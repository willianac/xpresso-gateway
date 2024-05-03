import "dotenv/config";
import { Client } from "basic-ftp";
import { getAcessToken } from "../api/controllers/almond/getAccessToken.js";
import { getRate } from "../api/controllers/almond/getRate.js";
import { generateFTPFile } from "../utils/generateFTPFile.js";

async function writeRatesToFTP() {
	const token = (await getAcessToken()).access_token;
	const sourceCurrency = "USD";
	const targetCurrencies = ["PHP", "BRL", "IDR"];

	const rateList: string[][] = [];

	for(const currency of targetCurrencies) {
		//use a flag da almond 'live=y' se o pais for BRL, para evitar erros
		const live = currency === "PHP" ? false : true;
		const rate = await getRate(sourceCurrency, currency, token, live);
		rateList.push([sourceCurrency, currency, rate.exchangeRate.toString()]);
	}

	const fileName = generateFTPFile("XPSPFX", "txt", true, ...rateList);

	const client = new Client();
	client.ftp.verbose = true;

	try {
		await client.access({
			host: process.env.FTP_HOST,
			user: process.env.FTP_USER,
			password: process.env.FTP_PASS,
			secure: false
		});

		await client.cd("./Rates");
		await client.uploadFrom(fileName + ".txt", fileName + ".txt");
		client.close();
	} catch (error) {
		console.error(error);
	}
	client.close();
}

writeRatesToFTP();
setInterval(() => {
	writeRatesToFTP();
}, 900000);

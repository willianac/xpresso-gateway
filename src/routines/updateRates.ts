import "dotenv/config";
import { Client } from "basic-ftp";
import { getAcessToken } from "../api/controllers/almond/getAccessToken.js";
import { getRate } from "../api/controllers/almond/getRate.js";
import { generateRateFile } from "../utils/generateRateFile.js";

async function writeRatesToFTP() {
	const token = (await getAcessToken()).access_token;
	const sourceCurrency = "USD";
	const targetCurrencies = ["PHP", "MXN", "BRL", "IDR"];

	const rateList: string[][] = [];

	for(const currency of targetCurrencies) {
		const rate = await getRate(sourceCurrency, currency, token);
		rateList.push([sourceCurrency, currency, rate.exchangeRate.toString()]);
	}

	const fileName = generateRateFile(...rateList);

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
		await client.uploadFrom(fileName + ".csv", fileName + ".csv");
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
import "dotenv/config";
import fs from "node:fs";
import { Client } from "basic-ftp";
import { getAcessToken } from "../api/controllers/almond/getAccessToken.js";
import { getRate } from "../api/controllers/almond/getRate.js";
import { generateFTPFile } from "../utils/generateFTPFile.js";

export async function writeRatesToFTP() {
	const token = (await getAcessToken(true)).access_token;
	const sourceCurrency = "USD";
	const targetCurrencies = ["PHP", "BRL"];

	const rateList: string[][] = [];

	for(const currency of targetCurrencies) {
		//use a flag da almond 'live=y' se o pais for BRL, para evitar erros
		const live = currency === "BRL" ? true : false;
		const rate = await getRate(sourceCurrency, currency, token, live);
		rateList.push([sourceCurrency, currency, rate.exchangeRate.toString()]);
	}

	const fileName = generateFTPFile("XPSPFX", "txt", true, ...rateList);

	const client = new Client();
	try {
		await client.access({
			host: process.env.FTP_HOST,
			user: process.env.FTP_USER,
			password: process.env.FTP_PASS,
			secure: false
		});

		await client.cd("./Rates");
		await client.uploadFrom(fileName + ".txt", fileName + ".txt");
		fs.rm(fileName + ".txt", err => {if(err) console.log(err);});
		client.close();
	} catch (error) {
		console.error(error);
	}
	client.close();
}

writeRatesToFTP();
setInterval(() => {
	writeRatesToFTP();
}, 1000 * 60 * 45);

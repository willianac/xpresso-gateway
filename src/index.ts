import "dotenv/config";
import fetch from "node-fetch";
import { Client } from "basic-ftp";
import { getAcessToken } from "./controllers/almond/getAccessToken.js";
import { getRate } from "./controllers/almond/getRate.js";
import { generateRateFile } from "./utils/generateRateFile.js";

async function writeAllRates() {
	const token = (await getAcessToken()).access_token;
	const sourceCurrency = "USD";
	const targetCurrencies = ["PHP", "MXN"];

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

async function test() {
	const res = await fetch("https://jsonplaceholder.typicode.com/todos/1");
	const data = await res.json();
	console.log(data);
}

test();
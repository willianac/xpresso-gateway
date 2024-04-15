import "dotenv/config";
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
			host: "xpressoadm.moneytransmittersystem.com",
			user: "xpsgw1",
			password: "rw66wimp",
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
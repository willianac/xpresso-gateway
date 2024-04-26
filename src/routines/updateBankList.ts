import "dotenv/config";
import { Client } from "basic-ftp";
import { getAcessToken } from "../api/controllers/almond/getAccessToken.js";
import { getFiList } from "../api/controllers/almond/getFiList.js";
import { generateCSVFile } from "../utils/generateCSVFile.js";

type Countries = "PH" | "ID"

async function updateBankList() {
	const token = (await getAcessToken()).access_token;

	const client = new Client();
	client.ftp.verbose = true;
	await client.access({
		host: process.env.FTP_HOST,
		user: process.env.FTP_USER,
		password: process.env.FTP_PASS,
		secure: false
	});
	await client.cd("./Rates");

	const countries: Countries[]= ["PH", "ID"];
	let fis: string[][] = [];

	for(const country of countries) {
		const response = await getFiList(token, country);

		for(const fi of response.fis) {
			fis.push([fi.fiName, fi.fiId, fi.active]);
		}

		const file = generateCSVFile(`${country}XPSFIS`, true, ...fis);
		await client.uploadFrom(file + ".csv", file + ".csv");
		fis = [];
	}
	client.close();
}

updateBankList();
//mude o primeiro item para definir de quantas em quantas HORAS a função irá rodar.
setInterval(() => {
	updateBankList();
}, 24 * 60 * 60 * 1000);
import "dotenv/config";
import { Client } from "basic-ftp";
import { getAcessToken } from "../api/controllers/almond/getAccessToken.js";
import { Countries, getFiList } from "../api/controllers/almond/getFiList.js";
import { generateFTPFile } from "../utils/generateFTPFile.js";

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

	const countries: Countries[]= ["PH", "ID", "MX"];
	let fis: string[][] = [];

	for(const country of countries) {
		const result = await getFiList(token, country);

		if(country === "MX") {
			result.fis = result.fis.filter(fi => fi.serviceType === "BANK_ACCOUNT");
		}

		for(const fi of result.fis) {
			fis.push([fi.fiName, fi.fiId, fi.active]);
		}

		let file = generateFTPFile(`${country}XPSFIS`, "txt", true, ...fis);
		await client.uploadFrom(file + ".txt", file + ".txt");
		file = "";
		fis = [];
	}
	client.close();
}

function schedule() {
	//vai rodar todo dia as 00:01
	const tenOClock = new Date().setHours(0, 1, 0, 0);

	let timeUntilTenPM = tenOClock - Date.now();
	
	if (timeUntilTenPM < 0) {
		timeUntilTenPM += 24 * 60 * 60 * 1000; // 24 hours in milliseconds
	}

	setTimeout(async () => {
		updateBankList();
		schedule();
	}, timeUntilTenPM);
}

schedule();
updateBankList();
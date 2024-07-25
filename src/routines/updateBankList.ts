import "dotenv/config";
import { Client } from "basic-ftp";
import { getAcessToken } from "../api/controllers/almond/getAccessToken.js";
import { Countries, getFiList } from "../api/controllers/almond/getFiList.js";
import { generateFTPFile } from "../utils/generateFTPFile.js";

async function updateBankList() {
	const token = (await getAcessToken()).access_token;

	const client = new Client();
	await client.access({
		host: process.env.FTP_HOST,
		user: process.env.FTP_USER,
		password: process.env.FTP_PASS,
		secure: false
	});
	await client.cd("./Rates");

	const countries: Countries[]= ["PH", "ID", "MX"];
	let bankAccountsFis: string[][] = [];
	let cashPickupsFis: string[][] = [];

	for(const country of countries) {
		const result = await getFiList(token, country);

		for(const fi of result.fis) {
			if(fi.serviceType === "CASH_PICKUP") {
				cashPickupsFis.push([
          fi.fiName, fi.fiId, 
          fi.cashPickupLocation.address!.replace("#", ""), 
          fi.cashPickupLocation.city!, 
          fi.cashPickupLocation.state!, 
          fi.cashPickupLocation.zipCode!, 
          fi.active
        ]);
			} else {
				bankAccountsFis.push([fi.fiName, fi.fiId, fi.active]);
			}
		}

		const bankAccountFileName = generateFTPFile(`${country}XPSFIS`, "txt", true, ...bankAccountsFis);
		await client.uploadFrom(bankAccountFileName + ".txt", bankAccountFileName + ".txt");

		if(cashPickupsFis.length) {
			const cashPickupFileName = generateFTPFile(`${country}XPSCPU`, "txt", true, ...cashPickupsFis);
			await client.uploadFrom(cashPickupFileName + ".txt", cashPickupFileName + ".txt");
		}

		bankAccountsFis = [];
		cashPickupsFis = [];
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

schedule()
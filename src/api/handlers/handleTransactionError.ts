import fs from "node:fs";
import { Client } from "basic-ftp";
import { AlmondResponseError } from "../../types/AlmondResponseError.js";
import { XpressoPayload } from "../../types/XpressoPayload.js";
import { generateFeedbackFile } from "../../utils/generateFeedbackFile.js";

export async function handleTransactionError(error: AlmondResponseError, payload: XpressoPayload) {
	const fileName = await generateFeedbackFile({
		order: payload.sourceFiTransactionId,
		date: new Date(),
		beneficiary: payload.Receiver_firstName + " " + payload.Receiver_lastName,
		beneficiaryId: payload.Receiver_idNumber,
		amountSent: "",
		rate: "",
		amountReceived: payload.receiveAmt,
		status: "DNQ",
		message: error.detail,
		currency: payload.receiveAmtCcy,
	});
	

	const client = new Client();
	await client.access({
		host: process.env.FTP_HOST,
		user: process.env.FTP_USER,
		password: process.env.FTP_PASS,
		secure: false
	});
	await client.cd("./Retorno");
	await client.uploadFrom(fileName, fileName);
	fs.rm(fileName, (err) => {
		if(err) {
			console.log(err);
		}
	});
	client.close();
}
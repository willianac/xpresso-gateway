import { getAcessToken } from "../controllers/almond/getAccessToken.js";

import { XpressoPayload } from "../../types/XpressoPayload.js";
import { initiateTransaction } from "../controllers/almond/initiateTransaction.js";
import { processTransaction } from "../controllers/almond/processTransaction.js";
import { getRate } from "../controllers/almond/getRate.js";
import { AlmondResponseError } from "../../types/AlmondResponseError.js";
import { handleTransactionError } from "./handleTransactionError.js";
import { generateFeedbackFile } from "../../utils/generateFeedbackFile.js";
import { Client } from "basic-ftp";
import { writeFile } from "node:fs";

export async function handleTransaction(payload: XpressoPayload) {
	const startTime = performance.now();
	try {
		const token = (await getAcessToken()).access_token;
		const rate = await getRate("USD", payload.receiveAmtCcy, token, false);
		const transaction = await initiateTransaction(payload, token, rate.rateId);
		const processedTransaction = await processTransaction(transaction.transactionId, token);

		let fileName = "";
		if(processedTransaction.transactionStatus === "PRCD") {
			fileName = await generateFeedbackFile({
				order: payload.sourceFiTransactionId,
				date: new Date(),
				beneficiary: payload.Receiver_firstName + " " + payload.Receiver_lastName,
				beneficiaryId: payload.Receiver_idNumber,
				amountSent: transaction.sendAmt.value.toString(),
				rate: transaction.exchangeRate.toString(),
				amountReceived: transaction.receiveAmt.value.toString(),
				status: "POP",
				message: transaction.transactionId,
				currency: payload.receiveAmtCcy,
			});
		} else {
			fileName = await generateFeedbackFile({
				order: payload.sourceFiTransactionId,
				date: new Date(),
				beneficiary: payload.Receiver_firstName + " " + payload.Receiver_lastName,
				beneficiaryId: payload.Receiver_idNumber,
				amountSent: transaction.sendAmt.value.toString(),
				rate: transaction.exchangeRate.toString(),
				amountReceived: transaction.receiveAmt.value.toString(),
				status: "PND",
				message: transaction.transactionId,
				currency: payload.receiveAmtCcy,
			}, transaction.transactionId);
		}
		const endTime = performance.now();
		const completionTime = endTime - startTime;

		const data = `Almond fee: ${transaction.almondFee} | Completion time: ${(completionTime / 1000).toFixed(3)} | XPS Id: ${transaction.sourceFiTransactionId} | Rate: ${transaction.exchangeRate}`;
		writeFile(`${transaction.transactionId}.txt`, data, (err) => {
			if(err) {
				console.log(err);
			}
		});
    
		const client = new Client();
		client.ftp.verbose = true;

		await client.access({
			host: process.env.FTP_HOST,
			user: process.env.FTP_USER,
			password: process.env.FTP_PASS,
			secure: false
		});

		await client.cd("./Retorno");
		await client.uploadFrom(fileName, fileName);
		client.close();

	} catch (error) { 
		const almondError = error as AlmondResponseError;
		handleTransactionError(almondError, payload);
    
		const endTime2 = performance.now();
		const completionTime2 = endTime2 - startTime;

		const data = `Erro em 'initiateTransaction API'. Name: ${almondError.message} | Details: ${almondError.detail} | Completion Time: ${(completionTime2 / 1000).toFixed(3)}`;
		writeFile(`${payload.sourceFiTransactionId}.txt`, data, (err) => {
			if(err) {
				console.log(err);
			}
		});
	}
}
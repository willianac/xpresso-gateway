import { getAcessToken } from "../controllers/almond/getAccessToken.js";

import { XpressoPayload } from "../../types/XpressoPayload.js";
import { initiateTransaction } from "../controllers/almond/initiateTransaction.js";
import { processTransaction } from "../controllers/almond/processTransaction.js";
import { getRate } from "../controllers/almond/getRate.js";
import { AlmondResponseError } from "../../types/AlmondResponseError.js";
import { handleTransactionError } from "./handleTransactionError.js";
import { generateFeedbackFile } from "../../utils/generateFeedbackFile.js";

export async function handleTransaction(payload: XpressoPayload) {
	try {
		const token = (await getAcessToken()).access_token;
		const rate = await getRate("USD", payload.receiveAmtCcy, token, false);
		const transaction = await initiateTransaction(payload, token, rate.rateId);
		const processedTransaction = await processTransaction(transaction.transactionId, token);

		if(processedTransaction.transactionStatus === "PRCD") {
			generateFeedbackFile({
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
			generateFeedbackFile({
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

	} catch (error) { 
		const almondError = error as AlmondResponseError;
		handleTransactionError(almondError, payload);
	}
}
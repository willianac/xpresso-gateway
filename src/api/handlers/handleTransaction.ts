import { getAcessToken } from "../controllers/almond/getAccessToken.js";

import { XpressoPayload } from "../../types/XpressoPayload.js";
import { initiateTransaction } from "../controllers/almond/initiateTransaction.js";
import { processTransaction } from "../controllers/almond/processTransaction.js";
import { checkTransactionStatus } from "../controllers/almond/checkTransactionStatus.js";
import { getRate } from "../controllers/almond/getRate.js";
import { AlmondResponseError } from "../../types/AlmondResponseError.js";

export async function handleTransaction(payload: XpressoPayload) {
	try {
		const token = (await getAcessToken()).access_token;
		const rate = await getRate("USD", "PHP", token, false);
		console.log(rate);

		console.log("<<TRANSACTION>>");
		const transaction = await initiateTransaction(payload, token, rate.rateId);
		console.log(transaction);

		const processedTransaction = await processTransaction(transaction.transactionId, token);
		const res = await checkTransactionStatus(transaction.transactionId, token);
	} catch (error) { 
		console.log("ERRO AQUI");
		const erro = error as AlmondResponseError;
	}
}
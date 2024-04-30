import { getAcessToken } from "../controllers/almond/getAccessToken.js";
import { getRate } from "../controllers/almond/getRate.js";

import { XpressoPayload } from "../../types/XpressoPayload.js";
import { initiateTransaction } from "../controllers/almond/initiateTransaction.js";


export async function handleTransaction(payload: XpressoPayload) {
	const token = (await getAcessToken()).access_token;

	const SOURCE_CURRENCY = "USD";
	const rate = await getRate(SOURCE_CURRENCY, payload.receiveAmtCcy, token);
	//const transaction = await initiateTransaction(payload, token, rate.rateId);
	return {
		transactionStatus: "PNDG",
		rate: rate.exchangeRate.toFixed(4),
		dueToPayer: (Number(payload.receiveAmt) / rate.exchangeRate).toFixed(2)
	};
}
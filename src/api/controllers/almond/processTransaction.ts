import fetch from "node-fetch";
import { AlmondResponseError } from "../../../types/AlmondResponseError.js";

type ProcessTransactionResponse = {
	transactionStatus: string,
	cashPickupPasscode: string
}

export async function processTransaction(id: string, accessToken: string) {
	const res = await fetch(process.env.ALMOND_PROD_URL + `/v1/transactions/${id}/process`, {
		method: "POST",
		headers: {
			"Authorization": "Bearer " + accessToken
		}
	});

	if(!res.ok) {
		const error = await res.json() as AlmondResponseError;
		throw error;
	}

	const data = await res.json() as ProcessTransactionResponse;
	return data;
}
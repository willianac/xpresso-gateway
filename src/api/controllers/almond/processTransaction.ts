import fetch from "node-fetch";
import { AlmondResponseError } from "../../../types/AlmondResponseError.js";
import { writeFile, writeFileSync } from "node:fs";

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

    //AUDIT DE ERROR NOS TESTES DE PRODUÇAO ALMOND
    writeFileSync(`PRCSS-ERR-${id}.txt`, JSON.stringify(error, null, 4))

		throw error;
	}

	const data = await res.json() as ProcessTransactionResponse;
	return data;
}
import fetch from "node-fetch";

type ProcessTransactionResponse = {
	transactionStatus: string,
	cashPickupPasscode: string
}

export async function processTransaction(id: string, accessToken: string) {
	const res = await fetch(process.env.ALMOND_SANDBOX_URL + `/v1/transactions/${id}/process`, {
		method: "POST",
		headers: {
			"Authorization": "Bearer " + accessToken
		}
	});
	const data = await res.json() as ProcessTransactionResponse;
	return data;
}
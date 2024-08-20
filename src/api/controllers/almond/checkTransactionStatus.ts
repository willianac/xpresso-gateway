import fetch from "node-fetch";

type Status = "RJCT" | "TSFS" | "TSFR" | "PNDG" | "PRCD" | "RVSD" | "ACCP"

type CheckTransactionStatusResponse = {
  transactionStatus: Status
  transactionCancellationStatus: string | null,
  reversal: string | null,
  cashoutStatus: string | null
}

export async function checkTransactionStatus(id: string, accessToken: string) {
	const res = await fetch(process.env.ALMOND_PROD_URL + `/v1/transactions/${id}/status`, {
		method: "GET",
		headers: {
			"Authorization": "Bearer " + accessToken,
		},
	});
	const data = await res.json() as CheckTransactionStatusResponse;
	return data;
}
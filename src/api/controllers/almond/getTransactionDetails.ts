import fetch from "node-fetch";

type GetTransactionDetailsResponse = {
	transactionId: string,
	transactionStatus: string,
	sender: {
			fiId: string,
			firstName: string | null,
			fiName: string | null,
			fiCountry: string | null
	},
	receiver: {
			accountNumber: string,
			fiId: string,
			firstName: string | null,
			fiName: string | null,
			fiCountry: string | null
	},
	sendAmt: {
			value: number,
			ccy: string
	},
	receiveAmt: {
			value: number,
			ccy: string
	},
	almondFeeCcy: string | null,
	almondFee: number,
	sourceFiFee: number,
	sourceFiFeeCcy: string | null,
	serviceFee: number,
	exchangeRate: number,
	exchangeRateExpiryTimeInUtc: Date,
	reversal: string | null,
	cashoutStatus: string | null,
	bookTimeInUtc: Date,
	creationTimeInUtc: string,
	valueTimeInUtc: Date,
	sourceFiTransactionId: string,
	targetFiFeeCcy: string,
	targetFiFee: number | null,
	updatedAt: Date
}

export async function getTransactionDetails(id: string, accessToken: string) {
	const res = await fetch(process.env.ALMOND_PROD_URL + `/v1/transactions/${id}`, {
		method: "GET",
		headers: {
			"Authorization": "Bearer " + accessToken,
		},
	});	
	
	if(!res.ok) {
		console.log(res);
		throw new Error();
	}

	const data = await res.json() as GetTransactionDetailsResponse;
	return data;
}
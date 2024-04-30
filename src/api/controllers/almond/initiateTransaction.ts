import fetch from "node-fetch";
import { XpressoPayload } from "../../../types/XpressoPayload.js";

type InitiateTransactionResponse = {
	transactionId: string
	transactionStatus: string
	recipientName: string
	sendAmt: {
		value: string
		ccy: string
	}
	receiveAmt: {
		value: number,
		ccy: string
	},
	almondFee: number,
	sourceFiFee: number,
	serviceFee: number,
	exchangeRate: number,
	sourceFiTransactionId: string,
	exchangeRateExpiryTimeInUtc: Date,
	links: {
		self: string,
		status: string,
		process: string
	}
}

export async function initiateTransaction(payload: XpressoPayload, accessToken: string, rateId: string) {
	try {
		const requestBody = {
			sender: {
				fiId: "XPS247",
				firstName: payload.Sender_firstName,
				lastName: payload.Sender_lastName,
			},
			receiver: {
				fiId: payload.Receiver_fiId,
				firstName: payload.Receiver_firstName,
				accountNumber: (143210023705).toString()
			},
			complianceInfo: {
				purpose: payload.purpose
			},
			receiveAmt: Number(payload.receiveAmt),
			receiveAmtCcy: payload.receiveAmtCcy,
			sendAmtCcy: "USD",
			sourceFiTransactionId: payload.sourceFiTransactionId,
			rateId: rateId
		};

		const res = await fetch(process.env.ALMOND_SANDBOX_URL + "/v1/transactions", {
			method: "POST",
			headers: {
				"Authorization": "Bearer " + accessToken,
			},
			body: JSON.stringify(requestBody)
		});

		if(!res.ok) {
			console.log(res);
		}
		
		const data = await res.json() as InitiateTransactionResponse;
		return data;
	} catch (error) {
		console.log(error);
	}
}
import fetch from "node-fetch";
import { XpressoPayload } from "../../../types/XpressoPayload.js";
import { AlmondResponseError } from "../../../types/AlmondResponseError.js";
import { writeFileSync } from "node:fs";

type InitiateTransactionResponse = {
	transactionId: string
	transactionStatus: string
	recipientName: string
	sendAmt: {
		value: number
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
};

export async function initiateTransaction(payload: XpressoPayload, accessToken: string, rateId?: string) {
	const requestBody = {
		sender: {
			fiId: "XPS247",
			firstName: payload.Sender_firstName,
			lastName: payload.Sender_lastName,
			countryCode: payload.Sender_countryCode
		},
		receiver: {
			fiId: payload.Receiver_fiId,
			firstName: payload.Receiver_firstName,
			lastName: payload.Receiver_lastName,
			countryCode: payload.Receiver_countryCode,
      phone: payload.Receiver_cellphone,
      ...(payload.receiveAmtCcy !== "BRL" 
				? { accountNumber: payload.Receiver_accountNumber } 
				: { pixType: payload.Receiver_pixType, pixKey: payload.Receiver_pixKey })
		},
		complianceInfo: {
			purpose: payload.purpose
		},
		receiveAmt: Number(payload.receiveAmt),
		receiveAmtCcy: payload.receiveAmtCcy,
		sendAmtCcy: "USD",
		sourceFiTransactionId: payload.sourceFiTransactionId,
		...(payload.Receiver_paymentType === "CASH_PICK_UP" ? {serviceType: "CASH_PICKUP"} : {})
	};
	const res = await fetch(process.env.ALMOND_PROD_URL + "/v1/transactions", {
		method: "POST",
		headers: {
			"Authorization": "Bearer " + accessToken,
			"Content-Type": "application/json"
		},
		body: JSON.stringify(requestBody)
	});

	if(!res.ok) {
		const error = await res.json() as AlmondResponseError;

    //AUDIT DE ERROR NOS TESTES DE PRODUÇAO ALMOND
    writeFileSync(`INIT-ERR-${payload.sourceFiTransactionId}`, JSON.stringify(error, null, 4))

		throw error;
	}
	
	const data = await res.json() as InitiateTransactionResponse;
	return data;
}
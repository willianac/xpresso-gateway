/* eslint-disable quotes */
import fetch from "node-fetch";

type GetRateResponse = {
	rateId: string
  exchangeRate: number
  expiryTime: Date
  sendAmt: null | number
  receiveAmt: null | number
  depositAmt: null | number
  serviceFee: null | number
  rateSpreadBps: null | number
}

export async function getRate(
	sourceCurrency: string, 
	targetCurrency: string, 
	accessToken: string,
	liveFeature: boolean
): Promise<GetRateResponse> {
	const live = liveFeature ? "&live=y" : "";
	const res = await fetch(process.env.ALMOND_PROD_URL as string + `/v1/rates?sourceCurrency=${sourceCurrency}&targetCurrency=${targetCurrency}${live}`, {
		method: "GET",
		headers: {
			"Authorization": "Bearer " + accessToken
		}
	});
	const data = await res.json() as GetRateResponse;
	return data;
}
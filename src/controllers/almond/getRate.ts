/* eslint-disable quotes */

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
	accessToken: string
): Promise<GetRateResponse> {
	const res = await fetch(process.env.ALMOND_SANDBOX_URL as string + `/v1/rates?sourceCurrency=${sourceCurrency}&targetCurrency=${targetCurrency}&live=y`, {
		method: "GET",
		headers: {
			"Authorization": "Bearer " + accessToken
		}
	});
	const data = await res.json() as GetRateResponse;
	return data;
}
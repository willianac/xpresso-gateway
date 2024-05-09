/* eslint-disable quotes */
import fetch from "node-fetch";

export type Countries = "PH" | "ID" | "MX"

type GetFiListResponse = {
	fiName: string
	fiId: string
	countryCode: string
	serviceType: string
	active: string
	supportedSegments: string[]
}

export async function getFiList(accessToken: string, countryCode?: Countries) {
	const endpoint = countryCode ? `/v1/fis?countryCode=${countryCode}` : "/v1/fis";

	const res = await fetch(process.env.ALMOND_SANDBOX_URL + endpoint, {
		method: "GET",
		headers: {
			"Authorization": "Bearer " + accessToken
		}
	});
	const data = await res.json() as { fis: GetFiListResponse[] };
	return data;
}
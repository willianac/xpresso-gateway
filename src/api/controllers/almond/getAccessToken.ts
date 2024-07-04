import fetch from "node-fetch";

type GetAccessTokenResponse = {
	access_token: string
	scope: string
	token_type: string
	expires_in: number
}

export async function getAcessToken(production = false): Promise<GetAccessTokenResponse> {
  const URL = production ? process.env.ALMOND_PROD_URL : process.env.ALMOND_SANDBOX_URL

	const token = production
  ? btoa(`${process.env.ALMOND_PROD_CLIENT_ID}:${process.env.ALMOND_PROD_CLIENT_SECRET}`)
  : btoa(`${process.env.ALMOND_CLIENT_ID}:${process.env.ALMOND_CLIENT_SECRET}`)

	const almondParams = new URLSearchParams();
	almondParams.append("grant_type", "client_credentials"),
	almondParams.append("scope", "fi transactions");

	const res = await fetch(URL+ "/oauth2/token", {
		method: "POST",
		headers: {
			"Authorization": "Basic " + token,
			"Content-Type": "application/x-www-form-urlencoded"
		},
		body: almondParams
	});
	
	const data = await res.json() as GetAccessTokenResponse;
	return data;
}
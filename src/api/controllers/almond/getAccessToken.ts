import fetch from "node-fetch";

type GetAccessTokenResponse = {
	access_token: string
	scope: string
	token_type: string
	expires_in: number
}

export async function getAcessToken(): Promise<GetAccessTokenResponse> {
	const token = btoa(`${process.env.ALMOND_CLIENT_ID}:${process.env.ALMOND_CLIENT_SECRET}`);
	const almondParams = new URLSearchParams();
	almondParams.append("grant_type", "client_credentials"),
	almondParams.append("scope", "fi transactions");

	const res = await fetch(process.env.ALMOND_SANDBOX_URL as string + "/oauth2/token", {
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
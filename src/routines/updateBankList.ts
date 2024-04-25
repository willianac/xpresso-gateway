import "dotenv/config";
import { getAcessToken } from "../api/controllers/almond/getAccessToken.js";
import { getFiList } from "../api/controllers/almond/getFiList.js";

async function updateBankList() {
	const token = (await getAcessToken()).access_token;

	const response = await getFiList(token, "PH");
}
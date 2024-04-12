import fs from "node:fs";
import { parseOrderFields } from "./utils/fieldsParser";

teste();

function teste() {
	const content = fs.readFileSync("./order.TXT");
	const result = parseOrderFields(content.toString(), "|");

	console.log(result);
}
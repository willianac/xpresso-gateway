import fs from "node:fs";

teste();

function teste() {
	const t = fs.readFileSync("./order.TXT");
	console.log(t.toString("utf-8").split("|"));
}
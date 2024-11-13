import fs from "node:fs";
import "dotenv/config";
import { parseOrderFields } from "../utils/fieldsParser.js";
import { Client } from "basic-ftp";
//import {  } from "/home/willianac/Documentos/dev/"
const ta = {
  "batida": {
    "sabores": ["Morango", "Tutti-Fruti", "Mamão"],
    "tamanhos": [400, 500, 600],
    "precos": [10, 12, 15]
  }
}
const ta2 = {
  "batida": {
    "precos": [10, 12, 15]
  }
}

async function test() {
	// const file = fs.readFileSync("invoice2.TXT", "utf-8");
	// const texts = file.split("\n");
	// const result = parseOrderFields(texts[0], "|");
	// console.log(result);

  fs.writeFileSync("resultadosss.txt", JSON.stringify(ta, null, 4) + "\n" + JSON.stringify(ta2, null, 4))

	// const client = new Client();
	// client.ftp.verbose = true;
	// await client.access({
	// 	host: process.env.FTP_HOST,
	// 	user: process.env.FTP_USER,
	// 	password: process.env.FTP_PASS,
	// 	secure: false
	// });
	// await client.cd("./Ordens");
	// const result = await client.list();
	// const invoiceFiles = result.filter(file => file.type === 1);
	// const path = process.cwd();

	// fs.mkdirSync("files", {recursive: true});
	// for(const ftpFile of invoiceFiles) {
	// 	await client.downloadTo("files/" + ftpFile.name, ftpFile.name);
	// 	const invoices = fs.readFileSync("files/" + ftpFile.name, "utf-8");
	// 	console.log(invoices);
	// }
	// fs.rmSync("files", {recursive: true});
	// client.close();
}
test();
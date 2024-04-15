import fs from "node:fs";

export function generateRateFile(...args: string[][]) {
	const csvData = args.map(row => row.join(",")).join("\n");

	const date = new Date();
	const fileName = "XPSPFX" + date.getFullYear().toString() + 
										(date.getMonth() + 1).toString().padStart(2, "0") + 
										date.getDate().toString().padStart(2, "0") + 
										date.getHours().toString().padStart(2, "0") + 
										date.getMinutes().toString().padStart(2, "0") + 
										date.getSeconds().toString().padStart(2, "0");
	fs.writeFile(`${fileName}.csv`, csvData, (err) => {
		if(err) {
			console.error(err);
		}
	});
	return fileName;
}
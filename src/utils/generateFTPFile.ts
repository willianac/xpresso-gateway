import fs from "node:fs";

type FileExtension = "csv" | "txt"

export function generateFTPFile(name: string, fileExtension: FileExtension, useTimeStamp: boolean, ...args: string[][]) {
	const csvData = args.map(row => row.join("|")).join("\n");
	const date = new Date();
	let timeStamp = "";

	if(useTimeStamp) {
		timeStamp = date.getFullYear().toString() + 
								(date.getMonth() + 1).toString().padStart(2, "0") + 
								date.getDate().toString().padStart(2, "0") + 
								date.getHours().toString().padStart(2, "0") + 
								date.getMinutes().toString().padStart(2, "0") + 
								date.getSeconds().toString().padStart(2, "0");
	}
	const fileName = name + timeStamp; 
	
	fs.writeFileSync(`${fileName}.${fileExtension}`, csvData);
	return fileName;
}
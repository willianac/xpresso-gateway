import fs from "node:fs";

export type FeedbackFile = {
	order: string
	date: Date
	beneficiary: string
	beneficiaryId: string
	amountSent: string
	rate: string
	amountReceived: string
	status: "POP" | "DNQ" | "PND"
	message: string
	currency: string
}

export function generateFeedbackFile(feedback: FeedbackFile, transactionId?: string) {
	const date = feedback.date;
	const timeStamp = date.getFullYear().toString() + 
										(date.getMonth() + 1).toString().padStart(2, "0") + 
										date.getDate().toString().padStart(2, "0") + 
										date.getHours().toString().padStart(2, "0") + 
										date.getMinutes().toString().padStart(2, "0") + 
										date.getSeconds().toString().padStart(2, "0");
	
	let content = "";

	if(feedback.status !== "PND") {
		const formatedFeedbackDate = (date.getMonth() + 1).toString().padStart(2, "0") + "/" + date.getDate().toString().padStart(2, "0") + "/" + date.getFullYear().toString();

		content = content.concat(feedback.order + "|");
		content = content.concat(formatedFeedbackDate + "|");
		content = content.concat(feedback.beneficiary + "|");
		content = content.concat(feedback.beneficiaryId + "|");
		content = content.concat(feedback.amountSent + "|");
		content = content.concat(feedback.rate + "|");
		content = content.concat(feedback.amountReceived + "|");
		content = content.concat(feedback.status + "|");
		content = content.concat(feedback.message + "|");
		content = content.concat(feedback.currency);
		content = content.concat("\r\n");

		return new Promise<string>((resolve, reject) => {
			const fileName = `XPS${feedback.status}${timeStamp}.txt`;
			fs.writeFile(fileName, content, (err) => {
				if(err) {
					reject();
				} else {
					resolve(fileName);
				}
			});
		});
	}
	content = content.concat(transactionId! + "|");
	content = content.concat(feedback.order );

	return new Promise<string>((resolve, reject) => {
		const fileName = `PND${timeStamp}.txt`;
		fs.writeFile(fileName, content, (err) => {
			if(err) {
				reject();
			} else {
				resolve(fileName);
			}
		});
	});
}
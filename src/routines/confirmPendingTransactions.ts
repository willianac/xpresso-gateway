import fs from "node:fs";
import "dotenv/config";
import { Client } from "basic-ftp";
import { checkTransactionStatus } from "../api/controllers/almond/checkTransactionStatus.js";
import { getAcessToken } from "../api/controllers/almond/getAccessToken.js";
import { generateFeedbackFile } from "../utils/generateFeedbackFile.js";
import { getTransactionDetails } from "../api/controllers/almond/getTransactionDetails.js";

async function confirmPendingTransactions() {
	try {
		const client = new Client();

		await client.access({
			host: process.env.FTP_HOST,
			user: process.env.FTP_USER,
			password: process.env.FTP_PASS,
			secure: false
		});

		await client.cd("./Retorno");
		const files = await client.list();
		const pendingTransactions = files.filter(file => file.name.startsWith("PND"));
		const token = (await getAcessToken(true)).access_token;

		for(const transactionFile of pendingTransactions) {
			await client.downloadTo(transactionFile.name, transactionFile.name);
			const data = fs.readFileSync(transactionFile.name).toString().split("|");

			const transactionInfo = {
				transactionId: data[0],
				xpressoInvoice: data[1]
			};
			const result = await checkTransactionStatus(transactionInfo.transactionId, token);

			if(result.transactionStatus === "PRCD" || result.transactionStatus === "RJCT") {
				const transaction = await getTransactionDetails(transactionInfo.transactionId, token);

        //AUDIT DE ERROR NOS TESTES DE PRODUÇAO ALMOND
        fs.writeFileSync(`CNFRM-ERR-${transactionInfo.xpressoInvoice}-${transactionInfo.transactionId}`, JSON.stringify(result, null, 4) + "\n" + JSON.stringify(transaction, null, 4))

				const fileName = await generateFeedbackFile({
					amountReceived: transaction.receiveAmt.value.toString(),
					amountSent: transaction.sendAmt.value.toString(),
					beneficiary: transaction.receiver.firstName ?? "",
					beneficiaryId: "",
					currency: transaction.receiveAmt.ccy,
					date: new Date(transaction.creationTimeInUtc),
					message: transaction.transactionId,
					order: transaction.sourceFiTransactionId,
					rate: transaction.exchangeRate.toString(),
					status: result.transactionStatus === "PRCD" ? "POP" : "DNQ"
				});
				await client.remove(transactionFile.name);
				await client.uploadFrom(fileName, fileName);
				[transactionFile.name, fileName].forEach(file => fs.rm(file, (err) => { if(err) console.log(err); }));
			} else {
				fs.rm(transactionFile.name, (err) => { if(err) console.log(err); });
			}
		}
		client.close();
	} catch (error) {
		console.log(error);
	}
}

confirmPendingTransactions();
setInterval(() => {
	confirmPendingTransactions();
}, 1000 * 60 * 5);
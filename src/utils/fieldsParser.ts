export function parseOrderFields(str: string, delimiter: string): Record<string, string> {
	const splittedFields = str.split(delimiter);

	const fields = [
		"sourceFiTransactionId", "Sender_firstName", "Sender_lastName", "Sender_dateOfBirth", "Sender_countryOfBirth", "Sender_idNumber",
		"Sender_idType", "Sender_nationality", "Sender_occupation", "Sender_fiId", "Sender_countryCode", "Sender_disableScreening",
		"Receiver_firstName", "Receiver_lastName", "Receiver_idNumber", "Receiver_countryCode", "receiveAmt", "receiveAmtCcy", 
		"purpose", "relationship", "Receiver_fiId", "Receiver_accountNumber", "Receiver_accountBranch", "Receiver_accountType", 
		"Receiver_paymentType", "Receiver_pixKey", "Receiver_pixType", "Ordem_Sequence", "ConnErrorMsg"
	];

	const order: Record<string, string> = {};

	for(let i = 0; i < splittedFields.length; i++) {
		const field = fields[i];
		order[field] = splittedFields[i];
	}

	return order;
}
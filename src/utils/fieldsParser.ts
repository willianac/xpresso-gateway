export function parseOrderFields(str: string, delimiter: string): Record<string, string> {
	const splittedFields = str.split(delimiter);

	const fields = [
		"sourceFiTransactionId", "senderName", "senderLastName", "senderDOB", "senderCountryOfBirth", "senderId",
		"senderDocType", "senderNationality", "senderOccupation", "senderFiId", "senderCountryCode", "disableScreening",
		"receiverName", "receiverLastName", "receiverAcctNumber", "receiverBankCode", "receiverCountry", "receiveAmount",
		"targetCurrency", "purpose", "relationship", "orderSequence", "gatewayConnectionStatusCode"
	];

	const order: Record<string, string> = {};

	for(let i = 0; i < splittedFields.length; i++) {
		const field = fields[i];
		order[field] = splittedFields[i];
	}

	return order;
}
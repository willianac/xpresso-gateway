export function parseOrderFields(str: string, delimiter: string): Record<string, string> {
	const splittedFields = str.split(delimiter);

	const fields = [
		"orderSequence", "orderNumber", "transactionDate", "senderName", "senderLastName",
		"senderCity", "senderID", "senderDOB", "receiverName", "receiverLastName", "receiverCity",
		"receiverID", "receiverPhone1", "receiverPhone2", "receiverAddress1", "receiverAddress2",
		"receiverState", "receiverZip", "receiverCountry", "bankCode", "bankName", "bankBranch",
		"bankAcct", "bankAcctType", "baseCurrency", "dueToPayer", "payerRate", "landedCurrency",
		"localAmount", "remarks", "serialNo"
	];

	const order: Record<string, string> = {};

	for(let i = 0; i < splittedFields.length; i++) {
		const field = fields[i];
		order[field] = splittedFields[i];
	}

	return order;
}
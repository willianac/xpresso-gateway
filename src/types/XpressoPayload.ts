export type XpressoPayload = {
	sourceFiTransactionId: string
	Sender_firstName: string
	Sender_lastName: string
	Sender_dateOfBirth: string
	Sender_countryOfBirth: string
	Sender_idNumber: string
	Sender_idType: string
	Sender_nationality: string
	Sender_occupation: string
	Sender_fiId: string
	Sender_countryCode: string
	Sender_disableScreening: string
	Receiver_firstName: string
	Receiver_lastName: string
	Receiver_fiId: string
	Receiver_countryCode: string
	receiveAmt: string
	receiveAmtCcy: string
	purpose: string
	relationship: string
	Ordem_sequence: string
	Receiver_idNumber: string
	Receiver_accountNumber: string
	Receiver_accountBranch: string
	Receiver_accountType: string
	Receiver_paymentType: "BANK_DEPOSIT" | "CASH_PICK_UP"
	Receiver_pixKey: string
	Receiver_pixType: string
	ConnErrorMsg: string | undefined
}
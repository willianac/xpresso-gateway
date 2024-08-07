import { describe, expect, test, vi } from "vitest";
import { getAcessToken } from "../../controllers/almond/getAccessToken.js";
import { getRate } from "../../controllers/almond/getRate.js";
import { initiateTransaction } from "../../controllers/almond/initiateTransaction.js";
import { processTransaction } from "../../controllers/almond/processTransaction.js";
import { generateFeedbackFile } from "../../../utils/generateFeedbackFile.js";
import { handleTransaction } from "../handleTransaction.js";
import { XpressoPayload } from "../../../types/XpressoPayload.js";
import { Client } from "basic-ftp";

vi.mock("../../controllers/almond/getAccessToken.js", () => {
  return {
    getAcessToken: vi.fn().mockResolvedValue({
      access_token: "random token"
    })
  }
})
vi.mock("../../controllers/almond/getRate.js", () => {
  return {
    getRate: vi.fn().mockResolvedValue({
      rateId: "12345"
    })
  }
})
vi.mock("../../controllers/almond/initiateTransaction.js", () => {
  return {
    initiateTransaction: vi.fn().mockResolvedValue({
      transactionId: "09876",
      sendAmt: {
        value: 1
      },
      receiveAmt: {
        value: 5
      },
      exchangeRate: 5.00
    })
  }
})
vi.mock("../../controllers/almond/processTransaction.js", () => {
  return {
    processTransaction: vi.fn().mockResolvedValue({
      transactionStatus: "TEST"
    })
  }
})

vi.mock("basic-ftp")
vi.mock("../../../utils/generateFeedbackFile.js")

describe("#handleTransaction ", () => {
  test("should create a file and upload it to ftp", async () => {
    const mockedGetAccessToken = vi.mocked(getAcessToken)
    const mockedGetRate = vi.mocked(getRate)
    const mockedInitiateTransaction = vi.mocked(initiateTransaction)
    const mockedProcessTransaction = vi.mocked(processTransaction)
    const mockFileGenerator = vi.mocked(generateFeedbackFile)
    const mockAccess = vi.fn();
    const mockCd = vi.fn();
    const mockUploadFrom = vi.fn();
    const mockClose = vi.fn();

    Client.prototype.access = mockAccess;
    Client.prototype.cd = mockCd;
    Client.prototype.uploadFrom = mockUploadFrom;
    Client.prototype.close = mockClose;

    const xpressoPayload: XpressoPayload = {
      sourceFiTransactionId: "TXN1234567890",
      Sender_firstName: "John",
      Sender_lastName: "Doe",
      Sender_dateOfBirth: "1980-01-01",
      Sender_countryOfBirth: "USA",
      Sender_idNumber: "A123456789",
      Sender_idType: "PASSPORT",
      Sender_nationality: "American",
      Sender_occupation: "Engineer",
      Sender_fiId: "FI123",
      Sender_countryCode: "US",
      Sender_disableScreening: "false",
      Receiver_firstName: "Jane",
      Receiver_lastName: "Smith",
      Receiver_cellphone: "+1234567890",
      Receiver_fiId: "FI456",
      Receiver_countryCode: "CA",
      receiveAmt: "1000.00",
      receiveAmtCcy: "USD",
      purpose: "Family Support",
      relationship: "Sister",
      Ordem_sequence: "001",
      Receiver_idNumber: "B987654321",
      Receiver_accountNumber: "123456789",
      Receiver_accountBranch: "001",
      Receiver_accountType: "SAVINGS",
      Receiver_paymentType: "BANK_DEPOSIT",
      Receiver_pixKey: "pixkey123",
      Receiver_pixType: "EMAIL",
      ConnErrorMsg: undefined
    };

    await handleTransaction(xpressoPayload)

    expect(mockedGetAccessToken).toBeCalledTimes(1)
    expect(mockedGetRate).toBeCalledTimes(1)
    expect(mockedInitiateTransaction).toBeCalledTimes(1)
    expect(mockedProcessTransaction).toBeCalledTimes(1)
    expect(mockFileGenerator).toBeCalledTimes(1)
    expect(mockAccess).toBeCalledTimes(1)
    expect(mockCd).toBeCalledTimes(1)
    expect(mockUploadFrom).toBeCalledTimes(1)
    expect(mockClose).toBeCalledTimes(1)
  })
})
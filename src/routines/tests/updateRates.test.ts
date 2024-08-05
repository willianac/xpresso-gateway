import { test, describe, expect, vi, Mock, beforeEach } from "vitest";
import { getAcessToken } from "../../api/controllers/almond/getAccessToken.js";
import { generateFTPFile } from "../../utils/generateFTPFile.js";
import { Client } from 'basic-ftp';
import { writeRatesToFTP } from "../updateRates.js";
import fs from "node:fs"

vi.mock("fs")
vi.mock("basic-ftp")
vi.mock("../../utils/generateFTPFile.js")
vi.mock("../../api/controllers/almond/getAccessToken.js", () => {
  return {
    getAcessToken: vi.fn().mockResolvedValue({
      access_token: "dummy_access_token",
    })
  };
})

vi.mock("../../api/controllers/almond/getRate.js", () => {
  return {
    getRate: vi.fn().mockResolvedValue({
      exchangeRate: 5.60
    })
  }
})

describe("writeRatesToFTP function", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test("should upload rates to FTP", async () => {
    const tokenResponse = await getAcessToken();

    const mockFileName = "mockFileName";
    (generateFTPFile as Mock).mockReturnValue(mockFileName);

    const mockAccess = vi.fn();
    const mockCd = vi.fn();
    const mockUploadFrom = vi.fn();
    const mockClose = vi.fn();

    Client.prototype.access = mockAccess;
    Client.prototype.cd = mockCd;
    Client.prototype.uploadFrom = mockUploadFrom;
    Client.prototype.close = mockClose;

    await writeRatesToFTP()

    expect(tokenResponse.access_token).toBeTruthy()
    expect(mockAccess).toBeCalledTimes(1)
    expect(mockCd).toBeCalledWith("./Rates")
    expect(mockUploadFrom).toBeCalledWith(mockFileName + ".txt", mockFileName + ".txt")
    expect(fs.rm).toBeCalledTimes(1)
  })
})
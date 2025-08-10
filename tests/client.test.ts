import { MintPhotonClient } from "../src/client";
import { MintPhotonConfig } from "../src/types";
import { SigningStargateClient } from "@cosmjs/stargate";

jest.mock("@cosmjs/stargate");

describe("MintPhotonClient", () => {
  let client: MintPhotonClient;
  let config: MintPhotonConfig;
  let mockSigner: any;
  let mockStargateClient: any;

  beforeEach(() => {
    config = {
      rpcEndpoint: "https://rpc-atomone.22node.xyz",
      chainId: "atomone-1",
    };

    mockSigner = {
      getAccounts: jest
        .fn()
        .mockResolvedValue([
          { address: "atone1test123456789012345678901234567890123456" },
        ]),
    };

    mockStargateClient = {
      getBalance: jest.fn(),
      signAndBroadcast: jest.fn(),
      forceGetQueryClient: jest.fn().mockReturnValue({
        bank: {
          supplyOf: jest.fn(),
        },
      }),
    };

    (SigningStargateClient.connectWithSigner as jest.Mock).mockResolvedValue(
      mockStargateClient
    );

    client = new MintPhotonClient(config);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("constructor", () => {
    it("should initialize with config", () => {
      expect(client).toBeInstanceOf(MintPhotonClient);
      expect(client.isConnected()).toBe(false);
    });
  });

  describe("connect", () => {
    it("should connect successfully with valid signer", async () => {
      await client.connect(mockSigner);

      expect(SigningStargateClient.connectWithSigner).toHaveBeenCalledWith(
        config.rpcEndpoint,
        mockSigner,
        expect.objectContaining({ registry: expect.any(Object) })
      );
      expect(client.isConnected()).toBe(true);
      expect(client.getAddress()).toBe(
        "atone1test123456789012345678901234567890123456"
      );
    });

    it("should throw error when no accounts found", async () => {
      mockSigner.getAccounts.mockResolvedValue([]);

      await expect(client.connect(mockSigner)).rejects.toThrow(
        "No wallet address found"
      );
    });
  });

  describe("getWalletInfo", () => {
    beforeEach(async () => {
      await client.connect(mockSigner);
    });

    it("should return wallet info successfully", async () => {
      mockStargateClient.getBalance.mockResolvedValue({
        amount: "1000000",
        denom: "uatone",
      });

      const walletInfo = await client.getWalletInfo();

      expect(walletInfo).toEqual({
        address: "atone1test123456789012345678901234567890123456",
        balance: 1,
      });
    });

    it("should throw error when not connected", async () => {
      const disconnectedClient = new MintPhotonClient(config);

      await expect(disconnectedClient.getWalletInfo()).rejects.toThrow(
        "Client not connected"
      );
    });
  });

  describe("getSupplyInfo", () => {
    beforeEach(async () => {
      await client.connect(mockSigner);
    });

    it("should return supply info successfully", async () => {
      const mockBankExtension = {
        bank: {
          supplyOf: jest
            .fn()
            .mockResolvedValueOnce({ amount: "100000000000000" }) // atone supply
            .mockResolvedValueOnce({ amount: "50000000000000" }), // photon supply
        },
      };

      const setupBankExtension = require("@cosmjs/stargate").setupBankExtension;
      setupBankExtension.mockReturnValue(mockBankExtension);

      const supplyInfo = await client.getSupplyInfo();

      expect(supplyInfo).toEqual({
        atoneSupply: 100000000,
        photonSupply: 50000000,
        conversionRate: (1000000000 - 50000000) / 100000000,
      });
    });
  });

  describe("calculatePhotonAmount", () => {
    it("should calculate photon amount correctly", () => {
      const result = client.calculatePhotonAmount(100, 2.5);
      expect(result).toBe(250);
    });
  });

  describe("mintPhoton", () => {
    beforeEach(async () => {
      await client.connect(mockSigner);
    });

    it("should mint photon successfully", async () => {
      // Mock getSupplyInfo
      const mockBankExtension = {
        bank: {
          supplyOf: jest
            .fn()
            .mockResolvedValueOnce({ amount: "100000000000000" })
            .mockResolvedValueOnce({ amount: "50000000000000" }),
        },
      };
      const setupBankExtension = require("@cosmjs/stargate").setupBankExtension;
      setupBankExtension.mockReturnValue(mockBankExtension);

      mockStargateClient.signAndBroadcast.mockResolvedValue({
        code: 0,
        transactionHash: "ABC123DEF456",
      });

      const result = await client.mintPhoton(100);

      expect(result.success).toBe(true);
      expect(result.transactionHash).toBe("ABC123DEF456");
      expect(result.mintedAmount).toBeDefined();
      expect(result.conversionRate).toBeDefined();
    });

    it("should handle mint failure", async () => {
      const mockBankExtension = {
        bank: {
          supplyOf: jest
            .fn()
            .mockResolvedValueOnce({ amount: "100000000000000" })
            .mockResolvedValueOnce({ amount: "50000000000000" }),
        },
      };
      const setupBankExtension = require("@cosmjs/stargate").setupBankExtension;
      setupBankExtension.mockReturnValue(mockBankExtension);

      mockStargateClient.signAndBroadcast.mockResolvedValue({
        code: 1,
        rawLog: "Transaction failed",
      });

      const result = await client.mintPhoton(100);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Transaction failed");
    });

    it("should handle exceptions", async () => {
      // Mock getSupplyInfo to succeed first
      const mockBankExtension = {
        bank: {
          supplyOf: jest
            .fn()
            .mockResolvedValueOnce({ amount: "100000000000000" })
            .mockResolvedValueOnce({ amount: "50000000000000" }),
        },
      };
      const setupBankExtension = require("@cosmjs/stargate").setupBankExtension;
      setupBankExtension.mockReturnValue(mockBankExtension);

      // Then make signAndBroadcast fail
      mockStargateClient.signAndBroadcast.mockRejectedValue(
        new Error("Network error")
      );

      const result = await client.mintPhoton(100);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Network error");
    });
  });
});

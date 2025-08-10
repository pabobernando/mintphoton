import { SigningStargateClient } from "@cosmjs/stargate";
import { OfflineSigner, Registry } from "@cosmjs/proto-signing";
import { MintPhotonConfig, MintResult, SupplyInfo, WalletInfo } from "./types";
import { setupBankExtension } from "@cosmjs/stargate";

const MSG_MINT_PHOTON_TYPE_URL = "/atomone.photon.v1.MsgMintPhoton";
const MsgMintPhoton = {
  encode: (message: any) => {
    const encoded = new Uint8Array([
      0x0a,
      message.to_address ? message.to_address.length : 0,
      ...(message.to_address
        ? Array.from(new TextEncoder().encode(message.to_address))
        : []),
      0x12,
      0x10,
      0x0a,
      message.amount?.denom ? message.amount.denom.length : 0,
      ...(message.amount?.denom
        ? Array.from(new TextEncoder().encode(message.amount.denom))
        : []),
      0x12,
      message.amount?.amount ? message.amount.amount.length : 0,
      ...(message.amount?.amount
        ? Array.from(new TextEncoder().encode(message.amount.amount))
        : []),
    ]);

    return {
      finish: () => encoded,
    };
  },
  decode: (input: Uint8Array) => {
    return {};
  },
  fromPartial: (object: any) => {
    return {
      to_address: object.to_address || "",
      amount: object.amount || { denom: "", amount: "0" },
    };
  },
};

export class MintPhotonClient {
  private config: MintPhotonConfig;
  private client?: SigningStargateClient;
  private signer?: OfflineSigner;
  private address?: string;

  constructor(config: MintPhotonConfig) {
    this.config = config;
  }

  async connect(signer: OfflineSigner): Promise<void> {
    this.signer = signer;

    const registry = new Registry();
    registry.register(MSG_MINT_PHOTON_TYPE_URL, MsgMintPhoton);

    this.client = await SigningStargateClient.connectWithSigner(
      this.config.rpcEndpoint,
      signer,
      { registry }
    );

    const accounts = await signer.getAccounts();
    this.address = accounts[0]?.address;

    if (!this.address) {
      throw new Error("No wallet address found");
    }
  }

  async getWalletInfo(): Promise<WalletInfo> {
    if (!this.client || !this.address) {
      throw new Error("Client not connected");
    }

    const balance = await this.client.getBalance(this.address, "uatone");
    return {
      address: this.address,
      balance: parseFloat(balance.amount) / 1_000_000,
    };
  }

  async getSupplyInfo(): Promise<SupplyInfo> {
    if (!this.client) {
      throw new Error("Client not connected");
    }

    const queryClient = (this.client as any).forceGetQueryClient();
    const bankExtension = setupBankExtension(queryClient);

    const atoneSupplyResult = await bankExtension.bank.supplyOf("uatone");
    const photonSupplyResult = await bankExtension.bank.supplyOf("uphoton");

    const atoneSupply = parseFloat(atoneSupplyResult.amount) / 1_000_000;
    const photonSupply = parseFloat(photonSupplyResult.amount) / 1_000_000;
    const conversionRate = (1_000_000_000 - photonSupply) / atoneSupply;

    return {
      atoneSupply,
      photonSupply,
      conversionRate,
    };
  }

  async mintPhoton(amount: number): Promise<MintResult> {
    if (!this.client || !this.address) {
      throw new Error("Client not connected");
    }

    try {
      const supplyInfo = await this.getSupplyInfo();
      const photonAmount = amount * supplyInfo.conversionRate;

      const mintMsg = {
        typeUrl: MSG_MINT_PHOTON_TYPE_URL,
        value: MsgMintPhoton.fromPartial({
          to_address: this.address,
          amount: {
            denom: "uatone",
            amount: Math.floor(amount * 1_000_000).toString(),
          },
        }),
      };

      const fee = {
        amount: [{ denom: "uatone", amount: "10000" }],
        gas: "250000",
      };

      const result = await this.client.signAndBroadcast(
        this.address,
        [mintMsg],
        fee,
        "Mint PHOTON"
      );

      if (result.code === 0) {
        return {
          success: true,
          transactionHash: result.transactionHash,
          mintedAmount: photonAmount.toFixed(6),
          conversionRate: supplyInfo.conversionRate.toFixed(6),
        };
      } else {
        return {
          success: false,
          error: result.rawLog,
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  calculatePhotonAmount(atoneAmount: number, conversionRate: number): number {
    return atoneAmount * conversionRate;
  }

  isConnected(): boolean {
    return !!(this.client && this.address);
  }

  getAddress(): string | undefined {
    return this.address;
  }
}

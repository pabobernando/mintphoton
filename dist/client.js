"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MintPhotonClient = void 0;
const stargate_1 = require("@cosmjs/stargate");
const proto_signing_1 = require("@cosmjs/proto-signing");
const stargate_2 = require("@cosmjs/stargate");
const MSG_MINT_PHOTON_TYPE_URL = "/atomone.photon.v1.MsgMintPhoton";
// Definisi manual untuk MsgMintPhoton karena protobuf tidak lengkap
const MsgMintPhoton = {
    encode: (message) => {
        // Implementasi encoding yang mengembalikan object dengan method finish()
        const encoded = new Uint8Array([
            // Encoding sederhana untuk to_address (field 1)
            0x0a, // field 1, wire type 2 (length-delimited)
            message.to_address ? message.to_address.length : 0,
            ...(message.to_address
                ? Array.from(new TextEncoder().encode(message.to_address))
                : []),
            // Encoding sederhana untuk amount (field 2)
            0x12, // field 2, wire type 2 (length-delimited)
            0x10, // length placeholder
            0x0a, // denom field
            message.amount?.denom ? message.amount.denom.length : 0,
            ...(message.amount?.denom
                ? Array.from(new TextEncoder().encode(message.amount.denom))
                : []),
            0x12, // amount field
            message.amount?.amount ? message.amount.amount.length : 0,
            ...(message.amount?.amount
                ? Array.from(new TextEncoder().encode(message.amount.amount))
                : []),
        ]);
        return {
            finish: () => encoded,
        };
    },
    decode: (input) => {
        // Implementasi decoding sederhana
        return {};
    },
    fromPartial: (object) => {
        return {
            to_address: object.to_address || "",
            amount: object.amount || { denom: "", amount: "0" },
        };
    },
};
class MintPhotonClient {
    constructor(config) {
        this.config = config;
    }
    async connect(signer) {
        this.signer = signer;
        const registry = new proto_signing_1.Registry();
        registry.register(MSG_MINT_PHOTON_TYPE_URL, MsgMintPhoton);
        this.client = await stargate_1.SigningStargateClient.connectWithSigner(this.config.rpcEndpoint, signer, { registry });
        const accounts = await signer.getAccounts();
        this.address = accounts[0]?.address;
        if (!this.address) {
            throw new Error("No wallet address found");
        }
    }
    async getWalletInfo() {
        if (!this.client || !this.address) {
            throw new Error("Client not connected");
        }
        const balance = await this.client.getBalance(this.address, "uatone");
        return {
            address: this.address,
            balance: parseFloat(balance.amount) / 1000000,
        };
    }
    async getSupplyInfo() {
        if (!this.client) {
            throw new Error("Client not connected");
        }
        const queryClient = this.client.forceGetQueryClient();
        const bankExtension = (0, stargate_2.setupBankExtension)(queryClient);
        const atoneSupplyResult = await bankExtension.bank.supplyOf("uatone");
        const photonSupplyResult = await bankExtension.bank.supplyOf("uphoton");
        const atoneSupply = parseFloat(atoneSupplyResult.amount) / 1000000;
        const photonSupply = parseFloat(photonSupplyResult.amount) / 1000000;
        const conversionRate = (1000000000 - photonSupply) / atoneSupply;
        return {
            atoneSupply,
            photonSupply,
            conversionRate,
        };
    }
    async mintPhoton(amount) {
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
                        amount: Math.floor(amount * 1000000).toString(),
                    },
                }),
            };
            const fee = {
                amount: [{ denom: "uatone", amount: "10000" }],
                gas: "250000",
            };
            const result = await this.client.signAndBroadcast(this.address, [mintMsg], fee, "Mint PHOTON");
            if (result.code === 0) {
                return {
                    success: true,
                    transactionHash: result.transactionHash,
                    mintedAmount: photonAmount.toFixed(6),
                    conversionRate: supplyInfo.conversionRate.toFixed(6),
                };
            }
            else {
                return {
                    success: false,
                    error: result.rawLog,
                };
            }
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }
    calculatePhotonAmount(atoneAmount, conversionRate) {
        return atoneAmount * conversionRate;
    }
    isConnected() {
        return !!(this.client && this.address);
    }
    getAddress() {
        return this.address;
    }
}
exports.MintPhotonClient = MintPhotonClient;
//# sourceMappingURL=client.js.map
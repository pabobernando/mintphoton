import { OfflineSigner } from "@cosmjs/proto-signing";
import { MintPhotonConfig, MintResult, SupplyInfo, WalletInfo } from "./types";
export declare class MintPhotonClient {
    private config;
    private client?;
    private signer?;
    private address?;
    constructor(config: MintPhotonConfig);
    connect(signer: OfflineSigner): Promise<void>;
    getWalletInfo(): Promise<WalletInfo>;
    getSupplyInfo(): Promise<SupplyInfo>;
    mintPhoton(amount: number): Promise<MintResult>;
    calculatePhotonAmount(atoneAmount: number, conversionRate: number): number;
    isConnected(): boolean;
    getAddress(): string | undefined;
}
//# sourceMappingURL=client.d.ts.map
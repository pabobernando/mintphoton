import { MintPhotonClient } from "../client";
import { MintResult, SupplyInfo, WalletInfo } from "../types";
export declare const useMintPhoton: (rpcEndpoint: string) => {
    client: MintPhotonClient;
    isConnected: boolean;
    walletInfo: WalletInfo | null;
    supplyInfo: SupplyInfo | null;
    isLoading: boolean;
    error: string | null;
    connect: (signer: any) => Promise<void>;
    mintPhoton: (amount: number) => Promise<MintResult>;
    refreshData: () => Promise<void>;
};
//# sourceMappingURL=useMintPhoton.d.ts.map
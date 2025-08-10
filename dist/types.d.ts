export interface MintPhotonConfig {
    rpcEndpoint: string;
    chainId: string;
}
export interface MintResult {
    success: boolean;
    transactionHash?: string;
    mintedAmount?: string;
    conversionRate?: string;
    error?: string;
}
export interface SupplyInfo {
    atoneSupply: number;
    photonSupply: number;
    conversionRate: number;
}
export interface WalletInfo {
    address: string;
    balance: number;
}
//# sourceMappingURL=types.d.ts.map
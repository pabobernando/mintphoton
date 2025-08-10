export declare class MintPhotonError extends Error {
    code?: string | undefined;
    constructor(message: string, code?: string | undefined);
}
export declare class WalletNotConnectedError extends MintPhotonError {
    constructor();
}
export declare class InsufficientBalanceError extends MintPhotonError {
    constructor(required: number, available: number);
}
export declare class InvalidAddressError extends MintPhotonError {
    constructor(address: string);
}
//# sourceMappingURL=errors.d.ts.map
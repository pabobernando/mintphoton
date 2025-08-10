/**
 * Convert microunits to standard units
 */
export declare const fromMicroUnits: (amount: string | number) => number;
/**
 * Convert standard units to microunits
 */
export declare const toMicroUnits: (amount: number) => string;
/**
 * Format number with commas
 */
export declare const formatNumber: (num: number, decimals?: number) => string;
/**
 * Validate AtomOne address
 */
export declare const isValidAtomOneAddress: (address: string) => boolean;
/**
 * Calculate estimated fee
 */
export declare const calculateFee: (gasLimit?: string) => {
    amount: string;
    denom: string;
}[];
/**
 * Format transaction hash for display
 */
export declare const formatTxHash: (hash: string, length?: number) => string;
//# sourceMappingURL=utils.d.ts.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTxHash = exports.calculateFee = exports.isValidAtomOneAddress = exports.formatNumber = exports.toMicroUnits = exports.fromMicroUnits = void 0;
/**
 * Convert microunits to standard units
 */
const fromMicroUnits = (amount) => {
    return parseFloat(amount.toString()) / 1000000;
};
exports.fromMicroUnits = fromMicroUnits;
/**
 * Convert standard units to microunits
 */
const toMicroUnits = (amount) => {
    return Math.floor(amount * 1000000).toString();
};
exports.toMicroUnits = toMicroUnits;
/**
 * Format number with commas
 */
const formatNumber = (num, decimals = 6) => {
    return num.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
};
exports.formatNumber = formatNumber;
/**
 * Validate AtomOne address
 */
const isValidAtomOneAddress = (address) => {
    if (!address || typeof address !== "string") {
        return false;
    }
    // Check prefix and length
    const hasValidPrefix = address.startsWith("atone1");
    const hasValidLength = address.length >= 39 && address.length <= 50;
    // Basic character validation (alphanumeric, no uppercase)
    const hasValidChars = /^[a-z0-9]+$/.test(address);
    return hasValidPrefix && hasValidLength && hasValidChars;
};
exports.isValidAtomOneAddress = isValidAtomOneAddress;
/**
 * Calculate estimated fee
 */
const calculateFee = (gasLimit = "250000") => {
    return [{ denom: "uatone", amount: "10000" }];
};
exports.calculateFee = calculateFee;
/**
 * Format transaction hash for display
 */
const formatTxHash = (hash, length = 8) => {
    if (hash.length <= length * 2)
        return hash;
    return `${hash.slice(0, length)}...${hash.slice(-length)}`;
};
exports.formatTxHash = formatTxHash;
//# sourceMappingURL=utils.js.map
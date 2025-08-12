"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidAddressError = exports.InsufficientBalanceError = exports.WalletNotConnectedError = exports.MintPhotonError = void 0;
class MintPhotonError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
        this.name = "MintPhotonError";
    }
}
exports.MintPhotonError = MintPhotonError;
class WalletNotConnectedError extends MintPhotonError {
    constructor() {
        super("Wallet is not connected", "WALLET_NOT_CONNECTED");
    }
}
exports.WalletNotConnectedError = WalletNotConnectedError;
class InsufficientBalanceError extends MintPhotonError {
    constructor(required, available) {
        super(`Insufficient balance. Required: ${required} ATONE, Available: ${available} ATONE`, "INSUFFICIENT_BALANCE");
    }
}
exports.InsufficientBalanceError = InsufficientBalanceError;
class InvalidAddressError extends MintPhotonError {
    constructor(address) {
        super(`Invalid AtomOne address: ${address}`, "INVALID_ADDRESS");
    }
}
exports.InvalidAddressError = InvalidAddressError;
//# sourceMappingURL=errors.js.map
export class MintPhotonError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'MintPhotonError';
  }
}

export class WalletNotConnectedError extends MintPhotonError {
  constructor() {
    super('Wallet is not connected', 'WALLET_NOT_CONNECTED');
  }
}

export class InsufficientBalanceError extends MintPhotonError {
  constructor(required: number, available: number) {
    super(`Insufficient balance. Required: ${required} ATONE, Available: ${available} ATONE`, 'INSUFFICIENT_BALANCE');
  }
}

export class InvalidAddressError extends MintPhotonError {
  constructor(address: string) {
    super(`Invalid AtomOne address: ${address}`, 'INVALID_ADDRESS');
  }
}
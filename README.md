# MintPhoton Library

Simple library for minting PHOTON tokens on AtomOne blockchain.

## Installation

```bash
npm install mintphoton
```

## Quick Start

```typescript
import { createMintPhotonClient, ATOMONE_MAINNET_RPC } from "mintphoton";

// Initialize client
const client = createMintPhotonClient(ATOMONE_MAINNET_RPC);

// Connect wallet (Keplr)
if (window.keplr) {
  await window.keplr.enable("atomone-1");
  const signer = window.keplr.getOfflineSigner("atomone-1");
  await client.connect(signer);
}

// Get wallet info
const walletInfo = await client.getWalletInfo();
console.log("Balance:", walletInfo.balance, "ATONE");

// Get supply info and conversion rate
const supplyInfo = await client.getSupplyInfo();
console.log("Conversion Rate:", supplyInfo.conversionRate);

// Mint PHOTON
const result = await client.mintPhoton(100); // Mint 100 ATONE worth
if (result.success) {
  console.log("Success! TX:", result.transactionHash);
  console.log("Minted:", result.mintedAmount, "PHOTON");
} else {
  console.error("Error:", result.error);
}
```

## API Reference

### MintPhotonClient

#### Methods

- `connect(signer: OfflineSigner): Promise<void>`
- `getWalletInfo(): Promise<WalletInfo>`
- `getSupplyInfo(): Promise<SupplyInfo>`
- `mintPhoton(amount: number): Promise<MintResult>`
- `calculatePhotonAmount(atoneAmount: number, conversionRate: number): number`
- `isConnected(): boolean`
- `getAddress(): string | undefined`

### Types

```typescript
interface WalletInfo {
  address: string;
  balance: number;
}

interface SupplyInfo {
  atoneSupply: number;
  photonSupply: number;
  conversionRate: number;
}

interface MintResult {
  success: boolean;
  transactionHash?: string;
  mintedAmount?: string;
  conversionRate?: string;
  error?: string;
}
```

## Constants

- `ATOMONE_MAINNET_RPC`: https://rpc-atomone.22node.xyz
- `PHOTON_MAX_SUPPLY`: 1,000,000,000

## License

MIT

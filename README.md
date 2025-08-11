# MintPhoton Library

Simple library for minting PHOTON tokens on AtomOne blockchain.

## Installation

```bash
npm install mintphoton
```

## Quick Start with React Hook (Recommended)

```typescript
import React from "react";
import { useMintPhoton, ATOMONE_MAINNET_RPC } from "mintphoton";
import { OfflineSigner } from "@cosmjs/proto-signing";

function App() {
  const {
    isConnected,
    walletInfo,
    supplyInfo,
    isLoading,
    error,
    connect,
    mintPhoton,
  } = useMintPhoton(ATOMONE_MAINNET_RPC);

  const handleConnectWallet = async () => {
    if (!window.keplr) {
      alert("Please install Keplr extension");
      return;
    }

    await window.keplr.enable("atomone-1");
    const signer = window.keplr.getOfflineSigner("atomone-1");
    await connect(signer);
  };

  const handleMint = async () => {
    const result = await mintPhoton(100); // Mint 100 ATONE worth
    if (result.success) {
      console.log("Success! TX:", result.transactionHash);
      console.log("Minted:", result.mintedAmount, "PHOTON");
    } else {
      console.error("Error:", result.error);
    }
  };

  if (!isConnected) {
    return (
      <button onClick={handleConnectWallet} disabled={isLoading}>
        {isLoading ? "Connecting..." : "Connect Keplr"}
      </button>
    );
  }

  return (
    <div>
      <h2>Wallet Info</h2>
      <p>Address: {walletInfo?.address}</p>
      <p>Balance: {walletInfo?.balance} ATONE</p>

      <h2>Supply Info</h2>
      <p>ATONE Supply: {supplyInfo?.atoneSupply}</p>
      <p>PHOTON Supply: {supplyInfo?.photonSupply}</p>
      <p>Conversion Rate: {supplyInfo?.conversionRate}</p>

      <button onClick={handleMint} disabled={isLoading}>
        {isLoading ? "Minting..." : "Mint 100 ATONE"}
      </button>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}
    </div>
  );
}
```

## Alternative: Direct Client Usage

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

### useMintPhoton Hook

```typescript
const {
  isConnected,
  walletInfo,
  supplyInfo,
  isLoading,
  error,
  connect,
  mintPhoton,
} = useMintPhoton(rpcEndpoint: string, chainId?: string);
```

#### Returns

- `isConnected: boolean` - Wallet connection status
- `walletInfo: WalletInfo | null` - Current wallet information
- `supplyInfo: SupplyInfo | null` - Current supply information
- `isLoading: boolean` - Loading state for operations
- `error: string | null` - Error message if any
- `connect: (signer: OfflineSigner) => Promise<void>` - Connect wallet function
- `mintPhoton: (amount: number) => Promise<MintResult>` - Mint PHOTON function

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

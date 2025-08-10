import { useState, useEffect, useCallback } from "react";
import { MintPhotonClient } from "../client";
import { MintResult, SupplyInfo, WalletInfo } from "../types";

export const useMintPhoton = (rpcEndpoint: string) => {
  const [client] = useState(
    () => new MintPhotonClient({ rpcEndpoint, chainId: "atomone-1" })
  );
  const [isConnected, setIsConnected] = useState(false);
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [supplyInfo, setSupplyInfo] = useState<SupplyInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(
    async (signer: any) => {
      try {
        setError(null);
        await client.connect(signer);
        setIsConnected(true);
        await refreshData();
      } catch (err: any) {
        setError(err.message);
      }
    },
    [client]
  );

  const refreshData = useCallback(async () => {
    if (client.isConnected()) {
      try {
        const [wallet, supply] = await Promise.all([
          client.getWalletInfo(),
          client.getSupplyInfo(),
        ]);
        setWalletInfo(wallet);
        setSupplyInfo(supply);
      } catch (err: any) {
        setError(err.message);
      }
    }
  }, [client]);

  const mintPhoton = useCallback(
    async (amount: number): Promise<MintResult> => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await client.mintPhoton(amount);
        if (result.success) {
          await refreshData();
        } else {
          setError(result.error || "Mint failed");
        }
        return result;
      } catch (err: any) {
        setError(err.message);
        return { success: false, error: err.message };
      } finally {
        setIsLoading(false);
      }
    },
    [client, refreshData]
  );

  return {
    client,
    isConnected,
    walletInfo,
    supplyInfo,
    isLoading,
    error,
    connect,
    mintPhoton,
    refreshData,
  };
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMintPhoton = void 0;
const react_1 = require("react");
const client_1 = require("../client");
const useMintPhoton = (rpcEndpoint) => {
    const [client] = (0, react_1.useState)(() => new client_1.MintPhotonClient({ rpcEndpoint, chainId: "atomone-1" }));
    const [isConnected, setIsConnected] = (0, react_1.useState)(false);
    const [walletInfo, setWalletInfo] = (0, react_1.useState)(null);
    const [supplyInfo, setSupplyInfo] = (0, react_1.useState)(null);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const connect = (0, react_1.useCallback)(async (signer) => {
        try {
            setError(null);
            await client.connect(signer);
            setIsConnected(true);
            await refreshData();
        }
        catch (err) {
            setError(err.message);
        }
    }, [client]);
    const refreshData = (0, react_1.useCallback)(async () => {
        if (client.isConnected()) {
            try {
                const [wallet, supply] = await Promise.all([
                    client.getWalletInfo(),
                    client.getSupplyInfo(),
                ]);
                setWalletInfo(wallet);
                setSupplyInfo(supply);
            }
            catch (err) {
                setError(err.message);
            }
        }
    }, [client]);
    const mintPhoton = (0, react_1.useCallback)(async (amount) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await client.mintPhoton(amount);
            if (result.success) {
                await refreshData();
            }
            else {
                setError(result.error || "Mint failed");
            }
            return result;
        }
        catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        }
        finally {
            setIsLoading(false);
        }
    }, [client, refreshData]);
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
exports.useMintPhoton = useMintPhoton;
//# sourceMappingURL=useMintPhoton.js.map
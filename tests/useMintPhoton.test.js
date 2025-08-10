"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const useMintPhoton_1 = require("../src/hooks/useMintPhoton");
// Mock React
jest.mock("react", () => ({
    ...jest.requireActual("react"),
    useState: jest.fn(),
    useEffect: jest.fn(),
    useCallback: jest.fn((fn) => fn),
}));
// Mock MintPhotonClient
jest.mock("../src/client", () => ({
    MintPhotonClient: jest.fn().mockImplementation(() => ({
        connect: jest.fn(),
        getWalletInfo: jest.fn(),
        getSupplyInfo: jest.fn(),
        mintPhoton: jest.fn(),
        isConnected: jest.fn(() => false),
    })),
}));
describe("useMintPhoton Hook", () => {
    let mockSetState;
    let mockUseState;
    beforeEach(() => {
        mockSetState = jest.fn();
        mockUseState = jest.fn();
        const React = require("react");
        React.useState.mockImplementation((initial) => [
            initial,
            mockSetState,
        ]);
        React.useEffect.mockImplementation((fn) => fn());
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it("should initialize hook with correct default values", () => {
        const React = require("react");
        // Mock useState calls in order
        React.useState
            .mockReturnValueOnce([false, mockSetState]) // isConnected
            .mockReturnValueOnce([null, mockSetState]) // walletInfo
            .mockReturnValueOnce([null, mockSetState]) // supplyInfo
            .mockReturnValueOnce([false, mockSetState]) // isLoading
            .mockReturnValueOnce([null, mockSetState]); // error
        const hook = (0, useMintPhoton_1.useMintPhoton)("https://rpc-atomone.22node.xyz");
        expect(React.useState).toHaveBeenCalledTimes(5);
        expect(React.useCallback).toHaveBeenCalled();
        expect(hook).toBeDefined();
    });
    it("should create MintPhotonClient with correct config", () => {
        const { MintPhotonClient } = require("../src/client");
        (0, useMintPhoton_1.useMintPhoton)("https://rpc-atomone.22node.xyz");
        expect(MintPhotonClient).toHaveBeenCalledWith({
            rpcEndpoint: "https://rpc-atomone.22node.xyz",
            chainId: "atomone-1",
        });
    });
});
//# sourceMappingURL=useMintPhoton.test.js.map
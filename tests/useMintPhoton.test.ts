import { renderHook, act } from "@testing-library/react-hooks";
import { useMintPhoton } from "../src/hooks/useMintPhoton";
import { MintPhotonConfig } from "../src/types";

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
  let mockSetState: jest.Mock;
  let mockUseState: jest.Mock;

  beforeEach(() => {
    mockSetState = jest.fn();
    mockUseState = jest.fn();

    const React = require("react");
    React.useState.mockImplementation((initial: any) => [
      initial,
      mockSetState,
    ]);
    React.useEffect.mockImplementation((fn: any) => fn());
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

    const hook = useMintPhoton("https://rpc-atomone.22node.xyz");

    expect(React.useState).toHaveBeenCalledTimes(5);
    expect(React.useCallback).toHaveBeenCalled();
    expect(hook).toBeDefined();
  });

  it("should create MintPhotonClient with correct config", () => {
    const { MintPhotonClient } = require("../src/client");

    useMintPhoton("https://rpc-atomone.22node.xyz");

    expect(MintPhotonClient).toHaveBeenCalledWith({
      rpcEndpoint: "https://rpc-atomone.22node.xyz",
      chainId: "atomone-1",
    });
  });
});

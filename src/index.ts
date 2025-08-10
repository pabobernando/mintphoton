export { MintPhotonClient } from "./client";
export * from "./types";
export * from "./errors";
export * from "./utils";

import { MintPhotonClient } from "./client";

export const createMintPhotonClient = (
  rpcEndpoint: string,
  chainId: string = "atomone-1"
) => {
  return new MintPhotonClient({ rpcEndpoint, chainId });
};

export const ATOMONE_MAINNET_RPC = "https://rpc-atomone.22node.xyz";
export const PHOTON_MAX_SUPPLY = 1_000_000_000;

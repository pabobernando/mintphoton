"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PHOTON_MAX_SUPPLY = exports.ATOMONE_MAINNET_RPC = exports.createMintPhotonClient = exports.MintPhotonClient = void 0;
var client_1 = require("./client");
Object.defineProperty(exports, "MintPhotonClient", { enumerable: true, get: function () { return client_1.MintPhotonClient; } });
__exportStar(require("./types"), exports);
__exportStar(require("./errors"), exports);
__exportStar(require("./utils"), exports);
__exportStar(require("./hooks"), exports);
const client_2 = require("./client");
const createMintPhotonClient = (rpcEndpoint, chainId = "atomone-1") => {
    return new client_2.MintPhotonClient({ rpcEndpoint, chainId });
};
exports.createMintPhotonClient = createMintPhotonClient;
exports.ATOMONE_MAINNET_RPC = "https://rpc-atomone.22node.xyz";
exports.PHOTON_MAX_SUPPLY = 1000000000;
//# sourceMappingURL=index.js.map
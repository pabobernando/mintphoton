"use strict";
jest.mock("@cosmjs/stargate", () => ({
    SigningStargateClient: {
        connectWithSigner: jest.fn(),
    },
    setupBankExtension: jest.fn(),
}));
jest.mock("@cosmjs/proto-signing", () => ({
    Registry: jest.fn().mockImplementation(() => ({
        register: jest.fn(),
    })),
}));
global.mockSigner = {
    getAccounts: jest
        .fn()
        .mockResolvedValue([
        { address: "atone1test123456789012345678901234567890123456" },
    ]),
};
global.mockClient = {
    getBalance: jest.fn(),
    signAndBroadcast: jest.fn(),
    forceGetQueryClient: jest.fn(),
};
//# sourceMappingURL=setup.js.map
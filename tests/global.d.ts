declare global {
  var mockSigner: {
    getAccounts: jest.MockedFunction<any>;
  };
  var mockClient: {
    getBalance: jest.MockedFunction<any>;
    signAndBroadcast: jest.MockedFunction<any>;
    forceGetQueryClient: jest.MockedFunction<any>;
  };
}

export {};

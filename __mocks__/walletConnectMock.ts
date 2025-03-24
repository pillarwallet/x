// Mock for @reown

const Client = jest.fn(() => ({
  connect: jest
    .fn()
    .mockResolvedValue('Mock WalletConnect connection established'),
  disconnect: jest
    .fn()
    .mockResolvedValue('Mock WalletConnect connection closed'),
}));

const WalletKit = {
  initialize: jest.fn().mockResolvedValue('Mock WalletKit initialised'),
};

const WalletKitTypes = {
  type1: 'MockWalletKitType1',
  type2: 'MockWalletKitType2',
};

const WalletConnectCore = jest.fn(() => ({
  init: jest.fn().mockResolvedValue('Mock WalletConnect Core initialised'),
  connect: jest
    .fn()
    .mockResolvedValue('Mock WalletConnect Core connection established'),
  disconnect: jest
    .fn()
    .mockResolvedValue('Mock WalletConnect Core connection closed'),
}));

// Mock for @walletconnect/utils
const buildApprovedNamespaces = jest
  .fn()
  .mockReturnValue('Mock WalletConnect approved namespaces');
const getSdkError = jest.fn().mockReturnValue('Mock WalletConnect SDK error');

// Export mocks for all modules
export default Client;
export {
  WalletConnectCore as Core,
  WalletKit,
  WalletKitTypes,
  buildApprovedNamespaces,
  getSdkError,
};

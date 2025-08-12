// Mock for @reown

const Client = vi.fn(() => ({
  connect: vi
    .fn()
    .mockResolvedValue('Mock WalletConnect connection established'),
  disconnect: vi.fn().mockResolvedValue('Mock WalletConnect connection closed'),
}));

const WalletKit = {
  initialize: vi.fn().mockResolvedValue('Mock WalletKit initialised'),
};

const WalletKitTypes = {
  type1: 'MockWalletKitType1',
  type2: 'MockWalletKitType2',
};

const WalletConnectCore = vi.fn(() => ({
  init: vi.fn().mockResolvedValue('Mock WalletConnect Core initialised'),
  connect: vi
    .fn()
    .mockResolvedValue('Mock WalletConnect Core connection established'),
  disconnect: vi
    .fn()
    .mockResolvedValue('Mock WalletConnect Core connection closed'),
}));

// Mock for @walletconnect/utils
const buildApprovedNamespaces = vi
  .fn()
  .mockReturnValue('Mock WalletConnect approved namespaces');
const getSdkError = vi.fn().mockReturnValue('Mock WalletConnect SDK error');

// Export mocks for all modules
export default Client;
export {
  buildApprovedNamespaces,
  WalletConnectCore as Core,
  getSdkError,
  WalletKit,
  WalletKitTypes,
};

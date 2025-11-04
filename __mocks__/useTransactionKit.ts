import { vi } from 'vitest';

const useTransactionKit = vi.fn(() => ({
  kit: {
    getState: vi.fn(() => ({
      namedTransactions: {},
      batches: {},
      isEstimating: false,
      isSending: false,
      containsSendingError: false,
      containsEstimatingError: false,
    })),
    getEtherspotProvider: vi.fn(() => ({
      getChainId: vi.fn(() => 1),
      getWalletMode: vi.fn(() => 'modular'),
    })),
    transaction: vi.fn(() => ({
      name: vi.fn(() => ({
        estimate: vi.fn(() => Promise.resolve({})),
        send: vi.fn(() => Promise.resolve({})),
      })),
    })),
    estimateBatches: vi.fn(() => Promise.resolve({})),
    sendBatches: vi.fn(() => Promise.resolve({})),
  },
  walletAddress: '0x1234567890123456789012345678901234567890',
  setWalletAddress: vi.fn(),
}));

export default useTransactionKit;

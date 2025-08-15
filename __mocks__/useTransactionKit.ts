import { vi } from 'vitest';

const useTransactionKit = vi.fn(() => ({
  kit: {
    getState: vi.fn(() => ({
      namedTransactions: {},
      batches: {},
    })),
  },
  walletAddress: '0x7F30B1960D5556929B03a0339814fE903c55a347',
  activeChainId: 1,
  setActiveChainId: vi.fn(),
}));

export default useTransactionKit;

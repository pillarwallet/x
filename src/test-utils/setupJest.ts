import React from 'react';

// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import 'jest-styled-components';
import * as TransactionKit from '@etherspot/transaction-kit';

jest.mock('@firebase/app');
jest.mock('@firebase/analytics');

jest.mock('@privy-io/react-auth', () => ({
  PrivyProvider: ({ children }: { children: React.ReactNode }) => children,
  usePrivy: jest.fn(() => ({ authenticated: false })),
  useWallets: jest.fn(() => ({}))
}));

export const etherspotTestAssets = [
  { address: '0xe3818504c1b32bf1557b16c238b2e01fd3149c17', chainId: 1, name: 'tk1', symbol: 'TK1', decimals: 18, logoURI: '' },
  { address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', chainId: 1, name: 'tk2', symbol: 'TK2', decimals: 18, logoURI: '' },
  { address: '0xdac17f958d2ee523a2206206994597c13d831ec7', chainId: 1, name: 'tk3', symbol: 'TK3', decimals: 18, logoURI: '' }
];

jest.spyOn(TransactionKit, 'useEtherspotAssets').mockReturnValue(({
  getAssets: async () => etherspotTestAssets,
}));

jest.spyOn(TransactionKit, 'useWalletAddress').mockReturnValue('0x7F30B1960D5556929B03a0339814fE903c55a347');

jest.spyOn(TransactionKit, 'useEtherspotTransactions').mockReturnValue(({
  chainId: 1,
  batches: [],
  estimate: async () => [],
  send: async () => [{ sentBatches: [{ userOpHash: '0x123' }], estimatedBatches: [], batches: [] }],
}));

jest.spyOn(TransactionKit, 'useEtherspotBalances').mockReturnValue(({
  getAccountBalances: async () => [],
}));

jest.spyOn(TransactionKit, 'useEtherspotPrices').mockReturnValue(({
  getPrice: async () => undefined,
  getPrices: async () => [],
}));

process.env.REACT_APP_PRIVY_APP_ID = 'test';

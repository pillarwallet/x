/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { TextDecoder, TextEncoder } from 'util';

// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { BigNumber } from 'ethers';
import 'jest-styled-components';
import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { goerli } from 'viem/chains';

// mocking matchMedia for slick carousel
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// polyfill for TextEncoder and TextDecoder for jsdom environment (viem dep related)
Object.assign(global, { TextDecoder, TextEncoder });

jest.mock('@firebase/app');
jest.mock('@firebase/analytics');
jest.mock('axios');
jest.mock('@etherspot/data-utils');
jest.mock('@etherspot/modular-sdk');

jest.mock('@privy-io/react-auth', () => ({
  PrivyProvider: ({ children }: { children: React.ReactNode }) => children,
  usePrivy: jest.fn(() => ({ authenticated: false })),
  useWallets: jest.fn(() => ({})),
  useLogout: jest.fn(() => ({ logout: jest.fn() })),
}));

export const etherspotTestAssets = [
  {
    address: '0xe3818504c1b32bf1557b16c238b2e01fd3149c17',
    chainId: 1,
    name: 'tk1',
    symbol: 'TK1',
    decimals: 18,
    logoURI: '',
  },
  {
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    chainId: 1,
    name: 'tk2',
    symbol: 'TK2',
    decimals: 18,
    logoURI: '',
  },
  {
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    chainId: 1,
    name: 'tk3',
    symbol: 'TK3',
    decimals: 18,
    logoURI: '',
  },
];

export const etherspotTestSupportedAssets = [
  {
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    chainId: 1,
    decimals: 6,
    icon: '',
    name: 'USDC',
    symbol: 'USDC',
  },
  {
    address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    chainId: 1,
    decimals: 18,
    icon: '',
    name: 'Wrapped ETH',
    symbol: 'WETH',
  },
  {
    address: '0x39B061B7e41DE8B721f9aEcEB6b3f17ECB7ba63E',
    chainId: 420,
    decimals: 18,
    icon: '',
    name: 'nextWETH',
    symbol: 'nextWETH',
  },
];

const randomWallet = privateKeyToAccount(
  `0x${crypto.getRandomValues(new Uint8Array(32)).reduce((acc, byte) => acc + byte.toString(16).padStart(2, '0'), '')}`
);
const provider = createWalletClient({
  account: randomWallet,
  chain: goerli,
  transport: http('http://localhost:8545'),
});

jest.mock('wagmi', () => ({
  createConfig: jest.fn(),
  http: jest.fn(),
  mainnet: { id: 1, name: 'mainnet' },
  useAccount: jest.fn().mockReturnValue({
    address: '0x',
  }),
  useDisconnect: jest.fn().mockReturnValue({
    disconnect: jest.fn(),
  }),
}));

jest.mock('wagmi/connectors', () => ({
  walletConnect: jest.fn(),
}));

jest.mock('@etherspot/transaction-kit', () => ({
  useEtherspotAssets: jest.fn().mockReturnValue({
    getAssets: async () => etherspotTestAssets,
    getSupportedAssets: async () => etherspotTestSupportedAssets,
  }),
  useWalletAddress: jest
    .fn()
    .mockReturnValue('0x7F30B1960D5556929B03a0339814fE903c55a347'),
  useEtherspotTransactions: jest.fn().mockReturnValue({
    chainId: 1,
    batches: [],
    estimate: async () => [],
    send: async () => [
      {
        sentBatches: [{ userOpHash: '0x123' }],
        estimatedBatches: [],
        batches: [],
      },
    ],
    isEstimating: false,
    isSending: false,
    containsEstimatingError: false,
    containsSendingError: false,
  }),
  useEtherspotBalances: jest.fn().mockReturnValue({
    getAccountBalances: async () => [],
  }),
  useEtherspotPrices: jest.fn().mockReturnValue({
    getPrice: async () => undefined,
    getPrices: async () => [],
  }),

  useEtherspotHistory: jest.fn().mockReturnValue({
    getAccountTransactions: async () => [],
    getAccountTransaction: async () => undefined,
    getAccountTransactionStatus: async () => undefined,
  }),

  useEtherspotNfts: jest.fn().mockReturnValue({
    getAccountNfts: async () => [],
  }),

  useEtherspot: jest.fn().mockReturnValue({
    getSdk: async () => {},
    getDataService: () => {},
    provider,
    chainId: 1,
  }),

  useEtherspotUtils: jest.fn().mockReturnValue({
    checksumAddress: () => '0x7F30B1960D5556929B03a0339814fE903c55a347',
    verifyEip1271Message: async () => false,
    toBigNumber: () => BigNumber.from('1'),
    parseBigNumber: () => '0x123',
    isZeroAddress: () => false,
    addressesEqual: () => true,
  }),
}));

process.env.REACT_APP_PRIVY_APP_ID = 'test';

/* eslint-disable import/no-extraneous-dependencies */
// Polyfill for TextEncoder and TextDecoder MUST be at the very top
// This must be done before any other imports that might use TextEncoder/TextDecoder

// Create proper polyfills for TextEncoder and TextDecoder
if (typeof globalThis.TextEncoder === 'undefined') {
  const {
    TextEncoder: NodeTextEncoder,
    TextDecoder: NodeTextDecoder,
  } = require('util');

  // Create wrapper classes that match the Web API
  class TextEncoderPolyfill {
    readonly encoding = 'utf-8';

    encode(input = ''): Uint8Array {
      return new NodeTextEncoder().encode(input);
    }
  }

  class TextDecoderPolyfill {
    readonly encoding: string;
    readonly fatal: boolean;
    readonly ignoreBOM: boolean;

    constructor(
      encoding = 'utf-8',
      options: { fatal?: boolean; ignoreBOM?: boolean } = {}
    ) {
      this.encoding = encoding;
      this.fatal = options.fatal || false;
      this.ignoreBOM = options.ignoreBOM || false;
    }

    decode(input?: any, options: { stream?: boolean } = {}): string {
      return new NodeTextDecoder(this.encoding, {
        fatal: this.fatal,
        ignoreBOM: this.ignoreBOM,
      }).decode(input, options);
    }
  }

  globalThis.TextEncoder = TextEncoderPolyfill as any;
  globalThis.TextDecoder = TextDecoderPolyfill as any;
  (global as any).TextEncoder = TextEncoderPolyfill;
  (global as any).TextDecoder = TextDecoderPolyfill;
}

// Crypto polyfill for Node.js environment
if (typeof globalThis.crypto === 'undefined') {
  const crypto = require('crypto');
  globalThis.crypto = {
    getRandomValues: (arr: Uint8Array) => {
      const bytes = crypto.randomBytes(arr.length);
      arr.set(bytes);
      return arr;
    },
    subtle: {} as any,
  } as any;
}

import React from 'react';

import '@testing-library/jest-dom';
import 'jest-styled-components';
import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { goerli } from 'viem/chains';

// mocking matchMedia for slick carousel
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: vi.fn(),
});

vi.mock('@firebase/app');
vi.mock('@firebase/analytics');
vi.mock('axios');
vi.mock('@etherspot/data-utils');
vi.mock('@etherspot/modular-sdk');

// Mock the problematic @etherspot/modular-sdk more thoroughly
vi.mock('@etherspot/modular-sdk', () => ({
  default: {
    EtherspotSDK: vi.fn().mockImplementation(() => ({
      init: vi.fn().mockResolvedValue(true),
      getAccount: vi.fn().mockResolvedValue({
        address: '0x7F30B1960D5556929B03a0339814fE903c55a347',
      }),
    })),
    ERC4337Utils: {
      getAccountAddress: vi
        .fn()
        .mockResolvedValue('0x7F30B1960D5556929B03a0339814fE903c55a347'),
    },
  },
}));

vi.mock('@privy-io/react-auth', () => ({
  PrivyProvider: ({ children }: { children: React.ReactNode }) => children,
  usePrivy: vi.fn(() => ({ authenticated: false })),
  useWallets: vi.fn(() => ({ wallets: [] })),
  useLogout: vi.fn(() => ({ logout: vi.fn() })),
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

vi.mock('wagmi', () => ({
  createConfig: vi.fn(),
  http: vi.fn(),
  mainnet: { id: 1, name: 'mainnet' },
  useAccount: vi.fn().mockReturnValue({
    address: '0x',
    isConnected: false,
  }),
  useDisconnect: vi.fn().mockReturnValue({
    disconnect: vi.fn(),
  }),
}));

vi.mock('wagmi/connectors', () => ({
  walletConnect: vi.fn(),
}));

vi.mock('@etherspot/transaction-kit', () => {
  class MockEtherspotTransactionKit {
    getWalletAddress = vi
      .fn()
      .mockResolvedValue('0x7F30B1960D5556929B03a0339814fE903c55a347');
    transaction = vi.fn().mockReturnThis();
    name = vi.fn().mockReturnThis();
    batch = vi.fn().mockReturnThis();
    estimate = vi.fn().mockResolvedValue({ isEstimatedSuccessfully: true });
    send = vi.fn().mockResolvedValue({ isSentSuccessfully: true });
    getTransactionHash = vi.fn().mockResolvedValue('0x123');
    getState = vi.fn().mockReturnValue({});
    setDebugMode = vi.fn();
    getProvider = vi.fn();
    getEtherspotProvider = vi.fn();
    getSdk = vi.fn();
    reset = vi.fn();
  }

  class MockEtherspotUtils {
    static checksumAddress = vi.fn((address) => address);
    static verifyEip1271Message = vi.fn().mockResolvedValue(false);
    static toBigNumber = vi.fn(() => BigInt(1));
    static parseBigNumber = vi.fn(() => '1');
    static isZeroAddress = vi.fn(() => false);
    static addressesEqual = vi.fn(() => true);
  }

  return {
    EtherspotTransactionKit: MockEtherspotTransactionKit,
    EtherspotUtils: MockEtherspotUtils,
  };
});

// Mock useTransactionKit hook globally
vi.mock(
  '../hooks/useTransactionKit',
  () => import('../../__mocks__/useTransactionKit')
);

// Mock EtherspotTransactionKitProvider globally
vi.mock(
  '../providers/EtherspotTransactionKitProvider',
  () => import('../../__mocks__/EtherspotTransactionKitProvider')
);

// Mock WalletConnectToastProvider
vi.mock('../providers/WalletConnectToastProvider', () => ({
  WalletConnectToastProvider: ({ children }: { children: React.ReactNode }) =>
    children,
  WalletConnectToastContext: {
    Provider: ({ children }: { children: React.ReactNode }) => children,
  },
}));

// Mock useWalletConnectToast hook
vi.mock('../hooks/useWalletConnectToast', () => ({
  default: vi.fn(() => ({
    showToast: vi.fn(),
    hideToast: vi.fn(),
    isToastVisible: false,
  })),
}));

// Mock WalletConnectModalProvider
vi.mock('../providers/WalletConnectModalProvider', () => ({
  WalletConnectModalProvider: ({ children }: { children: React.ReactNode }) =>
    children,
  WalletConnectModalContext: {
    Provider: ({ children }: { children: React.ReactNode }) => children,
  },
}));

// Mock useWalletConnectModal hook
vi.mock('../hooks/useWalletConnectModal', () => ({
  default: vi.fn(() => ({
    showModal: vi.fn(),
    hideModal: vi.fn(),
    isModalVisible: false,
  })),
}));

// Mock chart.js to prevent chart context errors
vi.mock('chart.js', () => ({
  Chart: {
    register: vi.fn(),
  },
  ChartJS: {
    register: vi.fn(),
  },
  registerables: [],
  LineElement: vi.fn(),
  PointElement: vi.fn(),
  CategoryScale: vi.fn(),
  LinearScale: vi.fn(),
  TimeScale: vi.fn(),
  Title: vi.fn(),
  Tooltip: vi.fn(),
  Legend: vi.fn(),
  Filler: vi.fn(),
  register: vi.fn(),
}));

// Mock react-chartjs-2 to render a canvas element
vi.mock('react-chartjs-2', () => {
  console.log('react-chartjs-2 mock applied');
  return {
    Line: ({ data, options, ...props }: any) => {
      console.log('Line component rendered with props:', props);
      // Create a mock canvas element using React.createElement
      const React = require('react');
      const canvas = React.createElement('canvas', {
        'data-testid': props['data-testid'] || 'price-graph',
        width: '300',
        height: '150',
        role: 'img',
        ...props,
      });

      return canvas;
    },
  };
});

// Mock tokensData service
vi.mock('../../../services/tokensData', () => ({
  chainNameDataCompatibility: vi.fn((chainName) => chainName),
  chainNameToChainIdTokensData: vi.fn((chainName) => 1),
  chainNameFromViemToMobula: vi.fn((chainName) => chainName),
  chainIdToChainNameTokensData: vi.fn((chainId) => 'Ethereum'),
}));

import.meta.env.VITE_PRIVY_APP_ID = 'test';

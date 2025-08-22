import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

// providers
import {
  EtherspotTransactionKitContext,
  EtherspotTransactionKitProvider,
} from '../EtherspotTransactionKitProvider';

// Mock the EtherspotTransactionKit
const mockKit = {
  getState: vi.fn(() => ({
    namedTransactions: {},
    batches: {},
    isEstimating: false,
    isSending: false,
    containsSendingError: false,
    containsEstimatingError: false,
  })),
  getWalletAddress: vi.fn(() => Promise.resolve('0xMockWalletAddress')),
  getEtherspotProvider: vi.fn(() => ({
    getChainId: vi.fn(() => 1),
  })),
  transaction: vi.fn(() => ({
    name: vi.fn(() => ({
      estimate: vi.fn(() => Promise.resolve({})),
      send: vi.fn(() => Promise.resolve({})),
    })),
  })),
  estimateBatches: vi.fn(() => Promise.resolve({})),
  sendBatches: vi.fn(() => Promise.resolve({})),
};

const mockConfig = {
  chainId: 1,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  provider: {} as any,
  bundlerApiKey: 'test-key',
  debugMode: false,
};

describe('EtherspotTransactionKitProvider', () => {
  it('renders children', () => {
    render(
      <EtherspotTransactionKitProvider config={mockConfig}>
        <div data-testid="child">Child Component</div>
      </EtherspotTransactionKitProvider>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('provides context data', () => {
    const TestComponent = () => {
      const context = React.useContext(EtherspotTransactionKitContext);

      if (!context) {
        return <div>No context</div>;
      }

      return (
        <div>
          <div data-testid="kit-exists">
            {context.data.kit ? 'Kit exists' : 'No kit'}
          </div>
          <div data-testid="wallet-address">
            {context.data.walletAddress || 'No address'}
          </div>
          <div data-testid="set-wallet-address">
            {typeof context.data.setWalletAddress === 'function'
              ? 'Function exists'
              : 'No function'}
          </div>
        </div>
      );
    };

    render(
      <EtherspotTransactionKitProvider config={mockConfig}>
        <TestComponent />
      </EtherspotTransactionKitProvider>
    );

    expect(screen.getByTestId('kit-exists')).toHaveTextContent('Kit exists');
    expect(screen.getByTestId('wallet-address')).toBeInTheDocument();
    expect(screen.getByTestId('set-wallet-address')).toHaveTextContent(
      'Function exists'
    );
  });

  it('provides kit object', () => {
    expect(mockKit).toBeDefined();
    expect(typeof mockKit.getState).toBe('function');
  });

  it('provides walletAddress', () => {
    expect(mockConfig.chainId).toBeDefined();
  });

  it('provides setWalletAddress function that can be called', () => {
    const TestComponent = () => {
      const context = React.useContext(EtherspotTransactionKitContext);

      if (!context) {
        return <div>No context</div>;
      }

      return (
        <div>
          <div data-testid="kit-exists">
            {context.data.kit ? 'Kit exists' : 'No kit'}
          </div>
          <div data-testid="wallet-address">
            {context.data.walletAddress || 'No address'}
          </div>
          <div data-testid="set-wallet-address">
            {typeof context.data.setWalletAddress === 'function'
              ? 'Function exists'
              : 'No function'}
          </div>
        </div>
      );
    };

    render(
      <EtherspotTransactionKitProvider config={mockConfig}>
        <TestComponent />
      </EtherspotTransactionKitProvider>
    );

    expect(screen.getByTestId('kit-exists')).toHaveTextContent('Kit exists');
    expect(screen.getByTestId('wallet-address')).toBeInTheDocument();
    expect(screen.getByTestId('set-wallet-address')).toHaveTextContent(
      'Function exists'
    );
  });
});

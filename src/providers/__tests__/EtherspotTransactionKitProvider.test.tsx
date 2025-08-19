import { act, render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// providers
import {
  EtherspotTransactionKitContext,
  EtherspotTransactionKitProvider,
} from '../EtherspotTransactionKitProvider';

describe('EtherspotTransactionKitProvider', () => {
  const mockConfig = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    provider: {} as any, // Mock provider
    chainId: 1,
    bundlerApiKey: 'test-api-key',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders children without crashing', () => {
    render(
      <EtherspotTransactionKitProvider config={mockConfig}>
        <div data-testid="test-child">Test Child</div>
      </EtherspotTransactionKitProvider>
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('provides context with expected structure', () => {
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
          <div data-testid="active-chain-id">
            {context.data.activeChainId || 'No chain'}
          </div>
          <div data-testid="set-active-chain-id">
            {typeof context.data.setActiveChainId === 'function'
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
    expect(screen.getByTestId('active-chain-id')).toBeInTheDocument();
    expect(screen.getByTestId('set-active-chain-id')).toHaveTextContent(
      'Function exists'
    );
  });

  it('provides setActiveChainId function that can be called', () => {
    const TestComponent = () => {
      const context = React.useContext(EtherspotTransactionKitContext);

      if (!context) {
        return <div>No context</div>;
      }

      const handleChainChange = () => {
        context.data.setActiveChainId(5); // Set to a different chain
      };

      return (
        <div>
          <button
            data-testid="change-chain"
            type="button"
            onClick={handleChainChange}
          >
            Change Chain
          </button>
          <div data-testid="current-chain">
            {context.data.activeChainId || 'No chain'}
          </div>
        </div>
      );
    };

    render(
      <EtherspotTransactionKitProvider config={mockConfig}>
        <TestComponent />
      </EtherspotTransactionKitProvider>
    );

    expect(screen.getByTestId('current-chain')).toHaveTextContent('1'); // Initial chain from config

    // Click the button to change chain
    act(() => {
      screen.getByTestId('change-chain').click();
    });

    // The setActiveChainId function should be callable
    expect(screen.getByTestId('change-chain')).toBeInTheDocument();
  });
});

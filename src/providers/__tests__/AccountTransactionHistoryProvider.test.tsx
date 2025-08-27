import {
  act,
  render,
  renderHook,
  screen,
  waitFor,
} from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';

// providers
import AccountTransactionHistoryProvider, {
  AccountTransactionHistoryContext,
} from '../AccountTransactionHistoryProvider';

describe('AccountTransactionHistoryProvider', () => {
  const TestComponent = () => {
    const context = React.useContext(AccountTransactionHistoryContext);

    if (!context) return <div>No context</div>;

    return (
      <div>
        <div data-testid="user-op-status">
          {context.data.userOpStatus || 'undefined'}
        </div>
        <div data-testid="transaction-hash">
          {context.data.transactionHash || 'undefined'}
        </div>
        <div data-testid="latest-user-op-info">
          {context.data.latestUserOpInfo || 'undefined'}
        </div>
        <div data-testid="latest-user-op-chain-id">
          {context.data.latestUserOpChainId || 'undefined'}
        </div>
        <button
          data-testid="set-sending"
          type="button"
          onClick={() => context.data.setUserOpStatus('Sending')}
        >
          Set Sending
        </button>
        <button
          data-testid="set-sent"
          type="button"
          onClick={() => context.data.setUserOpStatus('Sent')}
        >
          Set Sent
        </button>
        <button
          data-testid="set-confirmed"
          type="button"
          onClick={() => context.data.setUserOpStatus('Confirmed')}
        >
          Set Confirmed
        </button>
        <button
          data-testid="set-failed"
          type="button"
          onClick={() => context.data.setUserOpStatus('Failed')}
        >
          Set Failed
        </button>
        <button
          data-testid="set-transaction-hash"
          type="button"
          onClick={() => context.data.setTransactionHash('0x123...')}
        >
          Set Transaction Hash
        </button>
        <button
          data-testid="set-latest-user-op-info"
          type="button"
          onClick={() =>
            context.data.setLatestUserOpInfo('Transaction submitted')
          }
        >
          Set Latest User Op Info
        </button>
        <button
          data-testid="set-latest-user-op-chain-id"
          type="button"
          onClick={() => context.data.setLatestUserOpChainId(1)}
        >
          Set Latest User Op Chain ID
        </button>
      </div>
    );
  };

  const wrapper = ({ children }: React.PropsWithChildren) => (
    <AccountTransactionHistoryProvider>
      {children}
    </AccountTransactionHistoryProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders children without crashing', () => {
    render(
      <AccountTransactionHistoryProvider>
        <div data-testid="test-child">Test Child</div>
      </AccountTransactionHistoryProvider>
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('provides context with initial undefined values', () => {
    render(<TestComponent />, { wrapper });

    expect(screen.getByTestId('user-op-status')).toHaveTextContent('undefined');
    expect(screen.getByTestId('transaction-hash')).toHaveTextContent(
      'undefined'
    );
    expect(screen.getByTestId('latest-user-op-info')).toHaveTextContent(
      'undefined'
    );
    expect(screen.getByTestId('latest-user-op-chain-id')).toHaveTextContent(
      'undefined'
    );
  });

  it('updates userOpStatus when setUserOpStatus is called', async () => {
    render(<TestComponent />, { wrapper });

    // Initially undefined
    expect(screen.getByTestId('user-op-status')).toHaveTextContent('undefined');

    // Set to Sending
    await act(async () => {
      screen.getByTestId('set-sending').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('user-op-status')).toHaveTextContent('Sending');
    });

    // Set to Sent
    await act(async () => {
      screen.getByTestId('set-sent').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('user-op-status')).toHaveTextContent('Sent');
    });

    // Set to Confirmed
    await act(async () => {
      screen.getByTestId('set-confirmed').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('user-op-status')).toHaveTextContent(
        'Confirmed'
      );
    });

    // Set to Failed
    await act(async () => {
      screen.getByTestId('set-failed').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('user-op-status')).toHaveTextContent('Failed');
    });
  });

  it('updates transactionHash when setTransactionHash is called', async () => {
    render(<TestComponent />, { wrapper });

    // Initially undefined
    expect(screen.getByTestId('transaction-hash')).toHaveTextContent(
      'undefined'
    );

    // Set transaction hash
    await act(async () => {
      screen.getByTestId('set-transaction-hash').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('transaction-hash')).toHaveTextContent(
        '0x123...'
      );
    });
  });

  it('updates latestUserOpInfo when setLatestUserOpInfo is called', async () => {
    render(<TestComponent />, { wrapper });

    // Initially undefined
    expect(screen.getByTestId('latest-user-op-info')).toHaveTextContent(
      'undefined'
    );

    // Set latest user op info
    await act(async () => {
      screen.getByTestId('set-latest-user-op-info').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('latest-user-op-info')).toHaveTextContent(
        'Transaction submitted'
      );
    });
  });

  it('updates latestUserOpChainId when setLatestUserOpChainId is called', async () => {
    render(<TestComponent />, { wrapper });

    // Initially undefined
    expect(screen.getByTestId('latest-user-op-chain-id')).toHaveTextContent(
      'undefined'
    );

    // Set latest user op chain ID
    await act(async () => {
      screen.getByTestId('set-latest-user-op-chain-id').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('latest-user-op-chain-id')).toHaveTextContent(
        '1'
      );
    });
  });

  it('provides context data structure correctly', () => {
    const { result } = renderHook(
      () => React.useContext(AccountTransactionHistoryContext),
      { wrapper }
    );

    expect(result.current).toBeDefined();
    expect(result.current?.data).toBeDefined();
    expect(result.current?.data.userOpStatus).toBeUndefined();
    expect(result.current?.data.transactionHash).toBeUndefined();
    expect(result.current?.data.latestUserOpInfo).toBeUndefined();
    expect(result.current?.data.latestUserOpChainId).toBeUndefined();
    expect(typeof result.current?.data.setUserOpStatus).toBe('function');
    expect(typeof result.current?.data.setTransactionHash).toBe('function');
    expect(typeof result.current?.data.setLatestUserOpInfo).toBe('function');
    expect(typeof result.current?.data.setLatestUserOpChainId).toBe('function');
  });

  it('maintains state between re-renders', async () => {
    const { rerender } = render(<TestComponent />, { wrapper });

    // Set some values
    await act(async () => {
      screen.getByTestId('set-sending').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('user-op-status')).toHaveTextContent('Sending');
    });

    await act(async () => {
      screen.getByTestId('set-transaction-hash').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('transaction-hash')).toHaveTextContent(
        '0x123...'
      );
    });

    // Re-render
    rerender(<TestComponent />);

    // Verify values are maintained
    expect(screen.getByTestId('user-op-status')).toHaveTextContent('Sending');
    expect(screen.getByTestId('transaction-hash')).toHaveTextContent(
      '0x123...'
    );
  });

  it('handles multiple state updates correctly', async () => {
    render(<TestComponent />, { wrapper });

    // Set multiple values
    await act(async () => {
      screen.getByTestId('set-sending').click();
    });

    await act(async () => {
      screen.getByTestId('set-transaction-hash').click();
    });

    await act(async () => {
      screen.getByTestId('set-latest-user-op-info').click();
    });

    await act(async () => {
      screen.getByTestId('set-latest-user-op-chain-id').click();
    });

    // Verify all values are set correctly
    await waitFor(() => {
      expect(screen.getByTestId('user-op-status')).toHaveTextContent('Sending');
    });

    await waitFor(() => {
      expect(screen.getByTestId('transaction-hash')).toHaveTextContent(
        '0x123...'
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('latest-user-op-info')).toHaveTextContent(
        'Transaction submitted'
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('latest-user-op-chain-id')).toHaveTextContent(
        '1'
      );
    });
  });
});

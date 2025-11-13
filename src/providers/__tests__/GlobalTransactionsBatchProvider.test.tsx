import { act, renderHook } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';

// providers
import GlobalTransactionsBatchProvider from '../GlobalTransactionsBatchProvider';

// hooks
import useGlobalTransactionsBatch from '../../hooks/useGlobalTransactionsBatch';

// Unmock for this specific test file since we're testing the provider itself
vi.unmock('../../hooks/useGlobalTransactionsBatch');

describe('GlobalTransactionsBatchProvider', () => {
  let wrapper: React.FC;

  beforeEach(() => {
    wrapper = ({ children }: React.PropsWithChildren) => (
      <GlobalTransactionsBatchProvider>
        {children}
      </GlobalTransactionsBatchProvider>
    );
  });

  it('initializes with empty transaction metadata', () => {
    const { result } = renderHook(() => useGlobalTransactionsBatch(), {
      wrapper,
    });
    expect(result.current.transactionMeta).toEqual({});
  });

  it('initializes with undefined wallet connect transaction hash', () => {
    const { result } = renderHook(() => useGlobalTransactionsBatch(), {
      wrapper,
    });
    expect(result.current.walletConnectTxHash).toBeUndefined();
  });

  it('sets wallet connect transaction hash correctly', () => {
    const { result } = renderHook(() => useGlobalTransactionsBatch(), {
      wrapper,
    });

    act(() => {
      result.current.setWalletConnectTxHash('0x1234567890abcdef');
    });

    expect(result.current.walletConnectTxHash).toBe('0x1234567890abcdef');
  });

  it('sets transaction metadata for name correctly', () => {
    const { result } = renderHook(() => useGlobalTransactionsBatch(), {
      wrapper,
    });

    act(() => {
      result.current.setTransactionMetaForName('test-transaction', {
        title: 'Test Transaction',
        description: 'This is a test transaction',
      });
    });

    expect(result.current.transactionMeta['test-transaction']).toEqual({
      title: 'Test Transaction',
      description: 'This is a test transaction',
    });
  });

  it('updates existing transaction metadata', () => {
    const { result } = renderHook(() => useGlobalTransactionsBatch(), {
      wrapper,
    });

    act(() => {
      result.current.setTransactionMetaForName('test-transaction', {
        title: 'Test Transaction',
        description: 'This is a test transaction',
      });
    });

    act(() => {
      result.current.setTransactionMetaForName('test-transaction', {
        title: 'Updated Test Transaction',
        description: 'This is an updated test transaction',
      });
    });

    expect(result.current.transactionMeta['test-transaction']).toEqual({
      title: 'Updated Test Transaction',
      description: 'This is an updated test transaction',
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
});

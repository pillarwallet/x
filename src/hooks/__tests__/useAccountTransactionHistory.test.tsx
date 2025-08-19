import { renderHook } from '@testing-library/react';
import React from 'react';

// hooks
import useAccountTransactionHistory from '../useAccountTransactionHistory';

// providers
import AccountTransactionHistoryProvider from '../../providers/AccountTransactionHistoryProvider';

describe('useAccountTransactionHistory', () => {
  it('throws error when no parent provider', () => {
    expect(() => {
      renderHook(() => useAccountTransactionHistory());
    }).toThrow(Error('No parent <AccountTransactionHistoryProvider />'));
  });

  it('not to throw error when parent provider exist', () => {
    const wrapper = ({ children }: React.PropsWithChildren) => (
      <AccountTransactionHistoryProvider>
        {children}
      </AccountTransactionHistoryProvider>
    );

    expect(() => {
      renderHook(() => useAccountTransactionHistory(), { wrapper });
    }).not.toThrow();
  });

  it('returns user-op data when parent provider exists', () => {
    const wrapper = ({ children }: React.PropsWithChildren) => (
      <AccountTransactionHistoryProvider>
        {children}
      </AccountTransactionHistoryProvider>
    );

    const { result } = renderHook(() => useAccountTransactionHistory(), {
      wrapper,
    });

    expect(result.current).toBeDefined();
    expect(result.current.userOpStatus).toBeUndefined(); // Initial state
    expect(result.current.transactionHash).toBeUndefined(); // Initial state
    expect(result.current.latestUserOpInfo).toBeUndefined(); // Initial state
    expect(result.current.latestUserOpChainId).toBeUndefined(); // Initial state
    expect(typeof result.current.setUserOpStatus).toBe('function');
    expect(typeof result.current.setTransactionHash).toBe('function');
    expect(typeof result.current.setLatestUserOpInfo).toBe('function');
    expect(typeof result.current.setLatestUserOpChainId).toBe('function');
  });
});

import { act, renderHook } from '@testing-library/react';
import React from 'react';
import { mainnet } from 'viem/chains';
import { vi } from 'vitest';

// hooks
import useAccountTransactionHistory from '../useAccountTransactionHistory';

// providers
import AccountTransactionHistoryProvider from '../../providers/AccountTransactionHistoryProvider';

vi.mock('../../providers/AccountTransactionHistoryProvider');

// Skipping due to this being removed in an upcoming version of
// TransactionKit
describe('useAccountTransactionHistory', () => {
  const mockContextValue = {
    data: {
      history: {
        [mainnet.id]: {
          '0x7F30B1960D5556929B03a0339814fE903c55a347': [
            {
              hash: '0x1',
              from: '0x7F30B1960D5556929B03a0339814fE903c55a347',
              to: '0x7F30B1960D5556929B03a0339814fE903c55a347',
              value: '0',
              timestamp: 0,
              status: 'pending',
            },
          ],
        },
      },
      updateData: false,
      setUpdateData: vi.fn(),
      userOpStatus: undefined,
      setUserOpStatus: vi.fn(),
      transactionHash: undefined,
      setTransactionHash: vi.fn(),
      latestUserOpInfo: undefined,
      setLatestUserOpInfo: vi.fn(),
      latestUserOpChainId: undefined,
      setLatestUserOpChainId: vi.fn(),
    },
    listenerRef: {
      current: {
        onHistoryUpdated: vi.fn(),
      },
    },
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

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

  it.skip('returns history when parent provider exists', () => {
    vi.spyOn(React, 'useContext').mockImplementation(() => mockContextValue);

    const { result } = renderHook(() => useAccountTransactionHistory());
    expect(result.current).toEqual(mockContextValue.data);
  });

  it.skip('calls onUpdated when history are updated', () => {
    vi.spyOn(React, 'useContext').mockImplementation(() => mockContextValue);

    const onUpdated = vi.fn();
    renderHook(() => useAccountTransactionHistory({ onUpdated }));

    const newTransaction = {
      hash: '0x2',
      from: '0x7F30B1960D5556929B03a0339814fE903c55a347',
      to: '0x7F30B1960D5556929B03a0339814fE903c55a347',
      value: '0',
      timestamp: 0,
      status: 'confirmed',
    };

    act(() => {
      mockContextValue.listenerRef.current.onHistoryUpdated!(
        mainnet.id,
        '0x7F30B1960D5556929B03a0339814fE903c55a347',
        newTransaction
      );
    });

    expect(onUpdated).toHaveBeenCalledTimes(1);
    expect(onUpdated).toHaveBeenCalledWith(
      mainnet.id,
      '0x7F30B1960D5556929B03a0339814fE903c55a347',
      newTransaction
    );
  });
});

import { act, renderHook } from '@testing-library/react';
import React from 'react';
import { mainnet } from 'viem/chains';

// hooks
import useAccountTransactionHistory from '../useAccountTransactionHistory';

// providers
import AccountTransactionHistoryProvider from '../../providers/AccountTransactionHistoryProvider';

jest.mock('../../providers/AccountTransactionHistoryProvider');

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
    },
    listenerRef: {
      current: {
        onHistoryUpdated: jest.fn(),
      },
    },
  };

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

  it('returns history when parent provider exists', () => {
    jest.spyOn(React, 'useContext').mockImplementation(() => mockContextValue);

    const { result } = renderHook(() => useAccountTransactionHistory());
    expect(result.current).toEqual(mockContextValue.data.history);
  });

  it('calls onUpdated when history are updated', () => {
    jest.spyOn(React, 'useContext').mockImplementation(() => mockContextValue);

    const onUpdated = jest.fn();
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
      mockContextValue.listenerRef.current.onHistoryUpdated(
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

  afterEach(() => {
    jest.clearAllMocks();
  });
});

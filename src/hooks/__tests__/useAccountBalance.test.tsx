import { act, renderHook } from '@testing-library/react';
import React from 'react';

import AccountBalancesProvider from '../../providers/AccountBalancesProvider';
import useAccountBalances from '../useAccountBalances';

jest.mock('../../providers/AccountBalancesProvider');

describe('useAccountBalances', () => {
  it('throws error when no parent provider', () => {
    expect(() => {
      renderHook(() => useAccountBalances());
    }).toThrow(Error('No parent <AccountBalancesProvider />'));
  });

  it('not to throw error when parent provider exist', () => {
    const wrapper = ({ children }: React.PropsWithChildren) => (
      <AccountBalancesProvider>{children}</AccountBalancesProvider>
    );

    expect(() => {
      renderHook(() => useAccountBalances(), { wrapper });
    }).not.toThrow();
  });

  it('returns balances when parent provider exists', () => {
    const mockContextValue = {
      data: {
        balances: {
          eth: '10',
          btc: '1',
        },
      },
      listenerRef: {
        current: {
          onBalanceUpdated: jest.fn(),
        },
      },
    };

    jest.spyOn(React, 'useContext').mockImplementation(() => mockContextValue);

    const { result } = renderHook(() => useAccountBalances());
    expect(result.current).toEqual(mockContextValue.data.balances);
  });

  it('calls onUpdated when balances are updated', () => {
    const mockContextValue = {
      data: {
        balances: {
          eth: '10',
          btc: '1',
        },
      },
      listenerRef: {
        current: {
          onBalanceUpdated: jest.fn(),
        },
      },
    };

    jest.spyOn(React, 'useContext').mockImplementation(() => mockContextValue);

    const onUpdated = jest.fn();
    renderHook(() => useAccountBalances({ onUpdated }));

    const prevBalances = mockContextValue.data.balances;
    const newBalances = { ...prevBalances, eth: '20' };

    act(() => {
      mockContextValue.listenerRef.current.onBalanceUpdated(
        newBalances,
        prevBalances
      );
    });

    expect(onUpdated).toHaveBeenCalledTimes(1);
    expect(onUpdated).toHaveBeenCalledWith(newBalances, prevBalances);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});

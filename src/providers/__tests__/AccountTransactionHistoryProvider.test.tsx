import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import * as TransactionKit from '@etherspot/transaction-kit';
import {  mainnet } from 'viem/chains';
import { TransactionStatuses } from '@etherspot/prime-sdk/dist/sdk/data/constants';

// providers
import AccountTransactionHistoryProvider, { AccountTransactionHistoryContext } from '../../providers/AccountTransactionHistoryProvider';

describe('AccountTransactionHistoryProvider', () => {
  const accountTransactionsMock = [
    {
      transactionHash: '0x1',
      userOpHash: '0x1a',
      sender: '0x7F30B1960D5556929B03a0339814fE903c55a347',
      value: 0,
      success: TransactionStatuses.Completed,
      timestamp: 1630000000,
    },
    {
      transactionHash: '0x2',
      userOpHash: '0x2a',
      sender: '0x7F30B1960D5556929B03a0339814fE903c55a347',
      value: 0,
      success: TransactionStatuses.Pending,
      timestamp: 1640000000,
    }
  ];

  const accountHistoryMock =  {
    '0x7F30B1960D5556929B03a0339814fE903c55a347': accountTransactionsMock
  };

  let wrapper: React.FC;
  let mockGetAccountTransactionHistory: jest.Mock;
  let returnLongerHistory: boolean = false;

  beforeEach(() => {
    returnLongerHistory = false;

    wrapper = ({ children }: React.PropsWithChildren) => (
      <AccountTransactionHistoryProvider>
        {children}
      </AccountTransactionHistoryProvider>
    );

    mockGetAccountTransactionHistory = jest.fn().mockImplementation(() => ({
      getAccountTransactions: async (walletAddress: string, chainId: number) => {
        if (chainId === mainnet.id && walletAddress === '0x7F30B1960D5556929B03a0339814fE903c55a347') {
          return returnLongerHistory
            ? accountTransactionsMock.concat({
              transactionHash: '0x3',
              userOpHash: '0x3a',
              sender: '0x7F30B1960D5556929B03a0339814fE903c55a347',
              value: 0,
              success: TransactionStatuses.Completed,
              timestamp: 1650000000,
            })
            : accountTransactionsMock;
        }
        return [];
      }
    }));

    jest.spyOn(TransactionKit, 'useEtherspotHistory').mockImplementation(mockGetAccountTransactionHistory);

    jest.spyOn(TransactionKit, 'useWalletAddress').mockReturnValue('0x7F30B1960D5556929B03a0339814fE903c55a347');
  });

  it('initializes with empty history', () => {
    const { result } = renderHook(() => React.useContext(AccountTransactionHistoryContext), { wrapper });
    expect(result.current?.data.history).toEqual({});
  });

  it('updates history', async () => {
    const { result } = renderHook(() => React.useContext(AccountTransactionHistoryContext), { wrapper });

    await waitFor(async () => {
      expect(result.current?.data.history).toEqual({
        [mainnet.id]: accountHistoryMock,
      });
    });

    expect(mockGetAccountTransactionHistory).toHaveBeenCalled();
  });

  it('does not update history when wallet address is not set', async () => {
    jest.spyOn(TransactionKit, 'useWalletAddress').mockReturnValue(undefined);

    const { result } = renderHook(() => React.useContext(AccountTransactionHistoryContext), { wrapper });

    expect(result.current?.data.history).toEqual({});
  });

  it('calls onHistoryUpdated when history change', async () => {
    jest.useFakeTimers();

    const onHistoryUpdated = jest.fn();

    const { result } = renderHook(() => React.useContext(AccountTransactionHistoryContext), {
      wrapper: ({ children }) => (
        <AccountTransactionHistoryProvider>
          <AccountTransactionHistoryContext.Consumer>
            {(value) => {
              if (!value) return children;
              value.listenerRef.current.onHistoryUpdated = onHistoryUpdated;
              return children
            }}
          </AccountTransactionHistoryContext.Consumer>
        </AccountTransactionHistoryProvider>
      ),
    });

    await waitFor(async () => {
      expect(result.current?.data.history).not.toEqual({});
    });

    expect(result.current?.data.history[mainnet.id]['0x7F30B1960D5556929B03a0339814fE903c55a347'].length).toBe(2);

    returnLongerHistory = true;

    jest.runAllTimers();

    await waitFor(async () => {
      expect(result.current?.data.history[mainnet.id]['0x7F30B1960D5556929B03a0339814fE903c55a347'].length).toBe(3);
    });

    expect(onHistoryUpdated).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});

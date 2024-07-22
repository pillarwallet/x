import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import * as TransactionKit from '@etherspot/transaction-kit';
import {  polygon } from 'viem/chains';
import { TransactionStatuses } from '@etherspot/prime-sdk/dist/sdk/data/constants';

// services
import * as dappLocalStorage from '../../services/dappLocalStorage';

// providers
import AccountTransactionHistoryProvider, { AccountTransactionHistoryContext } from '../../providers/AccountTransactionHistoryProvider';

const accountAddress = '0x7F30B1960D5556929B03a0339814fE903c55a347';

describe('AccountTransactionHistoryProvider', () => {
  const accountTransactionsMock = [
    {
      transactionHash: '0x1',
      userOpHash: '0x1a',
      sender: accountAddress,
      value: 0,
      success: TransactionStatuses.Completed,
      timestamp: 1630000000,
    },
    {
      transactionHash: '0x2',
      userOpHash: '0x2a',
      sender: accountAddress,
      value: 0,
      success: TransactionStatuses.Pending,
      timestamp: 1640000000,
    }
  ];

  const accountHistoryMock =  {
    [accountAddress]: accountTransactionsMock
  };

  let wrapper: React.FC;
  let mockGetAccountTransactions: jest.Mock;
  let returnLongerHistory: boolean = false;

  beforeEach(() => {
    returnLongerHistory = false;

    wrapper = ({ children }: React.PropsWithChildren) => (
      <AccountTransactionHistoryProvider>
        {children}
      </AccountTransactionHistoryProvider>
    );

    mockGetAccountTransactions = jest.fn().mockImplementation((walletAddress: string, chainId: number) => {
      if (chainId === polygon.id && walletAddress === accountAddress) {
        return returnLongerHistory
          ? accountTransactionsMock.concat({
            transactionHash: '0x3',
            userOpHash: '0x3a',
            sender: accountAddress,
            value: 0,
            success: TransactionStatuses.Completed,
            timestamp: 1650000000,
          })
          : accountTransactionsMock;
      }
      return [];
    });

    jest.spyOn(TransactionKit, 'useEtherspotHistory').mockReturnValue({
      getAccountTransactions: mockGetAccountTransactions,
      getAccountTransaction: jest.fn(),
      getAccountTransactionStatus: jest.fn(),
    });

    jest.spyOn(TransactionKit, 'useWalletAddress').mockReturnValue(accountAddress);
    jest.spyOn(dappLocalStorage, 'getJsonItem').mockReturnValue({});
  });

  it('initializes with empty history', () => {
    const { result } = renderHook(() => React.useContext(AccountTransactionHistoryContext), { wrapper });
    expect(result.current?.data.history).toEqual({});
  });

  it('updates history', async () => {
    const { result } = renderHook(() => React.useContext(AccountTransactionHistoryContext), { wrapper });

    result.current?.data.setUpdateData(true);

    await waitFor(async () => {
      expect(result.current?.data.history).toEqual({
        [polygon.id]: accountHistoryMock,
      });
    });

    expect(mockGetAccountTransactions).toHaveBeenCalled();
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

    result.current?.data.setUpdateData(true);
    
    await waitFor(async () => {
      expect(result.current?.data.history).not.toEqual({});
    });

    expect(result.current?.data.history[polygon.id][accountAddress].length).toBe(2);

    returnLongerHistory = true;

    jest.runAllTimers();

    await waitFor(async () => {
      expect(result.current?.data.history[polygon.id][accountAddress].length).toBe(3);
    });

    expect(onHistoryUpdated).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});

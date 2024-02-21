import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import * as TransactionKit from '@etherspot/transaction-kit';
import { avalanche, bsc, gnosis, mainnet, polygon } from 'viem/chains';

// utils
import * as blockchainUtils from '../../utils/blockchain';

// providers
import AccountTransactionHistoryProvider, { AccountTransactionHistoryContext } from '../../providers/AccountTransactionHistoryProvider';

// types
import { Transaction } from '../../types/blockchain';

describe('AccountTransactionHistoryProvider', () => {
  const accountTransactionsMock: Transaction[] = [
    {
      id: '1',
      hash: '0x1',
      to: '0x7F30B1960D5556929B03a0339814fE903c55a347',
      value: '0',
      status: 'confirmed',
      blockTimestamp: 1630000000,
    },
    {
      id: '2',
      hash: '0x2',
      to: '0x7F30B1960D5556929B03a0339814fE903c55a347',
      value: '0',
      status: 'pending',
      blockTimestamp: 1640000000,
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

    mockGetAccountTransactionHistory = jest.fn().mockImplementation((chainId, walletAddress) => {
      if (chainId === mainnet.id && walletAddress === '0x7F30B1960D5556929B03a0339814fE903c55a347') {
        return returnLongerHistory
          ? accountTransactionsMock.concat({
              id: '3',
              hash: '0x3',
              to: '0x7F30B1960D5556929B03a0339814fE903c55a347',
              value: '0',
              status: 'confirmed',
              blockTimestamp: 1650000000,
            })
          : accountTransactionsMock;
      }
      return [];
    });

    jest.spyOn(blockchainUtils, 'getAccountTransactionHistory').mockImplementation(mockGetAccountTransactionHistory);

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
        [polygon.id]: { '0x7F30B1960D5556929B03a0339814fE903c55a347': [] },
        [gnosis.id]: { '0x7F30B1960D5556929B03a0339814fE903c55a347': [] },
        [avalanche.id]: { '0x7F30B1960D5556929B03a0339814fE903c55a347': [] },
        [bsc.id]: { '0x7F30B1960D5556929B03a0339814fE903c55a347': [] },
      });
    });

    expect(mockGetAccountTransactionHistory).toHaveBeenCalled();
  });

  it('does not update history when wallet address is not set', async () => {
    jest.spyOn(TransactionKit, 'useWalletAddress').mockReturnValue(undefined);

    const { result } = renderHook(() => React.useContext(AccountTransactionHistoryContext), { wrapper });

    expect(mockGetAccountTransactionHistory).not.toHaveBeenCalled();
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

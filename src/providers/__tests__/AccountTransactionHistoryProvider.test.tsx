import { TransactionStatuses } from '@etherspot/data-utils/dist/cjs/sdk/data/constants';
import * as TransactionKit from '@etherspot/transaction-kit';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { polygon } from 'viem/chains';

// services
import * as dappLocalStorage from '../../services/dappLocalStorage';

// providers
import AccountTransactionHistoryProvider, {
  AccountTransactionHistoryContext,
} from '../AccountTransactionHistoryProvider';

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
    },
  ];

  const accountHistoryMock = {
    [accountAddress]: accountTransactionsMock,
  };

  let wrapper: React.FC;
  let mockGetAccountTransactions: vi.mock;
  let returnLongerHistory: boolean = false;

  beforeEach(() => {
    returnLongerHistory = false;

    wrapper = ({ children }: React.PropsWithChildren) => (
      <AccountTransactionHistoryProvider>
        {children}
      </AccountTransactionHistoryProvider>
    );

    mockGetAccountTransactions = vi
      .fn()
      .mockImplementation((walletAddress: string, chainId: number) => {
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

    vi.spyOn(TransactionKit, 'useEtherspotHistory').mockReturnValue({
      getAccountTransactions: mockGetAccountTransactions,
      getAccountTransaction: vi.fn(),
      getAccountTransactionStatus: vi.fn(),
    });

    vi.spyOn(TransactionKit, 'useWalletAddress').mockReturnValue(
      accountAddress
    );
    vi.spyOn(dappLocalStorage, 'getJsonItem').mockReturnValue({});
  });

  it('initializes with empty history', () => {
    const { result } = renderHook(
      () => React.useContext(AccountTransactionHistoryContext),
      { wrapper }
    );
    expect(result.current?.data.history).toEqual({});
  });

  it('updates history', async () => {
    const { result } = renderHook(
      () => React.useContext(AccountTransactionHistoryContext),
      { wrapper }
    );

    result.current?.data.setUpdateData(true);

    await waitFor(async () => {
      expect(result.current?.data.history).toEqual({
        [polygon.id]: accountHistoryMock,
      });
    });

    expect(mockGetAccountTransactions).toHaveBeenCalled();
  });

  it('does not update history when wallet address is not set', async () => {
    vi.spyOn(TransactionKit, 'useWalletAddress').mockReturnValue(undefined);

    const { result } = renderHook(
      () => React.useContext(AccountTransactionHistoryContext),
      { wrapper }
    );

    expect(result.current?.data.history).toEqual({});
  });

  it('calls onHistoryUpdated when history change', async () => {
    vi.useFakeTimers();

    const onHistoryUpdated = vi.fn();

    const { result } = renderHook(
      () => React.useContext(AccountTransactionHistoryContext),
      {
        wrapper: ({ children }) => (
          <AccountTransactionHistoryProvider>
            <AccountTransactionHistoryContext.Consumer>
              {(value) => {
                if (!value) return children;
                // eslint-disable-next-line no-param-reassign
                value.listenerRef.current.onHistoryUpdated = onHistoryUpdated;
                return children;
              }}
            </AccountTransactionHistoryContext.Consumer>
          </AccountTransactionHistoryProvider>
        ),
      }
    );

    result.current?.data.setUpdateData(true);

    await waitFor(async () => {
      expect(result.current?.data.history).not.toEqual({});
    });

    expect(
      result.current?.data.history[polygon.id][accountAddress].length
    ).toBe(2);

    returnLongerHistory = true;

    vi.runAllTimers();

    await waitFor(async () => {
      expect(
        result.current?.data.history[polygon.id][accountAddress].length
      ).toBe(3);
    });

    expect(onHistoryUpdated).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
});

import * as TransactionKit from '@etherspot/transaction-kit';
import { renderHook, waitFor } from '@testing-library/react';
import { ethers } from 'ethers';
import React from 'react';
import { polygon } from 'viem/chains';

// providers
import AccountBalancesProvider, {
  AccountBalancesContext,
} from '../AccountBalancesProvider';

// services
import * as dappLocalStorage from '../../services/dappLocalStorage';

const accountAddress = '0x7F30B1960D5556929B03a0339814fE903c55a347';

describe('AccountBalancesProvider', () => {
  const balancesMock = [
    {
      token: ethers.constants.AddressZero,
      balance: ethers.utils.parseEther('1.0'),
      superBalance: ethers.utils.parseEther('1.0'),
    },
  ];

  let wrapper: React.FC;
  let mockGetAccountBalances: jest.Mock;

  beforeEach(() => {
    wrapper = ({ children }: React.PropsWithChildren) => (
      <AccountBalancesProvider>{children}</AccountBalancesProvider>
    );

    mockGetAccountBalances = jest
      .fn()
      .mockImplementation((account: string, chainId: number) =>
        chainId === polygon.id ? balancesMock : []
      );

    jest.spyOn(TransactionKit, 'useEtherspotBalances').mockReturnValue({
      getAccountBalances: mockGetAccountBalances,
    });

    jest
      .spyOn(TransactionKit, 'useWalletAddress')
      .mockReturnValue(accountAddress);
    jest.spyOn(dappLocalStorage, 'getJsonItem').mockReturnValue({});
  });

  it('initializes with empty balances', () => {
    const { result } = renderHook(
      () => React.useContext(AccountBalancesContext),
      { wrapper }
    );

    result.current?.data.setUpdateData(true);

    expect(result.current?.data.balances).toEqual({});
  });

  it('updates balances', async () => {
    const { result } = renderHook(
      () => React.useContext(AccountBalancesContext),
      { wrapper }
    );

    result.current?.data.setUpdateData(true);

    await waitFor(async () => {
      expect(result.current?.data.balances).toEqual({
        [polygon.id]: { [accountAddress]: balancesMock },
      });
    });

    expect(mockGetAccountBalances).toHaveBeenCalled();
  });

  it('does not update balances when wallet address is not set', async () => {
    jest.spyOn(TransactionKit, 'useWalletAddress').mockReturnValue(undefined);

    const { result } = renderHook(
      () => React.useContext(AccountBalancesContext),
      { wrapper }
    );

    result.current?.data.setUpdateData(true);

    expect(mockGetAccountBalances).not.toHaveBeenCalled();
    expect(result.current?.data.balances).toEqual({});
  });

  it('calls onBalanceUpdated when balances change', async () => {
    const onBalanceUpdated = jest.fn();

    const { result } = renderHook(
      () => React.useContext(AccountBalancesContext),
      {
        wrapper: ({ children }) => (
          <AccountBalancesProvider>
            <AccountBalancesContext.Consumer>
              {(value) => {
                if (!value) return children;
                // eslint-disable-next-line no-param-reassign
                value.listenerRef.current.onBalanceUpdated = onBalanceUpdated;
                return children;
              }}
            </AccountBalancesContext.Consumer>
          </AccountBalancesProvider>
        ),
      }
    );

    result.current?.data.setUpdateData(true);

    await waitFor(async () => {
      expect(result.current?.data.balances).not.toEqual({});
    });

    expect(onBalanceUpdated).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});

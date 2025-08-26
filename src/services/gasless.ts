/* eslint-disable import/extensions */
import { constants } from 'ethers';

import { isPolygonAssetNative } from '../utils/blockchain';
import { Token } from './tokensData';

export type Paymasters = {
  gasToken: string;
  chainId: number;
  epVersion: string;
  paymasterAddress: string;
};

interface ChainBalance {
  chainId: string;
  balance: string;
}

export const GasConsumptions = {
  native: 510000,
  native_arb: 910000,
  token: 550000,
  token_arb: 960000,
  nft: 630000,
  nft_arb: 1050000,
};

export const getAllGaslessPaymasters = async (
  chainId: number,
  tokens_list: Token[]
): Promise<Paymasters[] | null> => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_PAYMASTER_URL}/getAllCommonERC20PaymasterAddress`,
      {
        method: 'POST',
        body: JSON.stringify({}),
      }
    );
    const data = await res.json();
    if (data.message) {
      let paymasterObject = JSON.parse(data.message);
      paymasterObject = paymasterObject.filter(
        (item: { epVersion: string; chainId: number; gasToken: string }) =>
          item.epVersion === 'EPV_07' &&
          item.chainId === chainId &&
          tokens_list.find(
            (token: Token) =>
              token.contract === item.gasToken.toLowerCase() ||
              (isPolygonAssetNative(item.gasToken, item.chainId) &&
                token.contract === constants.AddressZero)
          )
      );
      return paymasterObject;
    }
    return null;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getGasTankBalance = async (
  walletAddress: string
): Promise<number | null> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_PAYMASTER_URL}/getGasTankBalance?sender=${walletAddress}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch gas tank balance: ${response.status}`);
    }

    const data = await response.json();
    const balances: ChainBalance[] = Object.values(data.balance || {});
    // Get cumalative balance for all chains
    const total = balances.reduce((sum, chainBalance) => {
      const balance = parseFloat(chainBalance.balance) || 0;
      return sum + balance;
    }, 0);
    return total;
  } catch (error) {
    console.error('Error fetching gas tank balance:', error);
    return null;
  }
};

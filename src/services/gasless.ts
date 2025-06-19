/* eslint-disable import/extensions */
import { constants } from 'ethers';

import { Token } from './tokensData';
import { isPolygonAssetNative } from '../utils/blockchain';

export type Paymasters = {
  gasToken: string;
  chainId: number;
  epVersion: string;
  paymasterAddress: string;
};

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
      `${process.env.REACT_APP_PAYMASTER_URL}/getAllCommonERC20PaymasterAddress`,
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

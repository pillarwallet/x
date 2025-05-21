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

export const getAllGaslessPaymasters = async (
  chainId: number,
  tokens_list: Token[]
): Promise<Paymasters[] | null> => {
  try {
    // eslint-disable-next-line no-console
    console.log(chainId, tokens_list);
    const res = await fetch(
      `${process.env.REACT_APP_PAYMASTER_URL}/getAllCommonERC20PaymasterAddress?apiKey=${process.env.REACT_APP_PAYMASTER_API_KEY}`,
      {
        method: 'POST',
        body: JSON.stringify({}),
      }
    );
    const data = await res.json();
    // eslint-disable-next-line no-console
    console.log(data.message);
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

/* eslint-disable import/extensions */
import { constants, BigNumber } from 'ethers';

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

export const getGasPrice = async (chainId: number) => {
  let gasPrice = '0';
  try {
    const gasRes = await fetch(
      `${process.env.REACT_APP_GAS_URL}/${chainId}?api-key=${process.env.REACT_APP_ETHERSPOT_BUNDLER_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'skandha_getGasPrice',
        }),
      }
    );
    gasRes.json().then((response) => {
      if (response.result) {
        gasPrice = BigNumber.from(response.result.maxFeePerGas)
          .add(response.result.maxPriorityFeePerGas)
          .toString();
      }
    });
    return gasPrice;
  } catch (err) {
    console.error(err);
    return gasPrice;
  }
};

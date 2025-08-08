/* eslint-disable no-restricted-syntax */
import { DispensableAsset } from '@etherspot/intent-sdk/dist/cjs/sdk/types/user-intent-types';
import { Hex } from 'viem';
import { PortfolioData } from '../../../types/api';
import { PayingToken } from '../types/tokens';
import { STABLE_CURRENCIES } from '../constants/tokens';

export function getDesiredAssetValue(
  input: string,
  decimals: number,
  usdValue: string
): bigint {
  const value = Number(parseFloat(input)) / Number(parseFloat(usdValue));
  return BigInt(Math.ceil(Number(value.toFixed(6))) * 10 ** decimals);
}

export function getDispensableAssets(
  input: string,
  portfolioData: PortfolioData | undefined
): [DispensableAsset[], bigint[], PayingToken[]] {
  // TODO: build a logic to use multiple tokens from different chains.
  if (!portfolioData?.assets) {
    return [[], [], []];
  }

  for (const item of portfolioData.assets) {
    const { price } = item;
    for (const token of item.contracts_balances) {
      const tokenItem = {
        chainId: Number(token.chainId.split(':').at(-1)),
        address: token.address,
      };

      const usdEq = price * token.balance;
      const t = STABLE_CURRENCIES.find(
        (x) =>
          x.address.toLowerCase() === tokenItem.address.toLowerCase() &&
          x.chainId === tokenItem.chainId
      );
      if (usdEq > Number(input) && t) {
        return [
          [
            {
              asset: tokenItem.address as Hex,
              chainId: BigInt(tokenItem.chainId),
              maxValue: BigInt(
                Math.ceil(
                  Number(
                    (Number(Number(input).toFixed(6)) / price).toPrecision(6)
                  ) *
                    10 ** token.decimals
                )
              ),
            },
          ],
          [BigInt(tokenItem.chainId)],
          [
            {
              name: item.asset.name,
              logo: item.asset.logo,
              symbol: item.asset.symbol,
              chainId: tokenItem.chainId,
              actualBal: token.balance.toString(),
              totalUsd: Number(Number(input).toFixed(6)),
              totalRaw: (Number(Number(input).toFixed(6)) / price).toFixed(6),
            },
          ],
        ];
      }
    }
  }
  return [[], [], []];
}

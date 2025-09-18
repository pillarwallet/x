/* eslint-disable no-restricted-syntax */
import { DispensableAsset } from '@etherspot/intent-sdk/dist/cjs/sdk/types/user-intent-types';
import { getAddress, Hex } from 'viem';
import { PortfolioData } from '../../../types/api';
import { STABLE_CURRENCIES } from '../constants/tokens';
import { PayingToken } from '../types/tokens';
import { bigIntPow } from './number';

export function getDesiredAssetValue(
  input: string,
  decimals: number,
  usdValue: string
): bigint {
  const usd = parseFloat(input);
  const price = parseFloat(usdValue);
  if (Number.isNaN(usd) || Number.isNaN(price) || price <= 0) return BigInt(0);
  const multiplier = bigIntPow(BigInt(10), BigInt(decimals));
  const tokens = BigInt(Math.ceil((usd / price) * Number(multiplier)));
  return tokens;
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
              asset: getAddress(tokenItem.address) as Hex,
              chainId: BigInt(tokenItem.chainId),
              maxValue: BigInt(
                (BigInt(
                  Math.ceil(
                    Number(
                      (Number(Number(input).toFixed(6)) / price).toPrecision(6)
                    ) *
                      10 ** 6
                  )
                ) *
                  bigIntPow(BigInt(10), BigInt(token.decimals))) /
                  BigInt(10 ** 6)
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
              address: tokenItem.address,
            },
          ],
        ];
      }
    }
  }
  return [[], [], []];
}

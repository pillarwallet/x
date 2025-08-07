/* eslint-disable no-restricted-syntax */
import {
  PairResponse,
  Projection,
  TokenAssetResponse,
  TokensMarketData,
} from '../../../types/api';
import {
  getChainName,
  MOBULA_CHAIN_NAMES,
  MobulaChainNames,
} from './constants';
import { parseNumberString } from './number';

export type Asset = {
  name: string;
  symbol: string;
  logo: string | null;
  mCap: number | undefined;
  volume: number | undefined;
  price: number | null;
  liquidity: number | undefined;
  chain: string;
  decimals: number;
  contract: string;
  priceChange24h: number | null;
  timestamp?: number;
};

export function parseAssetData(
  asset: TokenAssetResponse,
  chains: MobulaChainNames
): Asset[] {
  const result: Asset[] = [];
  const { blockchains, contracts, decimals } = asset;
  for (let i = 0; i < blockchains.length; i += 1) {
    if (
      MOBULA_CHAIN_NAMES.includes(blockchains[i]) &&
      (chains === MobulaChainNames.All || chains === blockchains[i])
    ) {
      result.push({
        name: asset.name,
        symbol: asset.symbol,
        logo: asset.logo,
        mCap: asset.market_cap,
        volume: asset.volume,
        price: asset.price,
        liquidity: asset.liquidity,
        chain: blockchains[i],
        decimals: decimals[i],
        contract: contracts[i],
        priceChange24h: asset.price_change_24h,
      });
    }
  }

  return result;
}

export function parseTokenData(asset: TokenAssetResponse): Asset[] {
  const result: Asset[] = [];
  const { blockchains, decimals, contracts } = asset;
  for (let i = 0; i < blockchains.length; i += 1) {
    if (MOBULA_CHAIN_NAMES.includes(blockchains[i])) {
      result.push({
        name: asset.name,
        symbol: asset.symbol,
        logo: asset.logo,
        mCap: asset.market_cap,
        volume: asset.volume_24h,
        price: asset.price,
        liquidity: asset.liquidity,
        chain: blockchains[i],
        decimals: decimals[i],
        contract: contracts[i],
        priceChange24h: asset.price_change_24h,
      });
    }
  }
  return result;
}

export function parseSearchData(
  searchData: TokenAssetResponse[] | PairResponse[],
  chains: MobulaChainNames
) {
  const assets: Asset[] = [];
  const markets: Asset[] = [];
  searchData.forEach((item) => {
    if (item.type === 'asset') {
      assets.push(...parseAssetData(item as TokenAssetResponse, chains));
    } else if (item.type === 'token') {
      assets.push(...parseTokenData(item as TokenAssetResponse));
    }
  });

  return { assets, markets };
}

export function parseFreshAndTrendingTokens(
  projections: Projection[]
): Asset[] {
  const res: Asset[] = [];
  for (const projection of projections) {
    const chainId = projection.id.split('-')[1];
    const { rows } = projection.data as TokensMarketData;
    if (rows) {
      for (const j of rows) {
        res.push({
          chain: getChainName(+chainId),
          contract: j.leftColumn?.line1?.copyLink || '',
          decimals: j.meta?.tokenData.decimals || 18,
          liquidity: parseNumberString(
            j.leftColumn?.line2?.liquidity || '0.00K'
          ),
          logo: j.leftColumn?.token?.primaryImage || null,
          name: j.leftColumn?.line1?.text1 || '',
          price: Number(j.rightColumn?.line1?.price || 0),
          priceChange24h:
            Number((j.rightColumn?.line1?.percentage || '0%').slice(0, -1)) *
            (j.rightColumn?.line1?.direction === 'DOWN' ? -1 : 1),
          symbol: j.leftColumn?.line1?.text2 || '',
          volume: parseNumberString(j.leftColumn?.line2?.volume || '0.00K'),
          mCap: j.meta?.tokenData.marketCap || 0,
          timestamp: j.leftColumn?.line2?.timestamp,
        });
      }
    }
  }
  return res;
}

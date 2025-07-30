import { PairResponse, TokenAssetResponse } from '../../../types/api';
import { MOBULA_CHAIN_NAMES, MobulaChainNames } from './constants';

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

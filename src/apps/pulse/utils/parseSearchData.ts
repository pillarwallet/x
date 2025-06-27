import { PairResponse, TokenAssetResponse } from "../../../types/api";
import { CHAIN_LOGOS } from "../constants/tokens";
import { MOBULA_CHAIN_NAMES } from "./constants";

export type Asset = {
  name: string;
  symbol: string;
  logo: string | null;
  mCap: number | undefined;
  volume: number | undefined;
  price: number | null;
  liquidity: number | undefined;
  chainLogo: string;
  chain: string;
  decimals: number;
  contract: string;
}

export function parseAssetData(asset: TokenAssetResponse): Asset[] {
  const result: Asset[] = [];
  const {blockchains, contracts, decimals} = asset;
  for(let i=0; i< blockchains.length; i++) {
    if(MOBULA_CHAIN_NAMES.includes(blockchains[i])) {
      result.push({
        name: asset.name,
        symbol: asset.symbol,
        logo: asset.logo,
        mCap: asset.market_cap,
        volume: asset.volume,
        price: asset.price,
        liquidity: asset.liquidity,
        chainLogo: CHAIN_LOGOS[blockchains[i]],
        chain: blockchains[i],
        decimals: decimals[i],
        contract: contracts[i],
      });
    }
  }

  return result;
}

export function parseTokenData(asset: any): Asset[] {
  const result: Asset[] = [];
  const {blockchains, decimals, contracts} = asset as any
  for(let i=0; i< blockchains.length; i++) {
    if(MOBULA_CHAIN_NAMES.includes(blockchains[i])) {
      result.push({
        name: asset.name,
        symbol: asset.symbol,
        logo: asset.logo,
        mCap: asset.market_cap,
        volume: asset.volume_24h,
        price: asset.price,
        liquidity: asset.liquidity,
        chainLogo: CHAIN_LOGOS[blockchains[i]],
        chain: blockchains[i],
        decimals: decimals[i],
        contract: contracts[i]
      })
    }
  }
  return result;
}


export function parseSearchData(searchData: TokenAssetResponse[] | PairResponse[]) {
  let assets: Asset[] = [];
  let markets: Asset[] = [];

  console.log("searchData:: ", searchData);
  for(const item of searchData) {
    if(item.type === "asset") {
      assets.push(...parseAssetData(item as TokenAssetResponse));
    } else if (item.type === "token"){
      assets.push(...parseTokenData(item as PairResponse));
      continue;
    } else {
      continue;
    }
  }

  return {assets, markets};
}
/* eslint-disable no-restricted-syntax */
import {
  PairResponse,
  Projection,
  TokenAssetResponse,
  TokensMarketData,
} from '../../../types/api';
import { chainNameToChainIdTokensData } from '../../../services/tokensData';
import {
  getChainName,
  MOBULA_CHAIN_NAMES,
  MobulaChainNames,
} from './constants';
import { parseNumberString } from './number';
import { isWrappedNativeToken } from '../../../utils/blockchain';

// Optimism uses this special address for native ETH in Mobula API
const OP_NATIVE_MOBULA = '0xdeaddeaddeaddeaddeaddeaddeaddeaddead0000';
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const OPTIMISM_CHAIN_ID = 10;

/**
 * Normalize contract address for native tokens
 * Optimism native ETH uses a special address in Mobula, we need to convert it to zero address
 */
const normalizeContractAddress = (
  contract: string,
  symbol: string,
  chainId: number
): string => {
  if (
    contract.toLowerCase() === OP_NATIVE_MOBULA.toLowerCase() &&
    symbol === 'ETH' &&
    chainId === OPTIMISM_CHAIN_ID
  ) {
    return ZERO_ADDRESS;
  }
  return contract;
};

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
      const chainId = chainNameToChainIdTokensData(blockchains[i]);
      const contractAddress = contracts[i];
      const normalizedContract = normalizeContractAddress(
        contractAddress,
        asset.symbol,
        chainId
      );

      // Filter out wrapped native tokens (WETH, WBNB, WPOL, etc.) from search results
      if (!isWrappedNativeToken(contractAddress, chainId)) {
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
          contract: normalizedContract,
          priceChange24h: asset.price_change_24h,
        });
      }
    }
  }

  return result;
}

export function parseTokenData(asset: TokenAssetResponse): Asset[] {
  const result: Asset[] = [];
  const { blockchains, decimals, contracts } = asset;
  for (let i = 0; i < blockchains.length; i += 1) {
    if (MOBULA_CHAIN_NAMES.includes(blockchains[i])) {
      const chainId = chainNameToChainIdTokensData(blockchains[i]);
      const contractAddress = contracts[i];
      const normalizedContract = normalizeContractAddress(
        contractAddress,
        asset.symbol,
        chainId
      );

      // Filter out wrapped native tokens (WETH, WBNB, WPOL, etc.) from search results
      if (!isWrappedNativeToken(contractAddress, chainId)) {
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
          contract: normalizedContract,
          priceChange24h: asset.price_change_24h,
        });
      }
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
        const contractAddress = j.leftColumn?.line1?.copyLink || '';
        const symbol = j.leftColumn?.line1?.text2 || '';
        const normalizedContract = normalizeContractAddress(
          contractAddress,
          symbol,
          +chainId
        );

        // Filter out wrapped native tokens (WETH, WBNB, WPOL, etc.) from search results
        if (!isWrappedNativeToken(contractAddress, +chainId)) {
          res.push({
            chain: getChainName(+chainId),
            contract: normalizedContract,
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
            symbol,
            volume: parseNumberString(j.leftColumn?.line2?.volume || '0.00K'),
            mCap: j.meta?.tokenData.marketCap || 0,
            timestamp: j.leftColumn?.line2?.timestamp,
          });
        }
      }
    }
  }
  return res;
}

/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  Exchange,
  MobulaToken,
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

export type Asset = {
  id?: number; // Mobula ID for deduplication
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
  // For multi-chain assets, store all chains
  allChains?: string[];
  allContracts?: string[];
  allDecimals?: number[];
};

export type Market = {
  pairName: string; // e.g., "PLR/ETH"
  token0: MobulaToken;
  token1: MobulaToken;
  liquidity: number;
  volume24h: number;
  blockchain: string;
  address: string;
  exchange: Exchange;
  priceChange24h: number | null;
  price: number | null;
};

export function parseAssetData(
  asset: TokenAssetResponse,
  chains: MobulaChainNames
): Asset[] {
  const result: Asset[] = [];
  const { blockchains, contracts, decimals } = asset;

  // Filter valid chains first
  const validChainIndices: number[] = [];
  for (let i = 0; i < blockchains.length; i += 1) {
    if (
      MOBULA_CHAIN_NAMES.includes(blockchains[i]) &&
      (chains === MobulaChainNames.All || chains === blockchains[i])
    ) {
      const chainId = chainNameToChainIdTokensData(blockchains[i]);
      const contractAddress = contracts[i];

      // Filter out wrapped native tokens
      if (!isWrappedNativeToken(contractAddress, chainId)) {
        validChainIndices.push(i);
      }
    }
  }

  // If no valid chains, return empty
  if (validChainIndices.length === 0) {
    return result;
  }

  // Create a single asset entry with the first valid chain as primary
  // and store all other chains in allChains
  const primaryIndex = validChainIndices[0];

  result.push({
    id: asset.id, // Include Mobula ID
    name: asset.name,
    symbol: asset.symbol,
    logo: asset.logo,
    mCap: asset.market_cap,
    volume: asset.volume,
    price: asset.price,
    liquidity: asset.liquidity,
    chain: blockchains[primaryIndex],
    decimals: decimals[primaryIndex],
    contract: contracts[primaryIndex],
    priceChange24h: asset.price_change_24h,
    // Store all valid chains for multi-chain selection
    allChains: validChainIndices.map((i) => blockchains[i]),
    allContracts: validChainIndices.map((i) => contracts[i]),
    allDecimals: validChainIndices.map((i) => decimals[i]),
  });

  return result;
}

export function parseTokenData(asset: TokenAssetResponse): Asset[] {
  const result: Asset[] = [];
  const { blockchains, decimals, contracts } = asset;

  // Filter valid chains first
  const validChainIndices: number[] = [];
  for (let i = 0; i < blockchains.length; i += 1) {
    if (MOBULA_CHAIN_NAMES.includes(blockchains[i])) {
      const chainId = chainNameToChainIdTokensData(blockchains[i]);
      const contractAddress = contracts[i];

      // Filter out wrapped native tokens
      if (!isWrappedNativeToken(contractAddress, chainId)) {
        validChainIndices.push(i);
      }
    }
  }

  // If no valid chains, return empty
  if (validChainIndices.length === 0) {
    return result;
  }

  // Create a single token entry with the first valid chain as primary
  const primaryIndex = validChainIndices[0];

  result.push({
    id: asset.id, // Include Mobula ID
    name: asset.name,
    symbol: asset.symbol,
    logo: asset.logo,
    mCap: asset.market_cap,
    volume: asset.volume_24h,
    price: asset.price,
    liquidity: asset.liquidity,
    chain: blockchains[primaryIndex],
    decimals: decimals[primaryIndex],
    contract: contracts[primaryIndex],
    priceChange24h: asset.price_change_24h,
    // Store all valid chains for multi-chain selection
    allChains: validChainIndices.map((i) => blockchains[i]),
    allContracts: validChainIndices.map((i) => contracts[i]),
    allDecimals: validChainIndices.map((i) => decimals[i]),
  });

  return result;
}

/**
 * Parse market pairs from TokenAssetResponse, ensuring the searched token appears first
 */
export function parseMarketPairs(
  asset: TokenAssetResponse,
  searchTerm: string,
  chains: MobulaChainNames
): Market[] {
  const markets: Market[] = [];
  const { pairs } = asset;

  if (!pairs || pairs.length === 0) {
    return markets;
  }

  const normalizedSearchTerm = searchTerm.toLowerCase().trim();

  for (const pair of pairs) {
    // Filter by chain if specified
    if (
      chains === MobulaChainNames.All ||
      pair.blockchain === chains
    ) {
      // Determine which token matches the search term
      const token0MatchesSearch =
        pair.token0.symbol.toLowerCase().includes(normalizedSearchTerm) ||
        pair.token0.name.toLowerCase().includes(normalizedSearchTerm);

      const token1MatchesSearch =
        pair.token1.symbol.toLowerCase().includes(normalizedSearchTerm) ||
        pair.token1.name.toLowerCase().includes(normalizedSearchTerm);

      // Only process if at least one token matches
      if (token0MatchesSearch || token1MatchesSearch) {
        // Arrange pair so searched token is first
        let pairName: string;
        let orderedToken0: MobulaToken;
        let orderedToken1: MobulaToken;

        if (token0MatchesSearch) {
          pairName = `${pair.token0.symbol}/${pair.token1.symbol}`;
          orderedToken0 = pair.token0;
          orderedToken1 = pair.token1;
        } else {
          // token1 matches, so swap the order
          pairName = `${pair.token1.symbol}/${pair.token0.symbol}`;
          orderedToken0 = pair.token1;
          orderedToken1 = pair.token0;
        }

        markets.push({
          pairName,
          token0: orderedToken0,
          token1: orderedToken1,
          liquidity: pair.liquidity,
          volume24h: (pair as any).volume_24h || pair.volume24h || 0,
          blockchain: pair.blockchain,
          address: pair.address,
          exchange: pair.exchange,
          priceChange24h: null, // Pair type doesn't include price_change_24h
          price: pair.price,
        });
      }
    }
  }

  return markets;
}

/**
 * Parse market pairs from PairResponse
 */
export function parsePairResponse(pair: PairResponse): Market {
  return {
    pairName: `${pair.token0.symbol}/${pair.token1.symbol}`,
    token0: pair.token0,
    token1: pair.token1,
    liquidity: pair.liquidity,
    volume24h: pair.volume_24h || pair.volume24h,
    blockchain: pair.blockchain,
    address: pair.address,
    exchange: pair.exchange,
    priceChange24h: pair.price_change_24h || null,
    price: pair.price,
  };
}

/**
 * Sort assets by relevance to search term, then by market cap
 */
export function sortAssets(assets: Asset[], searchTerm: string): Asset[] {
  const normalizedSearchTerm = searchTerm.toLowerCase().trim();

  return assets.sort((a, b) => {
    // Exact symbol match comes first
    const aExactMatch = a.symbol.toLowerCase() === normalizedSearchTerm;
    const bExactMatch = b.symbol.toLowerCase() === normalizedSearchTerm;

    if (aExactMatch && !bExactMatch) return -1;
    if (!aExactMatch && bExactMatch) return 1;

    // Then sort by market cap (highest first)
    const aMCap = a.mCap || 0;
    const bMCap = b.mCap || 0;
    return bMCap - aMCap;
  });
}

/**
 * Sort markets by relevance to search term, then by liquidity
 */
export function sortMarkets(markets: Market[], searchTerm: string): Market[] {
  const normalizedSearchTerm = searchTerm.toLowerCase().trim();

  return markets.sort((a, b) => {
    // Check if token0 (first in pair) is exact match to search term
    const aToken0ExactMatch =
      a.token0.symbol.toLowerCase() === normalizedSearchTerm;
    const bToken0ExactMatch =
      b.token0.symbol.toLowerCase() === normalizedSearchTerm;

    // Prioritize pairs where searched token is token0 and exact match
    if (aToken0ExactMatch && !bToken0ExactMatch) return -1;
    if (!aToken0ExactMatch && bToken0ExactMatch) return 1;

    // Then sort by liquidity (highest first)
    return b.liquidity - a.liquidity;
  });
}

/**
 * Filter markets by minimum liquidity threshold
 */
export function filterMarketsByLiquidity(
  markets: Market[],
  minLiquidity: number
): Market[] {
  return markets.filter((market) => (market.liquidity || 0) >= minLiquidity);
}

export function parseSearchData(
  searchData: TokenAssetResponse[] | PairResponse[],
  chains: MobulaChainNames,
  searchTerm: string = ''
) {
  const assets: Asset[] = [];
  const markets: Market[] = [];

  // Debug logging for AAVE
  if (searchTerm.toLowerCase().includes('aave')) {
    console.log('🔍 Search API Response for AAVE:', {
      totalItems: searchData.length,
      items: searchData.map((item) => ({
        type: item.type,
        name: 'name' in item ? item.name : 'N/A',
        symbol: 'symbol' in item ? item.symbol : 'N/A',
        id: 'id' in item ? item.id : 'N/A',
        blockchains: 'blockchains' in item ? item.blockchains : 'N/A',
      })),
    });
  }

  searchData.forEach((item) => {
    if (item.type === 'asset') {
      const assetResponse = item as TokenAssetResponse;
      // Only add to assets if it's an asset type
      assets.push(...parseAssetData(assetResponse, chains));
      // Extract market pairs from asset's pairs field
      markets.push(...parseMarketPairs(assetResponse, searchTerm, chains));
    } else if (item.type === 'token') {
      const tokenResponse = item as TokenAssetResponse;
      // Token types should NOT be added to assets - they only contribute markets
      // assets.push(...parseTokenData(tokenResponse)); // REMOVED
      // Extract market pairs from token's pairs field
      markets.push(...parseMarketPairs(tokenResponse, searchTerm, chains));
    } else if ('token0' in item && 'token1' in item) {
      // This is a PairResponse
      markets.push(parsePairResponse(item as PairResponse));
    }
  });

  // Debug logging before deduplication
  if (searchTerm.toLowerCase().includes('aave')) {
    console.log('📊 Assets before deduplication:', {
      count: assets.length,
      assets: assets.map((a) => ({
        id: a.id,
        symbol: a.symbol,
        name: a.name,
        mCap: a.mCap,
        chains: a.allChains,
      })),
    });
  }

  // Deduplicate assets by ID
  const deduplicatedAssets = deduplicateAssetsBySymbol(assets);

  // Filter out assets with 0 volume or 0 market cap
  const filteredAssets = deduplicatedAssets.filter((asset) => {
    const hasValidVolume = asset.volume && asset.volume > 0;
    const hasValidMCap = asset.mCap && asset.mCap > 0;
    return hasValidVolume && hasValidMCap;
  });

  // Debug logging after deduplication
  if (searchTerm.toLowerCase().includes('aave')) {
    console.log('✅ Assets after deduplication:', {
      count: filteredAssets.length,
      assets: filteredAssets.map((a) => ({
        id: a.id,
        symbol: a.symbol,
        name: a.name,
        mCap: a.mCap,
        chains: a.allChains,
      })),
    });
  }

  // Deduplicate markets by address + blockchain
  const uniqueMarkets = Array.from(
    new Map(markets.map((m) => [`${m.address}-${m.blockchain}`, m])).values()
  );

  // Sort assets and markets
  const sortedAssets = searchTerm
    ? sortAssets(filteredAssets, searchTerm)
    : filteredAssets;
  const sortedMarkets = searchTerm ? sortMarkets(uniqueMarkets, searchTerm) : uniqueMarkets;

  return { assets: sortedAssets, markets: sortedMarkets };
}

/**
 * Deduplicate assets by Mobula ID and symbol
 * This handles cases where the API returns both 'asset' and 'token' types for the same asset
 */
function deduplicateAssetsBySymbol(assets: Asset[]): Asset[] {
  const assetMap = new Map<string, Asset>();
  const symbolToAssetId = new Map<string, number>();

  // First pass: collect all assets with IDs and map symbols to IDs
  assets.forEach((asset) => {
    if (asset.id) {
      const key = `id-${asset.id}`;
      symbolToAssetId.set(asset.symbol.toUpperCase(), asset.id);

      const existing = assetMap.get(key);
      if (!existing) {
        assetMap.set(key, asset);
      } else if (existing.allChains && asset.allChains) {
        // Merge chains if both have allChains
        existing.allChains = Array.from(new Set([...existing.allChains, ...asset.allChains]));
        existing.allContracts = Array.from(new Set([...(existing.allContracts || []), ...(asset.allContracts || [])]));
        existing.allDecimals = Array.from(new Set([...(existing.allDecimals || []), ...(asset.allDecimals || [])]));
      }
    }
  });

  // Second pass: add assets without IDs only if they don't duplicate an existing asset
  assets.forEach((asset) => {
    if (!asset.id) {
      const symbol = asset.symbol.toUpperCase();

      // Check if this symbol already has an asset with an ID
      if (symbolToAssetId.has(symbol)) {
        // Skip this asset - it's a duplicate of an asset-type entry
        console.log(`🚫 Skipping duplicate token: ${asset.name} (${asset.symbol}) - already have asset with ID ${symbolToAssetId.get(symbol)}`);
        return;
      }

      // No ID-based asset exists, so add this token
      const key = `symbol-${symbol}`;
      const existing = assetMap.get(key);

      if (!existing) {
        assetMap.set(key, asset);
      } else if (existing.allChains && asset.allChains) {
        // Merge chains
        existing.allChains = Array.from(new Set([...existing.allChains, ...asset.allChains]));
        existing.allContracts = Array.from(new Set([...(existing.allContracts || []), ...(asset.allContracts || [])]));
        existing.allDecimals = Array.from(new Set([...(existing.allDecimals || []), ...(asset.allDecimals || [])]));
      }
    }
  });

  return Array.from(assetMap.values());
}

export function parseFreshAndTrendingTokens(
  projections: Projection[]
): Asset[] {
  const assetsBySymbol = new Map<string, Asset>();

  for (const projection of projections) {
    const chainId = projection.id.split('-')[1];
    const { rows } = projection.data as TokensMarketData;
    if (rows) {
      for (const j of rows) {
        const contractAddress = j.leftColumn?.line1?.copyLink || '';
        const symbol = j.leftColumn?.line1?.text2 || '';
        const name = j.leftColumn?.line1?.text1 || '';

        // Filter out wrapped native tokens
        if (!isWrappedNativeToken(contractAddress, +chainId)) {
          const volume = parseNumberString(j.leftColumn?.line2?.volume || '0.00K');
          const mCap = j.meta?.tokenData.marketCap || 0;

          // Only process assets with non-zero volume
          if (volume !== 0) {
            const chain = getChainName(+chainId);
            const timestamp = j.leftColumn?.line2?.timestamp;

            // Create a unique key by symbol (or name if symbol is empty)
            const key = symbol || name;

            if (assetsBySymbol.has(key)) {
              // Asset already exists, aggregate data
              const existing = assetsBySymbol.get(key)!;

              // Add volume and mCap across chains
              existing.volume = (existing.volume || 0) + volume;
              existing.mCap = (existing.mCap || 0) + mCap;

              // Keep the newest timestamp for Fresh sorting
              if (timestamp && (!existing.timestamp || timestamp > existing.timestamp)) {
                existing.timestamp = timestamp;
              }

              // Add this chain to allChains
              if (existing.allChains) {
                existing.allChains.push(chain);
                existing.allContracts?.push(contractAddress);
                existing.allDecimals?.push(j.meta?.tokenData.decimals || 18);
              }
            } else {
              // New asset, create entry
              assetsBySymbol.set(key, {
                chain,
                contract: contractAddress,
                decimals: j.meta?.tokenData.decimals || 18,
                liquidity: parseNumberString(
                  j.leftColumn?.line2?.liquidity || '0.00K'
                ),
                logo: j.leftColumn?.token?.primaryImage || null,
                name,
                price: Number(j.rightColumn?.line1?.price || 0),
                priceChange24h:
                  Number((j.rightColumn?.line1?.percentage || '0%').slice(0, -1)) *
                  (j.rightColumn?.line1?.direction === 'DOWN' ? -1 : 1),
                symbol,
                volume,
                mCap,
                timestamp,
                // Store all chains for multi-chain selection
                allChains: [chain],
                allContracts: [contractAddress],
                allDecimals: [j.meta?.tokenData.decimals || 18],
              });
            }
          }
        }
      }
    }
  }

  // Convert map to array
  const assets = Array.from(assetsBySymbol.values());

  // Filter out assets with 0 volume or 0 market cap
  const filteredAssets = assets.filter((asset) => {
    const hasValidVolume = asset.volume && asset.volume > 0;
    const hasValidMCap = asset.mCap && asset.mCap > 0;
    return hasValidVolume && hasValidMCap;
  });

  return filteredAssets;
}

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

/**
 * Build a single Asset entry for a token using its first supported chain as the primary chain and attach multi-chain metadata.
 *
 * Filters out unsupported chains and wrapped native token deployments; when at least one valid chain remains, returns an array containing one Asset populated from the primary chain and including `allChains`, `allContracts`, and `allDecimals` for every valid chain. If no valid chains remain, returns an empty array.
 *
 * @param asset - The token response object to convert into an Asset
 * @param chains - Which chain(s) to consider (specific chain name or `MobulaChainNames.All`)
 * @returns An array containing one Asset with primary-chain fields and multi-chain metadata, or an empty array if no valid chains are found
 */
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

/**
 * Convert a TokenAssetResponse into a single Asset entry that consolidates multi-chain information when supported.
 *
 * @param asset - TokenAssetResponse from the API representing a token across chains; wrapped native-token contract entries are ignored.
 * @returns An array containing one Asset built from the first valid chain as the primary chain and populated `allChains`, `allContracts`, and `allDecimals`; returns an empty array if no valid chains are available.
 */
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
 * Extracts market pairs from a token response where either token matches the search term, ordering each pair so the matched token is first.
 *
 * @param asset - Token asset response containing pair data
 * @param searchTerm - Term used to match token symbol or name (case-insensitive)
 * @param chains - Chain filter; use MobulaChainNames.All to include all chains
 * @returns An array of Market entries matching the search term with the matched token positioned as `token0`; empty if none
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
          volume24h: pair.volume24h || 0,
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
 * Construct the pair representation including tokens, liquidity, volume, and pricing information.
 *
 * @returns An object representing the market pair with these fields:
 * - `pairName`: string in the form `"token0.symbol/token1.symbol"`
 * - `token0`, `token1`: token objects from the pair
 * - `liquidity`: pair liquidity
 * - `volume24h`: 24-hour volume (prefers `pair.volume_24h` if present)
 * - `blockchain`, `address`, `exchange`: source identifiers
 * - `priceChange24h`: 24-hour price change if provided, `null` otherwise
 * - `price`: current pair price
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
 * Order assets by relevance to the provided search term, then by market capitalization.
 *
 * The search term is compared to asset symbols case-insensitively after trimming; assets whose symbol exactly matches the search term are placed before others. Assets with equal relevance are ordered by `mCap` descending (treating missing `mCap` as zero).
 *
 * @param assets - Array of assets to sort
 * @param searchTerm - Term used to prioritize exact symbol matches
 * @returns The same assets array sorted with exact symbol matches first, then by market cap (highest first)
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
 * Order markets by relevance to the search term, placing markets whose token0 symbol exactly matches the term first, then by descending liquidity.
 *
 * @param markets - Array of market entries to sort
 * @param searchTerm - Search string used to determine relevance (matched against token0 symbol, case-insensitive)
 * @returns Markets sorted so exact `token0` symbol matches to `searchTerm` come first, ties broken by higher `liquidity`
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
 * Selects markets with liquidity greater than or equal to a minimum threshold.
 *
 * @param markets - Array of market entries to filter
 * @param minLiquidity - Minimum liquidity threshold; markets with liquidity >= `minLiquidity` are kept
 * @returns The filtered array of markets whose `liquidity` is greater than or equal to `minLiquidity`
 */
export function filterMarketsByLiquidity(
  markets: Market[],
  minLiquidity: number
): Market[] {
  return markets.filter((market) => (market.liquidity || 0) >= minLiquidity);
}

/**
 * Parse mixed API search results into deduplicated, filtered, and optionally sorted asset and market lists.
 *
 * @param searchData - Array of API responses which may be token/asset entries or pair records.
 * @param chains - Chain filter controlling which chains to consider (e.g., all chains or a specific Mobula chain).
 * @param searchTerm - Optional search term used to prioritize and sort results; also enables debug logging for certain terms.
 * @returns An object containing `assets` (deduplicated and filtered Asset[] with merged multi-chain metadata) and `markets` (deduplicated Market[]), optionally sorted by relevance to `searchTerm`.
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
 * Produce a deduplicated list of assets, preferring entries that include a Mobula `id`.
 *
 * Removes duplicate token entries by symbol when an asset with an `id` exists, and merges multi-chain metadata for entries that represent the same asset across chains.
 *
 * @param assets - Array of Asset entries (may include both asset-type entries with `id` and token-type entries without `id`)
 * @returns An array of unique Asset objects where duplicates are removed and multi-chain fields (`allChains`, `allContracts`, `allDecimals`) are merged into the retained entry
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
      } else {
        mergeMultiChainData(existing, asset);
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
      } else {
        mergeMultiChainData(existing, asset);
      }
    }
  });

  return Array.from(assetMap.values());
}

/**
 * Builds Asset entries from projection data representing fresh and trending tokens across chains.
 *
 * Parses each projection's market rows to produce assets keyed by symbol (or name if symbol is empty), merging entries that appear on multiple chains into a single Asset with aggregated `volume` and `mCap`, and populated `allChains`, `allContracts`, and `allDecimals`.
 *
 * @param projections - Array of projection objects containing tokens market data across chains.
 * @returns An array of Assets with non-zero volume and market cap, where multi-chain occurrences are merged and per-asset fields (price, priceChange24h, liquidity, timestamp, decimals, logo) are populated.
export function parseFreshAndTrendingTokens(
  projections: Projection[]
): Asset[] {
  const assetsBySymbol = new Map<string, Asset>();

  for (const projection of projections) {
    const chainId = projection.id.split('-')[1];
    const marketData = projection.data as TokensMarketData | undefined;
    const rows = marketData?.rows;
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
              if (existing.allChains && !existing.allChains.includes(chain)) {
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

/**
 * Merge multi-chain arrays (`allChains`, `allContracts`, `allDecimals`) from `source` into `target`, mutating `target`.
 *
 * If `source` lacks the multi-chain arrays the function does nothing. If `target` lacks those arrays they are copied from `source`. Otherwise, each chain present in `source` that is not already in `target.allChains` is appended along with its corresponding contract and decimals.
 *
 * @param target - Asset to receive merged multi-chain data (mutated).
 * @param source - Asset providing multi-chain data to merge.
 */
function mergeMultiChainData(target: Asset, source: Asset) {
  if (!source.allChains || !source.allContracts || !source.allDecimals) return;

  if (!target.allChains || !target.allContracts || !target.allDecimals) {
    // eslint-disable-next-line no-param-reassign
    target.allChains = [...source.allChains];
    // eslint-disable-next-line no-param-reassign
    target.allContracts = [...source.allContracts];
    // eslint-disable-next-line no-param-reassign
    target.allDecimals = [...source.allDecimals];
    return;
  }

  for (let i = 0; i < source.allChains.length; i += 1) {
    const chain = source.allChains[i];
    const existingIndex = target.allChains.indexOf(chain);
    if (existingIndex === -1) {
      target.allChains.push(chain);
      target.allContracts.push(source.allContracts[i]);
      target.allDecimals.push(source.allDecimals[i]);
    }
  }
}
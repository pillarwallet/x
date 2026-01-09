import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';

// store
import { addMiddleware } from '../../../store';

// types
import {
  BlockchainList,
  MarketHistoryPairData,
  OhlcvHistory,
  TokenAtlasInfoApiResponse,
  TrendingTokens,
} from '../../../types/api';

// utils
import { CompatibleChains, isTestnet } from '../../../utils/blockchain';

const chainIds = isTestnet
  ? [11155111]
  : CompatibleChains.map((chain) => chain.chainId);
const chainIdsQuery = chainIds.map((id) => `chainIds=${id}`).join('&');

const fetchBaseMobula = retry(
  fetchBaseQuery({
    baseUrl: isTestnet
      ? 'https://hifidata-nubpgwxpiq-uc.a.run.app'
      : 'https://hifidata-7eu4izffpa-uc.a.run.app',
    headers: {
      'Content-Type': 'application/json',
    },
  }),
  { maxRetries: 5 }
);

export const tokenMarketHistoryPair = createApi({
  reducerPath: 'tokenMarketHistoryPair',
  baseQuery: fetchBaseMobula,
  endpoints: (builder) => ({
    getTokenMarketHistoryPair: builder.query<
      MarketHistoryPairData,
      {
        asset?: string;
        symbol?: string;
        blockchain: string;
        period: string;
        from: number;
        to?: number;
        amount?: number;
      }
    >({
      query: ({ asset, symbol, blockchain, period, from, to, amount }) => {
        return {
          url: `?${chainIdsQuery}&testnets=${String(isTestnet)}`,
          method: 'POST',
          body: {
            path: 'market/history/pair',
            params: {
              asset,
              symbol,
              blockchain,
              period,
              from: from * 1000,
              to: to ? to * 1000 : undefined,
              amount: amount || undefined,
            },
          },
        };
      },
    }),
  }),
});

export const tokenMarketData = createApi({
  reducerPath: 'tokenMarketData',
  baseQuery: fetchBaseMobula,
  endpoints: (builder) => ({
    getTokenMarketData: builder.query<
      TokenAtlasInfoApiResponse,
      {
        asset?: string;
        symbol?: string;
        blockchain?: string;
        id?: number;
      }
    >({
      query: ({ asset, symbol, blockchain, id }) => {
        return {
          url: `?${chainIdsQuery}&testnets=${String(isTestnet)}`,
          method: 'POST',
          body: {
            path: 'market/data',
            params: {
              asset,
              symbol,
              blockchain,
              id,
            },
          },
        };
      },
    }),
  }),
});

export const blockchainsList = createApi({
  reducerPath: 'blockchainsList',
  baseQuery: fetchBaseMobula,
  endpoints: (builder) => ({
    getBlockchainsList: builder.query<BlockchainList, void>({
      query: () => {
        return {
          url: `?${chainIdsQuery}&testnets=${String(isTestnet)}`,
          method: 'POST',
          body: {
            path: 'blockchains',
            params: {},
          },
        };
      },
    }),
  }),
});

export const trendingTokens = createApi({
  reducerPath: 'trendingTokens',
  baseQuery: fetchBaseMobula,
  endpoints: (builder) => ({
    getTrendingTokens: builder.query<TrendingTokens, void>({
      query: () => {
        return {
          url: `?${chainIdsQuery}&testnets=${String(isTestnet)}`,
          method: 'POST',
          body: {
            path: 'metadata/trendings',
            params: {
              platform: 'CoinGecko',
            },
          },
        };
      },
    }),
  }),
});

export const tokenOhlcvHistory = createApi({
  reducerPath: 'tokenOhlcvHistory',
  baseQuery: fetchBaseMobula,
  endpoints: (builder) => ({
    getTokenOhlcvHistory: builder.query<
      OhlcvHistory,
      {
        address: string;
        chainId: string;
        period: string;
        from: number;
        to?: number;
        amount?: number;
      }
    >({
      query: ({ address, chainId, period, from, to, amount }) => {
        return {
          url: `?${chainIdsQuery}&testnets=${String(isTestnet)}`,
          method: 'POST',
          body: {
            version: '2',
            path: 'token/ohlcv-history',
            params: {
              address,
              chainId,
              period,
              from: from * 1000,
              to: to ? to * 1000 : undefined,
              amount: amount || undefined,
            },
          },
        };
      },
    }),
  }),
});

export const marketOhlcvHistory = createApi({
  reducerPath: 'marketOhlcvHistory',
  baseQuery: fetchBaseMobula,
  endpoints: (builder) => ({
    getMarketOhlcvHistory: builder.query<
      OhlcvHistory,
      {
        address: string;
        chainId: string;
        period: string;
        from: number;
        to?: number;
        amount?: number;
      }
    >({
      query: ({ address, chainId, period, from, to, amount }) => {
        return {
          url: `?${chainIdsQuery}&testnets=${String(isTestnet)}`,
          method: 'POST',
          body: {
            version: '2',
            path: 'market/ohlcv-history',
            params: {
              address,
              chainId,
              period,
              from: from * 1000,
              to: to ? to * 1000 : undefined,
              amount: amount || undefined,
            },
          },
        };
      },
    }),
  }),
});

/**
 * Add this to the store
 */
addMiddleware(trendingTokens);
addMiddleware(tokenMarketHistoryPair);
addMiddleware(tokenMarketData);
addMiddleware(blockchainsList);
addMiddleware(marketOhlcvHistory);
addMiddleware(tokenOhlcvHistory);

export const { useGetTrendingTokensQuery } = trendingTokens;
export const { useGetTokenMarketHistoryPairQuery } = tokenMarketHistoryPair;
export const { useGetTokenMarketDataQuery } = tokenMarketData;
export const { useGetBlockchainsListQuery } = blockchainsList;
export const { useGetMarketOhlcvHistoryQuery } = marketOhlcvHistory;
export const { useGetTokenOhlcvHistoryQuery } = tokenOhlcvHistory;

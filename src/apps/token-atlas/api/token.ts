import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';

// store
import { addMiddleware } from '../../../store';

// types
import {
  BlockchainList,
  MarketHistoryPairData,
  TokenAtlasGraphApiResponse,
  TokenAtlasInfoApiResponse,
  TrendingTokens,
} from '../../../types/api';

// utils
import { CompatibleChains, isTestnet } from '../../../utils/blockchain';

const chainIds = isTestnet
  ? [11155111]
  : CompatibleChains.map((chain) => chain.chainId);
const chainIdsQuery = chainIds.map((id) => `chainIds=${id}`).join('&');

export const tokenInfoApi = createApi({
  reducerPath: 'tokenInfoApi',
  baseQuery: fetchBaseQuery({
    baseUrl: isTestnet
      ? 'https://token-nubpgwxpiq-uc.a.run.app'
      : 'https://token-7eu4izffpa-uc.a.run.app',
  }),
  endpoints: (builder) => ({
    getTokenInfo: builder.query<
      TokenAtlasInfoApiResponse,
      { id?: number; asset?: string; symbol: string }
    >({
      query: ({ id, asset, symbol }) => {
        return `?${id ? `id=${id}` : ''}${asset ? `&asset=${asset}` : ''}&symbol=${symbol}&${chainIdsQuery}&testnets=${String(isTestnet)}`;
      },
    }),
  }),
});

export const tokenGraphApi = createApi({
  reducerPath: 'tokenGraphApi',
  baseQuery: fetchBaseQuery({
    baseUrl: isTestnet
      ? 'https://tokenpricehistory-nubpgwxpiq-uc.a.run.app'
      : 'https://tokenpricehistory-7eu4izffpa-uc.a.run.app',
  }),
  endpoints: (builder) => ({
    getTokenGraph: builder.query<
      TokenAtlasGraphApiResponse,
      {
        id?: number;
        asset?: string;
        symbol: string;
        from: number;
        to?: number;
      }
    >({
      query: ({ id, asset, symbol, from, to }) => {
        const toParam = to !== undefined ? `&to=${from * 1000}` : '';
        return `?${id ? `id=${id}` : ''}${asset ? `&asset=${asset}` : ''}&symbol=${symbol}&from=${from * 1000}${toParam}&${chainIdsQuery}&testnets=${String(isTestnet)}`;
      },
    }),
  }),
});

export const trendingTokensApi = createApi({
  reducerPath: 'trendingTokensApi',
  baseQuery: fetchBaseQuery({
    baseUrl: isTestnet
      ? 'https://trendingtokens-nubpgwxpiq-uc.a.run.app'
      : 'https://trendingtokens-7eu4izffpa-uc.a.run.app',
  }),
  endpoints: (builder) => ({
    getTrendingTokens: builder.query<TrendingTokens, void>({
      query: () => `?${chainIdsQuery}&testnets=${String(isTestnet)}`,
    }),
  }),
});

export const blockchainsListApi = createApi({
  reducerPath: 'blockchainsListApi',
  baseQuery: fetchBaseQuery({
    baseUrl: isTestnet
      ? 'https://blockchains-nubpgwxpiq-uc.a.run.app'
      : 'https://blockchains-7eu4izffpa-uc.a.run.app',
  }),
  endpoints: (builder) => ({
    getBlockchainsList: builder.query<BlockchainList, void>({
      query: () => `?${chainIdsQuery}&testnets=${String(isTestnet)}`,
    }),
  }),
});

const fetchBaseTokenMarketHistoryPairWithRetry = retry(
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
  baseQuery: fetchBaseTokenMarketHistoryPairWithRetry,
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

/**
 * Add this to the store
 */
addMiddleware(tokenInfoApi);
addMiddleware(tokenGraphApi);
addMiddleware(trendingTokensApi);
addMiddleware(blockchainsListApi);
addMiddleware(tokenMarketHistoryPair);

export const { useGetTokenInfoQuery } = tokenInfoApi;
export const { useGetTokenGraphQuery } = tokenGraphApi;
export const { useGetTrendingTokensQuery } = trendingTokensApi;
export const { useGetBlockchainsListQuery } = blockchainsListApi;
export const { useGetTokenMarketHistoryPairQuery } = tokenMarketHistoryPair;

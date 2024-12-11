import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// store
import { addMiddleware } from '../../../store';

// types
import {
  BlockchainList,
  TokenAtlasGraphApiResponse,
  TokenAtlasInfoApiResponse,
  TrendingTokens,
} from '../../../types/api';

// utils
import { CompatibleChains } from '../../../utils/blockchain';

const chainIds =
  process.env.REACT_APP_USE_TESTNETS === 'true'
    ? [11155111]
    : CompatibleChains.map((chain) => chain.chainId);
const chainIdsQuery = chainIds.map((id) => `chainIds=${id}`).join('&');

export const tokenInfoApi = createApi({
  reducerPath: 'tokenInfoApi',
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.REACT_APP_USE_TESTNETS === 'true'
        ? 'https://token-nubpgwxpiq-uc.a.run.app'
        : 'https://token-7eu4izffpa-uc.a.run.app',
  }),
  endpoints: (builder) => ({
    getTokenInfo: builder.query<
      TokenAtlasInfoApiResponse,
      { asset: string; blockchain: string; symbol: string }
    >({
      query: ({ asset, blockchain, symbol }) => {
        const blockchainParam =
          blockchain !== undefined ? `&blockchain=${blockchain}` : '';
        return `?asset=${asset}&symbol=${symbol}${blockchainParam}&${chainIdsQuery}&testnets=${process.env.REACT_APP_USE_TESTNETS || 'true'}`;
      },
    }),
  }),
});

export const tokenGraphApi = createApi({
  reducerPath: 'tokenGraphApi',
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.REACT_APP_USE_TESTNETS === 'true'
        ? 'https://tokenpricehistory-nubpgwxpiq-uc.a.run.app'
        : 'https://tokenpricehistory-7eu4izffpa-uc.a.run.app',
  }),
  endpoints: (builder) => ({
    getTokenGraph: builder.query<
      TokenAtlasGraphApiResponse,
      { blockchain?: string; asset: string; from: number; to?: number }
    >({
      query: ({ blockchain, asset, from, to }) => {
        const toParam = to !== undefined ? `&to=${from * 1000}` : '';
        const blockchainParam =
          blockchain !== undefined ? `&blockchain=${blockchain}` : '';
        const assetParam = asset.split(' ')[0];
        return `?asset=${assetParam}&from=${from * 1000}${toParam}${blockchainParam}&${chainIdsQuery}&testnets=${process.env.REACT_APP_USE_TESTNETS || 'true'}`;
      },
    }),
  }),
});

export const trendingTokensApi = createApi({
  reducerPath: 'trendingTokensApi',
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.REACT_APP_USE_TESTNETS === 'true'
        ? 'https://trendingtokens-nubpgwxpiq-uc.a.run.app'
        : 'https://trendingtokens-7eu4izffpa-uc.a.run.app',
  }),
  endpoints: (builder) => ({
    getTrendingTokens: builder.query<TrendingTokens, void>({
      query: () =>
        `?${chainIdsQuery}&testnets=${process.env.REACT_APP_USE_TESTNETS || 'true'}`,
    }),
  }),
});

export const blockchainsListApi = createApi({
  reducerPath: 'blockchainsListApi',
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.REACT_APP_USE_TESTNETS === 'true'
        ? 'https://blockchains-nubpgwxpiq-uc.a.run.app'
        : 'https://blockchains-7eu4izffpa-uc.a.run.app',
  }),
  endpoints: (builder) => ({
    getBlockchainsList: builder.query<BlockchainList, void>({
      query: () =>
        `?${chainIdsQuery}&testnets=${process.env.REACT_APP_USE_TESTNETS || 'true'}`,
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

export const { useGetTokenInfoQuery } = tokenInfoApi;
export const { useGetTokenGraphQuery } = tokenGraphApi;
export const { useGetTrendingTokensQuery } = trendingTokensApi;
export const { useGetBlockchainsListQuery } = blockchainsListApi;

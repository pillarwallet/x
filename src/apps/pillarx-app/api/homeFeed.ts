/* eslint-disable no-console */
import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';

// store
import { addMiddleware } from '../../../store';

// types
import { ApiResponse, WalletData } from '../../../types/api';

// utils
import { CompatibleChains, isTestnet } from '../../../utils/blockchain';

const chainIds = isTestnet
  ? [11155111]
  : CompatibleChains.map((chain) => chain.chainId);

const chainIdsQuery = chainIds.map((id) => `chainIds=${id}`).join('&');

export const homeFeedApi = createApi({
  reducerPath: 'homeFeedApi',
  baseQuery: fetchBaseQuery({
    baseUrl: isTestnet
      ? 'https://feed-nubpgwxpiq-uc.a.run.app'
      : 'https://feed-7eu4izffpa-uc.a.run.app',
  }),
  endpoints: (builder) => ({
    getTilesInfo: builder.query<ApiResponse, { page: number; address: string }>(
      {
        query: ({ page, address }) =>
          `?page=${page}&address=${address}&${chainIdsQuery}&testnets=${String(isTestnet)}`,
      }
    ),
  }),
});

// maxRetries: 5 is the default, and can be omitted. Shown for documentation purposes.
const staggeredBaseQuery = retry(
  fetchBaseQuery({
    baseUrl: isTestnet
      ? 'https://walletportfolio-nubpgwxpiq-uc.a.run.app'
      : 'https://walletportfolio-7eu4izffpa-uc.a.run.app',
  }),
  {
    maxRetries: 5,
  }
);

export const walletPortfolioTileApi = createApi({
  reducerPath: 'walletPortfolioTileApi',
  baseQuery: staggeredBaseQuery,
  endpoints: (builder) => ({
    getWalletInfo: builder.query<WalletData, { address: string }>({
      query: ({ address }) =>
        `?address=${address}&${chainIdsQuery}&testnets=${String(isTestnet)}`,
    }),
  }),
});

/**
 * Add this to the store
 */
addMiddleware(homeFeedApi);
addMiddleware(walletPortfolioTileApi);

export const { useGetTilesInfoQuery } = homeFeedApi;
export const { useGetWalletInfoQuery } = walletPortfolioTileApi;

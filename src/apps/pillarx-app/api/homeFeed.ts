/* eslint-disable no-console */
import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';

// store
import { addMiddleware } from '../../../store';

// types
import { ApiResponse, WalletData } from '../../../types/api';

// utils
import { CompatibleChains } from '../../../utils/blockchain';

const chainIds =
  process.env.REACT_APP_USE_TESTNETS === 'true'
    ? [11155111]
    : CompatibleChains.map((chain) => chain.chainId);

const chainIdsQuery = chainIds.map((id) => `chainIds=${id}`).join('&');

export const homeFeedApi = createApi({
  reducerPath: 'homeFeedApi',
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.REACT_APP_USE_TESTNETS === 'true'
        ? 'https://feed-nubpgwxpiq-uc.a.run.app'
        : 'https://feed-7eu4izffpa-uc.a.run.app',
  }),
  endpoints: (builder) => ({
    getTilesInfo: builder.query<ApiResponse, { page: number; address: string }>(
      {
        query: ({ page, address }) =>
          `?page=${page}&address=${address}&${chainIdsQuery}&testnets=${process.env.REACT_APP_USE_TESTNETS || 'true'}`,
      }
    ),
  }),
});

// maxRetries: 5 is the default, and can be omitted. Shown for documentation purposes.
const staggeredBaseQuery = retry(
  fetchBaseQuery({
    baseUrl:
      process.env.REACT_APP_USE_TESTNETS === 'true'
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
        `?address=${address}&${chainIdsQuery}&testnets=${process.env.REACT_APP_USE_TESTNETS || 'true'}`,
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

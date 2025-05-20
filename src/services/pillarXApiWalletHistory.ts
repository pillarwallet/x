import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';

// types
import { WalletHistoryMobulaResponse } from '../types/api';

// store
import { addMiddleware } from '../store';

// utils
import { CompatibleChains, isTestnet } from '../utils/blockchain';

const fetchBaseQueryWithRetry = retry(
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

export const pillarXApiWalletHistory = createApi({
  reducerPath: 'pillarXApiWalletHistory',
  baseQuery: fetchBaseQueryWithRetry,
  endpoints: (builder) => ({
    getWalletHistory: builder.query<
      WalletHistoryMobulaResponse,
      { wallet: string; period: string; from: number; to?: number }
    >({
      query: ({ wallet, period, from, to }) => {
        const chainIds = isTestnet
          ? [11155111]
          : CompatibleChains.map((chain) => chain.chainId);
        const chainIdsQuery = chainIds.map((id) => `chainIds=${id}`).join('&');

        return {
          url: `?${chainIdsQuery}&testnets=${String(isTestnet)}`,
          method: 'POST',
          body: {
            path: 'wallet/history',
            params: {
              wallet,
              blockchains: CompatibleChains.map((chain) => chain.chainId).join(
                ','
              ),
              period,
              from: from * 1000,
              to: to ? to * 1000 : undefined,
              unlistedAssets: 'true',
              filterSpam: 'true',
            },
          },
        };
      },
    }),
  }),
});

addMiddleware(pillarXApiWalletHistory);

export const { useGetWalletHistoryQuery } = pillarXApiWalletHistory;

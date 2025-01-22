// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// utils
import { CompatibleChains } from '../utils/blockchain';

const isTestnet =
  (localStorage.getItem('isTestnet') === 'true' &&
    process.env.REACT_APP_USE_TESTNETS === 'true') ||
  (localStorage.getItem('isTestnet') === 'true' &&
    process.env.REACT_APP_USE_TESTNETS === 'false');

// Define a service using a base URL and expected endpoints
export const pillarXApiTransactionsHistory = createApi({
  reducerPath: 'pillarXApiTransactionsHistory',
  baseQuery: fetchBaseQuery({
    baseUrl: isTestnet
      ? 'https://transactions-nubpgwxpiq-uc.a.run.app'
      : 'https://transactions-7eu4izffpa-uc.a.run.app',
  }),
  endpoints: (builder) => ({
    getTransactionsHistory: builder.query({
      query: ({ address }) => {
        const chainIds = isTestnet
          ? [11155111]
          : CompatibleChains.map((chain) => chain.chainId);
        const chainIdsQuery = chainIds.map((id) => `chainIds=${id}`).join('&');

        return `?address=${address}&${chainIdsQuery}&testnets=${String(isTestnet)}`;
      },
    }),
  }),
});

export const { useGetTransactionsHistoryQuery } = pillarXApiTransactionsHistory;

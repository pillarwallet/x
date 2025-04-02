import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';

// types
import { MobulaApiResponse } from '../types/api';

// store
import { addMiddleware } from '../store';

// utils
import { CompatibleChains, isTestnet } from '../utils/blockchain';
import { chainIdToChainNameTokensData } from './tokensData';

const fetchBaseQueryWithRetry = retry(
  fetchBaseQuery({
    baseUrl: isTestnet
      ? 'https://hifidata-nubpgwxpiq-uc.a.run.app'
      : 'https://hifidata-7eu4izffpa-uc.a.run.app',
    headers: {
      'Content-Type': 'application/json',
    },
  }),
  { maxRetries: 10 }
);

// Define a service using a base path and params
export const pillarXApiSearchTokens = createApi({
  reducerPath: 'pillarXApiSearchTokens',
  baseQuery: fetchBaseQueryWithRetry,
  endpoints: (builder) => ({
    getSearchTokens: builder.query<
      MobulaApiResponse,
      { searchInput: string; filterBlockchains?: string }
    >({
      query: ({ searchInput, filterBlockchains }) => {
        const chainIds = isTestnet
          ? [11155111]
          : CompatibleChains.map((chain) => chain.chainId);
        const chainIdsQuery = chainIds.map((id) => `chainIds=${id}`).join('&');

        return {
          url: `?${chainIdsQuery}&testnets=${String(isTestnet)}`,
          method: 'POST',
          body: {
            path: 'search',
            params: {
              input: searchInput,
              ...(filterBlockchains
                ? {
                    filters: JSON.stringify({ blockchains: filterBlockchains }),
                  }
                : {
                    filters: JSON.stringify({
                      blockchains: CompatibleChains.map((chain) =>
                        chainIdToChainNameTokensData(chain.chainId)
                      ).join(', '),
                    }),
                  }),
            },
          },
        };
      },
    }),
  }),
});

addMiddleware(pillarXApiSearchTokens);

export const { useGetSearchTokensQuery } = pillarXApiSearchTokens;

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// types
import { MobulaApiResponse } from '../types/api';

// utils
import { addMiddleware } from '../store';
import { CompatibleChains, isTestnet } from '../utils/blockchain';

// Define a service using a base path and params
export const pillarXApiSearchTokens = createApi({
  reducerPath: 'pillarXApiSearchTokens',
  baseQuery: fetchBaseQuery({
    baseUrl: isTestnet
      ? 'https://hifidata-nubpgwxpiq-uc.a.run.app'
      : 'https://hifidata-7eu4izffpa-uc.a.run.app',
    headers: {
      'Content-Type': 'application/json',
    },
  }),
  endpoints: (builder) => ({
    getSearchTokens: builder.query<
      MobulaApiResponse,
      { searchInput: string; filterBlockchains?: string }
    >({
      query: ({ searchInput, filterBlockchains }) => {
        const chainIds = isTestnet
          ? [11155111]
          : CompatibleChains.map((chain) => chain.chainId);

        return {
          url: '',
          method: 'POST',
          body: {
            path: 'search',
            params: {
              input: searchInput,
              chainIds,
              testnets: isTestnet,
              ...(filterBlockchains && {
                filters: JSON.stringify({ blockchains: filterBlockchains }),
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

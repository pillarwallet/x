// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// utils
import { CompatibleChains } from '../utils/blockchain';

export const pillarXApiPresence = createApi({
  reducerPath: 'pillarXApiPresence',
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.REACT_APP_USE_TESTNETS === 'true'
        ? 'https://activity-nubpgwxpiq-uc.a.run.app'
        : 'https://activity-7eu4izffpa-uc.a.run.app',
  }),
  endpoints: (builder) => ({
    recordPresence: builder.mutation({
      query: (payload = {}) => {
        const chainIds =
          process.env.REACT_APP_USE_TESTNETS === 'true'
            ? [11155111]
            : CompatibleChains.map((chain) => chain.chainId);
        const chainIdsQuery = chainIds.map((id) => `chainIds=${id}`).join('&');

        return {
          url: '/',
          method: 'POST',
          params: {
            testnets: process.env.REACT_APP_USE_TESTNETS || 'true',
            chainIds: chainIdsQuery,
          },
          body: payload,
        };
      },
    }),
  }),
});

export const { useRecordPresenceMutation } = pillarXApiPresence;

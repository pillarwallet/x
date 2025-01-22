// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// utils
import { CompatibleChains, isTestnet } from '../utils/blockchain';

export const pillarXApiPresence = createApi({
  reducerPath: 'pillarXApiPresence',
  baseQuery: fetchBaseQuery({
    baseUrl: isTestnet
      ? 'https://activity-nubpgwxpiq-uc.a.run.app'
      : 'https://activity-7eu4izffpa-uc.a.run.app',
  }),
  endpoints: (builder) => ({
    recordPresence: builder.mutation({
      query: (payload = {}) => {
        const chainIds = isTestnet
          ? [11155111]
          : CompatibleChains.map((chain) => chain.chainId);
        const chainIdsQuery = chainIds.map((id) => `chainIds=${id}`).join('&');

        return {
          url: `?${chainIdsQuery}&testnets=${String(isTestnet)}`,
          method: 'POST',
          body: payload,
        };
      },
    }),
  }),
});

export const { useRecordPresenceMutation } = pillarXApiPresence;

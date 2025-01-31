import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// store
import { addMiddleware } from '../../../store';

// types
import { PointsResultsData } from '../../../types/api';

// utils
import { CompatibleChains, isTestnet } from '../../../utils/blockchain';

const chainIds = isTestnet
  ? [11155111]
  : CompatibleChains.map((chain) => chain.chainId);

const chainIdsQuery = chainIds.map((id) => `chainIds=${id}`).join('&');

export const leaderboardApi = createApi({
  reducerPath: 'leaderboardApi',
  baseQuery: fetchBaseQuery({
    baseUrl: isTestnet
      ? 'https://pxpoints-nubpgwxpiq-uc.a.run.app'
      : 'https://pxpoints-7eu4izffpa-uc.a.run.app',
  }),
  endpoints: (builder) => ({
    getLeaderboard: builder.query<
      PointsResultsData,
      { address?: string; from?: number; until?: number }
    >({
      query: ({ address, from, until }) =>
        `?${address ? `address=${address}&` : ''}${from ? `from=${from}&` : ''}${until ? `until=${until}&` : ''}${chainIdsQuery}&testnets=${String(isTestnet)}`,
    }),
  }),
});

/**
 * Add this to the store
 */
addMiddleware(leaderboardApi);

export const { useGetLeaderboardQuery } = leaderboardApi;

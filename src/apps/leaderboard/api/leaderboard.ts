import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';

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

const baseQuery = fetchBaseQuery({
  baseUrl: isTestnet
    ? 'https://volumeleaderboard-nubpgwxpiq-uc.a.run.app'
    : 'https://volumeleaderboard-7eu4izffpa-uc.a.run.app',
});

const baseQueryWithRetry = retry(baseQuery, {
  maxRetries: 5,
});

export const leaderboardApi = createApi({
  reducerPath: 'leaderboardApi',
  baseQuery: baseQueryWithRetry,
  endpoints: (builder) => ({
    getLeaderboard: builder.query<
      PointsResultsData,
      {
        skipDefaultPoints?: boolean;
        address?: string;
        from?: number;
        until?: number;
      }
    >({
      query: ({ skipDefaultPoints, address, from, until }) =>
        `?${skipDefaultPoints ? `skipDefaultPoints=${skipDefaultPoints}&` : ''}${address ? `address=${address}&` : ''}${from ? `from=${from}&` : ''}${until ? `until=${until}&` : ''}${chainIdsQuery}&testnets=${String(isTestnet)}`,
    }),
  }),
});

/**
 * Add this to the store
 */
addMiddleware(leaderboardApi);

export const { useGetLeaderboardQuery } = leaderboardApi;

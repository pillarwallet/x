import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';

// store
import { addMiddleware } from '../../../store';

// types
import { MigrationApiResponse, PointsResultsData } from '../../../types/api';

// utils
import { CompatibleChains, isTestnet } from '../../../utils/blockchain';

const chainIds = isTestnet
  ? [11155111]
  : CompatibleChains.map((chain) => chain.chainId);

const chainIdsQuery = chainIds.map((id) => `chainIds=${id}`).join('&');

const baseVolumeQuery = fetchBaseQuery({
  baseUrl: isTestnet
    ? 'https://volumeleaderboard-nubpgwxpiq-uc.a.run.app'
    : 'https://volumeleaderboard-7eu4izffpa-uc.a.run.app',
});

const baseVolumeQueryWithRetry = retry(baseVolumeQuery, {
  maxRetries: 5,
});

export const leaderboardApi = createApi({
  reducerPath: 'leaderboardApi',
  baseQuery: baseVolumeQueryWithRetry,
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
        `?${skipDefaultPoints ? `skipDefaultPoints=${skipDefaultPoints}&` : ''}${address ? `address=${address}&` : ''}${from ? `from=${from * 1000}&` : ''}${until ? `until=${until * 1000}&` : ''}${chainIdsQuery}&testnets=${String(isTestnet)}`,
    }),
  }),
});

const baseMigrationQuery = fetchBaseQuery({
  baseUrl: isTestnet
    ? 'https://profiles-nubpgwxpiq-uc.a.run.app/migrantAddresses'
    : 'https://profiles-7eu4izffpa-uc.a.run.app/migrantAddresses',
});

const baseMigrationQueryWithRetry = retry(baseMigrationQuery, {
  maxRetries: 5,
});

export const leaderboardMigrationApi = createApi({
  reducerPath: 'leaderboardMigrationApi',
  baseQuery: baseMigrationQueryWithRetry,
  endpoints: (builder) => ({
    getLeaderboardMigration: builder.query<MigrationApiResponse, void>({
      query: () => `?${chainIdsQuery}&testnets=${String(isTestnet)}`,
    }),
  }),
});

/**
 * Add this to the store
 */
addMiddleware(leaderboardApi);
addMiddleware(leaderboardMigrationApi);

export const { useGetLeaderboardQuery } = leaderboardApi;
export const { useGetLeaderboardMigrationQuery } = leaderboardMigrationApi;

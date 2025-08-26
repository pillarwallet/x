import { useEffect, useMemo, useState } from 'react';

// types
import {
  LeaderboardRankChange,
  LeaderboardTableData,
} from '../../../types/api';

// api queries
import {
  useGetLeaderboardMigrationQuery,
  useGetLeaderboardQuery,
} from '../api/leaderboard';

// utils
import {
  getCurrentWeekMigrationData,
  getLastWeekMigrationData,
  getMergeLeaderboardData,
  getMergeLeaderboardMigrationDataByAddresses,
} from '../utils';

// hooks
import { useDateRanges } from './useDateRanges';
import { useRankComparison } from './useRankComparison';

export const useLeaderboardData = () => {
  const dateRanges = useDateRanges();
  const compareIndexes = useRankComparison();
  const [weeklyTradingData, setWeeklyTradingData] = useState<
    LeaderboardTableData[] | undefined
  >(undefined);

  // API calls
  const allTimeQuery = useGetLeaderboardQuery(
    { skipDefaultPoints: true },
    { refetchOnMountOrArgChange: true, refetchOnFocus: true }
  );

  const weeklyQuery = useGetLeaderboardQuery(
    {
      skipDefaultPoints: true,
      from: dateRanges.currentMonday,
      until: dateRanges.currentSunday,
    },
    { refetchOnMountOrArgChange: true, refetchOnFocus: true }
  );

  const lastWeeklyQuery = useGetLeaderboardQuery(
    {
      skipDefaultPoints: true,
      from: dateRanges.lastMonday,
      until: dateRanges.lastSunday,
    },
    { refetchOnMountOrArgChange: true, refetchOnFocus: true }
  );

  const migrationQuery = useGetLeaderboardMigrationQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  // Process all time trading data
  const allTimeTradingData: LeaderboardTableData[] | undefined = useMemo(() => {
    if (!allTimeQuery.data?.results) return undefined;
    return allTimeQuery.data.results.map((result) => ({
      totalPoints: result.totalSwapAmountUsd || 0,
      totalAmountUsd: result.totalSwapAmountUsd || 0,
      totalGas: result.totalTxFeesUsd || 0,
      addresses: [result.address],
      newDropTime: result.pointsUpdatedAt || 0,
      finalPxPointsAwardEligible: result.finalPxPointsAwardEligible,
    }));
  }, [allTimeQuery.data]);

  // Process all time migration data
  const allTimeMigrationData: LeaderboardTableData[] | undefined =
    useMemo(() => {
      if (!migrationQuery.data?.result) return undefined;

      const allMigrationEntries = migrationQuery.data.result.map((result) => ({
        totalPoints: result?.progress?.totalPoints || 0,
        totalAmountUsd: result?.progress?.migratedAmountUsd || 0,
        addresses: result?.pxAddresses,
        totalGas: result?.progress?.migratedFeesUsd || 0,
        source: result.source || undefined,
      }));

      return getMergeLeaderboardMigrationDataByAddresses(allMigrationEntries);
    }, [migrationQuery.data]);

  // Process weekly trading data
  useEffect(() => {
    if (
      weeklyQuery.data &&
      lastWeeklyQuery.data &&
      !weeklyQuery.isLoading &&
      !lastWeeklyQuery.isLoading
    ) {
      const lastWeeklyDataMap = new Map<string, number>();
      lastWeeklyQuery.data.results.forEach((userData, index) => {
        lastWeeklyDataMap.set(userData.address, index);
      });

      const updatedWeeklyData: LeaderboardTableData[] | undefined =
        weeklyQuery.data.results.map((currentUserData, currentIndex) => {
          const lastIndex = lastWeeklyDataMap.get(currentUserData.address);
          const rankChange =
            lastIndex !== undefined
              ? compareIndexes(currentIndex, lastIndex)
              : LeaderboardRankChange.NO_CHANGE;

          return {
            totalPoints: currentUserData.totalSwapAmountUsd || 0,
            totalAmountUsd: currentUserData.totalSwapAmountUsd || 0,
            totalGas: currentUserData.totalTxFeesUsd || 0,
            addresses: [currentUserData.address],
            completedSwap: currentUserData.completedSwap || false,
            rankChange,
            finalPxPointsAwardEligible:
              currentUserData.finalPxPointsAwardEligible,
          };
        });

      setWeeklyTradingData(updatedWeeklyData);
    }
  }, [
    weeklyQuery.data,
    lastWeeklyQuery.data,
    weeklyQuery.isLoading,
    lastWeeklyQuery.isLoading,
    compareIndexes,
  ]);

  // Process weekly migration data
  const weeklyMigrationData: LeaderboardTableData[] | undefined =
    useMemo(() => {
      if (!migrationQuery.data?.result) return undefined;

      const currentEntries = getCurrentWeekMigrationData(
        migrationQuery.data.result
      );
      const lastWeekEntries = getLastWeekMigrationData(
        migrationQuery.data.result
      );

      if (!currentEntries || !lastWeekEntries) return undefined;

      const lastWeekMap = new Map<string, number>();
      lastWeekEntries.forEach((userData, index) => {
        const lastAddress = userData.addresses[userData.addresses.length - 1];
        if (lastAddress) lastWeekMap.set(lastAddress, index);
      });

      return currentEntries.map((currentUserData, currentIndex) => {
        const lastAddress =
          currentUserData.addresses[currentUserData.addresses.length - 1];
        const lastIndex = lastAddress
          ? lastWeekMap.get(lastAddress)
          : undefined;
        const rankChange =
          lastIndex !== undefined
            ? compareIndexes(currentIndex, lastIndex)
            : LeaderboardRankChange.NO_CHANGE;

        return { ...currentUserData, rankChange };
      });
    }, [migrationQuery.data, compareIndexes]);

  // Process all time merged data
  const mergedAllTimeData = useMemo(() => {
    if (!allTimeTradingData && !allTimeMigrationData) return undefined;
    return getMergeLeaderboardData(
      allTimeTradingData || [],
      allTimeMigrationData || []
    );
  }, [allTimeTradingData, allTimeMigrationData]);

  // Process weekly merged data
  const mergedWeeklyTimeData: LeaderboardTableData[] | undefined =
    useMemo(() => {
      if (
        !weeklyTradingData ||
        !weeklyMigrationData ||
        !lastWeeklyQuery.data?.results ||
        !migrationQuery.data?.result
      ) {
        return undefined;
      }

      // Create last week's merged data
      const lastWeekTradingData: LeaderboardTableData[] =
        lastWeeklyQuery.data.results.map((entry) => ({
          totalPoints: entry.totalSwapAmountUsd || 0,
          totalAmountUsd: entry.totalSwapAmountUsd || 0,
          totalGas: entry.totalTxFeesUsd || 0,
          addresses: [entry.address],
          completedSwap: entry.completedSwap === true,
        }));

      const lastWeekMigrationData = getLastWeekMigrationData(
        migrationQuery.data.result
      );

      const lastMerged = getMergeLeaderboardData(
        lastWeekTradingData,
        lastWeekMigrationData || []
      );

      // Create current week's merged data
      const currentMerged = getMergeLeaderboardData(
        weeklyTradingData,
        weeklyMigrationData
      );

      // Address to rank index map (based on last address)
      const lastIndexMap = new Map<string, number>();
      lastMerged.forEach((entry, index) => {
        // In merged data only one address (common to both trading and migration)
        const lastAddress = entry.addresses[0];
        if (lastAddress) lastIndexMap.set(lastAddress, index);
      });

      // Apply rank change
      const mergedWithRankChange = currentMerged.map((entry, currentIndex) => {
        // In merged data only one address (common to both trading and migration)
        const address = entry.addresses[0];
        const lastIndex = address ? lastIndexMap.get(address) : undefined;

        const rankChange =
          lastIndex !== undefined
            ? compareIndexes(currentIndex, lastIndex)
            : LeaderboardRankChange.NO_CHANGE;

        return {
          ...entry,
          rankChange,
        };
      });

      return mergedWithRankChange;
    }, [
      weeklyTradingData,
      weeklyMigrationData,
      lastWeeklyQuery.data,
      migrationQuery.data,
      compareIndexes,
    ]);

  return {
    // API Queries
    allTimeQuery,
    weeklyQuery,
    lastWeeklyQuery,
    migrationQuery,
    // Processed data
    allTimeTradingData,
    allTimeMigrationData,
    weeklyTradingData,
    weeklyMigrationData,
    mergedAllTimeData,
    mergedWeeklyTimeData,
    // Loading states
    isLoading: {
      allTime: allTimeQuery.isLoading,
      weekly: weeklyQuery.isLoading || lastWeeklyQuery.isLoading,
      migration: migrationQuery.isLoading,
      merged: allTimeQuery.isLoading || migrationQuery.isLoading,
      mergedWeekly:
        weeklyQuery.isLoading ||
        lastWeeklyQuery.isLoading ||
        migrationQuery.isLoading,
    },
    // Error states
    isError: {
      allTime: allTimeQuery.isError,
      weekly: weeklyQuery.isError || lastWeeklyQuery.isError,
      migration: migrationQuery.isError,
      merged: allTimeQuery.isError || migrationQuery.isError,
      mergedWeekly:
        weeklyQuery.isError ||
        lastWeeklyQuery.isError ||
        migrationQuery.isError,
    },
    // Success states
    isSuccess: {
      allTime: allTimeQuery.isSuccess,
      weekly: weeklyQuery.isSuccess && lastWeeklyQuery.isSuccess,
      migration: migrationQuery.isSuccess,
      merged: allTimeQuery.isSuccess && migrationQuery.isSuccess,
      mergedWeekly:
        weeklyQuery.isSuccess &&
        lastWeeklyQuery.isSuccess &&
        migrationQuery.isSuccess,
    },
  };
};

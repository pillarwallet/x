// types
import {
  LeaderboardTableData,
  MigrationEntry,
  MigrationProgress,
} from '../../../types/api';

/**
 * Get the current week based on the current date
 * If goes after the 4 migration weeks it will return null
 */
function getCurrentMigrationWeek(): number | null {
  const now = new Date();

  if (now >= new Date(2025, 5, 3) && now < new Date(2025, 5, 10)) return 1;
  if (now >= new Date(2025, 5, 10) && now < new Date(2025, 5, 17)) return 2;
  if (now >= new Date(2025, 5, 17) && now < new Date(2025, 5, 24)) return 3;
  if (now >= new Date(2025, 5, 24) && now < new Date(2025, 6, 1)) return 4;

  return null;
}

/**
 * Get the current migration week data week based on the migration week
 * If goes after the 4 migration weeks it will return undefined
 */
export const getCurrentWeekMigrationData = (
  usersMigrationEntries: MigrationEntry[]
): LeaderboardTableData[] | undefined => {
  const currentWeek = getCurrentMigrationWeek();
  if (currentWeek === null) return undefined;

  return usersMigrationEntries
    .map((entry) => {
      if (!entry.progress || !entry.progress.pointsMatrix) {
        return {
          totalPoints: 0,
          totalAmountUsd: 0,
          addresses: entry.pxAddresses,
          source: entry.source || undefined,
          completedSwap: false,
        };
      }

      const { pointsMatrix } = entry.progress;

      const completedSwapWeek =
        `completedSwapWeek${currentWeek}` as keyof MigrationProgress;

      return {
        totalPoints:
          pointsMatrix[
            `week${currentWeek}WithBonus` as keyof typeof pointsMatrix
          ] || 0,
        totalAmountUsd:
          pointsMatrix[`week${currentWeek}Usd` as keyof typeof pointsMatrix] ||
          0,
        completedSwap: entry.progress[completedSwapWeek] === true,
        addresses: entry.pxAddresses,
        source: entry.source || undefined,
      };
    })
    .sort((a, b) => b.totalPoints - a.totalPoints);
};

/**
 * Get the last migration week data week based on the migration week
 * If goes after the 4 migration weeks it will return undefined
 */
export const getLastWeekMigrationData = (
  usersMigrationEntries: MigrationEntry[]
): LeaderboardTableData[] | undefined => {
  const currentWeek = getCurrentMigrationWeek();
  const lastWeek = currentWeek !== null ? currentWeek - 1 : null;

  if (lastWeek === null || lastWeek <= 0) return undefined;

  return usersMigrationEntries
    .map((entry) => {
      if (!entry.progress || !entry.progress.pointsMatrix) {
        return {
          totalPoints: 0,
          totalAmountUsd: 0,
          addresses: entry.pxAddresses,
          source: entry.source || undefined,
        };
      }

      const { pointsMatrix } = entry.progress;

      const completedSwapWeek =
        `completedSwapWeek${currentWeek}` as keyof MigrationProgress;

      return {
        totalPoints:
          pointsMatrix[
            `week${lastWeek}WithBonus` as keyof typeof pointsMatrix
          ] || 0,
        totalAmountUsd:
          pointsMatrix[`week${lastWeek}Usd` as keyof typeof pointsMatrix] || 0,
        completedSwap: entry.progress[completedSwapWeek] === true,
        addresses: entry.pxAddresses,
        source: entry.source || undefined,
      };
    })
    .sort((a, b) => b.totalPoints - a.totalPoints);
};

/**
 * Merge the trading data source with the migration data source.
 */
export const getMergeLeaderboardData = (
  tradingDataSource: LeaderboardTableData[],
  migrationDataSource: LeaderboardTableData[]
): LeaderboardTableData[] => {
  const addressMap = new Map<string, LeaderboardTableData>();

  // Add ALL entries from tradingDataSource to the map
  tradingDataSource.forEach((entry) => {
    const address = entry.addresses[0];
    addressMap.set(address, { ...entry });
  });

  // Process migrationDataSource entries
  migrationDataSource.forEach((entry) => {
    const matchingAddress = entry.addresses.find((address) =>
      addressMap.has(address)
    );

    if (matchingAddress) {
      // CASE 1: Match found - merge the data
      const foundEntry = addressMap.get(matchingAddress)!;
      foundEntry.totalPoints += entry.totalPoints;
      foundEntry.totalAmountUsd += entry.totalAmountUsd;
      foundEntry.totalGas = (foundEntry.totalGas ?? 0) + (entry.totalGas ?? 0);
      foundEntry.completedSwap =
        foundEntry.completedSwap || false || entry.completedSwap || false;
      const combinedAddresses = foundEntry.addresses.concat(entry.addresses);
      foundEntry.addresses = Array.from(new Set(combinedAddresses));
    } else {
      // CASE 2: No match found - add as new entry
      const primaryAddress = entry.addresses[0];
      addressMap.set(primaryAddress, { ...entry });
    }
  });

  return Array.from(addressMap.values()).sort(
    (a, b) => b.totalPoints - a.totalPoints
  );
};

/**
 * Merges leaderboard entries that have overlapping addresses.
 * This is in the case there are etherspot-v2 and archanova
 * wallets with the same PX address
 */
export const getMergeLeaderboardMigrationDataByAddresses = (
  allTimeMigrationData: LeaderboardTableData[]
): LeaderboardTableData[] => {
  const addressToEntries = new Map<string, LeaderboardTableData[]>();

  // Group entries by each address they contain
  allTimeMigrationData.forEach((entry) => {
    entry.addresses.forEach((address) => {
      if (!addressToEntries.has(address)) {
        addressToEntries.set(address, []);
      }
      addressToEntries.get(address)!.push(entry);
    });
  });

  const processed = new Set<LeaderboardTableData>();
  const mergedData: LeaderboardTableData[] = [];

  allTimeMigrationData.forEach((entry) => {
    if (processed.has(entry)) return;

    // Find all entries that share any address with this entry
    const relatedEntries = new Set<LeaderboardTableData>();
    entry.addresses.forEach((address) => {
      addressToEntries.get(address)?.forEach((relatedEntry) => {
        relatedEntries.add(relatedEntry);
      });
    });

    const allEntries = Array.from(relatedEntries);

    // Find addresses that appear in multiple entries
    const commonAddresses = entry.addresses.filter(
      (address) =>
        allEntries.filter((e) => e.addresses.includes(address)).length > 1
    );

    if (allEntries.length === 1) {
      // Single entry, no merging needed
      mergedData.push(entry);
    } else {
      // Multiple entries, merge them
      mergedData.push({
        totalPoints: allEntries.reduce((sum, e) => sum + e.totalPoints, 0),
        totalAmountUsd: allEntries.reduce(
          (sum, e) => sum + e.totalAmountUsd,
          0
        ),
        totalGas: allEntries.reduce((sum, e) => sum + (e.totalGas || 0), 0),
        completedSwap: allEntries.some((e) => e.completedSwap === true),
        addresses: commonAddresses,
        source: 'multiple',
      });
    }

    allEntries.forEach((e) => processed.add(e));
  });

  return mergedData;
};

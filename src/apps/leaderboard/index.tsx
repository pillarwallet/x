/* eslint-disable @typescript-eslint/no-use-before-define */
import { useWalletAddress } from '@etherspot/transaction-kit';
import { useCallback, useEffect, useMemo } from 'react';

// styles
import styled from 'styled-components';
import './styles/tailwindLeaderboard.css';

// types
import { LeaderboardTableData } from '../../types/api';

// utils
import { formatAmountDisplay } from '../../utils/number';

// components
import BodySmall from '../pillarx-app/components/Typography/BodySmall';
import InfoBanner from './components/InfoBanner/InfoBanner';
import LeaderboardFiltersButton from './components/LeaderboardTabsButton/LeaderboardFiltersButton';
import LeaderboardTabsButton from './components/LeaderboardTabsButton/LeaderboardTabsButton';
import Leaderboards from './components/Leaderboards/Leaderboards';
import PxPointsSummary from './components/PxPointsSummary/PxPointsSummary';
import H1 from './components/Typography/H1';

// hooks
import { useLeaderboardData } from './hooks/useLeaderboardData';
import { useAppDispatch, useAppSelector } from './hooks/useReducerHooks';

// images
import PillarXLogo from './images/pillarX_full_white.png';

// reducer
import {
  LeaderboardTabsType,
  LeaderboardTimeTabsType,
  setActiveTab,
  setIsUserInMigrationData,
} from './reducer/LeaderboardSlice';

const App = () => {
  const dispatch = useAppDispatch();
  const walletAddress = useWalletAddress();

  const activeTab = useAppSelector(
    (state) => state.leaderboard.activeTab as LeaderboardTabsType
  );
  const timeTab = useAppSelector(
    (state) => state.leaderboard.timeTab as LeaderboardTimeTabsType
  );
  const isUserInMigrationData = useAppSelector(
    (state) => state.leaderboard.isUserInMigrationData as boolean
  );

  const {
    allTimeTradingData,
    allTimeMigrationData,
    weeklyMigrationData,
    weeklyTradingData,
    mergedAllTimeData,
    mergedWeeklyTimeData,
    migrationQuery,
    isLoading,
    isError,
    isSuccess,
  } = useLeaderboardData();

  const handleAllTabClick = useCallback(() => {
    dispatch(setActiveTab('all'));
  }, [dispatch]);

  const handleMigrationTabClick = useCallback(() => {
    dispatch(setActiveTab('migration'));
  }, [dispatch]);

  const handleTradingTabClick = useCallback(() => {
    dispatch(setActiveTab('trading'));
  }, [dispatch]);

  // Check if user wallet address is present in migration data
  useEffect(() => {
    if (!walletAddress || !migrationQuery.data) {
      dispatch(setIsUserInMigrationData(false));
      return;
    }

    const userInMigrationData = migrationQuery.data.result.some((result) =>
      result.pxAddresses.some(
        (address) => address.toLowerCase() === walletAddress.toLowerCase()
      )
    );

    dispatch(setIsUserInMigrationData(userInMigrationData));
  }, [walletAddress, migrationQuery.data, dispatch]);

  // Memoized volume and gas calculations
  const { totalVolume, totalGas } = useMemo(() => {
    const calculateTotals = (data: LeaderboardTableData[] | undefined) => {
      if (!data) return { volume: 0, gas: 0 };
      return {
        volume: data.reduce((sum, entry) => sum + entry.totalAmountUsd, 0),
        gas: data.reduce((sum, entry) => sum + (entry.totalGas || 0), 0),
      };
    };

    let volume = 0;
    let gas = 0;

    if (activeTab === 'trading') {
      const data =
        timeTab === 'weekly' ? weeklyTradingData : allTimeTradingData;
      const totals = calculateTotals(data);
      volume = totals.volume;
      gas = totals.gas;
    } else if (activeTab === 'migration') {
      const data =
        timeTab === 'weekly' ? weeklyMigrationData : allTimeMigrationData;
      const totals = calculateTotals(data);
      volume = totals.volume;
      gas = totals.gas;
    } else if (activeTab === 'all') {
      const data =
        timeTab === 'weekly' ? mergedWeeklyTimeData : mergedAllTimeData;
      const totals = calculateTotals(data);
      volume = totals.volume;
      gas = totals.gas;
    }

    return { totalVolume: volume, totalGas: gas };
  }, [
    activeTab,
    timeTab,
    weeklyTradingData,
    allTimeTradingData,
    weeklyMigrationData,
    allTimeMigrationData,
    mergedWeeklyTimeData,
    mergedAllTimeData,
  ]);

  return (
    <Wrapper id="leaderboard-app">
      <img
        src={PillarXLogo}
        alt="pillar-x-logo"
        className="w-min object-contain h-[20px] mb-[70px] mobile:h-[18px] mobile:mb-[58px] self-center"
      />
      <InfoBanner />

      <H1 className="px-4 py-2.5 mb-1">Leaderboards</H1>

      <PxPointsSummary
        allTimeTradingData={allTimeTradingData}
        allTimeMigrationData={allTimeMigrationData}
        mergedAllTimeData={mergedAllTimeData}
        mergedWeeklyTimeData={mergedWeeklyTimeData}
        isUserInMigrationData={isUserInMigrationData}
      />

      <div className="flex flex-col bg-container_grey desktop:px-6 desktop:pt-6 tablet:px-6 tablet:pt-6 mobile:p-4 pb-12 rounded-2xl mt-3">
        <div className="desktop:flex tablet:flex mobile:flex mobile:flex-col mobile:gap-2.5 items-center justify-between mb-3">
          <div className="flex gap-2">
            <LeaderboardFiltersButton
              isActive={activeTab === 'all'}
              text="All"
              onClick={handleAllTabClick}
            />
            {isUserInMigrationData && (
              <LeaderboardFiltersButton
                isActive={activeTab === 'migration'}
                text="Migration"
                onClick={handleMigrationTabClick}
              />
            )}
            <LeaderboardFiltersButton
              isActive={activeTab === 'trading'}
              text="Trading"
              onClick={handleTradingTabClick}
            />
          </div>
          <LeaderboardTabsButton />
        </div>

        <div className="flex gap-3 desktop:mb-6 tablet:mb-6 mobile:self-center">
          <BodySmall className="text-white font-normal">
            Total Volume:{' '}
            <span className="text-purple_medium">
              $
              {totalVolume
                ? formatAmountDisplay(totalVolume.toFixed(2))
                : '0.00'}
            </span>
          </BodySmall>
          {totalGas && totalGas > 0 ? (
            <BodySmall className="text-white font-normal">
              Total Gas:{' '}
              <span className="text-purple_medium">
                ${formatAmountDisplay(totalGas.toFixed(2))}
              </span>
            </BodySmall>
          ) : null}
        </div>

        {/* TRADING - WEEKLY */}
        {activeTab === 'trading' && timeTab === 'weekly' && (
          <Leaderboards
            isLoading={isLoading.weekly}
            isError={isError.weekly}
            isSuccess={isSuccess.weekly}
            data={weeklyTradingData}
            errorMessage="Failed to load weekly trading data. Please try again later."
            noDataMessage="No available leaderboard data for this week."
          />
        )}

        {/* TRADING - ALL TIME */}
        {activeTab === 'trading' && timeTab === 'all' && (
          <Leaderboards
            isLoading={isLoading.allTime}
            isError={isError.allTime}
            isSuccess={isSuccess.allTime}
            data={allTimeTradingData}
            errorMessage="Failed to load all-time trading data. Please try again later."
            noDataMessage="No available leaderboard data."
          />
        )}

        {/* MIGRATION - ALL TIME */}
        {activeTab === 'migration' &&
          timeTab === 'all' &&
          isUserInMigrationData && (
            <Leaderboards
              isLoading={isLoading.migration}
              isError={isError.migration}
              isSuccess={isSuccess.migration}
              data={allTimeMigrationData}
              errorMessage="Failed to load migration data. Please try again later."
              noDataMessage="No available migration data."
            />
          )}

        {/* MIGRATION - WEEKLY */}
        {activeTab === 'migration' &&
          timeTab === 'weekly' &&
          isUserInMigrationData && (
            <Leaderboards
              isLoading={isLoading.migration}
              isError={isError.migration}
              isSuccess={isSuccess.migration}
              data={weeklyMigrationData}
              errorMessage="Failed to load weekly migration data. Please try again later."
              noDataMessage="No available migration data for this week."
            />
          )}

        {/* ALL - ALL TIME */}
        {activeTab === 'all' && timeTab === 'all' && (
          <Leaderboards
            isLoading={isLoading.merged}
            isError={isError.merged}
            isSuccess={isSuccess.merged}
            data={mergedAllTimeData}
            errorMessage="Failed to load leaderboard data. Please try again later."
            noDataMessage="No available leaderboard data."
          />
        )}

        {/* ALL - WEEKLY */}
        {activeTab === 'all' && timeTab === 'weekly' && (
          <Leaderboards
            isLoading={isLoading.mergedWeekly}
            isError={isError.mergedWeekly}
            isSuccess={isSuccess.mergedWeekly}
            data={mergedWeeklyTimeData}
            errorMessage="Failed to load weekly leaderboard data. Please try again later."
            noDataMessage="No available leaderboard data for this week."
          />
        )}
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  margin: 0 auto;
  flex-direction: column;
  max-width: 1248px;

  @media (min-width: 1024px) {
    padding: 52px 62px;
  }

  @media (max-width: 1024px) {
    padding: 52px 32px;
  }

  @media (max-width: 768px) {
    padding: 32px 16px;
  }
`;

export default App;

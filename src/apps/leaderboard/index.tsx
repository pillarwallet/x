/* eslint-disable @typescript-eslint/no-use-before-define */
import { formatDistanceToNowStrict } from 'date-fns';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';

// styles
import styled from 'styled-components';
import './styles/tailwindLeaderboard.css';

// types
import { LeaderboardRankChange, WeeklyLeaderboardData } from '../../types/api';

// api
import { useGetLeaderboardQuery } from './api/leaderboard';

// components
import SkeletonLoader from '../../components/SkeletonLoader';
import BodySmall from '../pillarx-app/components/Typography/BodySmall';
import LeaderboardTab from './components/LeaderboardTab/LeaderboardTab';
import LeaderboardTabsButton from './components/LeaderboardTabsButton/LeaderboardTabsButton';
import Body from './components/Typography/Body';
import H1 from './components/Typography/H1';

// images
import PillarXLogo from './images/pillarX_full_white.png';

const App = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [comparisonData, setComparisonData] = useState<WeeklyLeaderboardData[]>(
    []
  );
  const [lastFetchedAllTime, setLastFetchedAllTime] = useState<
    Date | undefined
  >(undefined);
  const [lastFetchedWeekly, setLastFetchedWeekly] = useState<Date | undefined>(
    undefined
  );
  const [timeAgoAllTime, setTimeAgoAllTime] = useState<string | undefined>(
    undefined
  );
  const [timeAgoWeekly, setTimeAgoWeekly] = useState<string | undefined>(
    undefined
  );

  const currentMonday = DateTime.now().startOf('week').toUnixInteger();
  const currentSunday = DateTime.now().endOf('week').toUnixInteger();
  const lastMonday = DateTime.now()
    .startOf('week')
    .minus({ weeks: 1 })
    .toUnixInteger();
  const lastSunday = DateTime.now()
    .endOf('week')
    .minus({ weeks: 1 })
    .toUnixInteger();

  const {
    data: allTimeData,
    isSuccess: isSuccessAllTimeData,
    isLoading: isLoadingAllTimeData,
    refetch: refetchAllTime,
  } = useGetLeaderboardQuery({ skipDefaultPoints: true });

  const {
    data: weeklyData,
    isSuccess: isSuccessWeeklyData,
    isLoading: isLoadingWeeklyData,
    refetch: refetchWeekly,
  } = useGetLeaderboardQuery({
    skipDefaultPoints: true,
    from: currentMonday,
    until: currentSunday,
  });

  const {
    data: lastWeeklyData,
    isSuccess: isSuccessLastWeeklyData,
    isLoading: isLoadingLastWeeklyData,
    refetch: refetchLastWeekly,
  } = useGetLeaderboardQuery({
    skipDefaultPoints: true,
    from: lastMonday,
    until: lastSunday,
  });

  const compareIndexes = (currentIndex: number, previousIndex: number) => {
    if (currentIndex === previousIndex) return LeaderboardRankChange.NO_CHANGE;
    return currentIndex > previousIndex
      ? LeaderboardRankChange.INCREASED
      : LeaderboardRankChange.DECREASED;
  };

  // Compare weekly data and calculate rank changes
  useEffect(() => {
    if (
      activeTab === 0 &&
      weeklyData &&
      lastWeeklyData &&
      !isLoadingWeeklyData &&
      !isLoadingLastWeeklyData
    ) {
      // New mapping of last week data for quick comparison of addresses and indexes only
      const lastWeeklyDataMap = new Map<string, number>();
      lastWeeklyData.results.forEach((userData, index) => {
        lastWeeklyDataMap.set(userData.address, index);
      });

      const updatedWeeklyData: WeeklyLeaderboardData[] = weeklyData.results.map(
        (currentUserData, currentIndex) => {
          // Finding last week index if the address existed last week
          const lastIndex = lastWeeklyDataMap.get(currentUserData.address);

          const rankChange =
            lastIndex !== undefined
              ? compareIndexes(currentIndex, lastIndex)
              : LeaderboardRankChange.NO_CHANGE;

          return {
            ...currentUserData,
            rankChange,
          };
        }
      );

      setComparisonData(updatedWeeklyData);
    }
  }, [
    activeTab,
    weeklyData,
    lastWeeklyData,
    isLoadingWeeklyData,
    isLoadingLastWeeklyData,
  ]);

  useEffect(() => {
    if (weeklyData && isSuccessWeeklyData) {
      refetchWeekly();
    }
    if (lastWeeklyData && isSuccessLastWeeklyData) {
      refetchLastWeekly();
    }
    if (allTimeData && isSuccessAllTimeData) {
      refetchAllTime();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isSuccessAllTimeData) {
      setLastFetchedAllTime(new Date());
    }
  }, [isSuccessAllTimeData]);

  useEffect(() => {
    if (isSuccessWeeklyData) {
      setLastFetchedWeekly(new Date());
    }
  }, [isSuccessWeeklyData]);

  // Update the time ago text every minute
  useEffect(() => {
    const updateTimes = () => {
      if (lastFetchedAllTime) {
        setTimeAgoAllTime(
          formatDistanceToNowStrict(lastFetchedAllTime, { addSuffix: true })
        );
      }
      if (lastFetchedWeekly) {
        setTimeAgoWeekly(
          formatDistanceToNowStrict(lastFetchedWeekly, { addSuffix: true })
        );
      }
    };

    updateTimes();
    const interval = setInterval(updateTimes, 60000);

    return () => clearInterval(interval);
  }, [lastFetchedAllTime, lastFetchedWeekly]);

  return (
    <Wrapper id="leaderboard-app">
      <img
        src={PillarXLogo}
        alt="pillar-x-logo"
        className="w-min object-contain h-[20px] mb-[70px] mobile:h-[18px] mobile:mb-[58px] self-center"
      />
      <div className="flex justify-between items-end">
        <H1 className="px-4 py-2.5 mb-1">Leaderboard</H1>
        {(timeAgoAllTime || timeAgoWeekly) && (
          <BodySmall className="text-purple_light text-[10px] px-4 py-2.5 mb-1 font-light">
            Last updated: {activeTab === 0 ? timeAgoWeekly : timeAgoAllTime}
          </BodySmall>
        )}
      </div>

      <LeaderboardTabsButton
        tabs={['Weekly', 'All time']}
        activeTab={activeTab}
        onTabClick={setActiveTab}
      />

      {activeTab === 0 && (
        <>
          {(isLoadingWeeklyData || isLoadingLastWeeklyData) && (
            <div className="flex flex-col">
              {[...Array(3)].map((_, index) => (
                <SkeletonLoader
                  key={index}
                  $height="50px"
                  $radius="6px"
                  $marginBottom="16px"
                />
              ))}
            </div>
          )}

          {isSuccessWeeklyData &&
            isSuccessLastWeeklyData &&
            comparisonData.length > 0 && (
              <LeaderboardTab data={comparisonData} />
            )}

          {isSuccessWeeklyData &&
            (!weeklyData?.results || weeklyData.results.length === 0) && (
              <Body>No available leaderboard data for this week.</Body>
            )}
        </>
      )}

      {activeTab === 1 && (
        <>
          {isLoadingAllTimeData && (
            <div className="flex flex-col">
              {[...Array(3)].map((_, index) => (
                <SkeletonLoader
                  key={index}
                  $height="50px"
                  $radius="6px"
                  $marginBottom="16px"
                />
              ))}
            </div>
          )}

          {isSuccessAllTimeData && allTimeData?.results?.length > 0 && (
            <LeaderboardTab data={allTimeData.results} />
          )}

          {isSuccessAllTimeData &&
            (!allTimeData?.results || allTimeData.results.length === 0) && (
              <Body>No available leaderboard data.</Body>
            )}
        </>
      )}
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

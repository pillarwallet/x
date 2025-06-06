import { useWalletAddress } from '@etherspot/transaction-kit';
import { useEffect, useRef, useState } from 'react';

// types
import {
  LeaderboardRankChange,
  PointsResult,
  WeeklyLeaderboardData,
} from '../../../../types/api';

// components
import Body from '../Typography/Body';
import UserInfo from '../UserInfo/UserInfo';

// utils
import { formatAmountDisplay } from '../../../../utils/number';

type LeaderboardTabProps = {
  data: PointsResult[] | WeeklyLeaderboardData[];
};

const LeaderboardTab = ({ data }: LeaderboardTabProps) => {
  const [visibleCount, setVisibleCount] = useState(10);
  const loadMoreRef = useRef(null);
  const walletAddress = useWalletAddress();

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadMore();
        }
      },
      { threshold: 1.0 }
    );

    const currentRef = loadMoreRef.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [visibleCount]);

  const visibleData = data.slice(0, visibleCount);
  const isEndOfData = visibleData.length === data.length;

  const myRankData = data.find((result) => result.address === walletAddress);

  return (
    <>
      <div
        id="leaderboard-list-data"
        className="flex flex-col bg-container_grey rounded-2xl desktop:p-5 tablet:p-5 mobile:p-2 desktop:pr-10 tablet:pr-10 mobile:pr-4"
      >
        {myRankData && (
          <>
            <div className="flex justify-between">
              <Body className="text-purple_light">My rank</Body>
              <Body className="text-purple_light">Total Swap Amount</Body>
            </div>
            <div className="flex flex-col">
              <div className="flex justify-between py-5 py-2">
                <UserInfo
                  rank={data.indexOf(myRankData) + 1}
                  walletAddress={myRankData.address}
                  rankChange={
                    'rankChange' in myRankData
                      ? (myRankData.rankChange as LeaderboardRankChange)
                      : LeaderboardRankChange.NO_CHANGE
                  }
                />
                <div className="flex desktop:gap-3.5 tablet:gap-3.5 mobile:gap-1.5 items-center">
                  <p className="desktop:text-[22px] tablet:text-[22px] mobile:text-base">
                    ${formatAmountDisplay(myRankData.totalSwapAmountUsd ?? 0)}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
        <div className="flex justify-between">
          <Body className="text-purple_light">Rankings</Body>
          {!myRankData && (
            <Body className="text-purple_light">Total Swap Amount</Body>
          )}
        </div>
        <div className="flex flex-col">
          {visibleData.map((result, index) => (
            <div
              key={result.address}
              className={`flex justify-between py-5 ${
                index !== visibleData.length - 1 && 'border-b border-[#1F1D23]'
              } py-2`}
            >
              <UserInfo
                rank={index + 1}
                walletAddress={result.address}
                rankChange={
                  'rankChange' in result
                    ? (result.rankChange as LeaderboardRankChange)
                    : LeaderboardRankChange.NO_CHANGE
                }
              />
              <div className="flex desktop:gap-3.5 tablet:gap-3.5 mobile:gap-1.5 items-center">
                <p className="desktop:text-[22px] tablet:text-[22px] mobile:text-base">
                  ${formatAmountDisplay(result.totalSwapAmountUsd ?? 0)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {!isEndOfData && (
        <div
          ref={loadMoreRef}
          onClick={handleLoadMore}
          className="border border-purple_light/[.20] py-3 px-7 rounded-3xl w-fit self-center my-9"
        >
          Loading more...
        </div>
      )}
    </>
  );
};

export default LeaderboardTab;

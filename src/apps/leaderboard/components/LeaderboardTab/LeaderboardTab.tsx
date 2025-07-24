import { useEffect, useRef, useState } from 'react';

// hooks
import useTransactionKit from '../../../../hooks/useTransactionKit';

// types
import {
  LeaderboardRankChange,
  LeaderboardTableData,
} from '../../../../types/api';

// components
import Body from '../Typography/Body';
import UserInfo from '../UserInfo/UserInfo';

// utils
import { formatAmountDisplay } from '../../../../utils/number';

type LeaderboardTabProps = {
  data: LeaderboardTableData[];
};

const LeaderboardTab = ({ data }: LeaderboardTabProps) => {
  const [visibleCount, setVisibleCount] = useState(10);
  const loadMoreRef = useRef(null);
  const { walletAddress } = useTransactionKit();

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

  const myRankData = walletAddress
    ? data.find((result) => result.addresses?.includes(walletAddress))
    : undefined;

  return (
    <>
      <div
        id="leaderboard-list-data"
        className="flex flex-col bg-container_grey desktop:p-6 tablet:p-6 mobile:p-0"
      >
        {myRankData && (
          <>
            {/* Header Row */}
            <div className="grid desktop:grid-cols-[70%_15%_15%] tablet:grid-cols-[70%_15%_15%] mobile:grid-cols-[70%_30%] items-center">
              <Body className="text-white/[.5] mobile:font-normal mobile:text:sm">
                My rank
              </Body>

              {/* USD label — hidden on mobile */}
              <Body className="text-white/[.5] text-left mobile:hidden desktop:flex tablet:flex justify-start">
                USD value
              </Body>

              <Body className="text-white/[.5] text-right mobile:hidden desktop:flex tablet:flex justify-end">
                PX Points
              </Body>

              <Body className="desktop:hidden tablet:hidden mobile:flex text-white/[.5] text-right mobile:font-normal mobile:text:sm mobile:justify-end">
                PX Points/USD value
              </Body>
            </div>
            <div className="grid desktop:grid-cols-[70%_15%_15%] tablet:grid-cols-[70%_15%_15%] mobile:grid-cols-[70%_30%] items-center desktop:py-5 tablet:py-5 mobile:py-2.5">
              {/* Column 1: User Info */}
              <div>
                <UserInfo
                  rank={data.indexOf(myRankData) + 1}
                  walletAddress={walletAddress || ''}
                  rankChange={
                    'rankChange' in myRankData
                      ? (myRankData.rankChange as LeaderboardRankChange)
                      : LeaderboardRankChange.NO_CHANGE
                  }
                />
              </div>

              {/* Column 2: USD Value (hidden on mobile) */}
              <div className="text-right pr-2 mobile:hidden tablet:flex desktop:flex">
                <p className="font-normal text-[22px] text-white">
                  $
                  {formatAmountDisplay(
                    Math.floor(myRankData.totalAmountUsd) || 0
                  )}
                </p>
              </div>

              {/* Column 3: PX Points */}
              <div className="flex flex-col">
                <div className="flex text-right desktop:gap-[14px] tablet:gap-[14px] mobile:gap-1 items-baseline justify-end">
                  <p className="font-normal desktop:text-[22px] tablet:text-[22px] mobile:text-sm text-white">
                    {formatAmountDisplay(
                      Math.floor(myRankData.totalPoints) || 0
                    )}
                  </p>
                  <p className="font-normal text-sm text-white">PX</p>
                </div>
                <div className="desktop:hidden tablet:hidden mobile:flex text-right justify-end">
                  <p className="font-normal desktop:text-[22px] tablet:text-[22px] mobile:text-sm text-white/[.5]">
                    $
                    {formatAmountDisplay(
                      Math.floor(myRankData.totalAmountUsd) || 0
                    )}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
        <div className="flex justify-between">
          <Body className="text-white mobile:font-normal mobile:text:sm">
            Rankings
          </Body>
        </div>
        <div className="flex flex-col">
          {visibleData.map((result, index) => (
            <div
              key={`${result.addresses?.[result.addresses.length - 1]}-${index}`}
              className="grid desktop:grid-cols-[70%_15%_15%] tablet:grid-cols-[70%_15%_15%] mobile:grid-cols-[70%_30%] items-center desktop:py-5 tablet:py-5 mobile:py-[5px]"
            >
              {/* Column 1: User Info */}
              <div>
                <UserInfo
                  rank={index + 1}
                  walletAddress={
                    result.addresses?.[result.addresses.length - 1] || ''
                  }
                  rankChange={
                    'rankChange' in result
                      ? (result.rankChange as LeaderboardRankChange)
                      : LeaderboardRankChange.NO_CHANGE
                  }
                />
              </div>

              {/* Column 2: USD Value (hidden on mobile) */}
              <div className="text-right pr-2 mobile:hidden tablet:flex desktop:flex">
                <p className="font-normal text-[22px] text-white">
                  ${formatAmountDisplay(Math.floor(result.totalAmountUsd) || 0)}
                </p>
              </div>

              {/* Column 3: PX Points */}
              <div className="flex flex-col">
                <div className="flex text-right desktop:gap-[14px] tablet:gap-[14px] mobile:gap-1 items-baseline justify-end">
                  <p className="font-normal desktop:text-[22px] tablet:text-[22px] mobile:text-sm text-white">
                    {formatAmountDisplay(
                      Math.floor(result.totalPoints) || 0
                    )}{' '}
                  </p>
                  <p className="font-normal text-sm text-white">PX</p>
                </div>
                <div className="desktop:hidden tablet:hidden mobile:flex text-right justify-end">
                  <p className="font-normal desktop:text-[22px] tablet:text-[22px] mobile:text-sm text-white/[.5]">
                    $
                    {formatAmountDisplay(
                      Math.floor(result.totalAmountUsd) || 0
                    )}
                  </p>
                </div>
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

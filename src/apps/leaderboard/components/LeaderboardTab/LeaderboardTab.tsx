import { useState } from 'react';

// types
import {
  LeaderboardRankChange,
  PointsResult,
  WeeklyLeaderboardData,
} from '../../../../types/api';

// components
import Body from '../Typography/Body';
import BodySmall from '../Typography/BodySmall';
import UserInfo from '../UserInfo/UserInfo';

type LeaderboardTabProps = {
  data: PointsResult[] | WeeklyLeaderboardData[];
};

const LeaderboardTab = ({ data }: LeaderboardTabProps) => {
  const [visibleCount, setVisibleCount] = useState(10);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  const visibleData = data.slice(0, visibleCount);
  const isEndOfData = visibleData.length === data.length;

  return (
    <>
      <div className="flex flex-col bg-container_grey rounded-2xl p-5 pr-10">
        <div className="flex justify-between">
          <Body className="text-purple_light">Rankings</Body>
          <Body className="text-purple_light">PX Points</Body>
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
              <div className="flex gap-3.5 items-center">
                <p className="text-[22px]">{result.points}</p>
                <BodySmall className="text-purple_light">PX</BodySmall>
              </div>
            </div>
          ))}
        </div>
      </div>
      {!isEndOfData && (
        <button
          type="button"
          onClick={handleLoadMore}
          className="border border-purple_light/[.20] py-3 px-7 rounded-3xl w-fit self-center my-9"
        >
          Load more
        </button>
      )}
    </>
  );
};

export default LeaderboardTab;

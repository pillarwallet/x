// types
import { LeaderboardTableData } from '../../../../types/api';

// utils
import { formatAmountDisplay } from '../../../../utils/number';

/**
 * Calculate final PX points by adding bonus points if eligible
 */
const calculateFinalPxPoints = (basePoints: number, finalPxPointsAwardEligible?: boolean, timeTab: 'all' | 'weekly' = 'all'): number => {
  if (timeTab === 'all' && finalPxPointsAwardEligible === true) {
    return basePoints + 200;
  }
  return basePoints;
};

// images
import CurrentRankIcon from '../../images/current-rank-icon.svg';
import EarnedLastWeekIcon from '../../images/earned-last-week-icon.svg';
import PillarXIcon from '../../images/pillarx-icon.svg';
import WeeklyRankIcon from '../../images/weekly-rank-icon.svg';

// components
import BodySmall from '../Typography/BodySmall';

type OverviewPointsCardProps = {
  myAllTimeMerged: { entry: LeaderboardTableData | undefined; index: number };
  myWeeklyMerged: { entry: LeaderboardTableData | undefined; index: number };
  timeTab: 'all' | 'weekly';
};
const OverviewPointsCard = ({
  myAllTimeMerged,
  myWeeklyMerged,
  timeTab,
}: OverviewPointsCardProps) => {
  return (
    <div className="flex flex-col w-full h-full rounded-[10px] bg-purple_medium/[.05] p-3 gap-3">
      <BodySmall className="font-normal">My PX Overview</BodySmall>
      <div className="flex flex-col w-full gap-2.5">
        <div className="flex w-full justify-between items-center">
          <div className="flex gap-2 items-center">
            <div className="flex h-6 w-6 items-center justify-center rounded-[5px] bg-purple_medium/[.05]">
              <img src={PillarXIcon} alt="pillarx-icon" />
            </div>
            <BodySmall className="font-normal text-white/[.5]">
              PX Points
            </BodySmall>
          </div>
          <BodySmall className="font-semibold text-white">
            {myAllTimeMerged.index === -1
              ? '-'
              : formatAmountDisplay(
                  Math.floor(calculateFinalPxPoints(myAllTimeMerged.entry?.totalPoints || 0, myAllTimeMerged.entry?.finalPxPointsAwardEligible, timeTab))
                )}{' '}
            <span className="font-semibold text-white/[.5]">PX</span>
          </BodySmall>
        </div>
        <div className="flex w-full justify-between items-center">
          <div className="flex gap-2 items-center">
            <div className="flex h-6 w-6 items-center justify-center rounded-[5px] bg-purple_medium/[.05]">
              <img src={CurrentRankIcon} alt="current-rank-icon" />
            </div>
            <BodySmall className="font-normal text-white/[.5]">
              Current Rank
            </BodySmall>
          </div>
          <BodySmall className="font-semibold text-white">
            <span className="font-semibold text-white/[.5]">#</span>
            {myAllTimeMerged.index !== -1 ? myAllTimeMerged.index + 1 : '-'}
          </BodySmall>
        </div>
      </div>
      <BodySmall className="font-normal">Weekly</BodySmall>
      <div className="flex flex-col w-full gap-2.5">
        <div className="flex w-full justify-between items-center">
          <div className="flex gap-2 items-center">
            <div className="flex h-6 w-6 items-center justify-center rounded-[5px] bg-purple_medium/[.05]">
              <img src={WeeklyRankIcon} alt="pillarx-icon" />
            </div>
            <BodySmall className="font-normal text-white/[.5]">
              Weekly Rank
            </BodySmall>
          </div>
          <BodySmall className="font-semibold text-white">
            <span className="font-semibold text-white/[.5]">#</span>
            {myWeeklyMerged.index !== -1 ? myWeeklyMerged.index + 1 : '-'}
          </BodySmall>
        </div>
        <div className="flex w-full justify-between items-center">
          <div className="flex gap-2 items-center">
            <div className="flex h-6 w-6 items-center justify-center rounded-[5px] bg-purple_medium/[.05]">
              <img src={EarnedLastWeekIcon} alt="current-rank-icon" />
            </div>
            <BodySmall className="font-normal text-white/[.5]">
              Earned This Week
            </BodySmall>
          </div>
          <BodySmall className="font-semibold text-white">
            {myWeeklyMerged.index === -1
              ? '-'
              : formatAmountDisplay(
                  Math.floor(calculateFinalPxPoints(myWeeklyMerged.entry?.totalPoints || 0, myWeeklyMerged.entry?.finalPxPointsAwardEligible, timeTab))
                )}{' '}
            <span className="font-semibold text-white/[.5]">PX</span>
          </BodySmall>
        </div>
      </div>
    </div>
  );
};

export default OverviewPointsCard;

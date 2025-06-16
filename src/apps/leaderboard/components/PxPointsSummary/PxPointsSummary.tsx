import { useWalletAddress } from '@etherspot/transaction-kit';

// types
import { LeaderboardTableData } from '../../../../types/api';

// images
import LotteryTicketIcon from '../../images/lottery-qualified-icon.png';
import MigrationIcon from '../../images/migration-icon.svg';
import PillarWalletIcon from '../../images/pillar-wallet-icon.svg';
import TradingIcon from '../../images/trading-icon.svg';

// components
import GasNewDropCard from '../PointsCards/GasNewDropCard';
import OverviewPointsCard from '../PointsCards/OverviewPointsCard';
import PointsCard from '../PointsCards/PointsCard';
import BodySmall from '../Typography/BodySmall';

type PxPointsSummaryProps = {
  allTimeTradingData: LeaderboardTableData[] | undefined;
  allTimeMigrationData: LeaderboardTableData[] | undefined;
  mergedAllTimeData: LeaderboardTableData[] | undefined;
  mergedWeeklyTimeData: LeaderboardTableData[] | undefined;
  isUserInMigrationData: boolean;
};

const PxPointsSummary = ({
  allTimeTradingData,
  allTimeMigrationData,
  mergedAllTimeData,
  mergedWeeklyTimeData,
  isUserInMigrationData,
}: PxPointsSummaryProps) => {
  const walletAddress = useWalletAddress();

  const findMatchingEntry = (data?: LeaderboardTableData[]) => {
    if (!walletAddress || !data) return { entry: undefined, index: -1 };

    const index = data.findIndex((entry) =>
      entry.addresses.some(
        (addr) => addr.toLowerCase() === walletAddress.toLowerCase()
      )
    );

    return {
      entry: index !== -1 ? data[index] : undefined,
      index,
    };
  };

  const myAllTimeTrading = findMatchingEntry(allTimeTradingData);
  const myAllTimeMigration = findMatchingEntry(allTimeMigrationData);
  const myAllTimeMerged = findMatchingEntry(mergedAllTimeData);
  const myWeeklyMerged = findMatchingEntry(mergedWeeklyTimeData);

  const isEligibleForLottery = myWeeklyMerged.entry?.completedSwap === true;

  return (
    <div className="flex flex-col bg-container_grey desktop:py-5 desktop:px-6 tablet:py-5 tablet:px-6 mobile:p-3 rounded-2xl">
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          {isUserInMigrationData && (
            <div className="w-5 h-5 rounded p-[0.6px] bg-gradient-to-b from-white via-white/[.6] to-[#360064] shadow-[0_0_15px_0_#693397,0_2px_6px_0_#00000080]">
              <div
                className="flex w-full h-full items-center justify-center rounded bg-[#360064]"
                style={{
                  backgroundImage:
                    'radial-gradient(100% 100% at 50% 0%, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0) 100%)',
                }}
              >
                <img src={PillarWalletIcon} alt="pillar-wallet-icon" />
              </div>
            </div>
          )}

          <p className="desktop:text-xl tablet:text-xl mobile:text-base font-medium">
            My PX Points
          </p>
        </div>
        {isEligibleForLottery && (
          <div className="flex gap-1 items-center px-1.5 py-[4px] rounded-md bg-[#25232D]">
            <img
              src={LotteryTicketIcon}
              alt="lottery-qualified-icon"
              className="w-5 h-4"
            />
            <BodySmall className="text-percentage_green font-normal">
              Qualified{' '}
              <span className="desktop:inline tablet:inline mobile:hidden">
                for Lottery
              </span>
            </BodySmall>
          </div>
        )}
      </div>

      <div className="desktop:flex tablet:flex mobile:flex mobile:flex-col gap-3 mt-4">
        <div className="desktop:w-[44%] tablet:w-[44%] mobile:w-full">
          <OverviewPointsCard
            myAllTimeMerged={myAllTimeMerged}
            myWeeklyMerged={myWeeklyMerged}
          />
        </div>

        <div
          className={`desktop:w-[56%] tablet:w-[56%] mobile:w-full grid ${isUserInMigrationData ? 'grid-cols-2' : 'grid-cols-1'} gap-3`}
        >
          {isUserInMigrationData && myAllTimeMigration && (
            <PointsCard
              title="Migration"
              icon={MigrationIcon}
              background="bg-percentage_red/[.05]"
              points={myAllTimeMigration.entry?.totalPoints || 0}
              rank={
                myAllTimeMigration.index !== -1
                  ? myAllTimeMigration.index + 1
                  : undefined
              }
              textTooltip="These are points calculated from the amount that you have transferred from your Pillar V1 and Pillar V2 wallets to PX."
            />
          )}
          <PointsCard
            title="Trading"
            icon={TradingIcon}
            background="bg-percentage_green/[.05]"
            points={myAllTimeTrading.entry?.totalPoints || 0}
            rank={
              myAllTimeTrading.index !== -1
                ? myAllTimeTrading.index + 1
                : undefined
            }
            textTooltip="These are points calculated from trading assets, only trades above $2 are calculated."
          />
          <GasNewDropCard
            newDropTime={0}
            gasUsed={myAllTimeMigration.entry?.totalGas || 0}
            isMigrated
          />
        </div>
      </div>
    </div>
  );
};

export default PxPointsSummary;

// images
import GasIcon from '../../images/gas-icon.svg';
import NewDropIcon from '../../images/new-drop-icon.svg';

// components
import BodySmall from '../Typography/BodySmall';
import FormattedNewDrop from './FormattedNewDrop';

type GasNewDropCardProps = {
  newDropTime: number;
  gasUsed?: number;
  isMigrated?: boolean;
};

const GasNewDropCard = ({
  newDropTime,
  gasUsed,
  isMigrated,
}: GasNewDropCardProps) => {
  return (
    <div className="group flex flex-col w-full gap-3 rounded-[10px] p-2 relative">
      {isMigrated ? (
        <>
          <div className="absolute bottom-full mb-2 left-0 rounded-lg border border-white/[.05] bg-[#25232D] px-2.5 py-2 text-[10px] text-white italic font-normal opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 max-w-max w-fit origin-bottom scale-y-0 group-hover:scale-y-100 transform">
            This is the amount of gas used to migrate your assets over to
            PillarX.
          </div>

          <div className="flex gap-1.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#FFEA72]/[.1]">
              <img src={GasIcon} alt="gas-icon" />
            </div>
            <div className="flex flex-col">
              <BodySmall className="font-normal text-white/[.5]">
                Gas Used
              </BodySmall>
              <BodySmall className="font-semibold text-white">
                ${gasUsed ? gasUsed.toFixed(2) : '-'}
              </BodySmall>
            </div>
          </div>
        </>
      ) : null}

      <div className="flex gap-1.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#3C80FF]/[.1]">
          <img src={NewDropIcon} alt="new-drop-icon" />
        </div>
        <div className="flex flex-col">
          <BodySmall className="font-normal text-white/[.5]">
            Next Drop
          </BodySmall>
          {newDropTime ? (
            <FormattedNewDrop timestamp={newDropTime + 24 * 60 * 60 * 1000} />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default GasNewDropCard;

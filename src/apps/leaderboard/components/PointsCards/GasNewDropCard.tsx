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
    <div className="flex flex-col w-full gap-3 rounded-[10px] p-2">
      {isMigrated ? (
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

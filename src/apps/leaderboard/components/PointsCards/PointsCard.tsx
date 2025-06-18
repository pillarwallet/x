// utils
import { formatAmountDisplay } from '../../../../utils/number';

// components
import BodySmall from '../Typography/BodySmall';

type PointsCardProps = {
  title: string;
  icon: string;
  background: string;
  points: number;
  rank?: number;
  textTooltip?: string;
};

const PointsCard = ({
  title,
  icon,
  background,
  points,
  rank,
  textTooltip,
}: PointsCardProps) => {
  return (
    <div
      className={`group flex flex-col w-full gap-3 rounded-[10px] p-2 ${background} relative`}
    >
      {textTooltip && (
        <div className="absolute bottom-full mb-2 left-0 rounded-lg border border-white/[.05] bg-[#25232D] px-2.5 py-2 text-[10px] text-white italic font-normal opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 max-w-max w-fit origin-bottom scale-y-0 group-hover:scale-y-100 transform">
          {textTooltip}
        </div>
      )}
      <div className="flex gap-1.5 items-center">
        <div className="flex h-6 w-6 items-center justify-center rounded-[5px]">
          <img src={icon} alt={`${title}-icon`} />
        </div>
        <BodySmall className="font-normal text-white">{title}</BodySmall>
      </div>
      <div className="flex w-full items-center justify-between px-1">
        <BodySmall className="font-normal text-white">Points</BodySmall>
        <BodySmall className="font-semibold text-white">
          {formatAmountDisplay(Math.floor(points || 0))}{' '}
          <span className="text-white/[.5]">PX</span>
        </BodySmall>
      </div>
      <div className="flex w-full items-center justify-between px-1 mb-1">
        <BodySmall className="font-normal text-white">Rank</BodySmall>
        <BodySmall className="font-semibold text-white">
          <span className="text-white/[.5]">#</span>
          {rank !== undefined && rank > 0 ? rank : '–'}
        </BodySmall>
      </div>
    </div>
  );
};

export default PointsCard;

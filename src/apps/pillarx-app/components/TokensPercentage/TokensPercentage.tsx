// components
import BodySmall from '../Typography/BodySmall';

// images
import TriangleRedIcon from '../../images/triangle-down-red.svg';
import TriangleGreenIcon from '../../images/triangle-up-green.svg';

type TokensPercentageProps = {
  percentage?: number | null;
};

const TokensPercentage = ({ percentage }: TokensPercentageProps) => {
  if (!percentage) {
    return null;
  }

  const trianglePercentage =
    percentage >= 0 ? TriangleGreenIcon : TriangleRedIcon;

  return (
    <div className="flex gap-1 items-center">
      <img
        src={trianglePercentage}
        alt={
          trianglePercentage === TriangleGreenIcon
            ? 'percentage-up'
            : 'percentage-down'
        }
        className="w-[10px] h[9px]"
      />
      <BodySmall
        className={`${percentage >= 0 ? 'text-percentage_green' : 'text-percentage_red'}`}
      >
        {percentage.toFixed(2)}%
      </BodySmall>
    </div>
  );
};

export default TokensPercentage;

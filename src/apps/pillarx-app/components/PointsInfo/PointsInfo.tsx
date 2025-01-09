// components
import Body from '../Typography/Body';

type PointsInfoProps = {
  icon: string;
  value: React.ReactNode;
  label: string;
  beforeValue?: string;
  afterValue?: string;
  isWhite?: boolean;
};

const PointsInfo = ({
  icon,
  value,
  label,
  beforeValue,
  afterValue,
  isWhite = false,
}: PointsInfoProps) => (
  <div className="flex gap-4 p-3 items-center">
    <img
      src={icon}
      alt={label}
      className={`flex w-[52px] h-[52px] items-center justify-center p-3 rounded-md ${isWhite ? 'bg-white' : 'bg-container_grey'}`}
    />
    <div className="flex flex-col">
      <div className="desktop:text-[22px] tablet:text-lg mobile:text-lg text-white">
        {beforeValue && (
          <span className="desktop:text-base tablet:text-sm mobile:text-sm">
            {beforeValue}{' '}
          </span>
        )}
        {value}
        {afterValue && (
          <span className="desktop:text-base tablet:text-sm mobile:text-sm">
            {' '}
            {afterValue}
          </span>
        )}
      </div>
      <Body className="desktop:text-base tablet:text-sm mobile:text-sm">
        {label}
      </Body>
    </div>
  </div>
);

export default PointsInfo;

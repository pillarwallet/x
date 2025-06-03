import { DateTime } from 'luxon';

type PointsFormattedTimestampProps = {
  timestamp: number;
};

const PointsFormattedTimestamp = ({
  timestamp,
}: PointsFormattedTimestampProps) => {
  const getNextDrop = () => {
    const timestampToDate = DateTime.fromSeconds(timestamp);
    const currentDate = DateTime.now();

    const nextDrop = timestampToDate.diff(currentDate, [
      'days',
      'hours',
      'minutes',
    ]);

    const { days, hours, minutes } = nextDrop;

    return {
      days: Math.floor(days),
      hours: Math.floor(hours),
      minutes: Math.floor(minutes),
    };
  };

  const { days, hours, minutes } = getNextDrop();

  return (
    <p
      className="desktop:text-[22px] tablet:text-lg mobile:text-lg text-white"
      data-testid="points-formatted-timestamp"
    >
      {days > 0 && (
        <>
          {days}
          <span className="text-base">d</span>{' '}
        </>
      )}
      {hours > 0 && (
        <>
          {hours}
          <span className="text-base">h</span>{' '}
        </>
      )}
      {minutes}
      <span className="text-base">m</span>
    </p>
  );
};

export default PointsFormattedTimestamp;

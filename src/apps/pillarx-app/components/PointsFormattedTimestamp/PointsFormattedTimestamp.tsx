type PointsFormattedTimestampProps = {
  timestamp: number;
};

const PointsFormattedTimestamp = ({
  timestamp,
}: PointsFormattedTimestampProps) => {
  const totalSeconds = Math.floor(timestamp / 1000);
  const days = Math.floor(totalSeconds / (24 * 3600));
  const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  return (
    <p className="desktop:text-[22px] tablet:text-lg mobile:text-lg text-white">
      {days}
      <span className="text-base">d</span> {hours}
      <span className="text-base">h</span> {minutes}
      <span className="text-base">m</span>
    </p>
  );
};

export default PointsFormattedTimestamp;

import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';

type FormattedNewDropProps = {
  timestamp: number;
};

const FormattedNewDrop = ({ timestamp }: FormattedNewDropProps) => {
  const getNextDrop = () => {
    const timestampToDate = DateTime.fromMillis(timestamp);
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

  const [timeLeft, setTimeLeft] = useState(getNextDrop());

  useEffect(() => {
    setTimeLeft(getNextDrop());

    // Refresh every minute
    const interval = setInterval(() => {
      setTimeLeft(getNextDrop());
    }, 60000);

    return () => clearInterval(interval); // cleanup on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timestamp]); // Re-run if the timestamp changes

  const { days, hours, minutes } = timeLeft;

  return (
    <p className="text-sm text-white font-semibold">
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

export default FormattedNewDrop;

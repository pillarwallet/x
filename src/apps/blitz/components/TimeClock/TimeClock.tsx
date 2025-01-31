import { differenceInMinutes, differenceInSeconds } from 'date-fns';
import { useEffect, useState } from 'react';

const TimeClock = () => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const DUMMY_END_DATE = new Date(2025, 0, 30, 14, 10, 0);

  const [timeRemaining, setTimeRemaining] = useState({
    minutes: differenceInMinutes(DUMMY_END_DATE, new Date()),
    seconds: differenceInSeconds(DUMMY_END_DATE, new Date()) % 60,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining({
        minutes: differenceInMinutes(DUMMY_END_DATE, new Date()),
        seconds: differenceInSeconds(DUMMY_END_DATE, new Date()) % 60,
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [DUMMY_END_DATE]);

  return (
    <>
      <div className="flex w-fit bg-container_grey rounded-2xl p-4 pb-2.5">
        {timeRemaining.minutes} min {timeRemaining.seconds} sec
      </div>
      <div className="p-[1px] bg-gradient-to-t from-[#87344D] to-[#D8748E] rounded-[10px]">
        <div className="flex rounded-[10px] items-center justify-center bg-gradient-to-t from-[#992041] to-[#FF366C]">
          Hello
        </div>
      </div>
    </>
  );
};

export default TimeClock;

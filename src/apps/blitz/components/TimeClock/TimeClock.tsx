/* eslint-disable react/no-unstable-nested-components */
import { differenceInMinutes, differenceInSeconds, isPast } from 'date-fns';
import { useEffect, useState } from 'react';

const DUMMY_END_DATE = new Date(2025, 1, 5, 18, 10, 0); // Move outside component

type TimeClockProps = { classname?: string };

const TimeClock = ({ classname }: TimeClockProps) => {
  const calculateTimeLeft = () => {
    const now = new Date();
    const minutes = Math.max(0, differenceInMinutes(DUMMY_END_DATE, now));
    const seconds = Math.max(0, differenceInSeconds(DUMMY_END_DATE, now) % 60);
    return { minutes, seconds };
  };

  const [timeRemaining, setTimeRemaining] = useState(calculateTimeLeft);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formattedMinutes = timeRemaining.minutes.toString().padStart(2, '0');
  const formattedSeconds = timeRemaining.seconds.toString().padStart(2, '0');

  const timeMap = Array.from(formattedMinutes + formattedSeconds);

  const DigitComponent = ({ time }: { time: string }) => {
    return (
      <div className="flex h-[52px] w-[52px] p-[1px] bg-gradient-to-t from-[#87344D] to-[#D8748E] rounded-[10px]">
        <div className="flex w-full h-full rounded-[10px] items-center justify-center bg-gradient-to-t from-[#992041] to-[#FF366C]">
          <p className="text-white text-[40px]">
            {isPast(DUMMY_END_DATE) ? 0 : time}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`flex w-fit bg-container_grey rounded-2xl p-4 pb-2.5 gap-5 ${classname}`}
    >
      <div className="flex flex-col items-center">
        <div className="flex gap-1.5">
          <DigitComponent time={timeMap[0]} />
          <DigitComponent time={timeMap[1]} />
        </div>
        <p className="mt-2.5 uppercase text-light_grey text-xl font-extralight leading-5">
          minutes
        </p>
      </div>
      <div className="flex flex-col items-center">
        <div className="flex gap-1.5">
          <DigitComponent time={timeMap[2]} />
          <DigitComponent time={timeMap[3]} />
        </div>
        <p className="mt-2.5 uppercase text-light_grey text-xl font-extralight leading-5">
          seconds
        </p>
      </div>
    </div>
  );
};

export default TimeClock;

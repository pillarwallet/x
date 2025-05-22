import React, { useEffect, useState } from 'react';

interface SwapTimerProps {
  duration: number;
}

const SwapTimer:React.FC<SwapTimerProps> = ({ duration }) => {
  const [remaining, setRemaining] = useState(duration); // в секундах

  useEffect(() => {
    if (remaining <= 0) return;

    const interval = setInterval(() => {
      setRemaining(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [remaining]);

  const formatTime = (seconds: number) => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  return (
    <div className="text-color-1 font-medium">
      {formatTime(remaining)}
    </div>
  );
};


export default SwapTimer;
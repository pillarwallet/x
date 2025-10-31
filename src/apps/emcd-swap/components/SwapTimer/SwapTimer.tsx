import React, { useEffect, useState } from 'react';

interface SwapTimerProps {
  duration: number;
  onComplete?: () => void;
}

const SwapTimer:React.FC<SwapTimerProps> = ({ duration, onComplete }) => {
  const [remaining, setRemaining] = useState(duration); // in seconds

  useEffect(() => {
    if (remaining <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setRemaining(prev => {
        const newValue = prev - 1;
        if (newValue <= 0 && onComplete) {
          onComplete();
        }
        return newValue;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [remaining, onComplete]);

  const formatTime = (seconds: number) => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  useEffect(() => {
    setRemaining(duration);
  }, [duration]);

  return (
    <div className="text-color-1 font-medium">
      {formatTime(remaining)}
    </div>
  );
};


export default SwapTimer;
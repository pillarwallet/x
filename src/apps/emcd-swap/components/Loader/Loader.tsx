import React from 'react';

const Loader: React.FC = () => {
  const dotStyle = (delay: string) => ({
    animation: 'fade 1.5s infinite',
    animationDelay: delay,
  });

  return (
    <div className="flex items-center justify-center">
      <div className="flex gap-2">
        <div className='w-2 h-2 rounded-full bg-brand' style={dotStyle('0s')}></div>
        <div className='w-2 h-2 rounded-full bg-brand' style={dotStyle('0.3s')}></div>
        <div className='w-2 h-2 rounded-full bg-brand' style={dotStyle('0.6s')}></div>
      </div>
    </div>
  );
};

export default Loader;

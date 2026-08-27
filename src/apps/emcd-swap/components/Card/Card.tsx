import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  valid?: boolean | null;
}

const Card = ({ children, className, valid }:CardProps) => {
  return (
    <div className={`p-5 border w-full bg-bg-7/70 rounded-5 ${valid ? 'border-bg-5' : 'border-error'} ${className} `}>
      { children }
    </div>
  );
};

export default Card;
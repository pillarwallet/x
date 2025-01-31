import { ReactNode } from 'react';

type BodySmallProps = {
  children: ReactNode;
  className?: string;
};

const BodySmall = ({ children, className }: BodySmallProps) => {
  return <p className={`text-sm font-medium ${className}`}>{children}</p>;
};

export default BodySmall;

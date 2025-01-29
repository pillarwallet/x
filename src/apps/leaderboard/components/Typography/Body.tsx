import { ReactNode } from 'react';

type BodyProps = {
  children: ReactNode;
  className?: string;
};

const Body = ({ children, className }: BodyProps) => {
  return <p className={`text-base font-medium ${className}`}>{children}</p>;
};

export default Body;

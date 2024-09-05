import { HTMLProps, ReactNode } from 'react';

type BodyProps = HTMLProps<HTMLElement> & {
  children: ReactNode;
  className?: string;
};

const Body = ({ children, className }: BodyProps) => {
  return (
    <p className={`text-base font-medium text-black_grey ${className}`}>
      {children}
    </p>
  );
};

export default Body;

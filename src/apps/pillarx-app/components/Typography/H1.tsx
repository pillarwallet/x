import { ReactNode } from 'react';

type H1Props = {
  children: ReactNode;
  className?: string;
}

const H1 = ({ children, className }: H1Props) => {
  return (
    <h1 className={`text-3xl leading-[45px] font-medium mobile:text-xl mobile:leading-5 ${className}`}>{children}</h1>
  )
}

export default H1;

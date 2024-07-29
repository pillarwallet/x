import { ReactNode } from 'react';

type H1Props = {
  children: ReactNode;
  className?: string;
}

const H1 = ({ children, className }: H1Props) => {
  return (
    <h1 className={`desktop:text-3xl desktop:leading-[45px] tablet:text-3xl tablet:leading-[45px] mobile:text-xl mobile:leading-5 font-medium ${className}`}>{children}</h1>
  )
}

export default H1;

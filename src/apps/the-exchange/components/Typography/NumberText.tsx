import { ReactNode } from 'react';

type NumberTextProps = {
  children: ReactNode;
  className?: string;
}

const NumberText = ({ children, className }: NumberTextProps) => {
  return (
    <h1 className={`text-black_grey ${className}`}>{children}</h1>
  )
}

export default NumberText;

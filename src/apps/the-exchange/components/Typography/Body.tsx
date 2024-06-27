import { ReactNode } from 'react';

type BodyProps = {
    children: ReactNode;
    className?: string;
}

const Body = ({ children, className }: BodyProps) => {
    return (
        <p className={`text-base font-medium text-black_grey ${className}`}>{children}</p>
    )
}

export default Body;

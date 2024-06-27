import { ReactNode } from 'react';

type BodySmallProps = {
    children: ReactNode;
    className?: string;
}

const BodySmall = ({ children, className }: BodySmallProps) => {
    return (
        <p className={`text-xs font-normal text-black_grey ${className}`}>{children}</p>
    )
}

export default BodySmall;

import { ReactNode } from 'react';

type BodySmallProps = {
    children: ReactNode;
    className?: string;
};

const BodySmall = ({ children, className }: BodySmallProps) => {
    return (
        <p className={`text-[9px] font-semibold ${className}`}>{children}</p>
    );
};

export default BodySmall;

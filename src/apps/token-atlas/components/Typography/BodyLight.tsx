import { ReactNode } from 'react';

type BodyLightProps = {
    children: ReactNode;
    className?: string;
};

const BodyLight = ({ children, className }: BodyLightProps) => {
    return (
        <p className={`text-[13px] font-normal text-light_grey ${className}`}>{children}</p>
    );
};

export default BodyLight;

import { ReactNode } from 'react';

type TileContainerProps = {
    children: ReactNode;
    className?: string;
};


const TileContainer = ({ children, className }: TileContainerProps) => {
	return (
		<div className={`flex bg-container_grey rounded-2xl ${className}`}>{children}</div>
	)

}

export default TileContainer;

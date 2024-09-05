import { ReactNode } from 'react';

type TileContainerProps = {
  children: ReactNode;
  className?: string;
  id?: string;
};

const TileContainer = ({ children, className, id }: TileContainerProps) => {
  return (
    <div id={id} className={`flex bg-container_grey rounded-2xl ${className}`}>
      {children}
    </div>
  );
};

export default TileContainer;

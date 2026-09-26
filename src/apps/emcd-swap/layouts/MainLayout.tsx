import React, { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex flex-col items-center py-12 h-full">
      <div className='w-full px-6 md:w-137.5'>
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
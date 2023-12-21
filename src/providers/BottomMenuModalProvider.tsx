import React, { createContext, useMemo } from 'react';
import { usePrivy } from '@privy-io/react-auth';

// components
import BottomMenuModal from '../components/BottomMenuModal';

export interface BottomMenuModalContext {
  data: {
    activeMenuItemIndex: number | null;
    setActiveMenuItemIndex: (index: number | null) => void;
  }
}

export const ProviderContext = createContext<BottomMenuModalContext | null>(null);

const BottomMenuModalProvider = ({ children }: React.PropsWithChildren) => {
  const { authenticated } = usePrivy();
  const [activeMenuItemIndex, setActiveMenuItemIndex] = React.useState<number | null>(null);

  const contextData = useMemo(() => ({
    activeMenuItemIndex,
    setActiveMenuItemIndex,
  }), [activeMenuItemIndex]);

  return (
    <ProviderContext.Provider value={{ data: contextData }}>
      {children}
      {authenticated && (
        <BottomMenuModal
          activeMenuItemIndex={activeMenuItemIndex}
          onClose={() => setActiveMenuItemIndex(null)}
        />
      )}
    </ProviderContext.Provider>
  );
}

export default BottomMenuModalProvider;

import React, { createContext, useMemo } from 'react';

// components
import { SendModalData } from '../components/BottomMenuModal/SendModal';

export interface BottomMenuModalContext {
  data: {
    show: React.Dispatch<React.SetStateAction<BottomMenuItem | null>>;
    hide: () => void;
    active: BottomMenuItem | null;
  }
}

export const ProviderContext = createContext<BottomMenuModalContext | null>(null);

interface BottomMenuSend {
  type: 'send';
  data?: SendModalData
}

export type BottomMenuItem = {
  type: 'history' | 'account' | 'apps';
} | BottomMenuSend;

const BottomMenuModalProvider = ({ children }: React.PropsWithChildren) => {
  const [activeMenuItem, setActiveMenuItem] = React.useState<BottomMenuItem | null>(null);

  const hide = () => setActiveMenuItem(null);

  const contextData = useMemo(() => ({
    show: setActiveMenuItem,
    hide,
    active: activeMenuItem
  }), [activeMenuItem]);

  return (
    <ProviderContext.Provider value={{ data: contextData }}>
      {children}
    </ProviderContext.Provider>
  );
}

export default BottomMenuModalProvider;

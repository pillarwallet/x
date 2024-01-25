import React, { createContext, useMemo } from 'react';
import { usePrivy } from '@privy-io/react-auth';

// components
import BottomMenuModal from '../components/BottomMenuModal';
import { SendModalProps } from '../components/BottomMenuModal/SendModal';

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
  data?: SendModalProps
}

export type BottomMenuItem = {
  type: 'history' | 'account' | 'apps';
} | BottomMenuSend;

const BottomMenuModalProvider = ({ children }: React.PropsWithChildren) => {
  const { authenticated } = usePrivy();
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
      {authenticated && (
        <BottomMenuModal
          activeMenuItem={activeMenuItem}
          onClose={hide}
        />
      )}
    </ProviderContext.Provider>
  );
}

export default BottomMenuModalProvider;

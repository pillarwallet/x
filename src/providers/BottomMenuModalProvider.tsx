import React, { Dispatch, SetStateAction, createContext, useMemo } from 'react';

// components
import { SendModalData } from '../components/BottomMenuModal/SendModal';

export interface BottomMenuModalContext {
  data: {
    showTransactionConfirmation: (payload: SendModalData) => void;
    showSend: () => void;
    showHistory: () => void;
    showAccount:() => void;
    showApps: () => void;
    hide: () => void;
    active: BottomMenuItem | null;
    activeIndex: number | null;
    showBatchSendModal: boolean;
    setShowBatchSendModal: Dispatch<SetStateAction<boolean>>;
  }
}

export const ProviderContext = createContext<BottomMenuModalContext | null>(null);

interface BottomMenuSend {
  type: 'send';
  payload?: SendModalData
}

export type BottomMenuItem = {
  type: 'history' | 'account' | 'apps';
} | BottomMenuSend;

const BottomMenuModalProvider = ({ children }: React.PropsWithChildren) => {
  const [activeMenuItem, setActiveMenuItem] = React.useState<BottomMenuItem | null>(null);
  const [showBatchSendModal, setShowBatchSendModal] = React.useState<boolean>(false);

  if (showBatchSendModal && activeMenuItem?.type !== 'send') {
    setShowBatchSendModal(false);
  }

  const hide = () => setActiveMenuItem(null);

  const activeIndex = useMemo(() => {
    return activeMenuItem?.type
      ? ['send', 'history', 'account', 'apps'].indexOf(activeMenuItem.type)
      : null;
  }, [activeMenuItem?.type]);

  const contextData = useMemo(() => ({
    showTransactionConfirmation: (payload?: SendModalData) => setActiveMenuItem({ type: 'send', payload }),
    showSend: () => setActiveMenuItem({ type: 'send' }),
    showHistory: () => setActiveMenuItem({ type: 'history' }),
    showAccount: () => setActiveMenuItem({ type: 'account' }),
    showApps: () => setActiveMenuItem({ type: 'apps' }),
    hide,
    setShowBatchSendModal,
    active: activeMenuItem,
    activeIndex,
    showBatchSendModal,
  }), [activeMenuItem, activeIndex, showBatchSendModal]);

  return (
    <ProviderContext.Provider value={{ data: contextData }}>
      {children}
    </ProviderContext.Provider>
  );
}

export default BottomMenuModalProvider;

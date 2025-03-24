/* eslint-disable react/jsx-no-constructed-context-values */
import React, { Dispatch, SetStateAction, createContext, useMemo } from 'react';

// types
import { SendModalData } from '../types';

export interface BottomMenuModalContext {
  data: {
    showTransactionConfirmation: (payload: SendModalData) => void;
    showSend: () => void;
    showHistory: () => void;
    showAccount: () => void;
    showApps: () => void;
    hide: () => void;
    active: BottomMenuItem | null;
    activeIndex: number | null;
    walletConnectPayload: SendModalData | undefined;
    setWalletConnectPayload: Dispatch<
      SetStateAction<SendModalData | undefined>
    >;
    showBatchSendModal: boolean;
    setShowBatchSendModal: Dispatch<SetStateAction<boolean>>;
  };
}

export const ProviderContext = createContext<BottomMenuModalContext | null>(
  null
);

interface BottomMenuSend {
  type: 'send';
  payload?: SendModalData;
}

export type BottomMenuItem =
  | {
      type: 'history' | 'account' | 'apps';
    }
  | BottomMenuSend;

const BottomMenuModalProvider = ({ children }: React.PropsWithChildren) => {
  const [activeMenuItem, setActiveMenuItem] =
    React.useState<BottomMenuItem | null>(null);
  const [showBatchSendModal, setShowBatchSendModal] =
    React.useState<boolean>(false);
  const [walletConnectPayload, setWalletConnectPayload] = React.useState<
    SendModalData | undefined
  >(undefined);

  if (showBatchSendModal && activeMenuItem?.type !== 'send') {
    setShowBatchSendModal(false);
  }

  const hide = () => setActiveMenuItem(null);

  const activeIndex = useMemo(() => {
    return activeMenuItem?.type
      ? ['send', 'history', 'account', 'apps'].indexOf(activeMenuItem.type)
      : null;
  }, [activeMenuItem?.type]);

  const contextData = useMemo(
    () => ({
      showTransactionConfirmation: (payload?: SendModalData) =>
        setActiveMenuItem({ type: 'send', payload }),
      showSend: () =>
        walletConnectPayload
          ? setActiveMenuItem({ type: 'send', payload: walletConnectPayload })
          : setActiveMenuItem({ type: 'send' }),
      showHistory: () => setActiveMenuItem({ type: 'history' }),
      showAccount: () => setActiveMenuItem({ type: 'account' }),
      showApps: () => setActiveMenuItem({ type: 'apps' }),
      hide,
      setShowBatchSendModal,
      active: activeMenuItem,
      activeIndex,
      showBatchSendModal,
      walletConnectPayload,
      setWalletConnectPayload,
    }),
    [activeMenuItem, activeIndex, showBatchSendModal, walletConnectPayload]
  );

  return (
    <ProviderContext.Provider value={{ data: contextData }}>
      {children}
    </ProviderContext.Provider>
  );
};

export default BottomMenuModalProvider;

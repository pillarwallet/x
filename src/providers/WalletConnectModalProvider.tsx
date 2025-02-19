/* eslint-disable react/jsx-no-constructed-context-values */
import { WalletKitTypes } from '@reown/walletkit';
import { ReactNode, createContext, useMemo, useState } from 'react';

// components
import WalletConnectModal from '../apps/pillarx-app/components/WalletConnectModal/WalletConnectModal';

interface WalletConnectModalContextProps {
  data: {
    showModal: (
      session: WalletKitTypes.SessionProposal,
      onConfirm: () => void,
      onReject: () => void
    ) => void;
    hideModal: () => void;
    isModalVisible: boolean;
  };
}

export const WalletConnectModalContext =
  createContext<WalletConnectModalContextProps | null>(null);

export const WalletConnectModalProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [sessionData, setSessionData] =
    useState<WalletKitTypes.SessionProposal | null>(null);
  const [onConfirmAction, setOnConfirmAction] = useState<(() => void) | null>(
    null
  );
  const [onRejectAction, setOnRejectAction] = useState<(() => void) | null>(
    null
  );

  const showModal = (
    session: WalletKitTypes.SessionProposal,
    onConfirm: () => void,
    onReject: () => void
  ) => {
    setSessionData(session);
    setOnConfirmAction(() => onConfirm);
    setOnRejectAction(() => onReject);
    setIsModalVisible(true);
  };

  const hideModal = () => {
    setIsModalVisible(false);
    setSessionData(null);
    setOnConfirmAction(null);
    setOnRejectAction(null);
  };

  const contextData = useMemo(
    () => ({
      showModal,
      hideModal,
      isModalVisible,
    }),
    [isModalVisible]
  );

  return (
    <WalletConnectModalContext.Provider value={{ data: contextData }}>
      {children}
      {isModalVisible && sessionData && (
        <WalletConnectModal
          onClose={hideModal}
          onConfirm={() => {
            if (onConfirmAction) onConfirmAction();
            hideModal();
          }}
          onReject={() => {
            if (onRejectAction) onRejectAction();
            hideModal();
          }}
          sessionData={sessionData}
        />
      )}
    </WalletConnectModalContext.Provider>
  );
};

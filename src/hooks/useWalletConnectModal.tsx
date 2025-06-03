import { useContext } from 'react';

// providers
import { WalletConnectModalContext } from '../providers/WalletConnectModalProvider';

const useWalletConnectModal = () => {
  const context = useContext(WalletConnectModalContext);

  if (context === null) {
    throw new Error('No parent <WalletConnectModalProvider />');
  }

  return context.data;
};

export default useWalletConnectModal;

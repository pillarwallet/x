import { useContext } from 'react';

// providers
import { WalletConnectToastContext } from '../providers/WalletConnectToastProvider';

const useWalletConnectToast = () => {
  const context = useContext(WalletConnectToastContext);

  if (context === null) {
    throw new Error('No parent <WalletConnectToastProvider />');
  }

  return context.data;
};

export default useWalletConnectToast;

import { useContext } from 'react';

// providers
import { ProviderContext } from '../providers/BottomMenuModalProvider';

const useBottomMenuModal = () => {
  const context = useContext(ProviderContext);

  if (context === null) {
    throw new Error('No parent <BottomMenuModalProvider />');
  }

  return context.data;
};

export default useBottomMenuModal;

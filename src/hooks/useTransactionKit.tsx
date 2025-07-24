import { useContext } from 'react';

// providers
import { EtherspotTransactionKitContext } from '../providers/EtherspotTransactionKitProvider';

const useTransactionKit = () => {
  const context = useContext(EtherspotTransactionKitContext);

  if (context === null) {
    throw new Error('No parent <EtherspotTransactionKitProvider />');
  }

  return context?.data;
};

export default useTransactionKit;

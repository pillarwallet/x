import { useContext } from 'react';

// providers
import { GlobalTransactionsBatchContext } from '../providers/GlobalTransactionsBatchProvider';

const useGlobalTransactionsBatch = () => {
  const context = useContext(GlobalTransactionsBatchContext);

  if (context === null) {
    throw new Error('No parent <GlobalTransactionsBatchProvider />');
  }

  return context.data;
};

export default useGlobalTransactionsBatch;

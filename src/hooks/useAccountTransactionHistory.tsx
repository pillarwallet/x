import { useContext } from 'react';

// providers
import { AccountTransactionHistoryContext } from '../providers/AccountTransactionHistoryProvider';

const useAccountTransactionHistory = () => {
  const context = useContext(AccountTransactionHistoryContext);

  if (context === null) {
    throw new Error('No parent <AccountTransactionHistoryProvider />');
  }

  return context.data;
};

export default useAccountTransactionHistory;

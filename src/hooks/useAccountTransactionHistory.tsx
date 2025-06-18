import { UserOpTransaction } from '@etherspot/transaction-kit';
import { useContext } from 'react';

// providers
import { AccountTransactionHistoryContext } from '../providers/AccountTransactionHistoryProvider';

const useAccountTransactionHistory = (params?: {
  onUpdated?: (
    chainId: number,
    walletAddress: string,
    transaction: UserOpTransaction
  ) => void;
}) => {
  const context = useContext(AccountTransactionHistoryContext);

  if (context === null) {
    throw new Error('No parent <AccountTransactionHistoryProvider />');
  }

  if (params?.onUpdated) {
    context.listenerRef.current.onHistoryUpdated = params.onUpdated;
  }

  return context.data;
};

export default useAccountTransactionHistory;

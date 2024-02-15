import { useContext } from 'react';

// providers
import { AccountTransactionHistoryContext } from '../providers/AccountTransactionHistoryProvider';

// types
import { Transaction } from '../types/blockchain';

const useAccountTransactionHistory = (params?: {
  onUpdated?: (chainId: number, walletAddress: string, transaction: Transaction) => void
}) => {
  const context = useContext(AccountTransactionHistoryContext);

  if (context === null) {
    throw new Error('No parent <AccountTransactionHistoryProvider />');
  }

  if (params?.onUpdated) {
    context.listenerRef.current.onHistoryUpdated = params.onUpdated;
  }

  return context.data.history;
};

export default useAccountTransactionHistory;

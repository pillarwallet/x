import { useContext } from 'react';
import { ITransaction } from '@etherspot/transaction-kit';

// providers
import { AccountTransactionHistoryContext } from '../providers/AccountTransactionHistoryProvider';

const useAccountTransactionHistory = (params?: {
  onUpdated?: (chainId: number, walletAddress: string, transaction: ITransaction) => void
}) => {
  const context = useContext(AccountTransactionHistoryContext);

  if (context === null) {
    throw new Error('No parent <AccountBalancesProvider />');
  }

  if (params?.onUpdated) {
    context.listenerRef.current.onHistoryUpdated = params.onUpdated;
  }

  return context.data.history;
};

export default useAccountTransactionHistory;

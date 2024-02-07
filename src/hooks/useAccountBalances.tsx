import { useContext } from 'react';

// providers
import { AccountBalancesContext, IBalances } from '../providers/AccountBalancesProvider';

const useAccountBalances = (params?: {
  onUpdated?: (newBalances: IBalances, prevBalances: IBalances) => void
}) => {
  const context = useContext(AccountBalancesContext);

  if (context === null) {
    throw new Error('No parent <AccountBalancesProvider />');
  }

  if (params?.onUpdated) {
    context.listenerRef.current.onBalanceUpdated = params.onUpdated;
  }

  return context.data;
};

export default useAccountBalances;

import React, { createContext, useEffect, useMemo, useRef } from 'react';
import { useEtherspotBalances, useWalletAddress } from '@etherspot/transaction-kit';
import { AccountBalance } from '@etherspot/prime-sdk';
import { sepolia } from 'viem/chains';
import isEqual from 'lodash/isEqual';

// utils
import {
  getAssetBalance,
  getNativeAssetBalance,
  usdcOnSepolia,
  visibleChains
} from '../utils/blockchain';

export interface IBalances {
  [chainId: number]: {
    [walletAddress: string]: AccountBalance[];
  };
}

export interface AccountBalancesContext {
  listenerRef: React.MutableRefObject<AccountBalancesListenerRef>;
  data: {
    balances: IBalances;
  }
}

export interface AccountBalancesListenerRef {
  onBalanceUpdated?: (newBalances: IBalances, prevBalances: IBalances) => void;
  prevBalances?: IBalances;
}

export const AccountBalancesContext = createContext<AccountBalancesContext | null>(null);

const AccountBalancesProvider = ({ children }: React.PropsWithChildren) => {
  const { getAccountBalances } = useEtherspotBalances();
  const walletAddress = useWalletAddress();
  const [balances, setBalances] = React.useState<IBalances>({});
  const listenerRef = useRef<AccountBalancesListenerRef>({});

  useEffect(() => {
    let expired = false;
    let timeout: NodeJS.Timeout;

    const refresh = async () => {
      if (!walletAddress) return;

      const updatedBalances: IBalances = {};

      const chainIds = visibleChains.map((chain) => chain.id);

      // sequential to avoid throttling
      for (const chainId of chainIds) {
        if (expired) return;

        if (!updatedBalances[chainId]) updatedBalances[chainId] = {};

        updatedBalances[chainId][walletAddress] = chainId === sepolia.id
          // TODO: replace once Sepolia is available on Prime SDK
          ? [
            await getNativeAssetBalance(sepolia.id, walletAddress),
            await getAssetBalance(sepolia.id, usdcOnSepolia.address, walletAddress),
          ]
          : await getAccountBalances(walletAddress, chainId);
      }

      if (expired) return;

      // deep compare
      setBalances((current) => isEqual(current, updatedBalances) ? current : updatedBalances);

      timeout = setTimeout(refresh, 5000); // confirmed block time depending on chain is ~1-10s
    }

    refresh();

    return () => {
      expired = true;
      if (timeout) clearTimeout(timeout);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress]);

  useEffect(() => {
    if (!Object.keys(balances).length) return; // nothing added yet

    if (listenerRef.current?.onBalanceUpdated) {
      listenerRef.current.onBalanceUpdated(balances, listenerRef.current.prevBalances ?? {});
    }

    listenerRef.current.prevBalances = balances;
  }, [balances, listenerRef]);

  const contextData = useMemo(() => ({
    balances,
  }), [
    balances,
  ]);

  return (
    <AccountBalancesContext.Provider value={{ listenerRef, data: contextData }}>
      {children}
    </AccountBalancesContext.Provider>
  );
}

export default AccountBalancesProvider;

import React, { createContext, useEffect, useMemo, useRef } from 'react';
import { ITransaction, useWalletAddress } from '@etherspot/transaction-kit';
import isEqual from 'lodash/isEqual';
import differenceWith from 'lodash/differenceWith';

// utils
import {
  getAccountTransactionHistory,
  supportedChains,
} from '../utils/blockchain';

export interface ITransactionHistory {
  [chainId: number]: {
    [walletAddress: string]: ITransaction[];
  };
}

export interface AccountBalancesContext {
  listenerRef: React.MutableRefObject<AccountTransactionHistoryListenerRef>;
  data: {
    history: ITransactionHistory;
  }
}

export interface AccountTransactionHistoryListenerRef {
  onHistoryUpdated?: (chainId: number, walletAddress: string, transaction: ITransaction) => void;
  prevHistory?: ITransactionHistory;
}

export const AccountTransactionHistoryContext = createContext<AccountBalancesContext | null>(null);

const AccountTransactionHistoryProvider = ({ children }: React.PropsWithChildren) => {
  const walletAddress = useWalletAddress();
  const [history, setHistory] = React.useState<ITransactionHistory>({});
  const listenerRef = useRef<AccountTransactionHistoryListenerRef>({});

  useEffect(() => {
    let expired = false;
    let timeout: NodeJS.Timeout;

    const refresh = async () => {
      if (!walletAddress) return;

      const updatedHistory: ITransactionHistory = {};

      const chainIds = supportedChains
        .filter((chain) => process.env.REACT_APP_USE_TESTNETS === 'true' ? chain.testnet : !chain.testnet)
        .map((chain) => chain.id);

      // sequential to avoid throttling
      for (const chainId of chainIds) {
        if (expired) return;
        const accountHistory = await getAccountTransactionHistory(chainId, walletAddress);
        if (!updatedHistory[chainId]) updatedHistory[chainId] = {};
        updatedHistory[chainId][walletAddress] = accountHistory;
      }

      if (expired) return;

      // deep compare
      setHistory((current) => isEqual(current, updatedHistory) ? current : updatedHistory);

      timeout = setTimeout(refresh, 5000); // confirmed block time depending on chain is ~1-10s
    }

    refresh();

    return () => {
      expired = true;
      if (timeout) clearTimeout(timeout);
    }
  }, [walletAddress]);

  useEffect(() => {
    if (!Object.keys(history).length) return; // nothing added yet

    // only store for the initial run
    if (!Object.keys(listenerRef.current?.prevHistory ?? {}).length) {
      listenerRef.current.prevHistory = history;
      return;
    }

    if (listenerRef.current?.onHistoryUpdated) {
      Object.keys(history).forEach((chainId) => {
        Object.keys(history[+chainId] ?? {}).forEach((walletAddress) => {
          const updatedTransactions = differenceWith(
            history[+chainId][walletAddress],
            listenerRef.current.prevHistory?.[+chainId]?.[walletAddress] ?? [],
            isEqual,
          );
          updatedTransactions.forEach((transaction) => {
            listenerRef.current.onHistoryUpdated?.(+chainId, walletAddress, transaction);
          });
        });
      });
    }

    listenerRef.current.prevHistory = history;
  }, [history, listenerRef]);

  const contextData = useMemo(() => ({
    history,
  }), [
    history,
  ]);

  return (
    <AccountTransactionHistoryContext.Provider value={{ listenerRef, data: contextData }}>
      {children}
    </AccountTransactionHistoryContext.Provider>
  );
}

export default AccountTransactionHistoryProvider;

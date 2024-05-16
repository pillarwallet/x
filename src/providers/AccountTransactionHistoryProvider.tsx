import React, { createContext, useEffect, useMemo, useRef, useState } from 'react';
import { useEtherspotHistory, UserOpTransaction, useWalletAddress } from '@etherspot/transaction-kit';
import isEqual from 'lodash/isEqual';
import differenceWith from 'lodash/differenceWith';

// utils
import { visibleChains } from '../utils/blockchain';

// services
import { getJsonItem, setJsonItem, storageKey } from '../services/dappLocalStorage';

export interface TransactionHistory {
  [chainId: number]: {
    [walletAddress: string]: UserOpTransaction[];
  };
}

export interface AccountBalancesContext {
  listenerRef: React.MutableRefObject<AccountTransactionHistoryListenerRef>;
  data: {
    history: TransactionHistory;
    updateData: boolean;
    setUpdateData: React.Dispatch<React.SetStateAction<boolean>>;
  };
}

export interface AccountTransactionHistoryListenerRef {
  onHistoryUpdated?: (chainId: number, walletAddress: string, transaction: UserOpTransaction) => void;
  prevHistory?: TransactionHistory;
}

export const AccountTransactionHistoryContext = createContext<AccountBalancesContext | null>(null);

const AccountTransactionHistoryProvider = ({ children }: React.PropsWithChildren) => {
  const walletAddress = useWalletAddress();
  const [history, setHistory] = React.useState<TransactionHistory>(getJsonItem(storageKey.history) ?? {});
  const listenerRef = useRef<AccountTransactionHistoryListenerRef>({});
  const { getAccountTransactions } = useEtherspotHistory();
  const [updateData, setUpdateData] = useState<boolean>(false);

  useEffect(() => {
    let expired = false;
    let timeout: NodeJS.Timeout;

    const refresh = async () => {
      if (!walletAddress || !updateData) return;

      const chainIds = visibleChains.map((chain) => chain.id);

      // sequential to avoid throttling
      for (const chainId of chainIds) {
        if (expired) return;

        const accountHistory = await getAccountTransactions(walletAddress, chainId);
        if (expired) return;

        // update each chain ID separately for faster updates
        setHistory((current) => {
          // deep compare per chainId and walletAddress
          return !accountHistory?.length || isEqual(current?.[chainId]?.[walletAddress], accountHistory)
            ? current
            : { ...current, [chainId]: { ...current[chainId] ?? {}, [walletAddress]: accountHistory } };
        });
      }

      if (expired) return;

      timeout = setTimeout(refresh, 10000); // confirmed block time depending on chain is ~1-10s
    };

    refresh();

    return () => {
      expired = true;
      if (timeout) clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress, updateData]); // Added triggerUpdate to dependency array

  useEffect(() => {
    setJsonItem(storageKey.history, history);
  }, [history]);

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

  const contextData = useMemo(
    () => ({
      history,
      updateData,
      setUpdateData,
    }),
    [history, updateData]
  );

  return (
    <AccountTransactionHistoryContext.Provider value={{ listenerRef, data: contextData }}>
      {children}
    </AccountTransactionHistoryContext.Provider>
  );
};

export default AccountTransactionHistoryProvider;

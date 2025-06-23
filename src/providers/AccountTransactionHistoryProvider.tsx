/* eslint-disable no-restricted-syntax */
/* eslint-disable react/jsx-no-constructed-context-values */
import {
  UserOpTransaction,
  useEtherspotHistory,
  useWalletAddress,
} from '@etherspot/transaction-kit';
import differenceWith from 'lodash/differenceWith';
import isEqual from 'lodash/isEqual';
import React, {
  createContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

// utils
import { visibleChains } from '../utils/blockchain';

// services
import {
  getJsonItem,
  setJsonItem,
  storageKey,
} from '../services/dappLocalStorage';

export interface TransactionHistory {
  [chainId: number]: {
    [walletAddress: string]: UserOpTransaction[];
  };
}

export interface AccountHistoryContext {
  listenerRef: React.MutableRefObject<AccountTransactionHistoryListenerRef>;
  data: {
    history: TransactionHistory;
    updateData: boolean;
    setUpdateData: React.Dispatch<React.SetStateAction<boolean>>;
    userOpStatus: 'Sending' | 'Sent' | 'Confirmed' | 'Failed' | undefined;
    setUserOpStatus: React.Dispatch<
      React.SetStateAction<
        'Sending' | 'Sent' | 'Confirmed' | 'Failed' | undefined
      >
    >;
    transactionHash: string | undefined;
    setTransactionHash: React.Dispatch<
      React.SetStateAction<string | undefined>
    >;
    latestUserOpInfo: string | undefined;
    setLatestUserOpInfo: React.Dispatch<
      React.SetStateAction<string | undefined>
    >;
    latestUserOpChainId: number | undefined;
    setLatestUserOpChainId: React.Dispatch<
      React.SetStateAction<number | undefined>
    >;
  };
}

export interface AccountTransactionHistoryListenerRef {
  onHistoryUpdated?: (
    chainId: number,
    walletAddress: string,
    transaction: UserOpTransaction
  ) => void;
  prevHistory?: TransactionHistory;
}

export const AccountTransactionHistoryContext =
  createContext<AccountHistoryContext | null>(null);

const AccountTransactionHistoryProvider = ({
  children,
}: React.PropsWithChildren) => {
  const walletAddress = useWalletAddress();
  const [history, setHistory] = React.useState<TransactionHistory>(
    getJsonItem(storageKey.history) ?? {}
  );
  const listenerRef = useRef<AccountTransactionHistoryListenerRef>({});
  const { getAccountTransactions } = useEtherspotHistory();
  const [updateData, setUpdateData] = useState<boolean>(false);
  const [userOpStatus, setUserOpStatus] = useState<
    'Sending' | 'Sent' | 'Confirmed' | 'Failed' | undefined
  >(undefined);
  const [transactionHash, setTransactionHash] = useState<string | undefined>(
    undefined
  );
  const [latestUserOpInfo, setLatestUserOpInfo] = useState<string | undefined>(
    undefined
  );
  const [latestUserOpChainId, setLatestUserOpChainId] = useState<
    number | undefined
  >(undefined);

  useEffect(() => {
    let expired = false;
    let timeout: NodeJS.Timeout;

    const refresh = async () => {
      if (!walletAddress || !updateData) return;

      const chainIds = visibleChains.map((chain) => chain.id);

      // sequential to avoid throttling
      for (const chainId of chainIds) {
        if (expired) return;

        // eslint-disable-next-line no-await-in-loop
        const accountHistory = await getAccountTransactions(
          walletAddress,
          chainId
        );
        if (expired) return;

        // update each chain ID separately for faster updates
        setHistory((current) => {
          // deep compare per chainId and walletAddress
          return !accountHistory?.length ||
            isEqual(current?.[chainId]?.[walletAddress], accountHistory)
            ? current
            : {
                ...current,
                [chainId]: {
                  ...(current[chainId] ?? {}),
                  [walletAddress]: accountHistory,
                },
              };
        });
      }

      if (expired) return;

      timeout = setTimeout(refresh, 30000); // ~30s
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
        Object.keys(history[+chainId] ?? {}).forEach((address) => {
          const updatedTransactions = differenceWith(
            history[+chainId][address],
            listenerRef.current.prevHistory?.[+chainId]?.[address] ?? [],
            isEqual
          );
          updatedTransactions.forEach((transaction) => {
            listenerRef.current.onHistoryUpdated?.(
              +chainId,
              address,
              transaction
            );
          });
        });
      });
    }

    listenerRef.current.prevHistory = history;
  }, [history, listenerRef]);

  const contextData = useMemo(
    () => ({
      history,
      transactionHash,
      setTransactionHash,
      userOpStatus,
      setUserOpStatus,
      updateData,
      setUpdateData,
      latestUserOpInfo,
      setLatestUserOpInfo,
      latestUserOpChainId,
      setLatestUserOpChainId,
    }),
    [
      history,
      transactionHash,
      userOpStatus,
      updateData,
      latestUserOpInfo,
      latestUserOpChainId,
    ]
  );

  return (
    <AccountTransactionHistoryContext.Provider
      value={{ listenerRef, data: contextData }}
    >
      {children}
    </AccountTransactionHistoryContext.Provider>
  );
};

export default AccountTransactionHistoryProvider;

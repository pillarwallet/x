/* eslint-disable react/jsx-no-constructed-context-values */
import React, { createContext, useMemo } from 'react';

// hooks
import useTransactionKit from '../hooks/useTransactionKit';

// types
import { ITransaction } from '../types/blockchain';

export type IGlobalBatchTransaction = {
  title: string;
  description?: string;
  id?: string;
} & ITransaction;

export interface IGlobalTransactionsBatchContext {
  data: {
    walletConnectTxHash: string | undefined;
    setWalletConnectTxHash: React.Dispatch<
      React.SetStateAction<string | undefined>
    >;
    transactionMeta: Record<string, { title: string; description?: string }>;
    setTransactionMetaForName: (
      transactionName: string,
      meta: { title: string; description?: string }
    ) => void;
    batchCount: number;
    setBatchCount: React.Dispatch<React.SetStateAction<number>>;
  };
}

export const GlobalTransactionsBatchContext =
  createContext<IGlobalTransactionsBatchContext | null>(null);

const GlobalTransactionsBatchProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [walletConnectTxHash, setWalletConnectTxHash] = React.useState<
    string | undefined
  >(undefined);
  const [transactionMeta, setTransactionMeta] = React.useState<
    Record<string, { title: string; description?: string }>
  >({});
  const [batchCount, setBatchCount] = React.useState<number>(0);
  const setTransactionMetaForName = (
    transactionName: string,
    meta: { title: string; description?: string }
  ) => {
    if (!transactionName || !meta.title) {
      console.warn('Invalid transaction metadata: name and title are required');
      return;
    }
    setTransactionMeta((prev) => ({ ...prev, [transactionName]: meta }));
  };

  const { kit } = useTransactionKit();
  React.useEffect(() => {
    let mounted = true;
    const interval = setInterval(() => {
      if (!mounted) return;

      const { namedTransactions, batches } = kit.getState();

      setTransactionMeta((prev) => {
        // Skip if no changes needed
        const prevKeys = Object.keys(prev);
        const validNames = new Set(Object.keys(namedTransactions));
        const hasChanges = prevKeys.some((key) => !validNames.has(key));

        if (!hasChanges) return prev;

        return Object.fromEntries(
          Object.entries(prev).filter(([name]) => validNames.has(name))
        );
      });

      setBatchCount(Object.keys(batches).length);
    }, 1000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [kit]);

  const contextData = useMemo(
    () => ({
      walletConnectTxHash,
      setWalletConnectTxHash,
      transactionMeta,
      setTransactionMetaForName,
      batchCount,
      setBatchCount,
    }),
    [walletConnectTxHash, transactionMeta, batchCount]
  );

  return (
    <GlobalTransactionsBatchContext.Provider value={{ data: contextData }}>
      {children}
    </GlobalTransactionsBatchContext.Provider>
  );
};

export default GlobalTransactionsBatchProvider;

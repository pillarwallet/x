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
  const setTransactionMetaForName = (
    transactionName: string,
    meta: { title: string; description?: string }
  ) => {
    setTransactionMeta((prev) => ({ ...prev, [transactionName]: meta }));
  };

  const { kit } = useTransactionKit();
  React.useEffect(() => {
    const interval = setInterval(() => {
      const { namedTransactions } = kit.getState();
      setTransactionMeta((prev) => {
        const validNames = new Set(Object.keys(namedTransactions));
        return Object.fromEntries(
          Object.entries(prev).filter(([name]) => validNames.has(name))
        );
      });
    }, 1000); // check every second if some transactions have been added or removed
    return () => clearInterval(interval);
  }, [kit]);

  const contextData = useMemo(
    () => ({
      walletConnectTxHash,
      setWalletConnectTxHash,
      transactionMeta,
      setTransactionMetaForName,
    }),
    [walletConnectTxHash, transactionMeta]
  );

  return (
    <GlobalTransactionsBatchContext.Provider value={{ data: contextData }}>
      {children}
    </GlobalTransactionsBatchContext.Provider>
  );
};

export default GlobalTransactionsBatchProvider;

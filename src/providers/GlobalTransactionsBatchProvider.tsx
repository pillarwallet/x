/* eslint-disable react/jsx-no-constructed-context-values */
import React, { createContext, useMemo } from 'react';

// utils
import { getObjectHash } from '../utils/common';

// types
import { ITransaction } from '../types/blockchain';

export type IGlobalBatchTransaction = {
  title: string;
  description?: string;
  id?: string;
} & ITransaction;

export interface IGlobalTransactionsBatchContext {
  data: {
    transactions: IGlobalBatchTransaction[];
    addToBatch: (transaction: IGlobalBatchTransaction) => void;
    removeFromBatch: (transactionId: string) => void;
    walletConnectTxHash: string | undefined;
    setWalletConnectTxHash: React.Dispatch<
      React.SetStateAction<string | undefined>
    >;
  };
}

export const GlobalTransactionsBatchContext =
  createContext<IGlobalTransactionsBatchContext | null>(null);

const GlobalTransactionsBatchProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [transactions, setBatches] = React.useState<IGlobalBatchTransaction[]>(
    []
  );
  const [walletConnectTxHash, setWalletConnectTxHash] = React.useState<
    string | undefined
  >(undefined);

  const addToBatch = (transaction: IGlobalBatchTransaction) => {
    setBatches((prev) =>
      prev.concat({
        ...transaction,
        id:
          transaction.id ||
          getObjectHash(transaction, +new Date() + Math.random()),
      })
    );
  };

  const removeFromBatch = (transactionId: string) => {
    setBatches((prev) => prev.filter((tx) => tx.id !== transactionId));
  };

  const contextData = useMemo(
    () => ({
      transactions,
      walletConnectTxHash,
      setWalletConnectTxHash,
      addToBatch,
      removeFromBatch,
    }),
    [transactions, walletConnectTxHash]
  );

  return (
    <GlobalTransactionsBatchContext.Provider value={{ data: contextData }}>
      {children}
    </GlobalTransactionsBatchContext.Provider>
  );
};

export default GlobalTransactionsBatchProvider;

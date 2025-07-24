/* eslint-disable no-restricted-syntax */
/* eslint-disable react/jsx-no-constructed-context-values */
import React, { createContext, useMemo, useState } from 'react';

export interface AccountHistoryContext {
  data: {
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

export const AccountTransactionHistoryContext =
  createContext<AccountHistoryContext | null>(null);

const AccountTransactionHistoryProvider = ({
  children,
}: React.PropsWithChildren) => {
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

  const contextData = useMemo(
    () => ({
      transactionHash,
      setTransactionHash,
      userOpStatus,
      setUserOpStatus,
      latestUserOpInfo,
      setLatestUserOpInfo,
      latestUserOpChainId,
      setLatestUserOpChainId,
    }),
    [transactionHash, userOpStatus, latestUserOpInfo, latestUserOpChainId]
  );

  return (
    <AccountTransactionHistoryContext.Provider value={{ data: contextData }}>
      {children}
    </AccountTransactionHistoryContext.Provider>
  );
};

export default AccountTransactionHistoryProvider;

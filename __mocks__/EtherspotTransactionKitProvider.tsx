/* eslint-disable react/jsx-no-constructed-context-values */
import React, { createContext } from 'react';

// Mock context type that matches the real implementation
export interface EtherspotTransactionKitContextType {
  data: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    kit: any; // Mock kit object
    walletAddress: string | undefined;
    activeChainId: number | undefined;
    setActiveChainId: React.Dispatch<React.SetStateAction<number | undefined>>;
  };
}

export const EtherspotTransactionKitContext =
  createContext<EtherspotTransactionKitContextType | null>({
    data: {
      kit: {
        // Mock kit methods, can add more as needed for the tests
        getWalletAddress: () => Promise.resolve('0xMockWalletAddress'),
      },
      walletAddress: '0xMockWalletAddress',
      activeChainId: 1,
      setActiveChainId: () => {},
    },
  });

export const EtherspotTransactionKitProvider: React.FC<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, react/no-unused-prop-types
  config: any;
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <EtherspotTransactionKitContext.Provider
      value={{
        data: {
          kit: {
            getWalletAddress: () => Promise.resolve('0xMockWalletAddress'),
          },
          walletAddress: '0xMockWalletAddress',
          activeChainId: 1,
          setActiveChainId: () => {},
        },
      }}
    >
      {children}
    </EtherspotTransactionKitContext.Provider>
  );
};

/* eslint-disable react/jsx-no-constructed-context-values */
import {
  EtherspotTransactionKit,
  EtherspotTransactionKitConfig,
} from '@etherspot/transaction-kit';
import React, { createContext, useEffect, useMemo, useState } from 'react';

export interface EtherspotTransactionKitContextType {
  data: {
    kit: EtherspotTransactionKit;
    walletAddress: string | undefined;
    activeChainId: number | undefined;
    setActiveChainId: React.Dispatch<React.SetStateAction<number | undefined>>;
  };
}

export const EtherspotTransactionKitContext =
  createContext<EtherspotTransactionKitContextType | null>(null);

interface EtherspotTransactionKitProviderProps {
  config: EtherspotTransactionKitConfig;
  children: React.ReactNode;
}

export const EtherspotTransactionKitProvider: React.FC<
  EtherspotTransactionKitProviderProps
> = ({ config, children }) => {
  const [activeChainId, setActiveChainId] = useState<number | undefined>(
    config.chainId
  );
  const [walletAddress, setWalletAddress] = useState<string>();

  // If activeChainId is provided, override the chainId in config
  // Setting an activeChainId will allow the kit to use the correct chain for single transaction management
  // For batches management, the chainId will be set based on the transactions being added to the batch
  const kitConfig = useMemo(
    () => ({
      ...config,
      chainId: activeChainId ?? config.chainId,
    }),
    [config, activeChainId]
  );
  const kit = useMemo(
    () => new EtherspotTransactionKit(kitConfig),
    [kitConfig]
  );

  useEffect(() => {
    const init = async () => {
      const address = await kit.getWalletAddress();
      if (address) setWalletAddress(address);
    };
    init();
  }, [kit]);

  const contextData = useMemo(
    () => ({
      walletAddress,
      setWalletAddress,
      kit,
      activeChainId,
      setActiveChainId,
    }),
    [walletAddress, kit, activeChainId]
  );

  return (
    <EtherspotTransactionKitContext.Provider value={{ data: contextData }}>
      {children}
    </EtherspotTransactionKitContext.Provider>
  );
};

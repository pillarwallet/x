/* eslint-disable react/jsx-no-constructed-context-values */
import {
  EtherspotTransactionKit,
  EtherspotTransactionKitConfig,
} from '@etherspot/transaction-kit';

import React, {
  createContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import type { WalletProviderLike } from '../types/walletProvider';

export interface EtherspotTransactionKitContextType {
  data: {
    kit: EtherspotTransactionKit;
    walletAddress: string | undefined;
    setWalletAddress: React.Dispatch<React.SetStateAction<string | undefined>>;
    walletProvider: WalletProviderLike | undefined;
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
  const [walletAddress, setWalletAddress] = useState<string>();
  const kitRef = useRef<EtherspotTransactionKit | null>(null);
  const [externalProvider, setExternalProvider] = useState<
    WalletProviderLike | undefined
  >(() =>
    'provider' in config
      ? (config as { provider?: WalletProviderLike }).provider
      : undefined
  );

  // Create kit with config
  const kit = useMemo(() => {
    const newKit = new EtherspotTransactionKit(config);
    kitRef.current = newKit;
    return newKit;
  }, [config]);

  // Get wallet address when kit changes
  useEffect(() => {
    const getWalletAddress = async () => {
      if (kit) {
        try {
          const address = await kit.getWalletAddress();
          setWalletAddress(address);
        } catch (error) {
          console.error('Failed to get wallet address:', error);
        }
      }
    };

    getWalletAddress();
  }, [kit]);

  useEffect(() => {
    setExternalProvider(
      'provider' in config
        ? (config as { provider?: WalletProviderLike }).provider
        : undefined
    );
  }, [config]);

  const contextData = useMemo(
    () => ({
      walletAddress,
      setWalletAddress,
      kit,
      walletProvider: externalProvider,
    }),
    [walletAddress, kit, externalProvider]
  );

  return (
    <EtherspotTransactionKitContext.Provider value={{ data: contextData }}>
      {children}
    </EtherspotTransactionKitContext.Provider>
  );
};

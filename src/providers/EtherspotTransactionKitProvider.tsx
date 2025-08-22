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

export interface EtherspotTransactionKitContextType {
  data: {
    kit: EtherspotTransactionKit;
    walletAddress: string | undefined;
    setWalletAddress: React.Dispatch<React.SetStateAction<string | undefined>>;
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

  const contextData = useMemo(
    () => ({
      walletAddress,
      setWalletAddress,
      kit,
    }),
    [walletAddress, kit]
  );

  return (
    <EtherspotTransactionKitContext.Provider value={{ data: contextData }}>
      {children}
    </EtherspotTransactionKitContext.Provider>
  );
};

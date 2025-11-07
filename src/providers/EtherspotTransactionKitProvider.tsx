/* eslint-disable react/jsx-no-constructed-context-values */
import {
  EtherspotTransactionKit,
  EtherspotTransactionKitConfig,
} from '@etherspot/transaction-kit';
import {useSignMessage, useWallets} from '@privy-io/react-auth';

import React, {
  createContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  setRequestSignature,
  clearRequestSignature,
} from '../services/requestSignature';

type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<string>;
};

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
  const {signMessage} = useSignMessage();
  const {wallets} = useWallets();

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

  // Initialise request signing using the connected wallet
  useEffect(() => {
    if (!kit) return undefined;

    const setSigner = () => {
      const signer = async (message: string): Promise<string> => {
        console.log('🔐 SIGNING with Etherspot SDK signMessage');
        
        try {
          // Use Etherspot SDK's signMessage method
          const eSdk = await kit.getSdk?.(1);
          if (!eSdk?.signMessage) {
            throw new Error('Etherspot SDK signMessage not available');
          }
          
          // const sig = await eSdk.signMessage({ message });
          const uiOptions = {
            title: 'You are voting for foobar project'
          };
          
          const {signature: sig} = await signMessage(
            {message: message},
            {
              uiOptions,
              address: wallets[0].address
            }
          );
          console.log('🔐 Etherspot SDK signature:', sig);
          return sig;
        } catch (e) {
          console.error('🔐 Etherspot SDK signing failed:', e);
          throw new Error('Failed to sign message with Etherspot SDK');
        }
      };

      setRequestSignature(signer, () => walletAddress);
    };

    setSigner();

    return () => {
      clearRequestSignature();
    };
  }, [kit, walletAddress]);

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

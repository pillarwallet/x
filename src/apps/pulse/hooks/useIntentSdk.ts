import { IntentSdk, Options } from '@etherspot/intent-sdk';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useCallback, useEffect, useState } from 'react';
import { Hex, createWalletClient, custom } from 'viem';
import { useAccount, useConnect } from 'wagmi';

// hooks
import useTransactionKit from '../../../hooks/useTransactionKit';

export default function useIntentSdk() {
  const { walletAddress: accountAddress } = useTransactionKit();
  const { ready, authenticated, user } = usePrivy();
  const { wallets } = useWallets();
  const { isConnected: isWagmiConnected } = useAccount();
  const { connectors } = useConnect();

  const privyWalletAddress = user?.wallet?.address;

  const walletProvider = wallets.find(
    (wallet) => wallet.address === privyWalletAddress
  );
  const [intentSdk, setIntentSdk] = useState<IntentSdk | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeSdk = async () => {
      if (!accountAddress) return;

      const options: Options = {
        bundlerApiKey: import.meta.env.VITE_ETHERSPOT_BUNDLER_API_KEY || '',
        modularAccount: accountAddress as Hex,
      };

      try {
        // 1: Check if connected via Privy wallet
        if (ready && authenticated && walletProvider) {
          const provider = await walletProvider.getEthereumProvider();
          const walletClient = createWalletClient({
            account: walletProvider.address as Hex,
            transport: custom(provider),
          });
          /* eslint-disable @typescript-eslint/no-explicit-any */
          const sdk = new IntentSdk(walletClient as any, options);
          setIntentSdk(sdk);
          setError(null);
          return;
        }

        // 2: Check if connected via WalletConnect (only if no Privy wallet)
        const hasWallets = walletProvider !== undefined;
        if (isWagmiConnected && !hasWallets) {
          const walletConnectConnector = connectors.find(
            ({ id }) => id === 'walletConnect'
          );

          if (walletConnectConnector) {
            const wcProvider: any = await walletConnectConnector.getProvider();

            // Only proceed if the provider is actually connected
            if (
              wcProvider &&
              wcProvider.connected &&
              wcProvider.accounts &&
              wcProvider.accounts.length > 0
            ) {
              // Get the connected account
              const accounts = await wcProvider.request({
                method: 'eth_accounts',
              });
              const wcAccount = accounts[0];

              if (wcAccount) {
                const walletClient = createWalletClient({
                  account: wcAccount as Hex,
                  transport: custom(wcProvider),
                });
                const sdk = new IntentSdk(walletClient as any, options);
                setIntentSdk(sdk);
                setError(null);
              }
            }
          }
        }
      } catch (err) {
        console.error('Failed to initialize Intent SDK:', err);
        setError('Failed to initialize Intent SDK. Please try again.');
      }
    };

    initializeSdk();
  }, [
    accountAddress,
    ready,
    authenticated,
    walletProvider,
    isWagmiConnected,
    connectors,
  ]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { intentSdk, error, clearError };
}

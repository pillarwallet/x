import { IntentSdk, Options } from '@etherspot/intent-sdk';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useCallback, useEffect, useState } from 'react';
import { Hex, createWalletClient, custom } from 'viem';
import { useAccount, useConnect } from 'wagmi';

// hooks
import useTransactionKit from '../../../hooks/useTransactionKit';
import { useTransactionDebugLogger } from '../../../hooks/useTransactionDebugLogger';

// types
import { PayingToken } from '../types/tokens';

interface IntentProps {
  payingTokens: PayingToken[];
}

interface Transactions {
  action: string;
  calldata: string;
  target: string;
}

export default function useIntentSdk(props: IntentProps) {
  const { payingTokens } = props;
  const { walletAddress: accountAddress, kit } = useTransactionKit();
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
  const [areModulesInstalled, setAreModulesInstalled] =
    useState<boolean>(false);
  const [isInstalling, setIsInstalling] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const { transactionDebugLog } = useTransactionDebugLogger();

  const sendTransactions = async (
    transactions: Transactions[],
    chainId: number
  ) => {
    try {
      let txnHash;
      const batchName = 'pulse-install-modules';
      for (let i = 0; i < transactions.length; i += 1) {
        kit
          .transaction({
            to: transactions[i].target,
            data: transactions[i].calldata,
            chainId,
          })
          .name({ transactionName: transactions[i].action })
          .addToBatch({ batchName });
      }
      const response = await kit.sendBatches({ onlyBatchNames: [batchName] });
      const userOpHash =
        response.batches[batchName].chainGroups?.[chainId]?.userOpHash ?? '';
      if (userOpHash) {
        txnHash = await kit.getTransactionHash(userOpHash, chainId);
        transactionDebugLog('Install modules txn hash: ', txnHash);
      }
      return true;
    } catch (err) {
      console.error('err on sending Install modules: ', err);
      return false;
    }
  };

  useEffect(() => {
    const initializeSdk = async () => {
      if (!accountAddress) return;

      const options: Options = {
        bundlerApiKey: import.meta.env.VITE_ETHERSPOT_BUNDLER_API_KEY || '',
        modularAccount: accountAddress as Hex,
        pulseNodeUrl: import.meta.env.VITE_PULSE_NODE_URL || '',
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

  useEffect(() => {
    if (
      !areModulesInstalled &&
      intentSdk &&
      payingTokens &&
      payingTokens.length > 0
    ) {
      const { chainId } = payingTokens[0];
      setIsFetching(true);
      intentSdk
        .isWalletReadyForPulse(chainId)
        .then((res) => {
          transactionDebugLog('Pulse wallet modules installed: ', res);
          if (res) {
            setAreModulesInstalled(true);
          } else {
            setAreModulesInstalled(false);
          }
          setIsFetching(false);
        })
        .catch((err) => {
          console.error('Error on checking the pulse wallet: ', err);
          setIsFetching(false);
          setAreModulesInstalled(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intentSdk, payingTokens, areModulesInstalled]);

  const installModules = async () => {
    if (!payingTokens?.length || !intentSdk) return;
    const { chainId } = payingTokens[0];
    setIsInstalling(true);
    try {
      const res: Transactions[] = await intentSdk.enablePulseTrading(chainId);
      transactionDebugLog('Enable pulse trading transactions: ', res);
      const ok = await sendTransactions(res, chainId);
      transactionDebugLog('Pulse trading modules installed: ', ok);
      setAreModulesInstalled(ok);
    } catch (err) {
      console.error('Pulse trading - Installation failed:: ', err);
      setAreModulesInstalled(false);
    } finally {
      setIsInstalling(false);
    }
  };

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    intentSdk,
    error,
    clearError,
    installModules,
    areModulesInstalled,
    isInstalling,
    isFetching,
  };
}

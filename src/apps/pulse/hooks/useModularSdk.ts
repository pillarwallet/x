import { Networks } from '@etherspot/intent-sdk';
import {
  EtherspotBundler,
  ModularSdk,
  SdkOptions,
} from '@etherspot/modular-sdk';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useEffect, useState } from 'react';
import { Hex, createWalletClient, custom } from 'viem';
import { useAccount, useConnect } from 'wagmi';
import { PayingToken } from '../types/tokens';
import { sleep } from '../utils/sleep';

interface ModularSdkProps {
  payingTokens: PayingToken[];
}

export default function useModularSdk(props: ModularSdkProps) {
  const { payingTokens } = props;
  const { ready, authenticated, user } = usePrivy();
  const { wallets } = useWallets();
  const { isConnected: isWagmiConnected } = useAccount();
  const { connectors } = useConnect();

  const privyWalletAddress = user?.wallet?.address;

  const walletProvider = wallets.find(
    (wallet) => wallet.address === privyWalletAddress
  );
  const [modularSdk, setModularSdk] = useState<ModularSdk | null>(null);
  const [areModulesInstalled, setAreModulesInstalled] = useState<boolean>();
  const [isInstalling, setIsInstalling] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const waitForReceipt = async (userOpHash: string) => {
    let userOpsReceipt = null;
    const timeout = Date.now() + 300000; // wait for 5 mins
    while (userOpsReceipt == null && Date.now() < timeout) {
      // eslint-disable-next-line no-await-in-loop
      userOpsReceipt = await modularSdk?.getUserOpReceipt(userOpHash);
      // eslint-disable-next-line no-await-in-loop
      await sleep(2);
    }
    return userOpsReceipt;
  };

  useEffect(() => {
    const initializeSdk = async () => {
      if (payingTokens.length === 0) return;

      const { chainId } = payingTokens[0];
      const options: SdkOptions = {
        chainId: payingTokens[0].chainId,
        bundlerProvider: new EtherspotBundler(
          chainId,
          import.meta.env.VITE_ETHERSPOT_BUNDLER_API_KEY || ''
        ),
      };

      try {
        // 1: Check if connected via Privy wallet
        if (ready && authenticated && walletProvider) {
          const provider = await walletProvider.getEthereumProvider();
          const walletClient = createWalletClient({
            account: walletProvider.address as Hex,
            transport: custom(provider),
          });
          const sdk = new ModularSdk(walletClient, options);
          setModularSdk(sdk);
          return;
        }

        // 2: Check if connected via WalletConnect (only if no Privy wallet)
        const hasWallets = walletProvider !== undefined;
        if (isWagmiConnected && !hasWallets) {
          const walletConnectConnector = connectors.find(
            ({ id }) => id === 'walletConnect'
          );

          if (walletConnectConnector) {
            /* eslint-disable @typescript-eslint/no-explicit-any */
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
                const sdk = new ModularSdk(walletClient, options);
                setModularSdk(sdk);
              }
            }
          }
        }
      } catch (err) {
        console.error('Failed to initialize Modular SDK:', err);
        setModularSdk(null);
      }
    };

    initializeSdk();
  }, [
    ready,
    authenticated,
    walletProvider,
    payingTokens,
    isWagmiConnected,
    connectors,
  ]);

  useEffect(() => {
    if (!areModulesInstalled && modularSdk && payingTokens.length > 0) {
      const { chainId } = payingTokens[0];
      setIsFetching(true);
      modularSdk.pulse
        .isPulseModulesInstalled({
          credibleAccountModuleAddress:
            Networks[chainId].contracts.credibleAccountModule,
          resourceLockValidatorAddress:
            Networks[chainId].contracts.resourceLockValidator,
        })
        .then((res) => {
          if (
            res.credibleAccountValidator &&
            res.hookMultiPlexer &&
            res.resourceLockValidator
          ) {
            setAreModulesInstalled(true);
          } else {
            setAreModulesInstalled(false);
          }
          setIsFetching(false);
        })
        .catch((err) => {
          console.error('err:: ', err);
          setIsFetching(false);
          setAreModulesInstalled(false);
        });
    }
  }, [modularSdk, payingTokens, areModulesInstalled]);

  const installModules = async () => {
    const { chainId } = payingTokens[0];
    setIsInstalling(true);
    modularSdk?.pulse
      .installPulseModules({
        credibleAccountModuleAddress:
          Networks[chainId].contracts.credibleAccountModule,
        resourceLockValidatorAddress:
          Networks[chainId].contracts.resourceLockValidator,
      })
      .then((userOpHash) => {
        waitForReceipt(userOpHash)
          .then(() => {
            setIsInstalling(false);
            setAreModulesInstalled(true);
          })
          .catch((err) => {
            console.error('err:: ', err);
            setIsInstalling(false);
          });
      })
      .catch((err) => {
        console.error('Installation failed:: ', err);
        setIsInstalling(false);
      });
  };

  return {
    modularSdk,
    areModulesInstalled,
    isInstalling,
    installModules,
    isFetching,
  };
}

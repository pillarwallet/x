import {
  EtherspotBundler,
  ModularSdk,
  SdkOptions,
} from '@etherspot/modular-sdk';
import { useEffect, useState } from 'react';
import { createWalletClient, custom, Hex } from 'viem';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { Networks } from '@etherspot/intent-sdk';
import { PayingToken } from '../types/tokens';
import { sleep } from '../utils/sleep';

interface ModularSdkProps {
  payingTokens: PayingToken[];
}

export default function useModularSdk(props: ModularSdkProps) {
  const { payingTokens } = props;
  const { ready, authenticated, user } = usePrivy();
  const { wallets } = useWallets();

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
    if (ready && authenticated && walletProvider && payingTokens.length > 0) {
      const { chainId } = payingTokens[0];
      const options: SdkOptions = {
        chainId: payingTokens[0].chainId,
        bundlerProvider: new EtherspotBundler(
          chainId,
          process.env.REACT_APP_ETHERSPOT_BUNDLER_API_KEY || ''
        ),
      };

      walletProvider.getEthereumProvider().then((provider) => {
        const walletClient = createWalletClient({
          account: walletProvider.address as Hex,
          transport: custom(provider),
        });
        const sdk = new ModularSdk(walletClient, options);
        setModularSdk(sdk);
      });
    }
  }, [ready, authenticated, walletProvider, payingTokens]);

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
          }
          setIsFetching(false);
        })
        .catch((err) => {
          console.error('err:: ', err);
          setIsFetching(false);
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
          });
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

import { IntentSdk, Options } from '@etherspot/intent-sdk';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useEffect, useState } from 'react';
import { Hex, createWalletClient, custom } from 'viem';

// hooks
import useTransactionKit from '../../../hooks/useTransactionKit';

export default function useIntentSdk() {
  const { walletAddress: accountAddress } = useTransactionKit();
  const { ready, authenticated, user } = usePrivy();
  const { wallets } = useWallets();

  const privyWalletAddress = user?.wallet?.address;

  const walletProvider = wallets.find(
    (wallet) => wallet.address === privyWalletAddress
  );
  const [intentSdk, setIntentSdk] = useState<IntentSdk | null>(null);

  useEffect(() => {
    if (accountAddress && ready && authenticated && walletProvider) {
      const options: Options = {
        bundlerApiKey: import.meta.env.VITE_ETHERSPOT_BUNDLER_API_KEY || '',
        modularAccount: accountAddress as Hex,
      };

      walletProvider.getEthereumProvider().then((provider) => {
        const walletClient = createWalletClient({
          account: walletProvider.address as Hex,
          transport: custom(provider),
        });
        /* eslint-disable @typescript-eslint/no-explicit-any */
        const sdk = new IntentSdk(walletClient as any, options);
        setIntentSdk(sdk);
      });
    }
  }, [accountAddress, ready, authenticated, walletProvider]);

  return { intentSdk };
}

import {
  MAINNET_RELAY_API,
  RelayClient,
  convertViemChainToRelayChain,
  createClient,
} from '@relayprotocol/relay-sdk';
import { useEffect, useState } from 'react';
import {
  arbitrum,
  base,
  bsc,
  gnosis,
  mainnet,
  optimism,
  polygon,
} from 'viem/chains';

// hooks
import useTransactionKit from '../../../hooks/useTransactionKit';

export default function useRelaySdk() {
  const { walletAddress: accountAddress } = useTransactionKit();
  const [relayClient, setRelayClient] = useState<RelayClient | undefined>(
    undefined
  );
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (accountAddress) {
      try {
        const client = createClient({
          baseApiUrl: MAINNET_RELAY_API,
          source: 'pillarx-pulse',
          chains: [
            convertViemChainToRelayChain(mainnet),
            convertViemChainToRelayChain(polygon),
            convertViemChainToRelayChain(base),
            convertViemChainToRelayChain(arbitrum),
            convertViemChainToRelayChain(optimism),
            convertViemChainToRelayChain(bsc),
            convertViemChainToRelayChain(gnosis),
          ],
        });

        setRelayClient(client);
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize Relay SDK:', error);
        setIsInitialized(false);
      }
    } else {
      // Reset state when account disconnects
      setRelayClient(undefined);
      setIsInitialized(false);
    }
  }, [accountAddress]);

  return {
    relayClient,
    isInitialized,
    accountAddress,
  };
}

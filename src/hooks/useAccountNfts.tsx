import { useContext } from 'react';
import { Nft } from '@etherspot/prime-sdk';

// providers
import { AccountNftsContext } from '../providers/AccountNftsProvider';

const useAccountNfts = (params?: {
  onReceived?: (chainId: number, walletAddress: string, nft: Nft) => void
  onSent?: (chainId: number, walletAddress: string, nft: Nft) => void
}) => {
  const context = useContext(AccountNftsContext);

  if (context === null) {
    throw new Error('No parent <AccountNftsProvider />');
  }

  if (params?.onSent) {
    context.listenerRef.current.onNftSent = params.onSent;
  }

  if (params?.onReceived) {
    context.listenerRef.current.onNftReceived = params.onReceived;
  }

  return context.data.nfts;
};

export default useAccountNfts;

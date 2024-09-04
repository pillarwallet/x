import {
  BridgingProvider,
  TokenListToken,
} from '@etherspot/prime-sdk/dist/sdk/data';
import { useEtherspotAssets } from '@etherspot/transaction-kit';

// hooks
import useAssets from '../../../hooks/useAssets';

type PillarSwapToken = {
  address: string;
  name: string;
  symbol: string;
  chainId: number;
  decimals: number;
  icon: string;
};

const usePillarSwapAssets = (chainId?: number) => {
  const { getSupportedAssets } = useEtherspotAssets(chainId);
  const assets = useAssets();

  const getPillarSwapAssets = async (
    assetChainId?: number,
    bridgingProvider?: BridgingProvider
  ): Promise<PillarSwapToken[]> => {
    let pillarSwapAssets: PillarSwapToken[] = [];
    try {
      // TO DO - add supported Assets when ready
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const supportedAssets = await getSupportedAssets(
        assetChainId,
        bridgingProvider
      );
      const nativeAssets = Object.values(assets).flat() as TokenListToken[];

      const mappedAssets = nativeAssets.map((asset) => ({
        address: asset.address,
        name: asset.name,
        symbol: asset.symbol,
        chainId: asset.chainId,
        decimals: asset.decimals,
        icon: asset.logoURI,
      }));

      // TO DO - add supported Assets when ready
      // const mappedSupportedAssets = supportedAssets.map(asset => ({
      //   address: asset.address,
      //   name: asset.name,
      //   symbol: asset.symbol,
      //   chainId: asset.chainId,
      //   decimals: asset.decimals,
      //   icon: asset.icon,
      // }));

      pillarSwapAssets = [...mappedAssets];
    } catch (e) {
      console.error(
        `Sorry, an error occurred when trying to fetch all supported tokens: ${e}`
      );
    }

    return pillarSwapAssets;
  };

  return {
    getPillarSwapAssets,
  };
};

export default usePillarSwapAssets;

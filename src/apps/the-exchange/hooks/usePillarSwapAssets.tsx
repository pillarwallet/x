import { BridgingProvider } from '@etherspot/data-utils/dist/cjs/sdk/data/constants';
import { useEtherspotAssets } from '@etherspot/transaction-kit';
import {
  Token,
  chainIdToChainNameTokensData,
  queryTokenData,
} from '../../../services/tokensData';

// hooks

const usePillarSwapAssets = (chainId?: number) => {
  const { getSupportedAssets } = useEtherspotAssets(chainId);

  const assets = queryTokenData({
    blockchain: chainIdToChainNameTokensData(chainId),
  });

  const getPillarSwapAssets = async (
    assetChainId?: number,
    bridgingProvider?: BridgingProvider
  ): Promise<Token[]> => {
    let pillarSwapAssets: Token[] = [];
    try {
      // TO DO - add supported Assets when ready
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const supportedAssets = await getSupportedAssets(
        assetChainId,
        bridgingProvider
      );
      const nativeAssets = Object.values(assets).flat();

      const mappedAssets = nativeAssets.map((asset) => ({
        id: asset.id,
        name: asset.name,
        symbol: asset.symbol,
        logo: asset.logo,
        blockchain: asset.blockchain,
        contract: asset.contract,
        decimals: asset.decimals,
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

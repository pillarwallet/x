import React, { createContext, useEffect, useMemo } from 'react';
import { useEtherspotAssets } from '@etherspot/transaction-kit';
import { TokenListToken } from '@etherspot/prime-sdk';
import { sepolia } from 'viem/chains';
import isEqual from 'lodash/isEqual';

// utils
import { usdcOnSepolia, getNativeAssetForChainId, visibleChains } from '../utils/blockchain';

export interface IAssets {
  [chainId: number]: TokenListToken[];
}

export interface AssetsContext {
  data: {
    assets: IAssets;
  }
}

export const AssetsContext = createContext<AssetsContext | null>(null);

const AssetsProvider = ({ children }: React.PropsWithChildren) => {
  const { getAssets } = useEtherspotAssets();
  const [assets, setAssets] = React.useState<IAssets>({});

  useEffect(() => {
    let expired = false;

    const refresh = async () => {
      const chainIds = visibleChains.map((chain) => chain.id);

      const updatedAssets: IAssets = {};

      // sequential to avoid throttling
      for (const chainId of chainIds) {
        if (expired) return;

        let chainAssets = (await getAssets(chainId)) ?? [];

        const nativeAsset = getNativeAssetForChainId(chainId);
        if (nativeAsset) {
          chainAssets = [nativeAsset, ...chainAssets];
        }

        // TODO: remove once Sepolia is available on Prime SDK
        if (chainId === sepolia.id) {
          chainAssets = [...chainAssets, usdcOnSepolia];
        }

        updatedAssets[chainId] = chainAssets;
      }

      if (expired) return;

      setAssets((current) => isEqual(current, updatedAssets) ? current : updatedAssets);
    }

    refresh();

    return () => {
      expired = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const contextData = useMemo(() => ({
    assets,
  }), [
    assets,
  ]);

  return (
    <AssetsContext.Provider value={{ data: contextData }}>
      {children}
    </AssetsContext.Provider>
  );
}

export default AssetsProvider;

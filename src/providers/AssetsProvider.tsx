/* eslint-disable no-restricted-syntax */
/* eslint-disable react/jsx-no-constructed-context-values */
import { TokenListToken } from '@etherspot/data-utils/dist/cjs/sdk/data/classes/token-list-token';
import { useEtherspotAssets } from '@etherspot/transaction-kit';
import isEqual from 'lodash/isEqual';
import React, { createContext, useEffect, useMemo } from 'react';

// utils
import {
  WRAPPED_POL_TOKEN_ADDRESS,
  getNativeAssetForChainId,
  visibleChains,
} from '../utils/blockchain';

export interface IAssets {
  [chainId: number]: TokenListToken[];
}

export interface AssetsContextProps {
  data: {
    assets: IAssets;
  };
}

export const AssetsContext = createContext<AssetsContextProps | null>(null);

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

        // eslint-disable-next-line no-await-in-loop
        let chainAssets = (await getAssets(chainId)) ?? [];

        // Check if Wrapped POL as native asset
        if (chainId === 137) {
          chainAssets = chainAssets.map((token) => {
            if (token.address === WRAPPED_POL_TOKEN_ADDRESS) {
              return {
                ...token,
                name: 'Wrapped POL (as POL)',
                symbol: 'WPOL',
                decimals: 18,
              };
            }
            return token;
          });
        }

        const nativeAsset = getNativeAssetForChainId(chainId);
        if (nativeAsset) {
          chainAssets = [nativeAsset, ...chainAssets];
        }

        updatedAssets[chainId] = chainAssets;
      }

      if (expired) return;

      setAssets((current) =>
        isEqual(current, updatedAssets) ? current : updatedAssets
      );
    };

    refresh();

    return () => {
      expired = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const contextData = useMemo(
    () => ({
      assets,
    }),
    [assets]
  );

  return (
    <AssetsContext.Provider value={{ data: contextData }}>
      {children}
    </AssetsContext.Provider>
  );
};

export default AssetsProvider;

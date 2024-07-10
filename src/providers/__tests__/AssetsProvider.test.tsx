import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { avalanche, bsc, gnosis, mainnet, polygon } from 'viem/chains';
import * as TransactionKit from '@etherspot/transaction-kit';

// providers
import AssetsProvider, { AssetsContext } from '../../providers/AssetsProvider';

// utils
import { etherspotTestAssets, etherspotTestSupportedAssets } from '../../test-utils/setupJest';
import { getNativeAssetForChainId } from '../../utils/blockchain';

describe('AssetsProvider', () => {
  let wrapper: React.FC;

  beforeEach(() => {
    wrapper = ({ children }: React.PropsWithChildren) => (
      <AssetsProvider>
        {children}
      </AssetsProvider>
    );

    jest.spyOn(TransactionKit, 'useEtherspotAssets').mockReturnValue(({
      getAssets: async (chainId?: number) => chainId === 1 ? etherspotTestAssets: [],
      getSupportedAssets: async (chainId?: number) => etherspotTestSupportedAssets.filter((asset) => asset.chainId === chainId),
    }));
  });

  it('initializes with no assets', () => {
    const { result } = renderHook(() => React.useContext(AssetsContext), { wrapper });
    expect(result.current?.data.assets).toEqual({});
  });

  it('updates assets', async () => {
    const { result } = renderHook(() => React.useContext(AssetsContext), { wrapper });

    await waitFor(async () => {
      expect(result.current?.data.assets).toEqual({
        [mainnet.id]: [getNativeAssetForChainId(mainnet.id), ...etherspotTestAssets],
        [polygon.id]: [getNativeAssetForChainId(polygon.id)],
        [gnosis.id]: [getNativeAssetForChainId(gnosis.id)],
        [avalanche.id]: [getNativeAssetForChainId(avalanche.id)],
        [bsc.id]: [getNativeAssetForChainId(bsc.id)],
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});

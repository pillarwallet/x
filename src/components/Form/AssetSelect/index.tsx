import { useEffect, useState } from 'react';
import { TokenListToken } from '@etherspot/prime-sdk';
import { ethers } from 'ethers';
import {
  useEtherspot,
  useEtherspotAssets,
  useEtherspotBalances,
  useEtherspotUtils,
  useWalletAddress
} from '@etherspot/transaction-kit';

// components
import Select, { SelectOption } from '../Select';

// utils
import { formatAmountDisplay } from '../../../utils/number';
import { nativeAssetPerChainId } from '../../../utils/blockchain';

export interface AssetSelectOption extends SelectOption {
  asset: TokenListToken;
  balance?: number;
}

const AssetSelect = ({ defaultSelectedId, onChange }: {
  defaultSelectedId?: string,
  onChange: (option: AssetSelectOption) => void,
}) => {
  const { addressesEqual, isZeroAddress } = useEtherspotUtils();
  const { getAssets } = useEtherspotAssets();
  const { getAccountBalances } = useEtherspotBalances();
  const [assetsOptions, setAssetsOptions] = useState<AssetSelectOption[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const { chainId } = useEtherspot();
  const walletAddress = useWalletAddress();

  useEffect(() => {
    if (!walletAddress) return;

    let expired;

    (async () => {
      let assets = await getAssets();
      if (expired) return;

      // add native asset
      const nativeAsset = nativeAssetPerChainId[chainId];
      if (nativeAsset) {
        assets = [
          nativeAsset,
          ...assets,
        ];
      }

      setAssetsOptions(assets.map((asset) => ({
        id: `${asset.chainId}:${asset.address}`,
        title: asset.name,
        value: '',
        isLoadingValue: true,
        imageSrc: asset.logoURI,
        asset,
      })));

      setIsLoadingOptions(false);
    })();

    return () => {
      expired = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress, chainId]);

  useEffect(() => {
    if (!walletAddress) return;

    let expired;

    (async () => {
      const balances = await getAccountBalances();
      if (expired) return;

      const assetsOptionsWithValuesLoading = assetsOptions.filter((assetOption) => assetOption.isLoadingValue);

      if (!assetsOptionsWithValuesLoading.length) return;

      const assetsOptionsWithBalances = assetsOptions.map((assetOption) => {
        const assetBalance = balances.find((balance) => {
          return (balance.token === null && isZeroAddress(assetOption.asset?.address ?? ''))
            || addressesEqual(balance.token, assetOption.asset?.address ?? '')
        });
        const balance = ethers.utils.formatUnits(assetBalance?.balance ?? '0', assetOption.asset?.decimals ?? 18);

        return {
          ...assetOption,
          value: formatAmountDisplay(balance) + ` ${assetOption.asset?.symbol ?? ''}`,
          balance: +balance,
          isLoadingValue: false,
        }
      });

      setAssetsOptions(assetsOptionsWithBalances);
    })();

    return () => {
      expired = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetsOptions, walletAddress]);

  return (
    <Select
      isLoadingOptions={isLoadingOptions}
      options={assetsOptions}
      defaultSelectedId={defaultSelectedId}
      onChange={(option) => onChange(option as AssetSelectOption)}
    />
  )
}

export default AssetSelect;

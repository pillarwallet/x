import { useEffect, useState } from 'react';
import { TokenListToken } from '@etherspot/prime-sdk';
import { ethers } from 'ethers';
import {
  useEtherspot,
  useEtherspotAssets,
  useEtherspotUtils,
  useWalletAddress
} from '@etherspot/transaction-kit';
import { sepolia } from 'viem/chains';

// components
import Select, { SelectOption } from '../Select';

// utils
import { formatAmountDisplay } from '../../../utils/number';
import { getNativeAssetForChainId, usdcOnSepolia } from '../../../utils/blockchain';

// hooks
import useAccountBalances from '../../../hooks/useAccountBalances';

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
  const [assetsOptions, setAssetsOptions] = useState<AssetSelectOption[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const { chainId } = useEtherspot();
  const walletAddress = useWalletAddress();
  const balances = useAccountBalances();

  useEffect(() => {
    if (!walletAddress) return;

    let expired;

    (async () => {
      let assets = await getAssets();
      if (expired) return;

      // add native asset
      const nativeAsset = getNativeAssetForChainId(chainId);
      if (nativeAsset) {
        assets = [nativeAsset, ...assets];
      }

      // TODO: remove once Sepolia is available on Prime SDK
      if (chainId === sepolia.id) {
        assets = [...assets, usdcOnSepolia];
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

  const assetsOptionsWithBalances = assetsOptions.map((assetOption) => {
    const assetBalance = balances[chainId]?.find((balance) => {
      if (!assetOption.asset?.address) return;

      const assetAddress = assetOption.asset.address;
      const isNativeBalance = balance.token === null || isZeroAddress(balance.token);

      return (isNativeBalance && isZeroAddress(assetAddress))
        || addressesEqual(balance.token, assetAddress)
    });

    const balance = ethers.utils.formatUnits(assetBalance?.balance ?? '0', assetOption.asset?.decimals ?? 18);

    return {
      ...assetOption,
      value: formatAmountDisplay(balance) + ` ${assetOption.asset?.symbol ?? ''}`,
      balance: +balance,
      isLoadingValue: !balances[chainId],
    }
  });

  return (
    <Select
      isLoadingOptions={isLoadingOptions}
      options={assetsOptionsWithBalances}
      defaultSelectedId={defaultSelectedId}
      onChange={(option) => onChange(option as AssetSelectOption)}
    />
  )
}

export default AssetSelect;

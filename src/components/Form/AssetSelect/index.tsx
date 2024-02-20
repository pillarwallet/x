import { useEffect, useState } from 'react';
import { TokenListToken } from '@etherspot/prime-sdk';
import { ethers } from 'ethers';
import {
  useEtherspotAssets,
  useEtherspotUtils,
  useWalletAddress
} from '@etherspot/transaction-kit';
import { sepolia } from 'viem/chains';
import styled from 'styled-components';

// components
import Select, { SelectOption } from '../Select';

// utils
import { formatAmountDisplay } from '../../../utils/number';
import { getNativeAssetForChainId, supportedChains, usdcOnSepolia } from '../../../utils/blockchain';

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
  const [chainId, setChainId] = useState<number | undefined>(undefined);
  const [isAssetSelected, setIsAssetSelected] = useState(false);
  const walletAddress = useWalletAddress();
  const balances = useAccountBalances();

  useEffect(() => {
    if (!walletAddress || !chainId) return;

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

  const visibleChains = process.env.REACT_APP_USE_TESTNETS === 'true'
    ? supportedChains.filter((chain) => chain.testnet)
    : supportedChains;

  const chainIdOptions = visibleChains.map((chain) => ({
    id: `${chain.id}`,
    title: chain.name,
    value: chain.id,
  }));

  const selectedChainTitle = chainIdOptions.find((option) => option.value === chainId)?.title;

  const assetsOptionsWithBalances = assetsOptions.map((assetOption) => {
    const assetBalance = chainId && balances[chainId]?.find((balance) => {
      if (!assetOption.asset?.address) return;

      const assetAddress = assetOption.asset.address;
      const isNativeBalance = balance.token === null || isZeroAddress(balance.token);

      return (isNativeBalance && isZeroAddress(assetAddress))
        || addressesEqual(balance.token, assetAddress)
    });

    const assetBalanceValue = assetBalance ? assetBalance.balance : '0';
    const balance = ethers.utils.formatUnits(assetBalanceValue, assetOption.asset?.decimals ?? 18);

    return {
      ...assetOption,
      title: assetOption.title + (isAssetSelected ? ` on ${selectedChainTitle}` : ''),
      value: formatAmountDisplay(balance) + ` ${assetOption.asset?.symbol ?? ''}`,
      balance: +balance,
      isLoadingValue: !!chainId && !balances[chainId],
    }
  });

  return (
    <MultiSelectWrapper
      onClick={() => {
        if (!isAssetSelected) return;
        // reset to chain select
        setChainId(undefined);
        setIsAssetSelected(false);
      }}
    >
      {!chainId && (
        <Select
          options={chainIdOptions}
          onChange={(option) => {
            setChainId(option.value as number);
            setIsAssetSelected(false);
          }}
          hideValue
        />
      )}
      {!!chainId && (
        <>
          {!isAssetSelected && (
            <ChainTitle
              onClick={() => {
                // reset to chain select
                setChainId(undefined);
              }}
            >
              {selectedChainTitle}
            </ChainTitle>
          )}
          <Select
            isLoadingOptions={isLoadingOptions}
            options={assetsOptionsWithBalances}
            defaultSelectedId={defaultSelectedId}
            onChange={(option) => {
              setIsAssetSelected(true);
              onChange(option as AssetSelectOption)
            }}
          />
        </>
      )}
    </MultiSelectWrapper>
  )
}

const MultiSelectWrapper = styled.div``;

const ChainTitle = styled.div`
  border-radius: 10px;
  background: ${({ theme }) => theme.color.background.selectItem};
  text-align: left;
  padding: 11px 13px;
  cursor: pointer;
  user-select: none;
  margin-bottom: 10px;
  font-size: 15px;
  font-weight: 700;

  &:hover {
    background: ${({ theme }) => theme.color.background.selectItemHover};
  }
`;

export default AssetSelect;

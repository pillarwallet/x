import { useContext, useEffect, useState } from 'react';
import { Nft, NftCollection, TokenListToken } from '@etherspot/prime-sdk/dist/sdk/data';
import { ethers } from 'ethers';
import {
  useEtherspotUtils,
  useWalletAddress
} from '@etherspot/transaction-kit';
import styled from 'styled-components';
import { CssVarsProvider, Tab, tabClasses, TabList, Tabs } from '@mui/joy';
import { useTranslation } from 'react-i18next';

// context
import { AccountNftsContext } from '../../../providers/AccountNftsProvider';
import { AccountBalancesContext } from '../../../providers/AccountBalancesProvider';

// components
import Select, { SelectOption } from '../Select';

// utils
import { formatAmountDisplay } from '../../../utils/number';
import { parseNftTitle, visibleChains } from '../../../utils/blockchain';

// hooks
import useAccountBalances from '../../../hooks/useAccountBalances';
import useAssets from '../../../hooks/useAssets';
import useAccountNfts from '../../../hooks/useAccountNfts';

export interface TokenAssetSelectOption extends SelectOption {
  type: 'token';
  asset: TokenListToken;
  chainId: number;
  balance?: number;
}

export interface NftAssetSelectOption extends SelectOption {
  type: 'nft';
  nft: Nft;
  collection: NftCollection;
  chainId: number;
}

export type AssetSelectOption = TokenAssetSelectOption | NftAssetSelectOption;

const AssetSelect = ({ defaultSelectedId, onChange, onClose }: {
  defaultSelectedId?: string,
  onChange: (option: AssetSelectOption) => void,
  onClose: () => void,
}) => {
  const contextNfts = useContext(AccountNftsContext)
  const contextBalances = useContext(AccountBalancesContext)
  const { addressesEqual, isZeroAddress } = useEtherspotUtils();
  const [tokenAssetsOptions, setTokenAssetsOptions] = useState<TokenAssetSelectOption[]>([]);
  const [nftAssetsOptions, setNftAssetsOptions] = useState<NftAssetSelectOption[]>([]);
  const [chainId, setChainId] = useState<number | undefined>(undefined);
  const [isAssetSelected, setIsAssetSelected] = useState(false);
  const [showNfts, setShowNfts] = useState(false);
  const walletAddress = useWalletAddress();
  const balances = useAccountBalances();
  const assets = useAssets();
  const nfts = useAccountNfts();
  const [t] = useTranslation();

  useEffect(() => {
    if (!walletAddress || !chainId) return;

    contextNfts?.data.setUpdateData(true)
    contextBalances?.data.setUpdateData(true)

    let expired;

    (async () => {
      if (expired) return;

      setTokenAssetsOptions(assets[chainId].map((asset) => ({
        type: 'token',
        id: `${chainId}:${asset.address}`,
        title: asset.name,
        value: '',
        isLoadingValue: true,
        imageSrc: asset.logoURI,
        asset,
        chainId,
      })));

      if (nfts?.[chainId]?.[walletAddress]?.length) {
        setNftAssetsOptions(nfts[chainId][walletAddress].reduce((acc: NftAssetSelectOption[], collection) => {
          collection.items.forEach((nft) => {
            const optionId = `${chainId}:${collection.contractAddress}:${nft.tokenId}`;
            acc.push({
              type: 'nft',
              id: optionId,
              title: parseNftTitle(collection, nft),
              value: optionId,
              isLoadingValue: false,
              imageSrc: nft.image,
              nft,
              collection,
              chainId,
            });
          });
          return acc;
        }, []));
      }
    })();

    return () => {
      expired = true;
      contextNfts?.data.setUpdateData(false)
      contextBalances?.data.setUpdateData(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress, chainId, assets]);

  const chainIdOptions = visibleChains.map((chain) => ({
    id: `${chain.id}`,
    title: chain.name,
    value: chain.id,
  }));

  const selectedChainTitle = chainIdOptions.find((option) => option.value === chainId)?.title;

  const assetsOptionsWithBalances = tokenAssetsOptions.map((assetOption) => {
    if (assetOption.type !== 'token') return assetOption;

    const assetBalance = chainId && balances[chainId]?.[walletAddress as string]?.find((balance) => {
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
      isLoadingValue: !!chainId && !balances[chainId]?.[walletAddress as string],
    }
  });

  const availableAssetsInWallet = assetsOptionsWithBalances.filter((asset) => asset.balance && asset.balance > 0)

  return (
    <MultiSelectWrapper
      id='assets-list-send-modal'
      onClick={() => {
        if (!isAssetSelected) return;
        // reset to chain select
        setChainId(undefined);
        setIsAssetSelected(false);
        onClose();
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
            <>
              <ChainTitle
                onClick={() => {
                  // reset to chain select
                  setChainId(undefined);
                }}
              >
                {selectedChainTitle}
              </ChainTitle>
              <CssVarsProvider defaultMode="dark">
                <Tabs
                  sx={{ bgcolor: 'transparent', mb: 1 }}
                  value={showNfts ? 1 : 0}
                  onChange={(event, value) => setShowNfts(value === 1)}
                >
                  <TabList
                    disableUnderline
                    sx={{
                      p: 0.5,
                      gap: 0.5,
                      borderRadius: 'sm',
                      bgcolor: 'background.level1',
                      [`& .${tabClasses.root}[aria-selected="true"]`]: {
                        boxShadow: 'sm',
                        bgcolor: 'background.surface',
                      },
                    }}
                    tabFlex={1}
                  >
                    <Tab disableIndicator>{t`label.tokens`}</Tab>
                    <Tab disableIndicator>{t`label.nfts`}</Tab>
                  </TabList>
                </Tabs>
              </CssVarsProvider>
            </>
          )}
          <Select
            options={showNfts ? nftAssetsOptions : availableAssetsInWallet}
            type={showNfts ? 'nft' : 'token'}
            defaultSelectedId={defaultSelectedId}
            hideValue={showNfts}
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
  font-weight: 500;

  &:hover {
    background: ${({ theme }) => theme.color.background.selectItemHover};
  }
`;

export default AssetSelect;

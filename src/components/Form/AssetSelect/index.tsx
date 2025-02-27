/* eslint-disable @typescript-eslint/no-use-before-define */
import { Nft } from '@etherspot/data-utils/dist/cjs/sdk/data/classes/nft';
import { NftCollection } from '@etherspot/data-utils/dist/cjs/sdk/data/classes/nft-collection';
import {
  useEtherspotUtils,
  useWalletAddress,
} from '@etherspot/transaction-kit';
import { CssVarsProvider, Tab, TabList, Tabs, tabClasses } from '@mui/joy';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

// services
import {
  Token,
  chainIdToChainNameTokensData,
  queryTokenData,
} from '../../../services/tokensData';

// components
import Select, { SelectOption } from '../Select';

// utils
import {
  nativeTokensByChain,
  parseNftTitle,
  visibleChains,
} from '../../../utils/blockchain';
import { formatAmountDisplay } from '../../../utils/number';

// hooks
import useAccountBalances from '../../../hooks/useAccountBalances';
import useAccountNfts from '../../../hooks/useAccountNfts';

export interface TokenAssetSelectOption extends SelectOption {
  type: 'token';
  asset: Token;
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

const AssetSelect = ({
  defaultSelectedId,
  onChange,
  onClose,
}: {
  defaultSelectedId?: string;
  onChange: (option: AssetSelectOption) => void;
  onClose: () => void;
}) => {
  const { addressesEqual } = useEtherspotUtils();
  const [tokenAssetsOptions, setTokenAssetsOptions] = useState<
    TokenAssetSelectOption[]
  >([]);
  const [nftAssetsOptions, setNftAssetsOptions] = useState<
    NftAssetSelectOption[]
  >([]);
  const [chainId, setChainId] = useState<number | undefined>(undefined);
  const [isAssetSelected, setIsAssetSelected] = useState(false);
  const [showNfts, setShowNfts] = useState(false);
  const walletAddress = useWalletAddress();
  const balances = useAccountBalances();
  const nfts = useAccountNfts();
  const [t] = useTranslation();

  const assets = queryTokenData({
    blockchain: chainIdToChainNameTokensData(chainId),
  });

  useEffect(() => {
    if (!walletAddress || !chainId) return;

    let expired;

    (async () => {
      if (expired) return;

      setTokenAssetsOptions(
        assets.map((asset) => ({
          type: 'token',
          id: `${chainId}:${asset.id}`,
          title: asset.name,
          value: '',
          isLoadingValue: true,
          imageSrc: asset.logo,
          asset,
          chainId,
        }))
      );

      if (nfts?.[chainId]?.[walletAddress]?.length) {
        setNftAssetsOptions(
          nfts[chainId][walletAddress].reduce(
            (acc: NftAssetSelectOption[], collection) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              collection.items.forEach((nft: any) => {
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
            },
            []
          )
        );
      }
    })();

    // eslint-disable-next-line consistent-return
    return () => {
      expired = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress, chainId]);

  const chainIdOptions = visibleChains.map((chain) => ({
    id: `${chain.id}`,
    title: chain.name,
    value: chain.id,
  }));

  const selectedChainTitle = chainIdOptions.find(
    (option) => option.value === chainId
  )?.title;

  const assetsOptionsWithBalances = tokenAssetsOptions.map((assetOption) => {
    if (assetOption.type !== 'token') return assetOption;

    const assetBalance =
      chainId &&
      balances[chainId]?.[walletAddress as string]?.find((balance) => {
        const nativeTokens = nativeTokensByChain[chainId] || [];

        const isNativeBalance =
          balance.token === null || nativeTokens.includes(balance.token);
        const isNativeAsset =
          assetOption.asset?.contract &&
          nativeTokens.includes(assetOption.asset.contract);

        if (isNativeBalance && isNativeAsset) return true;

        return addressesEqual(balance.token, assetOption.asset?.contract);
      });
    const assetBalanceValue = assetBalance ? assetBalance.balance : '0';
    const balance = ethers.utils.formatUnits(
      assetBalanceValue,
      assetOption.asset?.decimals ?? 18
    );

    return {
      ...assetOption,
      title:
        assetOption.title +
        (isAssetSelected ? ` on ${selectedChainTitle}` : ''),
      value: `${formatAmountDisplay(balance)} ${assetOption.asset?.symbol ?? ''}`,
      balance: +balance,
      isLoadingValue:
        !!chainId && !balances[chainId]?.[walletAddress as string],
    };
  });

  const availableAssetsInWallet = assetsOptionsWithBalances.filter(
    (asset) => asset.balance && asset.balance > 0
  );

  return (
    <MultiSelectWrapper
      id="assets-list-send-modal"
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
              onChange(option as AssetSelectOption);
            }}
          />
        </>
      )}
    </MultiSelectWrapper>
  );
};

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

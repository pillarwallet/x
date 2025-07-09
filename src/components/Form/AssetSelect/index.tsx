/* eslint-disable @typescript-eslint/no-use-before-define */
import { useWalletAddress } from '@etherspot/transaction-kit';
import { CssVarsProvider, Tab, TabList, Tabs, tabClasses } from '@mui/joy';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

// services
import {
  convertPortfolioAPIResponseToToken,
  useGetWalletPortfolioQuery,
} from '../../../services/pillarXApiWalletPortfolio';
import { chainNameToChainIdTokensData } from '../../../services/tokensData';

// components
import Select from '../Select';

// utils
import {
  getChainName,
  parseNftTitle,
  visibleChains,
} from '../../../utils/blockchain';
import { formatAmountDisplay } from '../../../utils/number';

// hooks
import useAccountNfts from '../../../hooks/useAccountNfts';

// types
import {
  AssetSelectOption,
  NftAssetSelectOption,
  TokenAssetSelectOption,
} from '../../../types';

const AssetSelect = ({
  defaultSelectedId,
  onChange,
  onClose,
}: {
  defaultSelectedId?: string;
  onChange: (option: AssetSelectOption) => void;
  onClose: () => void;
}) => {
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
  const nfts = useAccountNfts();
  const [t] = useTranslation();

  const {
    data: walletPortfolioData,
    isLoading: isWalletPortfolioDataLoading,
    isFetching: isWalletPortfolioDataFetching,
    isSuccess: isWalletPortfolioDataSuccess,
  } = useGetWalletPortfolioQuery(
    { wallet: walletAddress || '', isPnl: false },
    { skip: !walletAddress, refetchOnFocus: true, pollingInterval: 120000 }
  );

  const assets = useMemo(() => {
    if (isWalletPortfolioDataSuccess && walletPortfolioData?.result?.data) {
      return convertPortfolioAPIResponseToToken(
        walletPortfolioData.result.data
      );
    }
    return [];
  }, [isWalletPortfolioDataSuccess, walletPortfolioData]);

  useEffect(() => {
    if (!walletAddress || !chainId) return;

    if (
      isWalletPortfolioDataLoading ||
      isWalletPortfolioDataFetching ||
      !isWalletPortfolioDataSuccess
    ) {
      return;
    }

    let expired;

    (async () => {
      if (expired) return;

      if (assets.length > 0) {
        setTokenAssetsOptions(
          assets
            .filter(
              (asset) =>
                chainNameToChainIdTokensData(asset.blockchain) === chainId
            )
            .map((asset) => ({
              type: 'token',
              id: `${chainId}:${asset.contract}`,
              title: asset.name,
              value: '',
              isLoadingValue: true,
              imageSrc: asset.logo,
              asset,
              chainId,
              balance: asset.balance ?? 0,
            }))
        );
      } else {
        setTokenAssetsOptions([]);
      }

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
      } else {
        setNftAssetsOptions([]);
      }
    })();

    // eslint-disable-next-line consistent-return
    return () => {
      expired = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    walletAddress,
    chainId,
    isWalletPortfolioDataSuccess,
    isWalletPortfolioDataLoading,
    isWalletPortfolioDataFetching,
    assets,
  ]);

  const chainIdOptions = visibleChains.map((chain) => ({
    id: `${chain.id}`,
    title: getChainName(chain.id),
    value: chain.id,
  }));

  const selectedChainTitle = chainIdOptions.find(
    (option) => option.value === chainId
  )?.title;

  const assetsOptionsWithBalances = tokenAssetsOptions.map((assetOption) => {
    if (assetOption.type !== 'token') return assetOption;

    const balance = assetOption.asset?.balance ?? 0;

    return {
      ...assetOption,
      title:
        assetOption.title +
        (isAssetSelected ? ` on ${selectedChainTitle}` : ''),
      value: `${formatAmountDisplay(balance)} ${assetOption.asset?.symbol ?? ''}`,
      balance: +balance,
      isLoadingValue: false,
    };
  });

  const availableAssetsInWallet = assetsOptionsWithBalances.filter(
    (asset) => asset.balance && asset.balance > 0
  );

  const isLoadingAssets =
    isWalletPortfolioDataLoading || isWalletPortfolioDataFetching;

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
            isLoadingOptions={!showNfts && isLoadingAssets}
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

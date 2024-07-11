import { Nft, NftCollection, TokenListToken } from '@etherspot/prime-sdk/dist/sdk/data';
import { useEtherspotUtils, useWalletAddress } from '@etherspot/transaction-kit';
import { useLogout } from '@privy-io/react-auth';
import { BigNumber, ethers } from 'ethers';
import {
  ArrowRight2 as ArrowRightIcon,
  Copy as CopyIcon,
  CopySuccess as CopySuccessIcon,
  Blend2 as IconBlend,
  Gallery as IconGallery,
  Hierarchy as IconHierarchy,
  Logout as LogoutIcon,
  User as UserIcon
} from 'iconsax-react';
import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled, { useTheme } from 'styled-components';
import { Chain } from 'viem';

// components
import FormTabSelect from '../Form/FormTabSelect';
import ImageWithFallback from '../ImageWithFallback';
import SkeletonLoader from '../SkeletonLoader';
import Alert from '../Text/Alert';

// utils
import { getLogoForChainId, truncateAddress, visibleChains } from '../../utils/blockchain';
import { copyToClipboard } from '../../utils/common';
import { formatAmountDisplay } from '../../utils/number';

// hooks
import useAccountBalances from '../../hooks/useAccountBalances';
import useAccountNfts from '../../hooks/useAccountNfts';
import useAssets from '../../hooks/useAssets';

// services
import { clearDappStorage } from '../../services/dappLocalStorage';

//context
import { AccountBalancesContext } from '../../providers/AccountBalancesProvider';
import { AccountNftsContext } from '../../providers/AccountNftsProvider';

interface AccountModalProps {
  isContentVisible?: boolean; // for animation purpose to not render rest of content and return main wrapper only
}

const AccountModal = ({ isContentVisible }: AccountModalProps) => {
  const contextNfts = useContext(AccountNftsContext)
  const contextBalances = useContext(AccountBalancesContext)
  const accountAddress = useWalletAddress();
  const navigate = useNavigate();
  const { logout } = useLogout();
  const [t] = useTranslation();
  const assets = useAssets();
  const balances = useAccountBalances();
  const nfts = useAccountNfts();
  const { addressesEqual, isZeroAddress } = useEtherspotUtils();
  const [showNfts, setShowNfts] = React.useState(false);
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});
  const theme = useTheme();
  const [copied, setCopied] = React.useState(false);

  const groupedTokens = useMemo(() => {
    if (!accountAddress) return {};

    return visibleChains
      .reduce<Record<string, Record<string, { asset: TokenListToken, balance: BigNumber, chain: Chain }>>>((
        grouped,
        chain
      ) => {
        const balancesForChain = balances[chain.id]?.[accountAddress] || [];
        balancesForChain.forEach((balance) => {
          const asset = assets[chain.id]?.find((asset) => addressesEqual(asset.address, balance.token)
            || (balance.token === null && isZeroAddress(asset.address)));

          if (!asset) {
            console.warn(`Asset not found for balance: ${balance.token} on ${chain.name}`);
            return;
          }

          grouped[asset.symbol] = {
            ...grouped[asset.symbol] ?? {},
            [chain.id]: { asset, balance: balance.balance, chain }
          }
        });
        return grouped;
      }, {});
  }, [accountAddress, balances, assets, addressesEqual, isZeroAddress]);

  const allNfts = useMemo(() => {
    if (!accountAddress) return [];

    return visibleChains.reduce<{ nft: Nft, collection: NftCollection, chain: Chain }[]>((all, chain) => {
      const nftCollectionsForChain = nfts[chain.id]?.[accountAddress] || [];
      nftCollectionsForChain.forEach((collection) => {
        collection.items.forEach((nft) => {
          all.push({ nft, collection, chain });
        });
      });
      return all;
    }, []);
  }, [accountAddress, nfts]);

  useEffect(() => {
    if (!isContentVisible) {
      contextNfts?.data.setUpdateData(false)
      contextBalances?.data.setUpdateData(false)
    }
    if (isContentVisible) {
      contextNfts?.data.setUpdateData(true)
      contextBalances?.data.setUpdateData(true)
    }
  }, [isContentVisible, contextNfts?.data, contextBalances?.data])

  const onCopyAddressClick = useCallback(() => {
    if (copied) {
      setCopied(false);
      return;
    }

    if (!accountAddress) {
      console.warn('No account address to copy');
      return;
    }

    copyToClipboard(accountAddress, () => {
      setCopied(true);
    })
  }, [accountAddress, copied]);

  const onLogoutClick = useCallback(() => {
    logout();
    clearDappStorage();
    navigate('/');
  }, [logout, navigate]);

  React.useEffect(() => {
    const addressCopyActionTimeout = setTimeout(() => {
      setCopied(false);
    }, 500);

    return () => {
      clearTimeout(addressCopyActionTimeout);
    }
  }, [copied]);

  const nftsLoading = !accountAddress || Object.keys(nfts).some((chainId) => !nfts[+chainId]?.[accountAddress]);
  const tokensLoading = !accountAddress || Object.keys(nfts).some((chainId) => !balances[+chainId]?.[accountAddress]);

  if (!isContentVisible) {
    return <Wrapper />
  }

  if (!accountAddress) {
    return (
      <Wrapper>
        <SkeletonLoader $height="40px" $width="100%" $radius="30px" $marginBottom="15px" />
        <SkeletonLoader $height="160px" $width="100%" />
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <TopBar>
        <AccountSection>
          <TopBarIcon>
            <UserIcon size={20} />
          </TopBarIcon>
          {truncateAddress(accountAddress, 14)}
          <TopBarIcon onClick={onCopyAddressClick} $transparent>
            {copied ? <CopySuccessIcon size={20} /> : <CopyIcon size={20} />}
          </TopBarIcon>
        </AccountSection>
        <TopBarIcon onClick={onLogoutClick}>
          <LogoutIcon size={20} />
        </TopBarIcon>
      </TopBar>
      <FormTabSelect
        items={[
          { icon: <IconBlend size={20} />, title: t`label.tokens` },
          { icon: <IconGallery size={20} />, title: t`label.nfts` },
        ]}
        onChange={(index) => setShowNfts(index === 1)}
        fullwidth
        transparent
      />
      <TabContent>
        {showNfts && (
          <>
            {!allNfts.length && !nftsLoading && <Alert>{t`error.noNftsFound`}</Alert>}
            <NftsWrapper>
              {nftsLoading && (
                <>
                  <SkeletonLoader $height="189px" $width="143px" $radius="6px" />
                  <SkeletonLoader $height="189px" $width="143px" $radius="6px" />
                </>
              )}
              {allNfts.map(({ nft, collection, chain }, index) => {
                const nftKey = `${chain.id}-${collection.contractAddress}-${nft.tokenId}-${index}`;

                let title = nft.name;
                if (!title && collection.contractName && nft.tokenId) title = `${collection.contractName} #${nft.tokenId}`;
                if (!title && nft.tokenId) title = `Unknown NFT #${nft.tokenId}`;
                if (!title) title = 'Unknown NFT';

                return (
                  <NftItem key={nftKey}>
                    <NftImageWrapper>
                      <ImageWithFallback src={nft.image ?? nft.ipfsGateway} alt={nftKey.replace('-', '')} />
                    </NftImageWrapper>
                    <NftDetails>
                      <NftTitle>{title}</NftTitle>
                      {!!collection.contractName && <NftCollectionTitle>{collection.contractName}</NftCollectionTitle>}
                      <ChainIcon $size={16} src={getLogoForChainId(chain.id)} />
                    </NftDetails>
                  </NftItem>
                );
              })}
            </NftsWrapper>
          </>
        )}
        {!showNfts && (
          <>
            {!tokensLoading && !Object.keys(groupedTokens).length && <Alert>{t`error.noTokensFound`}</Alert>}
            {tokensLoading && (
              <>
                <SkeletonLoader $height="40px" $width="100%" $radius="6px" $marginBottom="15px" />
                <SkeletonLoader $height="40px" $width="100%" $radius="6px" $marginBottom="15px" />
                <SkeletonLoader $height="40px" $width="100%" $radius="6px" $marginBottom="15px" />
              </>
            )}
            {Object.keys(groupedTokens).map((tokenSymbol) => {
              const decimals = Object.values(groupedTokens[tokenSymbol])[0].asset.decimals;
              const logoUrl = Object.values(groupedTokens[tokenSymbol])[0].asset.logoURI;
              const totalBalanceBN = Object.values(groupedTokens[tokenSymbol]).reduce((total, { balance }) => total.add(balance), BigNumber.from(0));
              const totalBalance = ethers.utils.formatUnits(totalBalanceBN, decimals);
              const tokenChainsCount = Object.values(groupedTokens[tokenSymbol]).length;

              return (
                <TokenItem key={tokenSymbol}>
                  <TokenTotals>
                    <img src={logoUrl} alt={tokenSymbol} />
                    <p>{formatAmountDisplay(totalBalance)} <TokenSymbol>{tokenSymbol}</TokenSymbol></p>
                    <TokenTotalsRight>
                      <IconHierarchy size={13} color={theme.color.icon.cardIcon} variant="Bold" />
                      <TokenChainsCount>{tokenChainsCount}</TokenChainsCount>
                      <VerticalDivider />
                      <ToggleButton
                        $expanded={expanded[tokenSymbol]}
                        onClick={() => setExpanded((prev) => ({ ...prev, [tokenSymbol]: !prev[tokenSymbol] }))}
                      >
                        <ArrowRightIcon size={15} />
                      </ToggleButton>
                    </TokenTotalsRight>
                  </TokenTotals>
                  <TokenChainsWrapper $visible={expanded[tokenSymbol]}>
                    {Object.values(groupedTokens[tokenSymbol]).map(({ balance, asset, chain }) => {
                      const assetBalanceValue = ethers.utils.formatUnits(balance, asset.decimals);
                      return (
                        <TokenItemChain key={`${tokenSymbol}-${chain.id}`}>
                          <ChainIcon src={getLogoForChainId(chain.id)} />
                          <p>{chain.name}</p>
                          <p>{formatAmountDisplay(assetBalanceValue)}</p>
                        </TokenItemChain>
                      );
                    })}
                  </TokenChainsWrapper>
                </TokenItem>
              );
            })}
          </>
        )}
      </TabContent>
    </Wrapper>
  )
}

const TopBar = styled.div`
  width: 100%;
  word-break: break-all;
  text-align: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 9px;
  margin-bottom: 15px;
`;

const TopBarIcon = styled.div<{ $transparent?: boolean }>`
  background: ${({ theme, $transparent }) => $transparent ? 'transparent' : theme.color.background.card};
  color: ${({ theme }) => theme.color.text.cardContent};
  height: 38px;
  width: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;

  ${({ onClick }) => onClick && `
    cursor: pointer;

    &:hover {
      opacity: 0.7;
    }

    &:active {
      opacity: 0.4;
    }
  `}
`;

const AccountSection = styled.div`
  background: ${({ theme }) => theme.color.background.card};
  padding: 4px;
  border-radius: 24px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex: 1;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: 100%;
  width: 100%;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const TokenTotals = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;

  & > img {
    border-radius: 50%;
    width: 24px;
    height: 24px;
  }
`;

const TokenItem = styled.div`
  background: ${({ theme }) => theme.color.background.card};
  padding: 11px 6px 11px 11px;
  margin-bottom: 12px;
  font-size: 14px;
  color: ${({ theme }) => theme.color.text.cardTitle};
  font-weight: 700;
  border-radius: 6px;
  user-select: none;

  &:last-child {
    margin-bottom: 0;
  }
`;

const TokenItemChain = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 9px;
  margin-bottom: 12px;
  font-size: 13px;
  color: ${({ theme }) => theme.color.text.cardContent};

  &:last-child {
    margin-bottom: 0;
  }

  & > *:last-child {
    margin-left: auto;
  }
`;

const ChainIcon = styled.img<{ $size?: number }>`
  width: ${({ $size }) => $size ?? 20}px;
  height: ${({ $size }) => $size ?? 20}px;
`;

const TokenSymbol = styled.span`
  color: ${({ theme }) => theme.color.text.cardContent};
`;

const TokenTotalsRight = styled.div`
  margin-left: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  text-align: right;
`;

const ToggleButton = styled.span<{ $expanded: boolean }>`
  transition: transform 0.2s ease-in-out;
  cursor: pointer;
  transform: ${({ $expanded }) => $expanded ? 'rotate(-90deg)' : 'rotate(0)'};
  padding: 3px;
  margin-left: 4px;

  &:active {
    opacity: 0.4;
  }
`;

const TokenChainsCount = styled.p`
  margin-left: 6px;
`;

const VerticalDivider = styled.span`
  height: 12px;
  width: 1px;
  background: ${({ theme }) => theme.color.border.cardContentVerticalSeparator};
  margin-left: 9px;
`;

const TokenChainsWrapper = styled.div<{ $visible: boolean }>`
  display: ${({ $visible }) => $visible ? 'block' : 'none'};
  border-left: 4px solid ${({ theme }) => theme.color.border.cardContentVerticalSeparator};
  border-radius: 3px;
  margin: 14px 0 5px 10px;
  padding: 0 5px 0 17px;
`;

const TabContent = styled.div`
  margin-top: 15px;
  width: 100%;
`;

const NftItem = styled.div`
  background: ${({ theme }) => theme.color.background.card};
  padding: 6px;
  font-size: 14px;
  color: ${({ theme }) => theme.color.text.cardTitle};
  font-weight: 700;
  border-radius: 6px;
  user-select: none;
  width: calc(50% - 5px);
`;

const NftImageWrapper = styled.div`
  img {
    border-radius: 6px;
    width: 100%;
    height: auto;
  }
`;

const NftDetails = styled.div`
  padding: 6px;
  position: relative;
  
  ${ChainIcon} {
    position: absolute;
    bottom: 6px;
    right: 6px;
  }
`;

const NftTitle = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.color.text.cardTitle};
`;

const NftCollectionTitle = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.color.text.cardContent}
  padding-right: 25px;
`;

const NftsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  flex-wrap: wrap;
`;


export default AccountModal;

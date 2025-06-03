/* eslint-disable @typescript-eslint/no-use-before-define */
import { Nft } from '@etherspot/data-utils/dist/cjs/sdk/data/classes/nft';
import { NftCollection } from '@etherspot/data-utils/dist/cjs/sdk/data/classes/nft-collection';
import {
  useEtherspotUtils,
  useWalletAddress,
} from '@etherspot/transaction-kit';
import { useLogout } from '@privy-io/react-auth';
import Tippy from '@tippyjs/react';
import Avatar from 'boring-avatars';
import { BigNumber, ethers } from 'ethers';
import {
  ArrowRight2 as ArrowRightIcon,
  Copy as CopyIcon,
  CopySuccess as CopySuccessIcon,
  Blend2 as IconBlend,
  Gallery as IconGallery,
  Hierarchy as IconHierarchy,
  Logout as LogoutIcon,
} from 'iconsax-react';
import React, { useCallback, useMemo } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled, { useTheme } from 'styled-components';
import { Chain } from 'viem';
import { useDisconnect } from 'wagmi';

// components
import FormTabSelect from '../Form/FormTabSelect';
import ImageWithFallback from '../ImageWithFallback';
import SkeletonLoader from '../SkeletonLoader';
import Alert from '../Text/Alert';

// utils
import {
  getChainName,
  getLogoForChainId,
  truncateAddress,
  visibleChains,
} from '../../utils/blockchain';
import { formatAmountDisplay } from '../../utils/number';

// hooks
import useAccountBalances from '../../hooks/useAccountBalances';
import useAccountNfts from '../../hooks/useAccountNfts';
import usePrivateKeyLogin from '../../hooks/usePrivateKeyLogin';

// services
import { clearDappStorage } from '../../services/dappLocalStorage';
import {
  Token,
  chainIdToChainNameTokensData,
  queryTokenData,
} from '../../services/tokensData';

interface AccountModalProps {
  isContentVisible?: boolean; // for animation purpose to not render rest of content and return main wrapper only
}

const AccountModal = ({ isContentVisible }: AccountModalProps) => {
  const accountAddress = useWalletAddress();
  const { account, setAccount } = usePrivateKeyLogin();
  const navigate = useNavigate();
  const { logout } = useLogout();
  const [t] = useTranslation();
  const balances = useAccountBalances();
  const nfts = useAccountNfts();
  const { addressesEqual, isZeroAddress } = useEtherspotUtils();
  const { disconnect } = useDisconnect();

  const [showNfts, setShowNfts] = React.useState(false);
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});
  const theme = useTheme();
  const [copied, setCopied] = React.useState(false);

  const groupedTokens = useMemo(() => {
    if (!accountAddress) return {};

    return visibleChains.reduce<
      Record<
        string,
        Record<string, { asset: Token; balance: BigNumber; chain: Chain }>
      >
    >((grouped, chain) => {
      const balancesForChain = balances[chain.id]?.[accountAddress] || [];
      const assets = queryTokenData({
        blockchain: chainIdToChainNameTokensData(chain.id),
      });

      balancesForChain.forEach((balance) => {
        const asset = assets.find(
          (a) =>
            addressesEqual(a.contract, balance.token) ||
            (balance.token === null && isZeroAddress(a.contract))
        );

        if (!asset) {
          return;
        }

        // eslint-disable-next-line no-param-reassign
        grouped[asset.symbol] = {
          ...(grouped[asset.symbol] ?? {}),
          [chain.id]: { asset, balance: balance.balance, chain },
        };
      });

      return grouped;
    }, {});
  }, [accountAddress, balances, addressesEqual, isZeroAddress]);

  const allNfts = useMemo(() => {
    if (!accountAddress) return [];

    return visibleChains.reduce<
      { nft: Nft; collection: NftCollection; chain: Chain }[]
    >((all, chain) => {
      const nftCollectionsForChain = nfts[chain.id]?.[accountAddress] || [];
      nftCollectionsForChain.forEach((collection) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        collection.items.forEach((nft: any) => {
          all.push({ nft, collection, chain });
        });
      });
      return all;
    }, []);
  }, [accountAddress, nfts]);

  const onCopyAddressClick = useCallback(() => {
    if (copied) {
      setCopied(false);
      return;
    }

    if (!accountAddress) {
      console.warn('No account address to copy');
      return;
    }

    setCopied(true);
  }, [accountAddress, copied]);

  const onLogoutClick = useCallback(async () => {
    if (account) {
      localStorage.removeItem('ACCOUNT_VIA_PK');
      setAccount(undefined);
    } else {
      logout();
    }

    await disconnect();

    clearDappStorage();
    navigate('/');

    // Time to logout and redirect route
    setTimeout(() => window.location.reload(), 500);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, logout, navigate, disconnect]);

  React.useEffect(() => {
    const addressCopyActionTimeout = setTimeout(() => {
      setCopied(false);
    }, 500);

    return () => {
      clearTimeout(addressCopyActionTimeout);
    };
  }, [copied]);

  const nftsLoading =
    !accountAddress ||
    Object.keys(nfts).some((chainId) => !nfts[+chainId]?.[accountAddress]);
  const tokensLoading =
    !accountAddress ||
    Object.keys(nfts).some((chainId) => !balances[+chainId]?.[accountAddress]);

  if (!isContentVisible) {
    return <Wrapper />;
  }

  if (!accountAddress) {
    return (
      <Wrapper id="account-modal-loader">
        <SkeletonLoader
          $height="40px"
          $width="100%"
          $radius="30px"
          $marginBottom="15px"
        />
        <SkeletonLoader $height="160px" $width="100%" />
      </Wrapper>
    );
  }

  return (
    <Wrapper id="account-modal">
      <TopBar>
        <AccountSection id="address-account-modal">
          <TopBarIcon>
            <Avatar size={38} name={accountAddress} variant="marble" />
          </TopBarIcon>
          {truncateAddress(accountAddress, 14)}
          <CopyToClipboard text={accountAddress} onCopy={onCopyAddressClick}>
            <TopBarIcon $transparent>
              {copied ? <CopySuccessIcon size={20} /> : <CopyIcon size={20} />}
            </TopBarIcon>
          </CopyToClipboard>
        </AccountSection>
        <Tooltip content="Log Out">
          <TopBarIcon id="account-logout" onClick={onLogoutClick}>
            <LogoutIcon size={20} />
          </TopBarIcon>
        </Tooltip>
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
            {!allNfts.length && !nftsLoading && (
              <Alert>{t`error.noNftsFound`}</Alert>
            )}
            <NftsWrapper id="nfts-account-modal">
              {nftsLoading && (
                <>
                  <SkeletonLoader
                    $height="189px"
                    $width="143px"
                    $radius="6px"
                  />
                  <SkeletonLoader
                    $height="189px"
                    $width="143px"
                    $radius="6px"
                  />
                </>
              )}
              {allNfts.map(({ nft, collection, chain }, index) => {
                const nftKey = `${chain.id}-${collection.contractAddress}-${nft.tokenId}-${index}`;

                let title = nft.name;
                if (!title && collection.contractName && nft.tokenId)
                  title = `${collection.contractName} #${nft.tokenId}`;
                if (!title && nft.tokenId)
                  title = `Unknown NFT #${nft.tokenId}`;
                if (!title) title = 'Unknown NFT';

                return (
                  <NftItem id="nft-item-account-modal" key={nftKey}>
                    <NftImageWrapper>
                      <ImageWithFallback
                        src={nft.image ?? nft.ipfsGateway}
                        alt={nftKey.replace('-', '')}
                      />
                    </NftImageWrapper>
                    <NftDetails>
                      <NftTitle>{title}</NftTitle>
                      {!!collection.contractName && (
                        <NftCollectionTitle>
                          {collection.contractName}
                        </NftCollectionTitle>
                      )}
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
            {!tokensLoading && !Object.keys(groupedTokens).length && (
              <Alert>{t`error.noTokensFound`}</Alert>
            )}
            {tokensLoading && (
              <>
                <SkeletonLoader
                  $height="40px"
                  $width="100%"
                  $radius="6px"
                  $marginBottom="15px"
                />
                <SkeletonLoader
                  $height="40px"
                  $width="100%"
                  $radius="6px"
                  $marginBottom="15px"
                />
                <SkeletonLoader
                  $height="40px"
                  $width="100%"
                  $radius="6px"
                  $marginBottom="15px"
                />
              </>
            )}
            {Object.keys(groupedTokens).map((tokenSymbol) => {
              const { decimals } = Object.values(groupedTokens[tokenSymbol])[0]
                .asset;
              const logoUrl = Object.values(groupedTokens[tokenSymbol])[0].asset
                .logo;
              const totalBalanceBN = Object.values(
                groupedTokens[tokenSymbol]
              ).reduce(
                (total, { balance }) => total.add(balance),
                BigNumber.from(0)
              );
              const totalBalance = ethers.utils.formatUnits(
                totalBalanceBN,
                decimals
              );
              const tokenChainsCount = Object.values(
                groupedTokens[tokenSymbol]
              ).length;

              // This is to ensure that balances that are equal to 0 do not appear for the user
              if (Number(totalBalance) === 0) return undefined;

              return (
                <TokenItem
                  id={`token-item-${tokenSymbol}-account-modal`}
                  key={tokenSymbol}
                >
                  <TokenTotals id="token-totals-account-modal">
                    <img src={logoUrl} alt={tokenSymbol} />
                    <p>
                      {formatAmountDisplay(totalBalance)}{' '}
                      <TokenSymbol>{tokenSymbol}</TokenSymbol>
                    </p>
                    <TokenTotalsRight>
                      <IconHierarchy
                        size={13}
                        color={theme.color.icon.cardIcon}
                        variant="Bold"
                      />
                      <TokenChainsCount>{tokenChainsCount}</TokenChainsCount>
                      <VerticalDivider />
                      <ToggleButton
                        $expanded={expanded[tokenSymbol]}
                        onClick={() =>
                          setExpanded((prev) => ({
                            ...prev,
                            [tokenSymbol]: !prev[tokenSymbol],
                          }))
                        }
                      >
                        <ArrowRightIcon size={15} />
                      </ToggleButton>
                    </TokenTotalsRight>
                  </TokenTotals>
                  <TokenChainsWrapper
                    id="token-chains-account-modal"
                    $visible={expanded[tokenSymbol]}
                  >
                    {Object.values(groupedTokens[tokenSymbol]).map(
                      ({ balance, chain }) => {
                        const assetBalanceValue = ethers.utils.formatUnits(
                          balance,
                          decimals
                        );
                        return (
                          <TokenItemChain
                            key={`${tokenSymbol}-${chain.id}`}
                            id={`action-bar-account-token-${tokenSymbol}-${chain.id}`}
                          >
                            <ChainIcon src={getLogoForChainId(chain.id)} />
                            <p>{getChainName(Number(chain.id))}</p>
                            <p>{formatAmountDisplay(assetBalanceValue)}</p>
                          </TokenItemChain>
                        );
                      }
                    )}
                  </TokenChainsWrapper>
                </TokenItem>
              );
            })}
          </>
        )}
      </TabContent>
    </Wrapper>
  );
};

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
  background: ${({ theme, $transparent }) =>
    $transparent ? 'transparent' : theme.color.background.card};
  color: ${({ theme }) => theme.color.text.cardContent};
  height: 38px;
  width: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;

  ${({ onClick }) =>
    onClick &&
    `
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
  transform: ${({ $expanded }) => ($expanded ? 'rotate(-90deg)' : 'rotate(0)')};
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
  display: ${({ $visible }) => ($visible ? 'block' : 'none')};
  border-left: 4px solid
    ${({ theme }) => theme.color.border.cardContentVerticalSeparator};
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

const Tooltip = styled(Tippy)`
  position: relative;
  padding: 6px 6px;
  border-radius: 8px;
  background: ${({ theme }) => theme.color.background.card};
  font-size: 12px;
  font-weight: 400;
  line-height: 1;
  color: #fff;

  .tippy-content {
    padding: 0;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 8px;
    background: rgba(0, 0, 0, 1);
    z-index: -1;
  }
`;

Tooltip.defaultProps = {
  delay: [1000, 0],
};

export default AccountModal;

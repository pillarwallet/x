import React from 'react';
import { useEtherspotUtils, useWalletAddress } from '@etherspot/transaction-kit';
import styled from 'styled-components';
import { useLogout } from '@privy-io/react-auth';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Card,
  CssVarsProvider, Tab, tabClasses, TabList, Tabs,
  Typography
} from '@mui/joy';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';

// components
import Paragraph from '../Text/Paragraph';
import Button from '../Button';
import SkeletonLoader from '../SkeletonLoader';

// utils
import { parseNftTitle, visibleChains } from '../../utils/blockchain';
import { formatAmountDisplay } from '../../utils/number';

// hooks
import useAccountBalances from '../../hooks/useAccountBalances';
import useAssets from '../../hooks/useAssets';
import useAccountNfts from '../../hooks/useAccountNfts';

// services
import { clearDappStorage } from '../../services/dappLocalStorage';

interface AccountModalProps {
  isContentVisible?: boolean; // for animation purpose to not render rest of content and return main wrapper only
}

const AccountModal = ({ isContentVisible }: AccountModalProps) => {
  const accountAddress = useWalletAddress();
  const navigate = useNavigate();
  const { logout } = useLogout();
  const [t] = useTranslation();
  const assets = useAssets();
  const balances = useAccountBalances();
  const nfts = useAccountNfts();
  const { addressesEqual, isZeroAddress } = useEtherspotUtils();
  const [showNfts, setShowNfts] = React.useState(false);
  const [hiddenImages, setHiddenImages] = React.useState<{ [key: string]: boolean }>({});

  if (!isContentVisible) {
    return <Wrapper />
  }

  const onLogoutClick = () => {
    logout();
    clearDappStorage();
    navigate('/');
  }

  if (!accountAddress) {
    return (
      <Wrapper>
        <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column', width: '100%' }}>
          <SkeletonLoader $height="40px" $width="100%" />
          <SkeletonLoader $height="160px" $width="100%" />
        </Box>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <AccountSection>
        <Paragraph>
          {accountAddress}<br/><br/>
        </Paragraph>
      </AccountSection>
      <Box mb={2} sx={{ width: '100%' }}>
        <CssVarsProvider defaultMode="dark">
          <Tabs
            sx={{ bgcolor: 'transparent', mb: 0.5 }}
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
          {showNfts && visibleChains.map((chain) => (
            <>
              {!nfts[chain.id]?.[accountAddress] && (
                <Card key={chain.id + '-loader'} sx={{ mb: 0.5 }}>
                  <Box sx={{ display: 'flex', gap: 2, flexDirection: 'row' }}>
                    <SkeletonLoader $height="40px" $width="40px" />
                    <SkeletonLoader $height="40px" $width="220px" />
                  </Box>
                </Card>
              )}
              {!!nfts[chain.id]?.[accountAddress] && !nfts[chain.id]?.[accountAddress]?.length && (
                <Card key={chain.id + '-loader'} sx={{ mb: 0.5 }}>
                  <Typography level="title-md">
                    {chain.name}
                  </Typography>
                  <Typography level="body-sm">
                    {t`error.noNftsFound`}.
                  </Typography>
                </Card>
              )}
              {!!nfts[chain.id]?.[accountAddress]?.length && (
                <Card key={chain.id + '-item'} sx={{ mb: 0.5 }}>
                  <Typography level="title-md">
                    {chain.name}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {nfts[chain.id][accountAddress].map((nftCollection) => nftCollection?.items?.map((nft) => {
                      const nftKey = nftCollection.contractAddress + ':' + nft.tokenId;
                      return (
                        <Box
                          key={nftKey}
                          sx={{
                              width: '100%',
                              display: 'flex',
                              flexDirection: 'row',
                              gap: 2,
                              justifyContent: 'flex-start',
                              alignItems: 'center'
                          }}
                        >
                          {(!!nft.image || !!nft.ipfsGateway) && !hiddenImages[nftKey] && (
                            <img
                              src={nft.image || nft.ipfsGateway}
                              onError={() => setHiddenImages((hidden) => ({
                                ...hidden,
                                [nftKey]: true
                              }))}
                              alt={nft.name} style={{ width: '40px' }}
                            />
                          )}
                          <Typography level="body-sm">
                            {parseNftTitle(nftCollection, nft)}
                          </Typography>
                        </Box>
                      );
                    }))}
                  </Box>
                </Card>
              )}
            </>
          ))}
          {!showNfts && visibleChains.map((chain) => (
            <>
              {!balances[chain.id]?.[accountAddress] && (
                <Card key={chain.id + '-loader'} sx={{ mb: 0.5 }}>
                  <SkeletonLoader $height="15px" $width="45%" />
                  <SkeletonLoader $height="15px" $width="30%" />
                </Card>
              )}
              {!!balances[chain.id]?.[accountAddress]?.length && (
                <Card key={chain.id + '-item'} sx={{ mb: 0.5 }}>
                  <Typography level="title-md">
                    {chain.name}
                  </Typography>
                  {balances[chain.id][accountAddress].map((balance) => {
                    const asset = assets[chain.id]?.find((asset) => addressesEqual(asset.address, balance.token)
                      || (balance.token === null && isZeroAddress(asset.address)));

                    if (!asset) {
                      console.warn(`Asset not found for balance: ${balance.token} on ${chain.name}`);
                      return null;
                    }

                    const assetBalanceValue = ethers.utils.formatUnits(balance.balance, asset.decimals);

                    return (
                      <Typography level="body-sm" key={asset.address + chain.id}>
                        {formatAmountDisplay(assetBalanceValue)} {asset.symbol}
                      </Typography>
                    );
                  })}
                </Card>
              )}
            </>
          ))}
        </CssVarsProvider>
      </Box>
      <Button onClick={onLogoutClick}>{t`action.logout`}</Button>
    </Wrapper>
  )
}

const AccountSection = styled.div`
  width: 100%;
  word-break: break-all;
  text-align: center;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100%;
  width: 100%;
  max-height: calc(100vh - 240px);
  overflow: hidden;

  &::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
`;

export default AccountModal;

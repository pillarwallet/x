import { useEtherspotUtils, useWalletAddress } from '@etherspot/transaction-kit';
import styled from 'styled-components';
import { useLogout } from '@privy-io/react-auth';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Card,
  CssVarsProvider,
  Typography
} from '@mui/joy';
import { ethers } from 'ethers';

// components
import Paragraph from '../Text/Paragraph';
import Button from '../Button';
import SkeletonLoader from '../SkeletonLoader';

// utils
import { visibleChains } from '../../utils/blockchain';
import { formatAmountDisplay } from '../../utils/number';

// hooks
import useAccountBalances from '../../hooks/useAccountBalances';
import useAssets from '../../hooks/useAssets';

interface AccountModalProps {
  isContentVisible?: boolean; // for animation purpose to not render rest of content and return main wrapper only
}

const AccountModal = ({ isContentVisible }: AccountModalProps) => {
  const accountAddress = useWalletAddress();
  const { logout } = useLogout();
  const [t] = useTranslation();
  const assets = useAssets();
  const balances = useAccountBalances();
  const { addressesEqual, isZeroAddress } = useEtherspotUtils();

  if (!isContentVisible) {
    return <Wrapper />
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
          {visibleChains.map((chain) => !!accountAddress && (
            <>
              {!balances[chain.id]?.[accountAddress]?.length && (
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
      <Button onClick={logout}>{t`action.logout`}</Button>
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
  overflow-y: scroll;

  &::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
`;

export default AccountModal;

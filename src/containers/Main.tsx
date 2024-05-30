import { WalletProviderLike, Web3eip1193WalletProvider } from '@etherspot/prime-sdk';
import { EtherspotTransactionKit } from '@etherspot/transaction-kit';
import { PrivyProvider, usePrivy, useWallets } from '@privy-io/react-auth';
import { useEffect, useState } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { mainnet, sepolia } from 'viem/chains';

// components
import BottomMenu from '../components/BottomMenu';

// theme
import { defaultTheme, GlobalStyle } from '../theme';

// providers
import BottomMenuModalProvider from '../providers/BottomMenuModalProvider';
import LanguageProvider from '../providers/LanguageProvider';
import AccountBalancesProvider from '../providers/AccountBalancesProvider';
import AccountTransactionHistoryProvider from '../providers/AccountTransactionHistoryProvider';
import AssetsProvider from '../providers/AssetsProvider';
import AccountNftsProvider from '../providers/AccountNftsProvider';
import AllowedAppsProvider from '../providers/AllowedAppsProvider';
import GlobalTransactionBatchesProvider from '../providers/GlobalTransactionsBatchProvider'
import { ApiProvider } from '@reduxjs/toolkit/query/react'
import { pillarXApi } from '../apps/pillarx-app/api/apiSlice'

// navigation
import { AuthorizedNavigation, UnauthorizedNavigation } from '../navigation';

// pages
import Loading from '../pages/Loading';

// hooks
import useAllowedApps from '../hooks/useAllowedApps';
import { visibleChains } from '../utils/blockchain';

const AppAuthController = () => {
  const { ready, authenticated } = usePrivy();
  const { wallets } = useWallets();
  const [provider, setProvider] = useState<WalletProviderLike | undefined>(undefined);
  const [chainId, setChainId] = useState<number | undefined>(undefined);
  const { isLoading: isLoadingAllowedApps } = useAllowedApps();
  const navLocation = useLocation();
  const previouslyAuthenticated = !!localStorage.getItem('privy:token');

  const isAppReady = ready && !isLoadingAllowedApps;

  useEffect(() => {
    let expired = false;

    const updateProvider = async () => {
      if (!wallets.length) return; // not yet ready

      const privyEthereumProvider = await wallets[0].getWeb3jsProvider();

      // @ts-expect-error: provider type mismatch
      // TODO: fix provider types by either updating @etherspot/prime-sdk or @etherspot/transaction-kit
      const newProvider = new Web3eip1193WalletProvider(privyEthereumProvider.walletProvider);
      await newProvider.refresh();

      if (expired) return;

      setProvider(newProvider);
      const walletChainId = +wallets[0].chainId.split(':')[1]; // extract from CAIP-2
      const isWithinVisibleChains = visibleChains.some((chain) => chain.id === walletChainId);
      /**
       * Sets supported chain ID rather than throw unsupported bundler error.
       * This does not affect transaction send flow if chain ID remains provided to TransationKit Batches JSX.
       */
      setChainId(isWithinVisibleChains ? walletChainId : visibleChains[0].id);
    }

    updateProvider();

    return () => {
      expired = true;
    }
  }, [wallets]);

  if (isAppReady && authenticated && provider && chainId) {
    return (
      <ApiProvider api={pillarXApi}>
        <EtherspotTransactionKit
          provider={provider}
          chainId={chainId}
          bundlerApiKey={process.env.REACT_APP_ETHERSPOT_BUNDLER_API_KEY || undefined}
          dataApiKey={process.env.REACT_APP_ETHERSPOT_DATA_API_KEY || undefined}
        >
          <AccountTransactionHistoryProvider>
            <AssetsProvider>
              <AccountBalancesProvider>
                <AccountNftsProvider>
                  <GlobalTransactionBatchesProvider>
                    <BottomMenuModalProvider>
                      <AuthContentWrapper>
                        <AuthorizedNavigation />
                      </AuthContentWrapper>
                      <BottomMenu />
                    </BottomMenuModalProvider>
                  </GlobalTransactionBatchesProvider>
                </AccountNftsProvider>
              </AccountBalancesProvider>
            </AssetsProvider>
          </AccountTransactionHistoryProvider>
        </EtherspotTransactionKit>
      </ApiProvider>
    )
  }

  const isRootPage = navLocation.pathname === '/';

  if ((isAppReady && !authenticated) || (isRootPage && !previouslyAuthenticated)) {
    return (
      <UnauthorizedNavigation />
    );
  }

  return <Loading />;
}

const Main = () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyle />
      <LanguageProvider>
        <PrivyProvider
          appId={process.env.REACT_APP_PRIVY_APP_ID as string}
          config={{
            appearance: { theme: 'dark' },
            defaultChain: process.env.REACT_APP_USE_TESTNETS === 'true' ? sepolia : mainnet,
            embeddedWallets: {
              createOnLogin: 'users-without-wallets'
            }
          }}
        >
          <BrowserRouter>
            <AllowedAppsProvider>
              <AppAuthController />
            </AllowedAppsProvider>
          </BrowserRouter>
        </PrivyProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

const AuthContentWrapper = styled.div`
  margin: 0 auto;
`;

export default Main;

import { WalletProviderLike, Web3eip1193WalletProvider } from '@etherspot/prime-sdk';
import { EtherspotTransactionKit } from '@etherspot/transaction-kit';
import { PrivyProvider, usePrivy, useWallets } from '@privy-io/react-auth';
import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
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

// navigation
import { AuthorizedNavigation, UnauthorizedNavigation } from '../navigation';

// pages
import Loading from '../pages/Loading';

// hooks
import useAllowedApps from '../hooks/useAllowedApps';

const AppAuthController = () => {
  const { ready, authenticated } = usePrivy();
  const { wallets } = useWallets();
  const [provider, setProvider] = useState<WalletProviderLike | undefined>(undefined);
  const [chainId, setChainId] = useState<number | undefined>(undefined);
  const { isLoading: isLoadingAllowedApps } = useAllowedApps();

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
      setChainId(walletChainId);
    }

    updateProvider();

    return () => {
      expired = true;
    }
  }, [wallets]);

  if (isAppReady && authenticated && provider && chainId) {
    return (
      <EtherspotTransactionKit
        provider={provider}
        chainId={chainId}
        projectKey={process.env.REACT_APP_ETHERSPOT_PROJECT_KEY || undefined}
      >
        <AccountTransactionHistoryProvider>
          <AssetsProvider>
            <AccountBalancesProvider>
              <AccountNftsProvider>
                <BrowserRouter>
                  <BottomMenuModalProvider>
                    <AuthContentWrapper>
                      <AuthorizedNavigation />
                    </AuthContentWrapper>
                    <BottomMenu />
                  </BottomMenuModalProvider>
                </BrowserRouter>
              </AccountNftsProvider>
            </AccountBalancesProvider>
          </AssetsProvider>
        </AccountTransactionHistoryProvider>
      </EtherspotTransactionKit>
    )
  }

  if (isAppReady && !authenticated) {
    return (
      <BrowserRouter>
        <UnauthorizedNavigation />
      </BrowserRouter>
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
          <AllowedAppsProvider>
            <AppAuthController />
          </AllowedAppsProvider>
        </PrivyProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

const AuthContentWrapper = styled.div`
  // max-width: 500px; TODO: inspect and remove/adjust
  margin: 0 auto;
  // padding: 60px 20px 120px; TODO: inspect and remove/adjust
`;

export default Main;

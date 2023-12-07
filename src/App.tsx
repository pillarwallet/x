import React, { useEffect, useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { BrowserRouter } from 'react-router-dom';
import { PrivyProvider, usePrivy, useWallets } from '@privy-io/react-auth';
import { WalletProviderLike } from '@etherspot/prime-sdk';
import { EtherspotTransactionKit } from '@etherspot/transaction-kit';

// components
import BottomMenu from './components/BottomMenu';

// theme
import { defaultTheme, GlobalStyle } from './theme';

// providers
import LanguageProvider from './providers/LanguageProvider';

// navigation
import { AuthorizedNavigation, UnauthorizedNavigation } from './navigation';

// pages
import Loading from './pages/Loading';

const AppAuthController = () => {
  const { ready, authenticated, createWallet } = usePrivy();
  const { wallets } = useWallets();
  const [provider, setProvider] = useState<WalletProviderLike | undefined>(undefined);
  const [chainId, setChainId] = useState<number | undefined>(undefined);

  useEffect(() => {
    let expired = false;

    const updateProvider = async () => {
      if (!wallets.length) return; // not yet ready

      const privyEthereumProvider = await wallets[0].getEthereumProvider();
      if (expired) return;

      // @ts-expect-error: provider type mismatch
      // TODO: fix provider types by either updating @etherspot/prime-sdk or @etherspot/transaction-kit
      setProvider(privyEthereumProvider);
      setChainId(+wallets[0].chainId.split(':')[1]); // extract from CAIP-2
    }

    updateProvider();

    return () => {
      expired = true;
    }
  }, [wallets]);

  useEffect(() => {
    const createWalletIfNotExists = async () => {
      if (wallets?.length || !authenticated) return;
      // create&link a privy wallet for logged user if none exist
      await createWallet();
    }

    createWalletIfNotExists();
  }, [wallets, createWallet, authenticated]);

  if (authenticated && provider && chainId) {
    return (
      <EtherspotTransactionKit provider={provider} chainId={chainId}>
        <BrowserRouter>
          <AuthContentWrapper>
            <AuthorizedNavigation />
          </AuthContentWrapper>
          <BottomMenu />
        </BrowserRouter>
      </EtherspotTransactionKit>
    )
  }

  if (ready && !authenticated) {
    return (
      <BrowserRouter>
        <UnauthorizedNavigation />
      </BrowserRouter>
    );
  }

  return <Loading />;
}

const App = () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyle />
      <LanguageProvider>
        <PrivyProvider
          appId={process.env.REACT_APP_PRIVY_APP_ID as string}
          config={{ appearance: { theme: 'dark' } }}
        >
          <AppAuthController />
        </PrivyProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

const AuthContentWrapper = styled.div`
  max-width: 500px;
  height: 1px; // set height so children can inherit min height
  min-height: calc(100vh - 240px);
  margin: 0 auto;
  padding: 60px 20px 0;
`;

export default App;

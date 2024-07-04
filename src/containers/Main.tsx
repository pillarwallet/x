import { WalletProviderLike, Web3eip1193WalletProvider } from '@etherspot/prime-sdk';
import { PrivyProvider, usePrivy, useWallets } from '@privy-io/react-auth';
import { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { mainnet, sepolia } from 'viem/chains';

// theme
import { defaultTheme, GlobalStyle } from '../theme';

// providers
import AllowedAppsProvider from '../providers/AllowedAppsProvider';
import LanguageProvider from '../providers/LanguageProvider';

// pages
import Loading from '../pages/Loading';

// hooks
import useAllowedApps from '../hooks/useAllowedApps';
import App from '../pages/App';
import LandingPage from '../pages/Landing';
import Lobby from '../pages/Lobby';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';
import Waitlist from '../pages/WaitList';
import { visibleChains } from '../utils/blockchain';
import Authorized from './Authorized';

/**
 * @name AuthLayout
 * @description This component's primary responsibility
 * is to manage the application's authentication flow. If
 * the user is authenticated, it will render the Authorized
 * component which contains the main application logic. If
 * the user is not authenticated, it will render the routes
 * only available to unauthenticated users.
 * @returns 
 */
const AuthLayout = () => {
  /**
   * Import all the hooks, states and other variables
   * we will need to determine what authentication
   * state the user is in.
   */
  const { ready, authenticated } = usePrivy();
  const { wallets } = useWallets();
  const [provider, setProvider] = useState<WalletProviderLike | undefined>(undefined);
  const [chainId, setChainId] = useState<number | undefined>(undefined);
  const { allowed: allowedApps, isLoading: isLoadingAllowedApps } = useAllowedApps();
  const previouslyAuthenticated = !!localStorage.getItem('privy:token');
  const isAppReady = ready && !isLoadingAllowedApps;

  /**
   * The following useEffect is to detemine if the
   * wallet state of Privy changed, and if it did,
   * update the provider (if any). This would also
   * re-render Authorized component with the new
   * state.
   */
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

  /**
   * If all the following variables are truthy within the if
   * statement, we can consider this user as logged in and
   * authenticated.
   */
  if (isAppReady && authenticated && provider && chainId) {

    /**
     * Define our authorized routes for users that are
     * authenticated. There are a few steps here.
     */

    // First, add the core routes to the route definition
    const authorizedRoutesDefinition = [{
      path: '/',
      element: <Authorized chainId={chainId} provider={provider}  />,
      children: [
        {
          index: true,
          path: '/',
          element: <Lobby />,
        },
        {
        path: '/landing',
        element: <LandingPage />,
      },
      {
        path: '/waitlist',
        element: <Waitlist />,
      }]
    }];

    // Next, add the allowed apps to the route definition
    allowedApps.forEach((appId) => {
      authorizedRoutesDefinition[0].children.push({
        path: `/${appId}`,
        element: <App id={appId} />,
      });
      authorizedRoutesDefinition[0].children.push({
        path: `/${appId}/*`,
        element: <App id={appId} />,
      });
    });

    // Finally, add the development app to the route definition
    // if it exists...
    if (process.env.REACT_APP_PX_DEVELOPMENT_ID) {
      authorizedRoutesDefinition[0].children.push({
        path: `/${process.env.REACT_APP_PX_DEVELOPMENT_ID}`,
        element: <App id={process.env.REACT_APP_PX_DEVELOPMENT_ID} />,
      });
    }

    // ...and add the 404 route to the route definition
    // for good measure
    authorizedRoutesDefinition.push({
      path: '*',
      element: <NotFound />,
      children: []
    });
    
    // ...and return.
    return <RouterProvider router={createBrowserRouter(authorizedRoutesDefinition)} />;
  }

  // Determine if this is a root page, we'll need it later
  const isRootPage = window.location.pathname === '/' || window.location.pathname === '/waitlist';

  /**
   * The following if statement determines if the user is
   * logged in or not. If not logged in, This particular
   * statement will determine if the user is unauthorized.
   */
  if ((isAppReady && !authenticated) || (isRootPage && !previouslyAuthenticated)) {

    /**
     * Define our unauthorized routes for users that are
     * not authenticated. This is simpler as most of the 
     * website is locked out.
     */
    const unauthorizedRoutesDefinition = [{
      path: '/',
      element: <LandingPage />,
    }, {
      path: '/waitlist',
      element: <Waitlist />,
    }, {
      path: '/login',
      element: <Login />,
    }, {
      path: '*',
      element: <NotFound />,
    }];

    // ...and return.
    return <RouterProvider router={createBrowserRouter(unauthorizedRoutesDefinition)} />;
  }

  /**
   * If none of these considitions are met, we can assume that
   * we are still waiting for something to happen such as the
   * wallets to load. In this case, we will render the loading
   * component until a re-render is triggered by the useEffect
   * above.
   */
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
              <AuthLayout />
            </AllowedAppsProvider>
        </PrivyProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default Main;

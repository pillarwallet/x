/* eslint-disable import/extensions */
import { PrivyProvider, usePrivy, useWallets } from '@privy-io/react-auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import {
  createWalletClient,
  custom,
  http,
  isAddress,
  WalletClient,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { mainnet, sepolia } from 'viem/chains';
import { createConfig, useAccount, WagmiProvider } from 'wagmi';
import { walletConnect } from 'wagmi/connectors';

// theme
import { defaultTheme, GlobalStyle } from '../theme';

// providers
import AllowedAppsProvider from '../providers/AllowedAppsProvider';
import LanguageProvider from '../providers/LanguageProvider';
import { PrivateKeyLoginProvider } from '../providers/PrivateKeyLoginProvider';

// utils
import { getNetworkViem } from '../apps/deposit/utils/blockchain';
import { isTestnet, visibleChains } from '../utils/blockchain';

// pages
import Developers from '../pages/Developers';
import LandingPage from '../pages/Landing';
import Loading from '../pages/Loading';
import Lobby from '../pages/Lobby';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';
import Privacy from '../pages/Privacy';
import Waitlist from '../pages/WaitList';
import Authorized from './Authorized';

// hooks
import useAllowedApps from '../hooks/useAllowedApps';
import usePrivateKeyLogin from '../hooks/usePrivateKeyLogin';

import App from '../pages/App';

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
  const { ready, authenticated, user } = usePrivy();
  const { wallets } = useWallets();
  const { isConnected, address } = useAccount();
  const { account, setAccount } = usePrivateKeyLogin();
  const [provider, setProvider] = useState<WalletClient | undefined>(undefined);
  const [chainId, setChainId] = useState<number | undefined>(undefined);
  const { allowed: allowedApps, isLoading: isLoadingAllowedApps } =
    useAllowedApps();
  const previouslyAuthenticated =
    !!localStorage.getItem('privy:token') ||
    localStorage.getItem('ACCOUNT_VIA_PK');
  const isAppReady = ready && !isLoadingAllowedApps;
  const isAuthenticated = authenticated || Boolean(account);

  useEffect(() => {
    if (!authenticated) return;
    sessionStorage.setItem('loginPageReloaded', 'false');
  }, [authenticated]);

  /**
   * The following useEffect is to detemine if the
   * user is logging in (or has logged in)  with a
   * private key or if the wallet state of Privy changed,
   * and if it did, update the provider (if any).
   * This would also re-render Authorized component with
   * the new state.
   */
  useEffect(() => {
    const searchURL = new URLSearchParams(window.location.search);
    const searchURLPK = searchURL.get('pk');

    if ((searchURL && searchURLPK) || account || address) {
      if (searchURL && searchURLPK) {
        try {
          const privateKeyToAccountAddress = privateKeyToAccount(
            searchURLPK as `0x${string}`
          );

          if (isAddress(privateKeyToAccountAddress.address)) {
            setAccount(privateKeyToAccountAddress.address);

            localStorage.setItem(
              'ACCOUNT_VIA_PK',
              privateKeyToAccountAddress.address
            );

            const URLWithPK = new URL(window.location.href);

            // Remove the 'pk' parameter
            URLWithPK.searchParams.delete('pk');

            // Replace the current history state with the updated URL
            window.history.replaceState(null, '', URLWithPK.toString());
          }
        } catch (e) {
          console.error(e);
          localStorage.removeItem('ACCOUNT_VIA_PK');
        }
      }

      const updateProvider = async () => {
        const walletChainId = 1; // default chain id is 1

        const newProvider = createWalletClient({
          account: (account || address) as `0x${string}`,
          chain: getNetworkViem(walletChainId),
          transport: http(),
        });

        setProvider(newProvider);

        const isWithinVisibleChains = visibleChains.some(
          (chain) => chain.id === walletChainId
        );
        /**
         * Sets supported chain ID rather than throw unsupported bundler error.
         * This does not affect transaction send flow if chain ID remains provided to TransationKit Batches JSX.
         */
        setChainId(isWithinVisibleChains ? walletChainId : visibleChains[0].id);
      };

      updateProvider();
    } else {
      if (!wallets.length) return;

      const updateProvider = async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let privyEthereumProvider: any;

        const privyWalletAddress = user?.wallet?.address;

        const walletProvider = wallets.find(
          (wallet) => wallet.address === privyWalletAddress
        );

        if (walletProvider) {
          privyEthereumProvider = await walletProvider.getEthereumProvider();

          const walletChainId = +wallets[0].chainId.split(':')[1]; // extract from CAIP-2

          const newProvider = createWalletClient({
            account: walletProvider.address as `0x${string}`,
            chain: getNetworkViem(walletChainId),
            transport: custom(privyEthereumProvider),
          });

          setProvider(newProvider);
        }

        const walletChainId = +wallets[0].chainId.split(':')[1]; // extract from CAIP-2
        const isWithinVisibleChains = visibleChains.some(
          (chain) => chain.id === walletChainId
        );
        /**
         * Sets supported chain ID rather than throw unsupported bundler error.
         * This does not affect transaction send flow if chain ID remains provided to TransationKit Batches JSX.
         */
        setChainId(isWithinVisibleChains ? walletChainId : visibleChains[0].id);
      };

      updateProvider();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallets, user, account, address]);

  /**
   * If all the following variables are truthy within the if
   * statement, we can consider this user as logged in and
   * authenticated.
   */
  if (isAppReady && (isAuthenticated || isConnected) && provider && chainId) {
    /**
     * Define our authorized routes for users that are
     * authenticated. There are a few steps here.
     */

    // First, add the core routes to the route definition
    const authorizedRoutesDefinition = [
      {
        path: '/',
        element: <Authorized chainId={chainId} provider={provider} />,
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
          },
          {
            path: '/developers',
            element: <Developers />,
          },
          {
            path: '/privacy-policy',
            element: <Privacy />,
          },
          {
            path: '/login',
            element: <Navigate to="/" />,
          },
        ],
      },
    ];

    /**
     * Import app directory globs so that we can
     * dynamically extract and import the manifest
     * data needed to show the app icons
     */
    const appImports = import.meta.glob('../apps/*/index.tsx');
    for (const path in appImports) {
      // Extract the app ID from the path
      const appId = path.split('/')[2];

      authorizedRoutesDefinition[0].children.push({
        path: `/${appId}`,
        element: <App id={appId} />,
      });

      authorizedRoutesDefinition[0].children.push({
        path: `/${appId}/*`,
        element: <App id={appId} />,
      });
    }

    // ...and add the 404 route to the route definition
    // for good measure
    authorizedRoutesDefinition.push({
      path: '*',
      element: <NotFound />,
      children: [],
    });

    // ...and return.
    return (
      <RouterProvider
        router={createBrowserRouter(authorizedRoutesDefinition)}
      />
    );
  }

  // Determine if this is a root page, we'll need it later
  const isRootPage =
    window.location.pathname === '/' ||
    window.location.pathname === '/waitlist' ||
    window.location.pathname === '/developers' ||
    window.location.pathname === '/privacy-policy';

  /**
   * The following if statement determines if the user is
   * logged in or not. If not logged in, This particular
   * statement will determine if the user is unauthorized.
   */
  if (
    (isAppReady && !isAuthenticated) ||
    (isRootPage && !previouslyAuthenticated)
  ) {
    /**
     * Define our unauthorized routes for users that are
     * not authenticated. This is simpler as most of the
     * website is locked out.
     */
    const unauthorizedRoutesDefinition = [
      {
        path: '/',
        element: <LandingPage />,
      },
      {
        path: '/waitlist',
        element: <Waitlist />,
      },
      {
        path: '/developers',
        element: <Developers />,
      },
      {
        path: '/privacy-policy',
        element: <Privacy />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ];

    // ...and return.
    return (
      <RouterProvider
        router={createBrowserRouter(unauthorizedRoutesDefinition)}
      />
    );
  }

  /**
   * If none of these considitions are met, we can assume that
   * we are still waiting for something to happen such as the
   * wallets to load. In this case, we will render the loading
   * component until a re-render is triggered by the useEffect
   * above.
   */
  return <Loading type="wait" />;
};

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

export const config = createConfig({
  chains: [mainnet],
  connectors: [
    walletConnect({
      projectId: import.meta.env.VITE_WC_ID ?? '',
      showQrModal: !isMobile,
      isNewChainsStale: true,
      metadata: {
        name: 'PillarX',
        description: 'PillarX',
        url: 'https://pillarx.app/',
        icons: ['https://pillarx.app/favicon.ico'],
      },
    }),
  ],
  transports: {
    [mainnet.id]: http(),
  },
});

const queryClient = new QueryClient();

const Main = () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyle />
      <LanguageProvider>
        <PrivateKeyLoginProvider>
          <PrivyProvider
            appId={import.meta.env.VITE_PRIVY_APP_ID as string}
            config={{
              appearance: { theme: 'dark' },
              defaultChain: isTestnet ? sepolia : mainnet,
              embeddedWallets: {
                createOnLogin: 'users-without-wallets',
              },
            }}
          >
            <QueryClientProvider client={queryClient}>
              <WagmiProvider config={config}>
                <AllowedAppsProvider>
                  <AuthLayout />
                </AllowedAppsProvider>
              </WagmiProvider>
            </QueryClientProvider>
          </PrivyProvider>
        </PrivateKeyLoginProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default Main;

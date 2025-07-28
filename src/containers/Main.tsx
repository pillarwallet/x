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
import { createConfig, WagmiProvider, useAccount, useConnect } from 'wagmi';
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
  const { account, setAccount } = usePrivateKeyLogin();
  const { connectors } = useConnect();
  const [provider, setProvider] = useState<WalletClient | undefined>(undefined);
  const [chainId, setChainId] = useState<number | undefined>(undefined);
  const { isLoading: isLoadingAllowedApps } = useAllowedApps();
  const previouslyAuthenticated =
    !!localStorage.getItem('privy:token') ||
    localStorage.getItem('ACCOUNT_VIA_PK');
  const isAppReady = ready && !isLoadingAllowedApps;
  const isAuthenticated = authenticated || Boolean(account);
  
  // Add debug logging for authentication state
  console.log('Authentication state debug:', {
    ready,
    authenticated,
    hasUser: !!user,
    hasWallets: wallets.length > 0,
    hasAccount: !!account,
    isAppReady,
    isAuthenticated
  });

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

    if ((searchURL && searchURLPK) || account) {
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
          account: account as `0x${string}`,
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
      // Handle both Privy wallets and WalletConnect connections
      const updateProvider = async () => {
        // Don't run provider setup if Privy is still initializing
        if (!ready || !isAuthenticated) {
          console.log('Privy not ready or not authenticated, skipping provider setup');
          return;
        }
        
        // Check if we have any wallets (Privy or WalletConnect)
        const hasWallets = wallets.length > 0;
        const isWalletConnectConnected = isAuthenticated && !hasWallets;
        
        console.log('Provider setup debug:', {
          isAuthenticated,
          hasWallets,
          isWalletConnectConnected,
          walletsCount: wallets.length,
          connectorsCount: connectors.length
        });
        
        // If no wallets and not authenticated, return early
        if (!hasWallets && !isWalletConnectConnected) {
          console.log('No wallets or WalletConnect connection detected');
          return;
        }
        
        // If we have Privy wallets, don't try to setup WalletConnect
        if (hasWallets) {
          console.log('Privy wallets detected, skipping WalletConnect setup');
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let privyEthereumProvider: any;

        const privyWalletAddress = user?.wallet?.address;

        const walletProvider = wallets.find(
          (wallet) => wallet.address === privyWalletAddress
        );

        if (walletProvider) {
          // Handle Privy wallet
          privyEthereumProvider = await walletProvider.getEthereumProvider();

          const walletChainId = +wallets[0].chainId.split(':')[1]; // extract from CAIP-2

          const newProvider = createWalletClient({
            account: walletProvider.address as `0x${string}`,
            chain: getNetworkViem(walletChainId),
            transport: custom(privyEthereumProvider),
          });

          setProvider(newProvider);
        } else if (isWalletConnectConnected && !hasWallets) {
          // Handle WalletConnect connection - only if no Privy wallets are present
          console.log('Attempting to setup WalletConnect provider...');
          try {
            // Find the WalletConnect connector
            const walletConnectConnector = connectors.find(
              ({ id }) => id === 'walletConnect'
            );

            console.log('WalletConnect connector found:', !!walletConnectConnector);

            if (walletConnectConnector) {
              // Get the WalletConnect provider
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const wcProvider: any = await walletConnectConnector.getProvider();
              
              console.log('WalletConnect provider obtained:', !!wcProvider);
              console.log('WalletConnect provider connected:', wcProvider?.connected);
              
              // Only proceed if the provider is actually connected
              if (wcProvider && wcProvider.connected && wcProvider.accounts && wcProvider.accounts.length > 0) {
                // Get the connected account
                const accounts = await wcProvider.request({ method: 'eth_accounts' });
                const account = accounts[0];
                
                console.log('WalletConnect account:', account);
                
                if (account) {
                  // Create wallet client with WalletConnect provider
                  const newProvider = createWalletClient({
                    account: account as `0x${string}`,
                    chain: getNetworkViem(1), // Default to mainnet
                    transport: custom(wcProvider),
                  });

                  setProvider(newProvider);
                  setChainId(1); // Default to mainnet
                  console.log('WalletConnect provider setup successful');
                  console.log('WalletConnect provider details:', {
                    account: newProvider.account,
                    chain: newProvider.chain?.id,
                    transport: 'custom(wcProvider)'
                  });
                  return;
                } else {
                  console.log('No WalletConnect account found');
                }
              } else {
                console.log('WalletConnect provider not connected or no accounts');
              }
            } else {
              console.log('WalletConnect connector not found');
            }
          } catch (error) {
            console.error('Error setting up WalletConnect provider:', error);
          }
        }

        // Set chain ID for Privy wallets or WalletConnect
        if (wallets.length > 0) {
          const walletChainId = +wallets[0].chainId.split(':')[1]; // extract from CAIP-2
          const isWithinVisibleChains = visibleChains.some(
            (chain) => chain.id === walletChainId
          );
          /**
           * Sets supported chain ID rather than throw unsupported bundler error.
           * This does not affect transaction send flow if chain ID remains provided to TransationKit Batches JSX.
           */
          setChainId(isWithinVisibleChains ? walletChainId : visibleChains[0].id);
        } else if (isWalletConnectConnected && !chainId) {
          // For WalletConnect, default to mainnet if no chain ID is set
          setChainId(1);
        }
      };
      updateProvider();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallets, user, account]);



  /**
   * If all the following variables are truthy within the if
   * statement, we can consider this user as logged in and
   * authenticated.
   */
  if (isAppReady && isAuthenticated && provider && chainId) {
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
    Object.keys(appImports).forEach((path) => {
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
    });

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

// Debug: Log WalletConnect configuration
console.log('WalletConnect: Configuration debug:', {
  projectId: import.meta.env.VITE_REOWN_PROJECT_ID ? 'SET' : 'NOT_SET',
  isMobile,
  showQrModal: !isMobile,
  isNewChainsStale: true,
  metadata: {
    name: 'PillarX',
    description: 'PillarX',
    url: 'https://pillarx.app/',
    icons: ['https://pillarx.app/favicon.ico'],
  },
  environment: import.meta.env.MODE,
  baseUrl: import.meta.env.BASE_URL
});

export const config = createConfig({
  chains: [mainnet],
  connectors: [
    walletConnect({
      projectId: import.meta.env.VITE_REOWN_PROJECT_ID ?? '',
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

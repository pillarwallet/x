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
import { createWalletClient, custom, http, WalletClient } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { mainnet, sepolia } from 'viem/chains';
import { createConfig, WagmiProvider, useAccount, useConnect } from 'wagmi';
import { walletConnect } from 'wagmi/connectors';
import * as Sentry from '@sentry/react';

// theme
import { defaultTheme, GlobalStyle } from '../theme';

// providers
import AllowedAppsProvider from '../providers/AllowedAppsProvider';
import LanguageProvider from '../providers/LanguageProvider';

// utils
import { getNetworkViem } from '../apps/deposit/utils/blockchain';
import { isTestnet, visibleChains } from '../utils/blockchain';
import { setupPillarWalletMessaging } from '../utils/pillarWalletMessaging';

// pages
import Advertising from '../pages/Advertising';
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

// UI
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

  const { connectors } = useConnect();
  const { isConnected: wagmiIsConnected } = useAccount();
  const [provider, setProvider] = useState<WalletClient | undefined>(undefined);
  const [chainId, setChainId] = useState<number | undefined>(undefined);
  const [privateKey, setPrivateKey] = useState<string | undefined>(undefined);
  const [pkAccount, setPkAccount] = useState<string | undefined>(undefined);
  const { isLoading: isLoadingAllowedApps } = useAllowedApps();
  const previouslyAuthenticated = !!localStorage.getItem('privy:token');
  const isAppReady = ready && !isLoadingAllowedApps;
  const isAuthenticated = authenticated || wagmiIsConnected || !!pkAccount;

  // Minimal Sentry context for authentication state - only set on errors
  useEffect(() => {
    // Only set context if there's an authentication error
    if (!isAuthenticated && ready && isAppReady) {
      Sentry.setContext('authentication_state', {
        ready,
        authenticated,
        isAppReady,
        isAuthenticated,
        timestamp: new Date().toISOString(),
        wagmiIsConnected,
        hasUser: !!user,
        userAddress: user?.wallet?.address,
      });
    }
  }, [
    ready,
    authenticated,
    isAppReady,
    isAuthenticated,
    user,
    wagmiIsConnected,
  ]);

  useEffect(() => {
    if (!authenticated) return;
    sessionStorage.setItem('loginPageReloaded', 'false');
  }, [authenticated]);

  /**
   * Set up Pillar Wallet webview messaging to receive private keys
   * Only activate when coming from React Native app (iOS or Android)
   */
  useEffect(() => {
    // Check if request is from React Native app
    const searchParams = new URLSearchParams(window.location.search);
    const devicePlatformFromUrl = searchParams.get('devicePlatform');
    const devicePlatformFromStorage = localStorage.getItem('DEVICE_PLATFORM');

    // Check both URL params and localStorage to determine if we're in React Native
    const devicePlatform = devicePlatformFromUrl || devicePlatformFromStorage;
    const isReactNativeApp =
      devicePlatform === 'ios' || devicePlatform === 'android';

    Sentry.addBreadcrumb({
      category: 'authentication',
      message: 'Checking if Pillar Wallet messaging should be enabled',
      level: 'info',
      data: {
        devicePlatformFromUrl,
        devicePlatformFromStorage,
        devicePlatform,
        isReactNativeApp,
      },
    });

    // Only set up messaging if coming from React Native app
    if (isReactNativeApp) {
      // Store device platform in localStorage for persistence across navigation
      if (devicePlatformFromUrl) {
        localStorage.setItem('DEVICE_PLATFORM', devicePlatformFromUrl);
      }

      Sentry.addBreadcrumb({
        category: 'authentication',
        message: 'Setting up Pillar Wallet webview messaging',
        level: 'info',
        data: {
          devicePlatform,
        },
      });

      const cleanup = setupPillarWalletMessaging(
        (address: string, pk: string) => {
          // Success callback - private key received
          // Store in memory only (state) - NEVER persist private keys to localStorage
          setPkAccount(address);
          setPrivateKey(pk);

          // Store only the account address for session detection (NOT the private key)
          localStorage.setItem('ACCOUNT_VIA_PK', address);

          Sentry.addBreadcrumb({
            category: 'authentication',
            message: 'Private key received and stored in memory only',
            level: 'info',
            data: {
              accountAddress: address,
              devicePlatform,
              securityNote: 'Private key kept in memory only, not persisted',
            },
          });
        },
        (error: Error) => {
          // Error callback
          console.error('Pillar Wallet authentication error:', error);

          Sentry.captureException(error, {
            tags: {
              component: 'authentication',
              action: 'pillar_wallet_setup_error',
              devicePlatform: devicePlatform || 'unknown',
            },
          });
        }
      );

      return cleanup;
    }

    // If user was previously authenticated (ACCOUNT_VIA_PK exists) but we're not in RN context,
    // the private key will need to be re-requested on next RN webview load.
    // We never restore private keys from localStorage for security reasons.
    const storedAccount = localStorage.getItem('ACCOUNT_VIA_PK');
    if (storedAccount && !isReactNativeApp) {
      Sentry.addBreadcrumb({
        category: 'authentication',
        message:
          'Previous RN authentication detected, but private key not available',
        level: 'info',
        data: {
          accountAddress: storedAccount,
          securityNote: 'Private key must be re-requested from RN app',
        },
      });
    }

    // No cleanup needed if messaging wasn't set up
    return undefined;
  }, []);

  /**
   * The following useEffect is to detemine if the
   * user is logging in (or has logged in)  with a
   * private key or if the wallet state of Privy changed,
   * and if it did, update the provider (if any).
   * This would also re-render Authorized component with
   * the new state.
   */
  useEffect(() => {
    const providerSetupId = `provider_setup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Start Sentry transaction for provider setup
    Sentry.setContext('provider_setup', {
      providerSetupId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      ready,
      authenticated,
      hasUser: !!user,
      hasWallets: wallets.length > 0,
      wagmiIsConnected,
      connectorsCount: connectors.length,
    });

    // Handle both Privy wallets and WalletConnect connections
    const updateProvider = async () => {
      // PRIORITY 1: Private key authentication (takes precedence over all other methods)
      if (privateKey && pkAccount) {
        Sentry.addBreadcrumb({
          category: 'authentication',
          message: 'Setting up private key provider (priority authentication)',
          level: 'info',
          data: {
            providerSetupId,
            accountAddress: pkAccount,
          },
        });

        const account = privateKeyToAccount(privateKey as `0x${string}`);
        const walletChainId = 1; // default chain id is 1 (mainnet)

        const newProvider = createWalletClient({
          account,
          chain: getNetworkViem(walletChainId),
          transport: http(),
        });

        setProvider(newProvider);

        const isWithinVisibleChains = visibleChains.some(
          (chain) => chain.id === walletChainId
        );
        setChainId(isWithinVisibleChains ? walletChainId : visibleChains[0].id);

        Sentry.addBreadcrumb({
          category: 'authentication',
          message: 'Private key provider setup completed',
          level: 'info',
          data: {
            providerSetupId,
            walletChainId,
            isWithinVisibleChains,
            finalChainId: isWithinVisibleChains
              ? walletChainId
              : visibleChains[0].id,
          },
        });

        return;
      } // END if (privateKey && pkAccount)

      // Don't run provider setup if Privy is still initializing and we're not using WalletConnect
      if (!ready && !wagmiIsConnected) {
        Sentry.addBreadcrumb({
          category: 'authentication',
          message: 'Provider setup skipped - not ready',
          level: 'info',
          data: {
            providerSetupId,
            ready,
            wagmiIsConnected,
          },
        });

        return;
      }

      // Check if we have any wallets (Privy or WalletConnect)
      const hasWallets = wallets.length > 0;
      const isWalletConnectConnected = wagmiIsConnected && !hasWallets;

      Sentry.addBreadcrumb({
        category: 'authentication',
        message: 'Provider setup debug info',
        level: 'info',
        data: {
          providerSetupId,
          isAuthenticated,
          hasWallets,
          isWalletConnectConnected,
          wagmiIsConnected,
          walletsCount: wallets.length,
          connectorsCount: connectors.length,
        },
      });

      // If no wallets and not connected via WalletConnect, return early
      if (!hasWallets && !isWalletConnectConnected) {
        Sentry.addBreadcrumb({
          category: 'authentication',
          message: 'No wallets or WalletConnect connection detected',
          level: 'info',
          data: {
            providerSetupId,
            hasWallets,
            isWalletConnectConnected,
          },
        });

        return;
      }

      // If we have Privy wallets, don't try to setup WalletConnect
      if (hasWallets) {
        Sentry.addBreadcrumb({
          category: 'authentication',
          message: 'Privy wallets detected, skipping WalletConnect setup',
          level: 'info',
          data: {
            providerSetupId,
            walletsCount: wallets.length,
          },
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let privyEthereumProvider: any;

      const privyWalletAddress = user?.wallet?.address;

      const walletProvider = wallets.find(
        (wallet) => wallet.address === privyWalletAddress
      );

      if (walletProvider) {
        // Handle Privy wallet
        Sentry.addBreadcrumb({
          category: 'authentication',
          message: 'Setting up Privy wallet provider',
          level: 'info',
          data: {
            providerSetupId,
            walletAddress: walletProvider.address,
            chainId: walletProvider.chainId,
          },
        });

        privyEthereumProvider = await walletProvider.getEthereumProvider();

        const walletChainId = +wallets[0].chainId.split(':')[1]; // extract from CAIP-2

        const newProvider = createWalletClient({
          account: walletProvider.address as `0x${string}`,
          chain: getNetworkViem(walletChainId),
          transport: custom(privyEthereumProvider),
        });

        setProvider(newProvider);

        Sentry.addBreadcrumb({
          category: 'authentication',
          message: 'Privy wallet provider setup completed',
          level: 'info',
          data: {
            providerSetupId,
            walletAddress: walletProvider.address,
            walletChainId,
            hasProvider: !!newProvider,
          },
        });
      } else if (isWalletConnectConnected && !hasWallets) {
        // Handle WalletConnect connection - only if no Privy wallets are present
        Sentry.addBreadcrumb({
          category: 'authentication',
          message: 'Attempting to setup WalletConnect provider',
          level: 'info',
          data: {
            providerSetupId,
            hasWallets,
            isWalletConnectConnected,
          },
        });

        try {
          // Find the WalletConnect connector
          const walletConnectConnector = connectors.find(
            ({ id }) => id === 'walletConnect'
          );

          Sentry.addBreadcrumb({
            category: 'authentication',
            message: 'WalletConnect connector search result',
            level: 'info',
            data: {
              providerSetupId,
              connectorFound: !!walletConnectConnector,
              connectorsCount: connectors.length,
              connectorIds: connectors.map((c) => c.id),
            },
          });

          if (walletConnectConnector) {
            // Get the WalletConnect provider
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const wcProvider: any = await walletConnectConnector.getProvider();

            Sentry.addBreadcrumb({
              category: 'authentication',
              message: 'WalletConnect provider obtained',
              level: 'info',
              data: {
                providerSetupId,
                hasProvider: !!wcProvider,
                providerConnected: wcProvider?.connected,
                hasAccounts: wcProvider?.accounts?.length > 0,
              },
            });

            // Only proceed if the provider is actually connected
            if (
              wcProvider &&
              wcProvider.connected &&
              wcProvider.accounts &&
              wcProvider.accounts.length > 0
            ) {
              // Get the connected account
              const accounts = await wcProvider.request({
                method: 'eth_accounts',
              });
              const wcAccount = accounts[0];

              Sentry.addBreadcrumb({
                category: 'authentication',
                message: 'WalletConnect account retrieved',
                level: 'info',
                data: {
                  providerSetupId,
                  hasAccount: !!wcAccount,
                  accountAddress: wcAccount,
                  accountsCount: accounts.length,
                },
              });

              if (wcAccount) {
                // Create wallet client with WalletConnect provider
                const newProvider = createWalletClient({
                  account: wcAccount as `0x${string}`,
                  chain: getNetworkViem(1), // Default to mainnet
                  transport: custom(wcProvider),
                });

                setProvider(newProvider);
                setChainId(1); // Default to mainnet

                Sentry.addBreadcrumb({
                  category: 'authentication',
                  message: 'WalletConnect provider setup successful',
                  level: 'info',
                  data: {
                    providerSetupId,
                    account: newProvider.account,
                    chainId: newProvider.chain?.id,
                    transport: 'custom(wcProvider)',
                  },
                });

                Sentry.captureMessage(
                  'WalletConnect provider setup completed successfully',
                  {
                    level: 'info',
                    tags: {
                      component: 'authentication',
                      action: 'walletconnect_setup_success',
                      providerSetupId,
                    },
                    contexts: {
                      walletconnect_success: {
                        providerSetupId,
                        account: newProvider.account,
                        chainId: newProvider.chain?.id,
                        transport: 'custom(wcProvider)',
                      },
                    },
                  }
                );

                return;
              }

              Sentry.captureMessage('No WalletConnect account found', {
                level: 'warning',
                tags: {
                  component: 'authentication',
                  action: 'walletconnect_no_account',
                  providerSetupId,
                },
                contexts: {
                  walletconnect_error: {
                    providerSetupId,
                    hasProvider: !!wcProvider,
                    providerConnected: wcProvider?.connected,
                    accountsCount: wcProvider?.accounts?.length || 0,
                  },
                },
              });
            } else {
              Sentry.captureMessage(
                'WalletConnect provider not connected or no accounts',
                {
                  level: 'warning',
                  tags: {
                    component: 'authentication',
                    action: 'walletconnect_not_connected',
                    providerSetupId,
                  },
                  contexts: {
                    walletconnect_error: {
                      providerSetupId,
                      hasProvider: !!wcProvider,
                      providerConnected: wcProvider?.connected,
                      hasAccounts: wcProvider?.accounts?.length > 0,
                    },
                  },
                }
              );
            }
          } else {
            Sentry.captureMessage('WalletConnect connector not found', {
              level: 'error',
              tags: {
                component: 'authentication',
                action: 'walletconnect_connector_missing',
                providerSetupId,
              },
              contexts: {
                walletconnect_error: {
                  providerSetupId,
                  connectorsCount: connectors.length,
                  connectorIds: connectors.map((c) => c.id),
                },
              },
            });
          }
        } catch (error) {
          console.error('Error setting up WalletConnect provider:', error);

          Sentry.captureException(error, {
            tags: {
              component: 'authentication',
              action: 'walletconnect_setup_error',
              providerSetupId,
            },
            contexts: {
              walletconnect_error: {
                providerSetupId,
                error: error instanceof Error ? error.message : String(error),
                hasWallets,
                isWalletConnectConnected,
              },
            },
          });
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

        Sentry.addBreadcrumb({
          category: 'authentication',
          message: 'Chain ID set for Privy wallets',
          level: 'info',
          data: {
            providerSetupId,
            walletChainId,
            isWithinVisibleChains,
            finalChainId: isWithinVisibleChains
              ? walletChainId
              : visibleChains[0].id,
          },
        });
      } else if (isWalletConnectConnected && !chainId) {
        // For WalletConnect, default to mainnet if no chain ID is set
        setChainId(1);

        Sentry.addBreadcrumb({
          category: 'authentication',
          message: 'Chain ID set for WalletConnect',
          level: 'info',
          data: {
            providerSetupId,
            finalChainId: 1,
          },
        });
      }
    };
    updateProvider();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallets, user, wagmiIsConnected, privateKey, pkAccount]);

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

    Sentry.addBreadcrumb({
      category: 'authentication',
      message: 'User authenticated - setting up authorized routes',
      level: 'info',
      data: {
        isAppReady,
        isAuthenticated,
        hasProvider: !!provider,
        chainId,
        hasUser: !!user,
        wagmiIsConnected,
      },
    });

    // First, add the core routes to the route definition
    const authorizedRoutesDefinition = [
      {
        path: '/',
        element: (
          <Authorized
            chainId={chainId}
            provider={provider}
            privateKey={privateKey}
          />
        ),
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
            path: '/advertising',
            element: <Advertising />,
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

    Sentry.captureMessage('Authorized routes setup completed', {
      level: 'info',
      tags: {
        component: 'authentication',
        action: 'authorized_routes_setup',
      },
      contexts: {
        authorized_routes: {
          routesCount: authorizedRoutesDefinition[0].children.length,
          appImportsCount: Object.keys(appImports).length,
          hasProvider: !!provider,
          chainId,
        },
      },
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
    window.location.pathname === '/advertising' ||
    window.location.pathname === '/privacy-policy' ||
    window.location.pathname === '/login';

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

    Sentry.addBreadcrumb({
      category: 'authentication',
      message: 'User not authenticated - setting up unauthorized routes',
      level: 'info',
      data: {
        isAppReady,
        isAuthenticated,
        isRootPage,
        previouslyAuthenticated,
        currentPath: window.location.pathname,
      },
    });

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
        path: '/advertising',
        element: <Advertising />,
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

    Sentry.captureMessage('Unauthorized routes setup completed', {
      level: 'info',
      tags: {
        component: 'authentication',
        action: 'unauthorized_routes_setup',
      },
      contexts: {
        unauthorized_routes: {
          routesCount: unauthorizedRoutesDefinition.length,
          isAppReady,
          isAuthenticated,
          isRootPage,
          previouslyAuthenticated,
          currentPath: window.location.pathname,
        },
      },
    });

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

  Sentry.addBreadcrumb({
    category: 'authentication',
    message: 'Showing loading state - waiting for authentication',
    level: 'info',
    data: {
      isAppReady,
      isAuthenticated,
      hasProvider: !!provider,
      chainId,
      ready,
      authenticated,
      hasUser: !!user,
      wagmiIsConnected,
    },
  });

  return <Loading type="wait" />;
};

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

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
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default Main;

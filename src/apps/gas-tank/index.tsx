/* eslint-disable @typescript-eslint/no-use-before-define */
import { useEtherspot, useWalletAddress } from '@etherspot/transaction-kit';
import styled from 'styled-components';
import { useEffect, useRef } from 'react';
import { createConfig, EVM } from '@lifi/sdk';

// styles
import './styles/gasTank.css';

// components
import GasTank from './components/GasTank';

// utils
import { supportedChains } from '../../utils/blockchain';
import { addExchangeBreadcrumb, initSentryForGasTank, logExchangeEvent } from './utils/sentry';

export const App = () => {
  const { provider } = useEtherspot();
  const walletAddress = useWalletAddress();

  // Use ref to track if config has been initialized
  const configInitialized = useRef(false);
  useEffect(() => {
    initSentryForGasTank();

    // Log app initialization
    logExchangeEvent(
      'Gas Tank app initialized',
      'info',
      {
        walletAddress,
      },
      {
        component: 'App',
        action: 'initialization',
      }
    );

    addExchangeBreadcrumb('Gas Tank app loaded', 'app', {
      walletAddress,
      timestamp: new Date().toISOString(),
    });
  }, [walletAddress]);

  /**
   * Initialize LiFi SDK configuration
   * This sets up the LiFi SDK with the wallet provider and chain switching capabilities
   * Only runs once when the provider is available to avoid multiple initializations
   */
  useEffect(() => {
    if (!provider || configInitialized.current) {
      return;
    }

    try {
      /**
       * Create LiFi configuration with:
       * - Integrator name for tracking
       * - EVM provider with wallet client and chain switching
       * - API key for LiFi services
       */
      createConfig({
        integrator: 'PillarX',
        providers: [
          EVM({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            getWalletClient: async () => provider as any,

            /**
             * Chain switching functionality
             * Handles switching between different blockchain networks
             * Implements EIP-1193 standard for wallet chain switching
             */
            switchChain: async (chainId) => {
              // Log chain switching initiation
              logExchangeEvent(
                'Chain switching initiated',
                'info',
                {
                  walletAddress,
                  chainId,
                  currentChain: supportedChains.find(
                    (chain) => chain.id === chainId
                  ),
                },
                {
                  component: 'App',
                  action: 'chain_switch',
                }
              );

              try {
                /**
                 * Step 1: Validate chain support
                 * Check if the requested chain is supported by our application
                 */
                const targetChain = supportedChains.find(
                  (chain) => chain.id === chainId
                );

                if (!targetChain) {
                  throw new Error(`Chain ${chainId} is not supported`);
                }

                /**
                 * Step 2: Request EIP-1193 chain switch on the underlying provider
                 * This uses the standard Ethereum wallet interface to switch chains
                 */
                const providerWithRequest = provider as {
                  request?: (args: {
                    method: string;
                    params: unknown[];
                  }) => Promise<unknown>;
                };

                if (providerWithRequest.request) {
                  try {
                    /**
                     * Attempt to switch to the target chain
                     * Uses wallet_switchEthereumChain method
                     */
                    await providerWithRequest.request({
                      method: 'wallet_switchEthereumChain',
                      params: [{ chainId: `0x${chainId.toString(16)}` }],
                    });
                  } catch (switchError: unknown) {
                    /**
                     * Step 3: Handle chain not found (error code 4902)
                     * If the chain is not added to the wallet, try to add it
                     * This provides a seamless user experience
                     */
                    if ((switchError as { code?: number }).code === 4902) {
                      await providerWithRequest.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                          {
                            chainId: `0x${chainId.toString(16)}`,
                            chainName: targetChain.name,
                            nativeCurrency: targetChain.nativeCurrency,
                            rpcUrls: targetChain.rpcUrls.default.http,
                            blockExplorerUrls: targetChain.blockExplorers
                              ?.default?.url
                              ? [targetChain.blockExplorers.default.url]
                              : undefined,
                          },
                        ],
                      });
                    } else {
                      throw switchError;
                    }
                  }
                }

                /**
                 * Step 4: Log successful chain switch
                 * Record the successful chain switch for monitoring and debugging
                 */
                logExchangeEvent(
                  'Chain switching completed',
                  'info',
                  {
                    walletAddress,
                    chainId,
                    newChain: targetChain,
                  },
                  {
                    component: 'App',
                    action: 'chain_switch_success',
                  }
                );

                /**
                 * Step 5: Return the provider for LiFi SDK
                 * The LiFi SDK expects a specific client type, so we cast accordingly
                 */
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                return provider as any;
              } catch (error) {
                /**
                 * Error handling for chain switching failures
                 * Log the error and re-throw for proper error handling
                 */
                logExchangeEvent(
                  'Chain switching failed',
                  'error',
                  {
                    walletAddress,
                    chainId,
                    error:
                      error instanceof Error ? error.message : String(error),
                  },
                  {
                    component: 'App',
                    action: 'chain_switch_error',
                  }
                );
                throw error;
              }
            },
          }),
        ],
        apiKey: import.meta.env.VITE_LIFI_API_KEY,
      });

      // Mark config as initialized to prevent re-initialization
      configInitialized.current = true;
    } catch (error) {
      /**
       * Error handling for LiFi config initialization
       * Log the error and continue with app functionality
       */
      console.error('Failed to initialize LiFi config:', error);
      logExchangeEvent(
        'LiFi config initialization failed',
        'error',
        {
          walletAddress,
          error: error instanceof Error ? error.message : String(error),
        },
        {
          component: 'App',
          action: 'config_init_error',
        }
      );
    }
  }, [provider, walletAddress]);
  return (
    <Wrapper>
      <GasTank />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  margin: 0 auto;
  flex-direction: column;
  max-width: 1248px;
  padding: 32px;

  @media (min-width: 1024px) {
    padding: 52px 62px;
  }

  @media (max-width: 1024px) {
    padding: 52px 32px;
  }

  @media (max-width: 768px) {
    padding: 32px 16px;
  }
`;

export default App;

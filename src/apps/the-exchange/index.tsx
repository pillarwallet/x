/* eslint-disable @typescript-eslint/no-use-before-define */
import { EVM, createConfig } from '@lifi/sdk';
import { useEffect, useRef } from 'react';

// styles
import styled from 'styled-components';
import './styles/tailwindTheExchange.css';

// hooks
import useTransactionKit from '../../hooks/useTransactionKit';
import { useAppSelector } from './hooks/useReducerHooks';

// utils
import { supportedChains } from '../../utils/blockchain';
import {
  addExchangeBreadcrumb,
  initSentryForExchange,
  logExchangeEvent,
} from './utils/sentry';

// components
import CardsSwap from './components/CardsSwap/CardsSwap';
import ExchangeAction from './components/ExchangeAction/ExchangeAction';
import ExchangeHeader from './components/ExchangeHeader/ExchangeHeader';
import SwapSummary from './components/SwapSummary/SwapSummary';

// images
import XBackground from './images/x-background.svg';

export const App = () => {
  const { kit, walletAddress } = useTransactionKit();
  const { walletMode } = kit.getEtherspotProvider().getConfig();
  const provider =
    walletMode === 'modular'
      ? kit.getProvider()
      : kit.getEtherspotProvider().getWalletClient();
  const isSwapOpen = useAppSelector(
    (state) => state.swap.isSwapOpen as boolean
  );
  const isReceiveOpen = useAppSelector(
    (state) => state.swap.isReceiveOpen as boolean
  );

  // Use ref to track if config has been initialized
  const configInitialized = useRef(false);

  /**
   * Initialize Sentry for the-exchange app
   * This sets up error tracking and logging for the exchange functionality
   */
  useEffect(() => {
    initSentryForExchange();

    // Log app initialization
    logExchangeEvent(
      'The Exchange app initialized',
      'info',
      {
        walletAddress,
        isSwapOpen,
        isReceiveOpen,
      },
      {
        component: 'App',
        action: 'initialization',
      }
    );

    addExchangeBreadcrumb('The Exchange app loaded', 'app', {
      walletAddress,
      timestamp: new Date().toISOString(),
    });
  }, [walletAddress, isSwapOpen, isReceiveOpen]);

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

  /**
   * Main app render
   * Displays the exchange interface with swap cards and action buttons
   */
  return (
    <Wrapper>
      <ExchangeHeader />
      <div className="flex flex-col items-center z-10 gap-4 desktop:gap-8">
        <CardsSwap />
        {isSwapOpen || isReceiveOpen ? null : (
          <>
            <SwapSummary />
            <ExchangeAction />
          </>
        )}
      </div>
      <div className="fixed inset-x-0 mobile:bottom-0 tablet:top-0 desktop:top-0 flex justify-center overflow-hidden">
        <img
          src={XBackground}
          alt="the-exchange-backgroun-image"
          className="w-full h-auto transform rotate-[-15deg]"
        />
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
  margin: 0 auto;
  flex-direction: column;
  background-color: #eeeeee;

  @media (min-width: 768px) {
    padding: 35px 60px;
  }

  @media (max-width: 768px) {
    padding: 35px 16px;
  }
`;

export default App;

/* eslint-disable @typescript-eslint/no-use-before-define */
import { useEtherspot, useWalletAddress } from '@etherspot/transaction-kit';
import { EVM, createConfig } from '@lifi/sdk';
import { Chain, WalletClient, createWalletClient, http } from 'viem';
import { useEffect, useRef } from 'react';

// styles
import styled from 'styled-components';
import './styles/tailwindTheExchange.css';

// hooks
import { useAppSelector } from './hooks/useReducerHooks';

// utils
import { supportedChains } from '../../utils/blockchain';
import {
  initSentryForExchange,
  logExchangeEvent,
  addExchangeBreadcrumb,
} from './utils/sentry';

// components
import CardsSwap from './components/CardsSwap/CardsSwap';
import ExchangeAction from './components/ExchangeAction/ExchangeAction';
import ExchangeHeader from './components/ExchangeHeader/ExchangeHeader';
import SwapSummary from './components/SwapSummary/SwapSummary';

// images
import XBackground from './images/x-background.svg';

export const App = () => {
  const { provider } = useEtherspot();
  const walletAddress = useWalletAddress();
  const isSwapOpen = useAppSelector(
    (state) => state.swap.isSwapOpen as boolean
  );
  const isReceiveOpen = useAppSelector(
    (state) => state.swap.isReceiveOpen as boolean
  );

  // Use ref to track if config has been initialized
  const configInitialized = useRef(false);

  // Initialize Sentry for the-exchange app
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

  // Initialize LiFi config only once when provider is available
  useEffect(() => {
    if (!provider || configInitialized.current) {
      return;
    }

    try {
      createConfig({
        integrator: 'PillarX',
        providers: [
          EVM({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            getWalletClient: async () => provider as any,
            switchChain: async (chainId) => {
              // Log chain switching
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
                // Switch chain by creating a new wallet client
                const newWalletClient = createWalletClient({
                  account: (provider as WalletClient).account,
                  chain: supportedChains.find(
                    (chain) => chain.id === chainId
                  ) as Chain,
                  transport: http(),
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                }) as any;

                // Log successful chain switch
                logExchangeEvent(
                  'Chain switching completed',
                  'info',
                  {
                    walletAddress,
                    chainId,
                    newChain: supportedChains.find(
                      (chain) => chain.id === chainId
                    ),
                  },
                  {
                    component: 'App',
                    action: 'chain_switch_success',
                  }
                );

                return newWalletClient;
              } catch (error) {
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

      configInitialized.current = true;
    } catch (error) {
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

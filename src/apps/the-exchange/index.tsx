/* eslint-disable @typescript-eslint/no-use-before-define */
import { useEtherspot } from '@etherspot/transaction-kit';
import { EVM, createConfig } from '@lifi/sdk';
import { Chain, WalletClient, createWalletClient, http } from 'viem';

// styles
import styled from 'styled-components';
import './styles/tailwindTheExchange.css';

// hooks
import { useAppSelector } from './hooks/useReducerHooks';

// utils
import { supportedChains } from '../../utils/blockchain';

// components
import CardsSwap from './components/CardsSwap/CardsSwap';
import ExchangeAction from './components/ExchangeAction/ExchangeAction';
import ExchangeHeader from './components/ExchangeHeader/ExchangeHeader';
import SwapSummary from './components/SwapSummary/SwapSummary';

// images
import XBackground from './images/x-background.svg';

export const App = () => {
  const { provider } = useEtherspot();
  const isSwapOpen = useAppSelector(
    (state) => state.swap.isSwapOpen as boolean
  );
  const isReceiveOpen = useAppSelector(
    (state) => state.swap.isReceiveOpen as boolean
  );

  // Debug provider setup
  console.log('Exchange App - Provider debug:', {
    hasProvider: !!provider,
    providerType: provider?.constructor?.name,
    providerAccount: provider?.account,
    providerChain: provider?.chain?.id
  });

  createConfig({
    integrator: 'PillarX',
    providers: [
      EVM({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getWalletClient: async () => provider as any,
        switchChain: async (chainId) =>
          // Switch chain by creating a new wallet client
          createWalletClient({
            account: (provider as WalletClient).account,
            chain: supportedChains.find(
              (chain) => chain.id === chainId
            ) as Chain,
            transport: http(),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          }) as any,
      }),
    ],
    apiKey: import.meta.env.VITE_LIFI_API_KEY,
  });

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

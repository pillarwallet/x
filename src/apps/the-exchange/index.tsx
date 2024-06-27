import styled from 'styled-components';
import './styles/tailwindTheExchange.css';
import XBackground from './images/x-background.svg';
import ExchangeHeader from './components/ExchangeHeader/ExchangeHeader';
import { SwapDataProvider } from './context/SwapDataProvider';
import CardsSwap from './components/CardsSwap/CardsSwap';
import SwapSummary from './components/SwapSummary/SwapSummary';
import ExchangeAction from './components/ExchangeAction/ExchangeAction';

export const App = () => {
  return (
    <SwapDataProvider>
      <Wrapper >
      <ExchangeHeader />
        <div className='flex flex-col items-center z-10 gap-4 desktop:gap-8'>
          <CardsSwap />
          <SwapSummary />
          <ExchangeAction />
        </div>
        <div className="fixed inset-x-0 mobile:bottom-0 tablet:top-0 desktop:top-0 flex justify-center overflow-hidden">
          <img src={XBackground} className='w-full h-auto transform rotate-[-15deg]' />
        </div>
      </Wrapper>
    </SwapDataProvider>
  )
}


const Wrapper = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
  margin: 0 auto;
  flex-direction: column;
  background-color: #EEEEEE;

  @media (min-width: 800px) {
    padding: 35px 60px
  }

  @media (max-width: 800px) {
    padding: 35px 16px
  }
`;

export default App;

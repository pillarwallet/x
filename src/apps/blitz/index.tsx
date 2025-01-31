/* eslint-disable @typescript-eslint/no-use-before-define */
import styled from 'styled-components';
import './styles/tailwindBlitz.css';

import TimeClock from './components/TimeClock/TimeClock';
import TokenPriceUpdate from './components/TokenPriceUpdate/TokenPriceUpdate';
import PillarXLogo from './images/pillarX_full_white.png';

const App = () => {
  return (
    <Wrapper id="blitz-app">
      <img
        src={PillarXLogo}
        alt="pillar-x-logo"
        className="w-min object-contain h-[20px] mb-[70px] mobile:h-[18px] mobile:mb-[58px] self-center"
      />
      <TokenPriceUpdate />
      <TimeClock />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  margin: 0 auto;
  flex-direction: column;
  max-width: 1248px;

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

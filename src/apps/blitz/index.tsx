/* eslint-disable @typescript-eslint/no-use-before-define */
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import TokenPriceTime from './components/TokenPriceTime/TokenPriceTime';
import VoteInfoButton from './components/VoteInfoButton/VoteInfoButton';
import VotersList from './components/VotersList/VotersList';
import BlitzLogo from './images/Blitz_Logo.png';
import PillarXLogo from './images/pillarX_full_white.png';
import './styles/tailwindBlitz.css';

const App = () => {
  const [isDesktop, setIsDesktop] = useState<boolean>(window.innerWidth > 1023);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 1023);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Wrapper id="blitz-app">
      <img
        src={PillarXLogo}
        alt="pillar-x-logo"
        className="w-min object-contain h-[20px] mb-10 mobile:h-[18px] self-center"
      />
      <img
        src={BlitzLogo}
        alt="blitz-logo"
        className="w-min object-contain h-[40px] desktop:mb-20 tablet:mb-16 self-center"
      />
      {isDesktop ? (
        <div className="flex w-full gap-6">
          <VoteInfoButton type="up" />
          <TokenPriceTime />
          <VoteInfoButton type="down" />
        </div>
      ) : (
        <div className="flex-col w-full">
          <TokenPriceTime />
          <div className="flex w-full mt-5 gap-4 justify-center">
            <VoteInfoButton type="up" />
            <VoteInfoButton type="down" />
          </div>
        </div>
      )}
      <VotersList />
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

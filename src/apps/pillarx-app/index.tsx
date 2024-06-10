import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

// hooks
import { useApiData } from './hooks/useApiData';

// components
import PillarXLogo from './components/PillarXLogo/PillarXLogo';
import pillarLogoLight from './images/pillarX_full_white.png';
import H1 from './components/Typography/H1';
import PortfolioOverview from './components/PortfolioOverview/PortfolioOverview';
import TokensHorizontalTile from './components/TokensHorizontalTile/TokensHorizontalTile';
import TokensVerticalTile from './components/TokensVerticalTile/TokensVerticalTile';

export const App = () => {
  const [t] = useTranslation();

  const {
    isLoading,
    dataPortlioOverview,
    dataTokensHorizontal,
    dataTokensVerticalLeft,
    dataTokensVerticalRight,
    titleTokensHorizontal,
    titledataTokensVerticalLeft,
    titledataTokensVerticalRight,
  } = useApiData();

  return (
    <Wrapper>
      <PillarXLogo src={pillarLogoLight} className='h-[20px] mb-[70px] mobile:h-[18px] mobile:mb-[58px] self-center' />
      <H1 className='py-2.5 px-4 mobile:px-0'>{t`content.welcomeBack`} {dataPortlioOverview?.wallet.substring(0, 6)}...{dataPortlioOverview?.wallet.substring(dataPortlioOverview?.wallet.length - 5)}</H1>
        <div className='flex flex-col gap-[40px] tablet:gap-[28px] mobile:gap-[32px]'>
          <PortfolioOverview data={dataPortlioOverview} isDataLoading={isLoading} />
          <TokensHorizontalTile data={dataTokensHorizontal} isDataLoading={isLoading} tileTitle={titleTokensHorizontal || ''}/>
          <TokensVerticalTile dataLeft={dataTokensVerticalLeft} dataRight={dataTokensVerticalRight} titleLeft={titledataTokensVerticalLeft || ''} titleRight={titledataTokensVerticalRight || ''} isDataLoading={isLoading}/>
        </div>
    </Wrapper>
  )
}


const Wrapper = styled.div`
  display: flex;
  width: 100%;
  margin: 0 auto;
  flex-direction: column;

  @media (min-width: 800px) {
    padding: 50px 60px
  }

  @media (max-width: 800px) {
    padding: 50px 32px
  }

  @media (max-width: 360px) {
    padding: 32px 16px
  }
`;

export default App;

import styled from 'styled-components';
import { useGetTilesInfoQuery } from './api/apiSlice';
import { useTranslation } from 'react-i18next';

// types
import { WalletPortfolioData, TokenData, ApiLayout } from '../../types/api';

// components
import PillarXLogo from './components/PillarXLogo/PillarXLogo';
import pillarLogoLight from './images/pillarX_full_white.png';
import H1 from './components/Typography/H1';
import PortfolioOverview from './components/PortfolioOverview/PortfolioOverview';
import TrendingTokens from './components/TrendingTokens/TrendingTokens';
import ClimbersLosersTokens from './components/ClimbersLosersTokens/ClimbersLosersTokens';

export const App = () => {
  const [t] = useTranslation();

  const { data, isLoading } = useGetTilesInfoQuery('');

  const dataPortlioOverview =  data?.projection.find((data) => data.layout === ApiLayout.OVERVIEW)?.data as WalletPortfolioData;

  const dataTrendingTokens =  data?.projection.find((data) => data.layout === ApiLayout.TOKENS_HORIZONTAL)?.data as TokenData[];

  const dataClimbersLosersTokens =  data?.projection.find((data) => data.layout === ApiLayout.TOKENS_VERTICAL)?.data as TokenData[];

  return (
    <Wrapper>
      <PillarXLogo src={pillarLogoLight} className='h-[20px] mb-[70px] mobile:h-[18px] mobile:mb-[58px] self-center' />
      <H1 className='py-2.5 px-4 mobile:px-0'>{t`content.welcomeBack`} {dataPortlioOverview?.wallet.substring(0, 6)}...{dataPortlioOverview?.wallet.substring(dataPortlioOverview?.wallet.length - 5)}</H1>
        <div className='flex flex-col gap-[40px] tablet:gap-[28px] mobile:gap-[32px]'>
          <PortfolioOverview data={dataPortlioOverview} isDataLoading={isLoading} />
          <TrendingTokens data={dataTrendingTokens} isDataLoading={isLoading}/>
          <ClimbersLosersTokens data={dataClimbersLosersTokens} isDataLoading={isLoading}/>
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

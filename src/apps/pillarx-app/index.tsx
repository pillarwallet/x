import styled from 'styled-components';
import { useGetTilesInfoQuery } from './api/apiSlice';
import { useTranslation } from 'react-i18next';

// components
import PillarXLogo from './components/PillarXLogo/PillarXLogo';
import pillarLogoLight from './images/pillarX_full_white.png';
import H1 from './components/Typography/H1';
import PortofolioOverview from './components/PortofolioOverview/PortofolioOverview';

export const App = () => {
  const [t] = useTranslation();

  const { data, isLoading } = useGetTilesInfoQuery('');

  const dataPortolioOverview = isLoading ? undefined : data?.projection[0].data;

  const {wallet} = dataPortolioOverview || {};

  return (
    <Wrapper>
      <PillarXLogo src={pillarLogoLight} className='h-[20px] mb-[70px] mobile:h-[18px] mobile:mb-[58px] self-center' />
      <H1 className='py-2.5 px-4 mobile:px-0'>{t`Welcome back`} {wallet?.substring(0, 6)}...{wallet?.substring(wallet.length - 5)}</H1>
      <PortofolioOverview data={isLoading ? undefined : data?.projection[0].data} isDataLoading={isLoading} />
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

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

// types
import { Projection } from '../../types/api';

// hooks
import { useGetTilesInfoQuery } from './api/apiSlice';
import { useWalletAddress } from '@etherspot/transaction-kit';

// components
import PillarXLogo from './components/PillarXLogo/PillarXLogo';
import pillarLogoLight from './images/pillarX_full_white.png';
import H1 from './components/Typography/H1';
import { componentMap } from './utils/configComponent';
import SkeletonTiles from './components/SkeletonTile/SkeletonTile';

export const App = () => {
  const [t] = useTranslation();
  const [page, setPage] = useState(1);
  const [pageData, setPageData] = useState<Projection[]>([]);

  const walletAddress = useWalletAddress();
  const { data: apiData, isLoading: isApiLoading, isFetching } = useGetTilesInfoQuery( { page: page, address: walletAddress || '' });

  useEffect(() => {
    // when apiData loads, we save it in a state to keep previous data
      if (apiData) {
          setPageData((prevData) => [...prevData, ...apiData.projection]);
      }
  }, [apiData]);

  // scroll handler makes sure that when reaching the end of the page, it loads the next page
  const handleScroll = () => {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
          setPage((prevPage) => prevPage + 1);
      }
  };

  useEffect(() => {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
  }, []);



const displayAllTiles = () => {
  const allTileComponents = [];
  
  for (let index = 0; index < pageData.length; index++) {
    const tileData = pageData[index];
    
    const TileComponent = componentMap[tileData.layout];
    
    if (TileComponent) {
      allTileComponents.push(<TileComponent key={index} data={tileData} isDataLoading={isApiLoading} />);
    } else {
      return null;
    }
  }
  
  return allTileComponents;
};

  return (
    <Wrapper>
      <PillarXLogo src={pillarLogoLight} className='object-contain h-[20px] mb-[70px] mobile:h-[18px] mobile:mb-[58px] self-center' />
      <H1 className='py-2.5 px-4 mobile:px-0'>{t`content.welcomeBack`} {walletAddress?.substring(0, 6)}...{walletAddress?.substring(walletAddress?.length - 5)}</H1>
        <div className='flex flex-col gap-[40px] tablet:gap-[28px] mobile:gap-[32px]'>
          {displayAllTiles()}
          {isFetching && <><SkeletonTiles type='horizontal' /><SkeletonTiles type='vertical' /></>}
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

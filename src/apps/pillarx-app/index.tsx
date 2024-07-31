import { createRef, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import './styles/tailwindPillarX.css';

// types
import { Projection } from '../../types/api';

// hooks
import { useWalletAddress } from '@etherspot/transaction-kit';
import { useGetTilesInfoQuery } from './api/homeFeed';
import { useGetWaitlistQuery } from '../../services/pillarXApiWaitlist';
import useRefDimensions from './hooks/useRefDimensions';

// utils
import { componentMap } from './utils/configComponent';

// components
import SkeletonTiles from './components/SkeletonTile/SkeletonTile';
import H1 from './components/Typography/H1';
import Body from './components/Typography/Body';

// images
import PillarXLogo from './components/PillarXLogo/PillarXLogo';
import pillarLogoLight from './images/pillarX_full_white.png';

// constants
import { PAGE_LIMIT } from './utils/constants';

const App = () => {
  const [t] = useTranslation();
  const [page, setPage] = useState(1);
  const [isLoadingNextPage, setIsLoadingNextPage] = useState(false);
  const [pageData, setPageData] = useState<Projection[]>([]);
  const walletAddress = useWalletAddress();

  const divRef = createRef<HTMLDivElement>();
  const dimensions = useRefDimensions(divRef);

  // The API call will not fire if there is no walletAddress
  const { data: apiData, isLoading: isApiLoading, isFetching, isSuccess } = useGetTilesInfoQuery( { page: page, address: walletAddress || '' }, { skip: !walletAddress });
  // This is a "fire and forget" call to the waitlist
  const { data: waitlistData, isLoading: isWaitlistLoading, isSuccess: isWaitlistSucess  } = useGetWaitlistQuery(walletAddress || '');

  useEffect(() => {
    // when apiData loads, we save it in a state to keep previous data
    if (apiData && isSuccess) {
      setPageData((prevData) => {
        const newApiData = [...prevData];
        apiData.projection.forEach(item => {
          if (!prevData.includes(item)) {
            newApiData.push(item);
          }
        });
        return newApiData;
      });
      setIsLoadingNextPage(true);
    }
  }, [apiData, isSuccess]);

  // scroll handler makes sure that when reaching the end of the page, it loads the next page
  useEffect(() => {
    const handleScrollOrWheel = () => {
      const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
      if ((scrollTop + clientHeight >= scrollHeight - 300 || dimensions.height <= window.innerHeight) && !isFetching && isLoadingNextPage) {
        if (PAGE_LIMIT === 0 || page < PAGE_LIMIT) {
          setIsLoadingNextPage(false);
          setPage(() => page + 1);
        }
      }
    };

    window.addEventListener('scroll', handleScrollOrWheel);
    window.addEventListener('wheel', handleScrollOrWheel);
    return () => {
      window.removeEventListener('scroll', handleScrollOrWheel);
      window.removeEventListener('wheel', handleScrollOrWheel);
    };
  }, [dimensions.height, isFetching, isLoadingNextPage, page]);

  // useMemo here to reload all components and create a smoother scrolling experience
  const DisplayAllTiles = useMemo(() => {
    const allTileComponents = [];
  
    for (let index = 0; index < pageData.length; index++) {
      const tileData = pageData[index];
    
      const TileComponent = componentMap[tileData.layout];
    
      if (TileComponent) {
        allTileComponents.push(<TileComponent key={index} data={tileData} isDataLoading={isApiLoading} />);
      }
    }
  
    return allTileComponents;
  }, [pageData, isApiLoading]);

  return (
    <Wrapper>
      <PillarXLogo src={pillarLogoLight} className='object-contain h-[20px] mb-[70px] mobile:h-[18px] mobile:mb-[58px] self-center' />
      <H1 className='desktop:py-2.5 desktop:px-4 tablet:py-2.5 tablet:px-4 mobile:px-0'>{t`content.welcomeBackTester`} {waitlistData?.number && !isWaitlistLoading && isWaitlistSucess ? waitlistData.number : '...'}</H1>
      <div ref={divRef} className='flex flex-col gap-[40px] tablet:gap-[28px] mobile:gap-[32px]'>
        {DisplayAllTiles}
        {isFetching && <><SkeletonTiles type='horizontal' /><SkeletonTiles type='vertical' /></>}
        {page >= PAGE_LIMIT && <Body className='text-center mb-12'>That&apos;s all for now</Body>}
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  margin: 0 auto;
  flex-direction: column;
  max-width: 1248px;

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

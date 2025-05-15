/* eslint-disable @typescript-eslint/no-use-before-define */
import { useWalletAddress } from '@etherspot/transaction-kit';
import { setWalletAddresses } from '@hypelab/sdk-react';
import { useWallets } from '@privy-io/react-auth';
import { createRef, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import './styles/tailwindPillarX.css';

// types
import { Projection, WalletData } from '../../types/api';

// hooks
import { useRecordPresenceMutation } from '../../services/pillarXApiPresence';
import { useGetWaitlistQuery } from '../../services/pillarXApiWaitlist';
import {
  useGetTilesInfoQuery,
  useGetWalletInfoQuery,
  useRecordProfileMutation,
} from './api/homeFeed';
import useRefDimensions from './hooks/useRefDimensions';

// utils
import { componentMap } from './utils/configComponent';

// components
import AnimatedTile from './components/AnimatedTile/AnimatedTitle';
import PortfolioOverview from './components/PortfolioOverview/PortfolioOverview';
import SkeletonTiles from './components/SkeletonTile/SkeletonTile';
import Body from './components/Typography/Body';
import H1 from './components/Typography/H1';

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
  const [walletData, setWalletData] = useState<WalletData | undefined>(
    undefined
  );

  // Import wallets
  const walletAddress = useWalletAddress();
  const { wallets: privyWallets } = useWallets();

  const scrollPositionRef = useRef<number>(0);
  const divRef = createRef<HTMLDivElement>();
  const dimensions = useRefDimensions(divRef);

  /**
   * Import the recordPresence mutation from the
   * pillarXApiPresence service. We use this to
   * collect data on when the Home feed page is displaying
   */
  const [recordPresence] = useRecordPresenceMutation();

  /**
   * Import the recordProfile mutation from the
   * homefeed hook to let the PillarX API know
   * the EOA to Smart Wallet address mapping
   */
  const [recordProfile] = useRecordProfileMutation();

  // The API calls below will not fire if there is no walletAddress
  const {
    data: homeFeed,
    isLoading: isHomeFeedLoading,
    isFetching: isHomeFeedFetching,
    isSuccess: isHomeFeedSuccess,
    refetch: refetchHomeFeed,
  } = useGetTilesInfoQuery(
    { page, address: walletAddress || '' },
    { skip: !walletAddress }
  );
  const {
    data: walletTile,
    isLoading: isWalletTileLoading,
    isFetching: isWalletTileFetching,
    isSuccess: isWalletTileSuccess,
    refetch: refetchWalletTile,
  } = useGetWalletInfoQuery(
    { address: walletAddress || '' },
    { skip: !walletAddress }
  );
  // This is a "fire and forget" call to the waitlist
  const {
    data: waitlistData,
    isLoading: isWaitlistLoading,
    isSuccess: isWaitlistSucess,
  } = useGetWaitlistQuery(
    { address: walletAddress || '' },
    { skip: !walletAddress }
  );

  useEffect(() => {
    // This is a "fire and forget" call to the profile API

    // Did we have a truthy wallet address and truthy privyWallets?
    if (walletAddress && privyWallets) {
      // If we have a privyWallets array, we want to record the profile
      if (privyWallets.length > 0) {
        // We want to record the profile with the first wallet in the array
        recordProfile({
          owner: privyWallets[0]?.address,
          account: walletAddress,
        });
      }
    }
  }, [walletAddress, privyWallets, recordProfile]);

  // This useEffect is to update the wallet data
  useEffect(() => {
    if (!isWalletTileSuccess && walletAddress) {
      refetchWalletTile();
    }

    if (walletTile && isWalletTileSuccess) {
      setWalletData(walletTile);
    }

    if (!isWalletTileSuccess) {
      setWalletData(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletTile, isWalletTileSuccess, walletAddress]);

  useEffect(() => {
    if (!isHomeFeedSuccess && walletAddress) {
      refetchHomeFeed();
    }

    // when apiData loads, we save it in a state to keep previous data
    if (homeFeed && isHomeFeedSuccess) {
      setPageData((prevData) => {
        const newApiData = [...prevData];
        homeFeed.projection.forEach((item) => {
          if (!prevData.includes(item)) {
            newApiData.push(item);
          }
        });
        return newApiData;
      });
      recordPresence({
        address: walletAddress,
        action: 'app:feed:navigate',
        value: {
          pageNumber: page,
        },
      });
      setIsLoadingNextPage(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [homeFeed, isHomeFeedSuccess, walletAddress]);

  // scroll handler makes sure that when reaching the end of the page, it loads the next page
  useEffect(() => {
    const handleScrollOrWheel = () => {
      const { scrollTop, clientHeight, scrollHeight } =
        document.documentElement;
      scrollPositionRef.current = scrollTop;
      if (
        (scrollTop + clientHeight >= scrollHeight - 300 ||
          dimensions.height <= window.innerHeight) &&
        !isHomeFeedFetching &&
        isLoadingNextPage
      ) {
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
  }, [dimensions.height, isHomeFeedFetching, isLoadingNextPage, page]);

  useEffect(() => {
    window.scrollTo(0, scrollPositionRef.current);
  }, [pageData]);

  // to track walletAddress and adverts
  useEffect(() => {
    if (walletAddress) {
      setWalletAddresses([walletAddress]);
    }
  }, [walletAddress]);

  // useMemo here to reload all components and create a smoother scrolling experience
  const DisplayHomeFeedTiles = useMemo(() => {
    const allTileComponents = [];

    // eslint-disable-next-line no-plusplus
    for (let index = 0; index < pageData.length; index++) {
      const tileData = pageData[index];

      const TileComponent = componentMap[tileData.layout];

      if (TileComponent) {
        allTileComponents.push(
          <AnimatedTile
            key={tileData.id}
            isDataLoading={isHomeFeedLoading}
            data={tileData}
            accountAddress={walletAddress}
          >
            <TileComponent
              key={index}
              data={tileData}
              isDataLoading={isHomeFeedLoading}
            />
          </AnimatedTile>
        );
      }
    }

    return allTileComponents;
  }, [pageData, isHomeFeedLoading, walletAddress]);

  return (
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    <Wrapper>
      <PillarXLogo
        src={pillarLogoLight}
        className="object-contain h-[20px] mb-[70px] mobile:h-[18px] mobile:mb-[58px] self-center"
      />
      <H1 className="desktop:py-2.5 desktop:px-4 tablet:py-2.5 tablet:px-4 mobile:px-0">
        {t`content.welcomeBackTester`}{' '}
        {waitlistData?.number && !isWaitlistLoading && isWaitlistSucess
          ? waitlistData.number
          : '...'}
      </H1>
      <div
        ref={divRef}
        className="flex flex-col gap-[40px] tablet:gap-[28px] mobile:gap-[32px]"
      >
        <PortfolioOverview
          data={walletData}
          isDataLoading={isWalletTileLoading || isWalletTileFetching}
        />
        {DisplayHomeFeedTiles}
        {(isHomeFeedFetching || isHomeFeedLoading) && page === 1 && (
          <>
            <SkeletonTiles type="horizontal" />
            <SkeletonTiles type="vertical" />
          </>
        )}
        {(isHomeFeedFetching || isHomeFeedLoading) && page !== 1 && (
          <Body className="text-center mb-12">Loading more...</Body>
        )}
        {page >= PAGE_LIMIT && (
          <Body className="text-center mb-12">That&apos;s all for now</Body>
        )}
      </div>
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

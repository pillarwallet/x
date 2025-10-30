/* eslint-disable @typescript-eslint/no-use-before-define */
import { setWalletAddresses } from '@hypelab/sdk-react';
import { useWallets } from '@privy-io/react-auth';
import { Setting2 } from 'iconsax-react';
import {
  createRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import './styles/tailwindPillarX.css';

// types
import { Projection } from '../../types/api';

// hooks
import { useEIP7702Upgrade } from '../../hooks/useEIP7702Upgrade';
import useTransactionKit from '../../hooks/useTransactionKit';
import { useRecordPresenceMutation } from '../../services/pillarXApiPresence';
import { useGetTilesInfoQuery, useRecordProfileMutation } from './api/homeFeed';
import { useAppDispatch, useAppSelector } from './hooks/useReducerHooks';
import useRefDimensions from './hooks/useRefDimensions';

// reducer
import { setIsUpgradeWalletModalOpen } from './reducer/WalletPortfolioSlice';

// utils
import { componentMap } from './utils/configComponent';

// components
import EIP7702UpgradeModal from '../../components/EIP7702UpgradeModal/EIP7702UpgradeModal';
import AnimatedTile from './components/AnimatedTile/AnimatedTitle';
import SkeletonTiles from './components/SkeletonTile/SkeletonTile';
import Body from './components/Typography/Body';
import WalletPortfolioTile from './components/WalletPortfolioTile/WalletPortfolioTile';

// images
import PillarXLogo from './components/PillarXLogo/PillarXLogo';
import pillarLogoLight from './images/pillarX_full_white.png';

// constants
import { PAGE_LIMIT } from './utils/constants';

const App = () => {
  const [page, setPage] = useState(1);
  const [isLoadingNextPage, setIsLoadingNextPage] = useState(false);
  const [pageData, setPageData] = useState<Projection[]>([]);
  const isUpgradeWalletModalOpen = useAppSelector(
    (state) => state.walletPortfolio.isUpgradeWalletModalOpen as boolean
  );

  // Import wallets
  const { walletAddress } = useTransactionKit();
  const { wallets: privyWallets } = useWallets();

  // hooks
  const { checkOnLogin } = useEIP7702Upgrade();
  const dispatch = useAppDispatch();

  // Check if we're in React Native app (check localStorage which is set in Main.tsx)
  const isReactNativeApp = !!localStorage.getItem('DEVICE_PLATFORM');

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

  useEffect(() => {
    if (!isHomeFeedSuccess && walletAddress) {
      refetchHomeFeed();
    }

    // when apiData loads, we save it in a state to keep previous data
    if (homeFeed && isHomeFeedSuccess && walletAddress) {
      setPageData((prevData) => {
        const newApiData = [...prevData];
        homeFeed.projection.forEach((item) => {
          if (!prevData.includes(item)) {
            newApiData.push(item);
          }
        });
        return newApiData;
      });
      if (walletAddress) {
        recordPresence({
          address: walletAddress,
          action: 'app:feed:navigate',
          value: {
            pageNumber: page,
          },
        });
      }
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

  // Check if user is eligible for EIP-7702 upgrade (when walletAddress loads on login)
  const handleCheckEligibility = useCallback(() => {
    if (walletAddress) {
      checkOnLogin();
    }
  }, [walletAddress, checkOnLogin]);

  useEffect(() => {
    handleCheckEligibility();
  }, [handleCheckEligibility]);

  const handleCloseModal = () => {
    dispatch(setIsUpgradeWalletModalOpen(false));
  };

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

  // Handler to open settings in React Native app
  const handleSettingsClick = () => {
    const message = JSON.stringify({
      type: 'pillarXAuthRequest',
      value: 'settings',
    });

    // Send message to React Native webview
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(message);
    } else {
      // Fallback for testing in browser
      window.postMessage(message, '*');
    }
  };

  return (
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    <Wrapper>
      <HeaderContainer>
        {isReactNativeApp && (
          <SettingsButton
            onClick={handleSettingsClick}
            aria-label="Open settings"
          >
            <Setting2 size={24} variant="Outline" />
          </SettingsButton>
        )}
        <PillarXLogo
          src={pillarLogoLight}
          className="object-contain h-[20px] mobile:h-[18px]"
        />
      </HeaderContainer>
      <div
        ref={divRef}
        className="flex flex-col gap-[40px] tablet:gap-[28px] mobile:gap-[32px]"
      >
        <WalletPortfolioTile />
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
      <EIP7702UpgradeModal
        isOpen={isUpgradeWalletModalOpen}
        onClose={handleCloseModal}
      />
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

const HeaderContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 70px;

  @media (max-width: 768px) {
    margin-bottom: 58px;
  }
`;

const SettingsButton = styled.button`
  position: absolute;
  left: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.color.text.body};
  transition: opacity 0.2s;
  border-radius: 8px;

  &:hover {
    opacity: 0.7;
    background: ${({ theme }) => theme.color.background.card}20;
  }

  &:active {
    opacity: 0.5;
  }
`;

export default App;

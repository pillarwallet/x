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
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import './styles/tailwindPillarX.css';

// types
import { ApiLayout, Projection } from '../../types/api';

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
import searchIcon from '../pulse/assets/seach-icon.svg';

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
  const navigate = useNavigate();

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

        // Inject Gas Tank Tile
        const gasTankTile: Projection = {
          id: 'gas-tank-tile',
          layout: ApiLayout.GAS_TANK,
          meta: {
            display: { title: 'Gas Tank' },
          },
          data: {} as any,
        };

        // Inject Algo Insights Tile (Mock Data)
        const algoTile: Projection = {
          id: 'algo-insights-mock',
          layout: ApiLayout.ALGO_INSIGHTS,
          meta: {
            display: { title: 'Algo Insights' },
          },
          data: {
            pnl_1m: 0.18,
            pnl_3m: 26.3,
            pnl_6m: 39.72,
            risk_level: 'Low Risk',
            pnl_status: {
              winning: 54,
              losing: 27.4,
              neutral: 18.6,
            },
            cumulative_pnl: {
              '1w': {
                value: 0.18,
                history: [
                  { timestamp: 1732492800, value: -0.8 }, // Nov 25 (Mon)
                  { timestamp: 1732579200, value: 1.2 }, // Nov 26 (Tue)
                  { timestamp: 1732665600, value: 2.8 }, // Nov 27 (Wed)
                  { timestamp: 1732752000, value: 1.5 }, // Nov 28 (Thu)
                  { timestamp: 1732838400, value: 3.2 }, // Nov 29 (Fri)
                  { timestamp: 1732924800, value: 2.1 }, // Nov 30 (Sat)
                  { timestamp: 1733011200, value: 0.18 }, // Dec 1 (Sun)
                ],
              },
              '1m': {
                value: 0.18,
                history: [
                  { timestamp: 1730505600, value: -0.8 }, // Nov 2 (Week 1)
                  { timestamp: 1731110400, value: 2.5 }, // Nov 9 (Week 2)
                  { timestamp: 1731715200, value: 5.4 }, // Nov 16 (Week 3)
                  { timestamp: 1732320000, value: 2.8 }, // Nov 23 (Week 4)
                  { timestamp: 1732924800, value: 0.18 }, // Nov 30 (Week 5)
                ],
              },
              '3m': {
                value: 26.3,
                history: [
                  { timestamp: 1725408000, value: 0.5 }, // Sep 4 (Start)
                  { timestamp: 1726012800, value: -5.5 }, // Sep 11 (Dip)
                  { timestamp: 1726617600, value: 2.0 }, // Sep 18 (Recovery)
                  { timestamp: 1727222400, value: 15.5 }, // Sep 25 (Big Jump)
                  { timestamp: 1727827200, value: 26.8 }, // Oct 2 (Peak 1)
                  { timestamp: 1728432000, value: 23.5 }, // Oct 9 (Dip)
                  { timestamp: 1729036800, value: 28.2 }, // Oct 16 (Climb)
                  { timestamp: 1729641600, value: 26.5 }, // Oct 23 (Dip)
                  { timestamp: 1730246400, value: 30.5 }, // Oct 30 (Peak 2)
                  { timestamp: 1730851200, value: 27.8 }, // Nov 6 (Dip)
                  { timestamp: 1731456000, value: 31.2 }, // Nov 13 (Peak 3)
                  { timestamp: 1732060800, value: 26.3 }, // Nov 20 (End)
                ],
              },
              '6m': {
                value: 39.72,
                history: [
                  { timestamp: 1719792000, value: 0.5 }, // Jul 1 (Start ~0%)
                  { timestamp: 1720396800, value: 4.2 }, // Jul 8
                  { timestamp: 1721001600, value: 6.5 }, // Jul 15 (Small peak)
                  { timestamp: 1721606400, value: 5.1 }, // Jul 22
                  { timestamp: 1722211200, value: 7.2 }, // Jul 29
                  { timestamp: 1722816000, value: -3.5 }, // Aug 5 (Sharp drop)
                  { timestamp: 1723420800, value: 0.2 }, // Aug 12
                  { timestamp: 1724025600, value: -2.1 }, // Aug 19
                  { timestamp: 1724630400, value: -3.5 }, // Aug 26
                  { timestamp: 1725235200, value: -7.3 }, // Sep 2 (Lowest point)
                  { timestamp: 1725840000, value: -2.5 }, // Sep 9
                  { timestamp: 1726444800, value: 0.1 }, // Sep 16
                  { timestamp: 1727049600, value: 0.5 }, // Sep 23
                  { timestamp: 1727654400, value: 6.2 }, // Sep 30
                  { timestamp: 1728259200, value: 5.5 }, // Oct 7
                  { timestamp: 1728864000, value: 18.4 }, // Oct 14 (Big jump)
                  { timestamp: 1729468800, value: 20.5 }, // Oct 21
                  { timestamp: 1730073600, value: 10.2 }, // Oct 28 (Dip)
                  { timestamp: 1730678400, value: 12.5 }, // Nov 4
                  { timestamp: 1731283200, value: 15.8 }, // Nov 11
                  { timestamp: 1731888000, value: 28.5 }, // Nov 18 (Jump)
                  { timestamp: 1732492800, value: 32.2 }, // Nov 25
                  { timestamp: 1733097600, value: 40.5 }, // Dec 2
                  { timestamp: 1733702400, value: 38.2 }, // Dec 9
                  { timestamp: 1734307200, value: 42.5 }, // Dec 16
                  { timestamp: 1734912000, value: 44.1 }, // Dec 23 (Peak)
                ],
              },
            },
          },
        };

        // Add to the beginning of the feed if not already present
        // Add GasTank first, then Algo, so Algo ends up on top (index 0) and GasTank at index 1
        if (!newApiData.some((item) => item.id === gasTankTile.id)) {
          newApiData.unshift(gasTankTile);
        }
        if (!newApiData.some((item) => item.id === algoTile.id)) {
          newApiData.unshift(algoTile);
        }

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

  // Handler to navigate to Pulse Search in Buy mode
  const handleSearchClick = () => {
    navigate('/pulse?searching=true');
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
      {/* Search Bar */}
      <button
        type="button"
        onClick={handleSearchClick}
        className="flex items-center w-full max-w-[645px] h-8 mx-auto mb-5 mobile:mb-4 bg-[rgba(30,29,36,0.3)] border-2 border-[#1e1d24] shadow-[inset_0px_2px_0px_2px_#121116] rounded-[10px] px-[10px] cursor-pointer"
      >
        <img
          src={searchIcon}
          alt="search"
          className="w-[14px] h-[14px] opacity-60"
        />
        <span className="font-normal text-[13px] leading-[13px] tracking-[-0.02em] text-white opacity-50 ml-3 mt-[1px] select-none">
          Search
        </span>
      </button>
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
  margin-bottom: 20px;

  @media (max-width: 768px) {
    margin-bottom: 16px;
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

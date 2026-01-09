import { EtherspotUtils } from '@etherspot/transaction-kit';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// hooks
import useAllowedApps from '../../../../hooks/useAllowedApps';
import { useAppSelector } from '../../hooks/useReducerHooks';

// utils
import { chainIdToChainNameTokensData } from '../../../../services/tokensData';
import { limitDigits } from '../../utils/converters';

// types
import {
  MarketHistoryPairData,
  TokenAtlasInfoData,
} from '../../../../types/api';
import { SelectedTokenType } from '../../types/types';

// images
import ArrowGreenSmall from '../../images/arrow-circle-green-small.svg';
import ArrowGreen from '../../images/arrow-circle-green.svg';
import ArrowRedSmall from '../../images/arrow-circle-red-small.svg';
import ArrowRed from '../../images/arrow-circle-red.svg';

// components
import SkeletonLoader from '../../../../components/SkeletonLoader';
import RandomAvatar from '../RandomAvatar/RandomAvatar';
import TradingViewChart from '../TradingViewChart/TradingViewChart';
import Body from '../Typography/Body';

type TokenGraphColumnProps = {
  className?: string;
  isLoadingTokenDataInfo: boolean;
  selectedToken: SelectedTokenType;
  isWrappedOrNativeToken: boolean;
  getSymbol: (symbol: string) => string;
};

const TokenGraphColumn = ({
  className,
  isLoadingTokenDataInfo,
  selectedToken,
  isWrappedOrNativeToken,
  getSymbol,
}: TokenGraphColumnProps) => {
  const navigate = useNavigate();
  const { setIsAnimated } = useAllowedApps();
  const { isZeroAddress } = EtherspotUtils;
  const tokenDataInfo = useAppSelector(
    (state) => state.tokenAtlas.tokenDataInfo as TokenAtlasInfoData | undefined
  );
  const tokenDataGraph = useAppSelector(
    (state) =>
      state.tokenAtlas.tokenDataGraph as MarketHistoryPairData | undefined
  );
  const isTokenDataErroring = useAppSelector(
    (state) => state.tokenAtlas.isTokenDataErroring as boolean
  );
  const isGraphLoading = useAppSelector(
    (state) => state.tokenAtlas.isGraphLoading as boolean
  );

  const [viewportWidth, setViewportWidth] = useState<number>(window.innerWidth);
  const [isBrokenImage, setIsBrokenImage] = useState<boolean>(false);
  const [latestPrice, setLatestPrice] = useState<number | undefined>();
  const [realTimePrice, setRealTimePrice] = useState<number | undefined>();
  const [initialPrice, setInitialPrice] = useState<number | undefined>();

  // Helper functions
  /**
   * Calculate percentage change from initial price to current real-time price
   */
  const calculatePriceChange = (): number | undefined => {
    if (!initialPrice || !realTimePrice) return undefined;
    if (initialPrice === 0) return undefined;
    return ((realTimePrice - initialPrice) / initialPrice) * 100;
  };

  const priceChange = calculatePriceChange();

  /**
   * Get the appropriate arrow icon based on price change direction and viewport width
   * Uses real-time change if available, otherwise falls back to 24h change
   */
  const getArrow = () => {
    const change = priceChange ?? tokenDataInfo?.price_change_24h;
    if (change !== undefined) {
      if (change > 0) {
        return viewportWidth > 768 ? ArrowGreen : ArrowGreenSmall;
      }
      if (change < 0) {
        return viewportWidth > 768 ? ArrowRed : ArrowRedSmall;
      }
    }
    return '';
  };

  /**
   * Get the current price to display, prioritizing real-time price
   */
  const getDisplayPrice = (): number => {
    if (realTimePrice) {
      return realTimePrice;
    }
    if (latestPrice) {
      return latestPrice;
    }
    return tokenDataInfo?.price || 0;
  };

  // Callbacks
  /**
   * Handle real-time price updates from TradingView chart
   * Use useCallback to prevent the function from changing on every render
   */
  const handlePriceUpdate = useCallback((price: number) => {
    setRealTimePrice(price);
    // Update initial price if not set yet
    setInitialPrice((prev) => prev ?? price);
  }, []);

  /**
   * Handle window resize to update viewport width for responsive arrow icons
   */
  const handleResize = () => {
    setViewportWidth(window.innerWidth);
  };

  useEffect(() => {
    if (tokenDataInfo?.price && !initialPrice) {
      setInitialPrice(tokenDataInfo.price);
      setRealTimePrice(tokenDataInfo.price);
    }
  }, [tokenDataInfo?.price, initialPrice]);

  // Initialize price from tokenDataGraph
  useEffect(() => {
    if (tokenDataGraph?.result?.data.length && !isGraphLoading) {
      const tokenDataGraphPrices = tokenDataGraph.result.data;
      const latestClosePrice =
        tokenDataGraphPrices?.[tokenDataGraphPrices.length - 1].close;

      setLatestPrice(latestClosePrice);

      // Set initial price if not already set
      if (latestClosePrice && !initialPrice) {
        setInitialPrice(latestClosePrice);
        setRealTimePrice(latestClosePrice);
      }
    }
  }, [isGraphLoading, tokenDataGraph, initialPrice]);

  // Listen to window resize events
  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      id="token-atlas-token-graph-column"
      className={`flex flex-col ${className} mr-4`}
    >
      <div className="flex flex-col w-full max-w-[460px]">
        <div
          id="token-atlas-graph-column-name-logo-symbol"
          className="flex items-center gap-2 mb-2"
        >
          {isLoadingTokenDataInfo ? (
            <SkeletonLoader $height="29px" $radius="6px" $marginBottom="10px" />
          ) : (
            <>
              <div className="relative w-[30px] h-[30px] rounded-full">
                {tokenDataInfo?.logo && !isBrokenImage ? (
                  <img
                    src={tokenDataInfo.logo}
                    alt="token-logo"
                    className="w-full h-full object-fill rounded-full"
                    data-testid="token-logo-graph-column"
                    onError={() => setIsBrokenImage(true)}
                  />
                ) : (
                  <div className="w-full h-full overflow-hidden rounded-full">
                    <RandomAvatar name={tokenDataInfo?.name || ''} />
                  </div>
                )}

                {/* Overlay text when no token logo available */}
                {(!tokenDataInfo?.logo || isBrokenImage) && (
                  <span className="absolute inset-0 flex items-center justify-center text-lg text-xs font-bold">
                    {tokenDataInfo?.name?.slice(0, 2)}
                  </span>
                )}
              </div>

              <Body className="font-medium text-[27px] mobile:text-[25px]">
                {tokenDataInfo ? tokenDataInfo.name : 'Token not found'}
              </Body>
              <Body className="text-[15px] mobile:text-[13px] text-white_light_grey pt-2">
                {tokenDataInfo?.symbol}
              </Body>
              {tokenDataInfo && (
                <button
                  type="button"
                  className="flex w-fit ml-2 py-3 px-6 text-sm font-semibold uppercase truncate rounded bg-green hover:bg-[#5DE000] text-dark_grey"
                  onClick={() => {
                    setIsAnimated(false);

                    let assetParam: string;
                    if (isWrappedOrNativeToken) {
                      assetParam = getSymbol(selectedToken.symbol);
                    } else if (!isZeroAddress(selectedToken.address || '')) {
                      assetParam = selectedToken.address;
                    } else {
                      assetParam = selectedToken.symbol;
                    }

                    const blockchainParam = chainIdToChainNameTokensData(
                      selectedToken.chainId
                    );
                    const finalUrl = `/pulse?asset=${assetParam}&blockchain=${blockchainParam}&from=token-atlas`;

                    navigate(finalUrl);
                  }}
                >
                  Buy {tokenDataInfo?.symbol}
                </button>
              )}
            </>
          )}
        </div>
        {!isLoadingTokenDataInfo && isTokenDataErroring && (
          <Body>
            Oops something went wrong! This token may not have enough data
            available, or the data source could not be reached. Please try
            searching for this token again later.
          </Body>
        )}
        <div
          id="token-atlas-graph-column-price-change"
          className="flex justify-between items-center desktop:items-end"
        >
          {isLoadingTokenDataInfo ? (
            <SkeletonLoader $height="50px" $radius="6px" $marginBottom="10px" />
          ) : (
            <>
              {isGraphLoading ? (
                <SkeletonLoader
                  $height="50px"
                  $radius="6px"
                  $marginBottom="20px"
                  $marginTop="20px"
                />
              ) : (
                <h1
                  id="token-atlas-graph-column-price-today"
                  className="text-[60px] mobile:text-[40px] mr-4"
                >
                  <span className="text-white_light_grey">$</span>
                  {limitDigits(getDisplayPrice())}
                </h1>
              )}
              <div
                id="token-atlas-graph-column-price-change-percentage"
                className="flex mobile:flex-col tablet:flex-col items-end desktop:mb-5 mb-0"
              >
                {(priceChange !== undefined ||
                  tokenDataInfo?.price_change_24h) && (
                  <>
                    <img
                      src={getArrow()}
                      alt="arrow"
                      className={`w-[30px] mr-1 mobile:w-3.5 mobile:mb-2 ${
                        (priceChange ?? tokenDataInfo?.price_change_24h ?? 0) <
                          0 && 'rotate-180'
                      }`}
                    />
                    <div className="flex">
                      <Body className="text-[15px] mobile:text-[13px]">
                        {(
                          priceChange ??
                          tokenDataInfo?.price_change_24h ??
                          0
                        ).toFixed(3)}
                      </Body>
                      <Body className="text-[11px] font-black mobile:text-[9px] self-start">
                        %
                      </Body>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <TradingViewChart onPriceUpdate={handlePriceUpdate} />
    </div>
  );
};

export default TokenGraphColumn;

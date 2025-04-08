import { sub } from 'date-fns';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// hooks
import useAllowedApps from '../../../../hooks/useAllowedApps';
import { useAppDispatch, useAppSelector } from '../../hooks/useReducerHooks';

// reducer
import {
  setPeriodFilter,
  setPriceGraphPeriod,
} from '../../reducer/tokenAtlasSlice';

// utils
import { convertDateToUnixTimestamp } from '../../../../utils/common';
import { limitDigits } from '../../utils/converters';

// types
import {
  MarketHistoryPairData,
  TokenAtlasInfoData,
} from '../../../../types/api';
import { PeriodFilter, SelectedTokenType } from '../../types/types';

// images
import ArrowGreenSmall from '../../images/arrow-circle-green-small.svg';
import ArrowGreen from '../../images/arrow-circle-green.svg';
import ArrowRedSmall from '../../images/arrow-circle-red-small.svg';
import ArrowRed from '../../images/arrow-circle-red.svg';

// components
import SkeletonLoader from '../../../../components/SkeletonLoader';
import RandomAvatar from '../RandomAvatar/RandomAvatar';
import TokenGraph from '../TokenGraph/TokenGraph';
import Body from '../Typography/Body';

type TokenGraphColumnProps = {
  className?: string;
  isLoadingTokenDataInfo: boolean;
};

const TokenGraphColumn = ({
  className,
  isLoadingTokenDataInfo,
}: TokenGraphColumnProps) => {
  const navigate = useNavigate();
  const { setIsAnimated } = useAllowedApps();
  const dispatch = useAppDispatch();
  const tokenDataInfo = useAppSelector(
    (state) => state.tokenAtlas.tokenDataInfo as TokenAtlasInfoData | undefined
  );
  const tokenDataGraph = useAppSelector(
    (state) =>
      state.tokenAtlas.tokenDataGraph as MarketHistoryPairData | undefined
  );
  const periodFilter = useAppSelector(
    (state) => state.tokenAtlas.periodFilter as PeriodFilter
  );
  const selectedToken = useAppSelector(
    (state) => state.tokenAtlas.selectedToken as SelectedTokenType | undefined
  );

  const [viewportWidth, setViewportWidth] = useState<number>(window.innerWidth);
  const [isBrokenImage, setIsBrokenImage] = useState<boolean>(false);

  // The resize handle and listener are to check the viewport size, and change the arrows SVG accordingly
  const handleResize = () => {
    setViewportWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const timeFilter = [
    PeriodFilter.HOUR,
    PeriodFilter.DAY,
    PeriodFilter.WEEK,
    PeriodFilter.MONTH,
    PeriodFilter.YEAR,
  ];

  // The percentage showing next to the token price is the price change in the last 24H
  const getArrow = () => {
    if (tokenDataInfo?.price_change_24h) {
      if (tokenDataInfo.price_change_24h > 0) {
        return viewportWidth > 768 ? ArrowGreen : ArrowGreenSmall;
      }
      if (tokenDataInfo.price_change_24h < 0) {
        return viewportWidth > 768 ? ArrowRed : ArrowRedSmall;
      }
    }
    return '';
  };

  // The handleClickTimePeriod makes sure we select the right "from" Unix timestamp to today's Unix timestamp for the price history graph
  const handleClickTimePeriod = (filter: PeriodFilter) => {
    dispatch(setPeriodFilter(filter));
    const now = new Date();
    let from;
    switch (filter) {
      case PeriodFilter.HOUR:
        from = sub(now, { hours: 2 });
        break;
      case PeriodFilter.DAY:
        from = sub(now, { hours: 24 });
        break;
      case PeriodFilter.WEEK:
        from = sub(now, { weeks: 1 });
        break;
      case PeriodFilter.MONTH:
        from = sub(now, { months: 1 });
        break;
      case PeriodFilter.YEAR:
        from = sub(now, { years: 1 });
        break;
      default:
        from = sub(now, { days: 1 });
        break;
    }
    dispatch(
      setPriceGraphPeriod({
        from: convertDateToUnixTimestamp(from),
        to: undefined,
      })
    );
  };

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
                    navigate(
                      `/the-exchange?asset=${selectedToken?.name}&blockchain=${selectedToken?.chainId}&address=${selectedToken?.address}`
                    );
                  }}
                >
                  Buy {tokenDataInfo?.symbol}
                </button>
              )}
            </>
          )}
        </div>
        <div
          id="token-atlas-graph-column-price-change"
          className="flex justify-between items-center desktop:items-end"
        >
          {isLoadingTokenDataInfo ? (
            <SkeletonLoader $height="50px" $radius="6px" $marginBottom="10px" />
          ) : (
            <>
              <h1
                id="token-atlas-graph-column-price-today"
                className="text-[60px] mobile:text-[40px] mr-4"
              >
                <span className="text-white_light_grey">$</span>
                {tokenDataInfo?.price && limitDigits(tokenDataInfo.price)}
              </h1>
              <div
                id="token-atlas-graph-column-price-change-percentage"
                className="flex mobile:flex-col tablet:flex-col items-end desktop:mb-5 mb-0"
              >
                {tokenDataInfo?.price_change_24h && (
                  <>
                    <img
                      src={getArrow()}
                      alt="arrow"
                      className={`w-[30px] mr-1 mobile:w-3.5 mobile:mb-2 ${
                        tokenDataInfo.price_change_24h < 0 && 'rotate-180'
                      }`}
                    />
                    <div className="flex">
                      <Body className="text-[15px] mobile:text-[13px]">
                        {tokenDataInfo.price_change_24h.toFixed(3)}
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
        <div
          id="token-atlas-graph-column-time-filter"
          className="flex rounded bg-medium_grey max-w-[460px] p-1 gap-1"
        >
          {timeFilter.map((filter, index) => (
            <button
              type="button"
              key={index}
              className={`flex-1 text-[11px] font-semibold capitalize truncate py-3 rounded ${
                tokenDataGraph?.result.data.length
                  ? 'hover:bg-green hover:text-dark_grey'
                  : ''
              } ${periodFilter === filter && tokenDataGraph?.result.data.length ? 'bg-green text-dark_grey' : 'text-white_grey bg-medium_grey'}`}
              onClick={() => handleClickTimePeriod(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
      <TokenGraph />
    </div>
  );
};

export default TokenGraphColumn;

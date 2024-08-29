import { useEffect, useState } from 'react';
import { sub } from 'date-fns';

// hooks
import { useAppDispatch, useAppSelector } from '../../hooks/useReducerHooks';

// reducer
import { setPeriodFilter, setPriceGraphPeriod } from '../../reducer/tokenAtlasSlice';

// utils
import { convertDateToUnixTimestamp, limitDigits } from '../../utils/converters';

// types
import { TokenAtlasInfoData, TokenMarketHistory } from '../../../../types/api';
import { PeriodFilter } from '../../types/types';

// images
import ArrowGreen from '../../images/arrow-circle-green.svg';
import ArrowRed from '../../images/arrow-circle-red.svg';
import ArrowRedSmall from '../../images/arrow-circle-red-small.svg';
import ArrowGreenSmall from '../../images/arrow-circle-green-small.svg';

// components
import Body from '../Typography/Body';
import TokenGraph from '../TokenGraph/TokenGraph';
import SkeletonLoader from '../../../../components/SkeletonLoader';

type TokenGraphColumnProps = {
    className?: string;
    isLoadingTokenDataInfo: boolean;
    isLoadingTokenDataGraph: boolean;
};

const TokenGraphColumn = ({ className, isLoadingTokenDataInfo }: TokenGraphColumnProps) => {
    const dispatch = useAppDispatch();
    const tokenDataInfo = useAppSelector((state) => state.tokenAtlas.tokenDataInfo as TokenAtlasInfoData | undefined);
    const tokenDataGraph = useAppSelector((state) => state.tokenAtlas.tokenDataGraph as TokenMarketHistory | undefined);
    const periodFilter = useAppSelector((state) => state.tokenAtlas.periodFilter as PeriodFilter);
    const [viewportWidth, setViewportWidth] = useState<number>(window.innerWidth);

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
        dispatch(setPriceGraphPeriod({ from: convertDateToUnixTimestamp(from), to: undefined }));
    };

    return (
        <div className={`flex flex-col ${className} mr-4`}>
            <div className="flex flex-col w-full max-w-[460px]">
                <div className="flex items-center gap-2 mb-2">
                    {isLoadingTokenDataInfo ? (
                        <SkeletonLoader $height="29px" $radius="6px" $marginBottom="10px" />
                    ) : (
                        <>
                            {tokenDataInfo?.logo && (
                                <img src={tokenDataInfo.logo} className="w-[30px] h-[30px] object-fill rounded-full" />
                            )}
                            <Body className="font-medium text-[27px] mobile:text-[25px]">
                                {tokenDataInfo ? tokenDataInfo.name : 'Token not found'}
                            </Body>
                            <Body className="text-[15px] mobile:text-[13px] text-white_light_grey pt-2">
                                {tokenDataInfo?.symbol}
                            </Body>
                        </>
                    )}
                </div>
                <div className="flex justify-between items-center desktop:items-end">
                    {isLoadingTokenDataInfo ? (
                        <SkeletonLoader $height="50px" $radius="6px" $marginBottom="10px" />
                    ) : (
                        <>
                            <h1 className="text-[60px] mobile:text-[40px] mr-4">
                                <span className="text-white_light_grey">$</span>
                                {tokenDataInfo?.price && limitDigits(tokenDataInfo.price)}
                            </h1>
                            <div className="flex mobile:flex-col tablet:flex-col items-end desktop:mb-5 mb-0">
                                {tokenDataInfo?.price_change_24h && (
                                    <>
                                        <img
                                            src={getArrow()}
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
                <div className="flex rounded bg-medium_grey max-w-[460px] p-1 gap-1">
                    {timeFilter.map((filter, index) => (
                        <button
                            key={index}
                            className={`flex-1 text-[11px] font-semibold capitalize truncate py-3 rounded ${
                                tokenDataGraph?.price_history ? 'hover:bg-green hover:text-dark_grey' : ''
                            } ${periodFilter === filter && tokenDataGraph?.price_history ? 'bg-green text-dark_grey' : 'text-white_grey bg-medium_grey'}`}
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

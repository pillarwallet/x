import { createRef } from 'react';

// hooks
import useRefDimensions from '../../../pillarx-app/hooks/useRefDimensions';
import { useAppDispatch, useAppSelector } from '../../hooks/useReducerHooks';

// reducer
import { setIsAllChainsVisible } from '../../reducer/tokenAtlasSlice';

// types
import { TokenAtlasInfoData } from '../../../../types/api';

// components
import ChainCard from '../ChainCard/ChainCard';
import Body from '../Typography/Body';
import PriceCard from '../PriceCard/PriceCard';
import BodyLight from '../Typography/BodyLight';
import { CircularProgress } from '@mui/material';

type TokenInfoColumnProps = {
    isLoadingTokenDataInfo: boolean;
    className?: string;
};

const TokenInfoColumn = ({ className, isLoadingTokenDataInfo }: TokenInfoColumnProps) => {
    const dispatch = useAppDispatch();
    const tokenDataInfo = useAppSelector((state) => state.tokenAtlas.tokenDataInfo as TokenAtlasInfoData | undefined);
    const isAllChainsVisible = useAppSelector((state) => state.tokenAtlas.isAllChainsVisible as boolean);
    const divRef = createRef<HTMLDivElement>();
    const dimensions = useRefDimensions(divRef);

    // This is to make sure that if the chains do not all fit in one line, we add the number of hidden chains
    const tokenBlockchainsList = tokenDataInfo?.contracts.map((contract) => contract.blockchain) || [];
    const numberVisibleCards = Math.floor((dimensions.width - 50) / 158);
    const numberHiddenCards = Math.max(tokenBlockchainsList.length - numberVisibleCards, 0);

    const handleShowAllChains = () => {
        dispatch(setIsAllChainsVisible(!isAllChainsVisible));
    };

    const priceChanges = [
        { period: '1H', percentage: tokenDataInfo?.price_change_1h },
        { period: '24H', percentage: tokenDataInfo?.price_change_24h },
        { period: '7D', percentage: tokenDataInfo?.price_change_7d },
        { period: '1M', percentage: tokenDataInfo?.price_change_1m },
        { period: '1Y', percentage: tokenDataInfo?.price_change_1y },
    ];

    return (
        <div ref={divRef} className={`flex flex-col gap-10 ${className}`}>
            <div className="flex flex-col gap-2">
                <Body>Blockchains</Body>
                <div className="w-full h-fit flex flex-wrap gap-2">
                    {isLoadingTokenDataInfo && <CircularProgress size={32} sx={{ color: '#979797' }} />}
                    {isAllChainsVisible
                        ? tokenBlockchainsList.map((chain, index) => <ChainCard key={index} chainName={chain} />)
                        : tokenBlockchainsList.slice(0, numberVisibleCards).map((chain, index) => <ChainCard key={index} chainName={chain} />)}
                    {numberHiddenCards !== 0 && (
                        <div
                            className="flex rounded-full bg-medium_grey p-2 items-center h-8 cursor-pointer"
                            onClick={handleShowAllChains}
                        >
                            {numberHiddenCards > 0 && !isAllChainsVisible
                                ? <Body>+ {numberHiddenCards}</Body>
                                : <Body className="text-[9px] font-medium">Show less</Body>}
                        </div>
                    )}
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <Body>Price changes</Body>
                <div className="flex flex-wrap gap-2">
                    {isLoadingTokenDataInfo && <CircularProgress size={32} sx={{ color: '#979797' }} />}
                    {priceChanges.map((price, index) => <PriceCard key={index} percentage={price.percentage} timePeriod={price.period} />)}
                </div>
            </div>
            <div className="flex flex-col gap-2 mb-20">
                <Body>Stats</Body>
                <div className="flex flex-col rounded px-4 bg-medium_grey">
                    <div className="flex justify-between border-b border-b-dark_grey py-3">
                        <BodyLight>All time high</BodyLight>
                        <Body>{tokenDataInfo?.ath || '-'}</Body>
                    </div>
                    <div className="flex justify-between border-b border-b-dark_grey py-3">
                        <BodyLight>All time low</BodyLight>
                        <Body>{tokenDataInfo?.atl || '-'}</Body>
                    </div>
                    <div className="flex justify-between border-b border-b-dark_grey py-3">
                        <BodyLight>Total supply</BodyLight>
                        <Body>{tokenDataInfo?.total_supply || '-'}</Body>
                    </div>
                    <div className="flex justify-between border-b border-b-dark_grey py-3">
                        <BodyLight>Circulating supply</BodyLight>
                        <Body>{tokenDataInfo?.circulating_supply || '-'}</Body>
                    </div>
                    <div className="flex justify-between border-b border-b-dark_grey py-3">
                        <BodyLight>Diluted market cap</BodyLight>
                        <Body>{tokenDataInfo?.market_cap_diluted || '-'}</Body>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TokenInfoColumn;

import { CircularProgress } from '@mui/material';
import { createRef } from 'react';

// hooks
import { useAppSelector } from '../../hooks/useReducerHooks';

// types
import { TokenAtlasInfoData } from '../../../../types/api';

// components
import PriceCard from '../PriceCard/PriceCard';
import TokenAudit from '../TokenAudit/TokenAudit';
import Body from '../Typography/Body';
import BodyLight from '../Typography/BodyLight';

type TokenInfoColumnProps = {
  isLoadingTokenDataInfo: boolean;
  className?: string;
};

const TokenInfoColumn = ({
  className,
  isLoadingTokenDataInfo,
}: TokenInfoColumnProps) => {
  const tokenDataInfo = useAppSelector(
    (state) => state.tokenAtlas.tokenDataInfo as TokenAtlasInfoData | undefined
  );

  const divRef = createRef<HTMLDivElement>();

  const priceChanges = [
    { period: '1H', percentage: tokenDataInfo?.price_change_1h },
    { period: '24H', percentage: tokenDataInfo?.price_change_24h },
    { period: '7D', percentage: tokenDataInfo?.price_change_7d },
    { period: '1M', percentage: tokenDataInfo?.price_change_1m },
    { period: '1Y', percentage: tokenDataInfo?.price_change_1y },
  ];

  return (
    <div
      id="token-atlas-token-info-column"
      ref={divRef}
      className={`flex flex-col gap-10 ${className}`}
    >
      <TokenAudit />
      <div
        id="token-atlas-info-column-price-change-cards"
        className="flex flex-col gap-2"
      >
        <Body>Price changes</Body>
        <div className="flex flex-wrap gap-2">
          {isLoadingTokenDataInfo && (
            <CircularProgress
              size={32}
              sx={{ color: '#979797' }}
              data-testid="circular-loading"
            />
          )}
          {priceChanges.map((price, index) => (
            <PriceCard
              key={index}
              percentage={price.percentage}
              timePeriod={price.period}
            />
          ))}
        </div>
      </div>
      <div
        id="token-atlas-info-column-stats"
        className="flex flex-col gap-2 mb-20"
      >
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

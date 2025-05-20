import { TbTriangleFilled } from 'react-icons/tb';

// types
import { TokensMarketDataRow } from '../../../../types/api';

// utils
import { limitDigitsNumber } from '../../../../utils/number';

// components
import HighDecimalsFormatted from '../HighDecimalsFormatted/HighDecimalsFormatted';
import BodySmall from '../Typography/BodySmall';

type RightColumnTokenMarketDataRowProps = {
  data: TokensMarketDataRow;
};

const RightColumnTokenMarketDataRow = ({
  data,
}: RightColumnTokenMarketDataRowProps) => {
  const { rightColumn } = data;

  return (
    <div className="flex flex-col h-full items-end justify-between flex-shrink-0">
      <div className="flex desktop:gap-1 tablet:gap-1 mobile:flex-col mobile:items-end">
        {rightColumn?.line1?.price ? (
          <HighDecimalsFormatted
            value={limitDigitsNumber(Number(rightColumn.line1.price || 0))}
            moneySymbol="$"
            styleNumber={`font-normal ${rightColumn?.line1?.direction === 'UP' && 'desktop:text-market_row_green tablet:text-market_row_green'} ${rightColumn?.line1?.direction === 'DOWN' && 'desktop:text-percentage_red tablet:text-percentage_red'} mobile:text-white desktop:text-base tablet:text-base mobile:text-sm`}
            styleZeros="mobile:text-white desktop:text-xs tablet:text-xs mobile:text-[10px]"
          />
        ) : null}
        <div
          className={`flex gap-1 items-center desktop:px-1 desktop:rounded tablet:px-1 tablet:rounded ${rightColumn?.line1?.direction === 'UP' && 'text-market_row_green desktop:bg-market_row_green/[.1] tablet:bg-market_row_green/[.1] mobile:bg-transparent'} ${rightColumn?.line1?.direction === 'DOWN' && 'text-percentage_red desktop:bg-percentage_red/[.1] tablet:bg-percentage_red/[.1] mobile:bg-transparent'}`}
        >
          {rightColumn?.line1?.direction === 'UP' ||
          rightColumn?.line1?.direction === 'DOWN' ? (
            <TbTriangleFilled
              size={6}
              color={
                rightColumn?.line1?.direction === 'UP' ? '#5CFF93' : '#FF366C'
              }
              style={{
                transform:
                  rightColumn?.line1?.direction === 'DOWN'
                    ? 'rotate(180deg)'
                    : 'none',
              }}
            />
          ) : null}
          {rightColumn?.line1?.percentage ? (
            <BodySmall className="font-normal">
              {rightColumn?.line1?.percentage}
            </BodySmall>
          ) : null}
        </div>
      </div>
      {rightColumn?.line2?.transactionCount ? (
        <BodySmall className="font-normal mobile:hidden text-white">
          <span className="text-white/[.5]">Txs:</span>{' '}
          {rightColumn?.line2?.transactionCount}
        </BodySmall>
      ) : null}
    </div>
  );
};

export default RightColumnTokenMarketDataRow;

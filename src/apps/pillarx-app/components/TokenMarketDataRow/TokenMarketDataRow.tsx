import { useNavigate } from 'react-router-dom';

// types
import { TokensMarketDataRow } from '../../../../types/api';

// components
import Body from '../Typography/Body';
import LeftColumnTokenMarketDataRow from './LeftColumnTokenMarketDataRow';
import RightColumnTokenMarketDataRow from './RightColumnTokenMarketDataRow';
import TokenLogoMarketDataRow from './TokenLogoMarketDataRow';

type TokenMarketDataRowProps = {
  data: TokensMarketDataRow;
  listNumber: number;
  isLastNumber: boolean;
  isMiddleNumber: boolean;
};
const TokenMarketDataRow = ({
  data,
  listNumber,
  isLastNumber,
  isMiddleNumber,
}: TokenMarketDataRowProps) => {
  const navigate = useNavigate();
  return (
    <div
      className={`flex w-full h-full items-center justify-between gap-2 py-3 border-b-[1px] border-[#25232D]
    ${isLastNumber && 'desktop:border-b-0 tablet:border-b-0 mobile:border-b-0'} 
    ${isMiddleNumber && 'desktop:border-b-0'}
    ${data.link && 'cursor-pointer'}`}
      onClick={() => (data.link ? navigate(`${data.link}`) : undefined)}
    >
      <div className="flex items-center flex-1 min-w-0">
        <Body className="desktop:text-base tablet:text-base mobile:text-sm font-normal text-white/[0.5] mr-4 mobile:mr-2.5">
          {listNumber > 0 && listNumber < 10 ? `0${listNumber}` : listNumber}
        </Body>
        <TokenLogoMarketDataRow
          tokenLogo={data.leftColumn?.token?.primaryImage}
          chainLogo={data.leftColumn?.token?.secondaryImage}
          tokenName={data.leftColumn?.line1?.text2}
        />
        <LeftColumnTokenMarketDataRow data={data} />
      </div>
      <div className="flex-shrink-0">
        <RightColumnTokenMarketDataRow data={data} />
      </div>
    </div>
  );
};

export default TokenMarketDataRow;

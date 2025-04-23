/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { formatDistanceToNowStrict } from 'date-fns';
import { DateTime } from 'luxon';
import CopyToClipboard from 'react-copy-to-clipboard';

// types
import { TokensMarketDataRow } from '../../../../types/api';

// components
import Body from '../Typography/Body';
import BodySmall from '../Typography/BodySmall';

// images
import CopyIcon from '../../images/token-market-data-copy.png';

type LeftColumnTokenMarketDataRowProps = {
  data: TokensMarketDataRow;
};

const LeftColumnTokenMarketDataRow = ({
  data,
}: LeftColumnTokenMarketDataRowProps) => {
  const { leftColumn } = data;

  let timestamp = formatDistanceToNowStrict(
    DateTime.fromSeconds(leftColumn?.line2?.timestamp || 0).toISO() || '',
    { addSuffix: true }
  );

  // Replace long units with shorter units and delete white space before the units
  timestamp = timestamp
    .replace('seconds', 's')
    .replace('second', 's')
    .replace('minutes', 'min')
    .replace('minute', 'min')
    .replace('hours', 'h')
    .replace('hour', 'h')
    .replace('days', 'd')
    .replace('day', 'd')
    .replace('months', 'mo')
    .replace('month', 'mo')
    .replace(/(\d+)\s+(?=[a-zA-Z])/g, '$1');

  return (
    <div className="flex flex-col ml-1.5 h-full justify-between">
      <div className="flex gap-1 items-center">
        {leftColumn?.line1?.text1 && (
          <Body className="font-normal text-white desktop:text-base tablet:text-base mobile:text-sm">
            {leftColumn?.line1?.text1}
          </Body>
        )}
        {leftColumn?.line1?.text2 && (
          <Body className="font-normal text-white/[.5] desktop:text-base tablet:text-base mobile:text-sm">
            {leftColumn?.line1?.text2}
          </Body>
        )}
        {leftColumn?.line1?.copyLink && (
          <CopyToClipboard text={leftColumn.line1.copyLink}>
            <img
              src={CopyIcon}
              alt="copy-token-address"
              className="w-2.5 h-3"
              onClick={(e) => e.stopPropagation()}
            />
          </CopyToClipboard>
        )}
      </div>
      <div className="flex flex-wrap gap-2 mobile:gap-1.5">
        {timestamp && (
          <BodySmall className="mobile:hidden text-white desktop:text-sm tablet:text-sm mobile:text-xs">
            {timestamp}
          </BodySmall>
        )}
        {leftColumn?.line2?.volume && (
          <BodySmall className="text-white desktop:text-sm tablet:text-sm mobile:text-xs">
            <span className="text-white/[.5]">Vol:</span>{' '}
            {leftColumn?.line2?.volume}
          </BodySmall>
        )}
        {leftColumn?.line2?.liquidity && (
          <BodySmall className="text-white desktop:text-sm tablet:text-sm mobile:text-xs">
            <span className="text-white/[.5]">Liq:</span>{' '}
            {leftColumn?.line2?.liquidity}
          </BodySmall>
        )}
      </div>
    </div>
  );
};

export default LeftColumnTokenMarketDataRow;

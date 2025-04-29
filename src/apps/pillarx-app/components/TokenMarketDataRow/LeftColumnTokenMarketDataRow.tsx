/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { formatDistanceToNowStrict, isValid, parseISO } from 'date-fns';
import { DateTime } from 'luxon';
import CopyToClipboard from 'react-copy-to-clipboard';

// types
import { TokensMarketDataRow } from '../../../../types/api';

// utils
import { getShorterTimeUnits } from '../../../../utils/common';

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

  const timestampToISO =
    DateTime.fromSeconds(leftColumn?.line2?.timestamp || 0).toISO() || '';

  const ISOToDate = parseISO(timestampToISO);

  let timestamp = isValid(ISOToDate)
    ? formatDistanceToNowStrict(
        DateTime.fromSeconds(leftColumn?.line2?.timestamp || 0).toISO() || '',
        { addSuffix: true }
      )
    : undefined;

  // Replace long units with shorter units and delete white space before the units
  timestamp = timestamp && getShorterTimeUnits(timestamp);

  return (
    <div className="flex flex-col ml-1.5 h-full justify-between">
      <div className="flex gap-1 items-center">
        {leftColumn?.line1?.text1 ? (
          <Body className="font-normal text-white desktop:text-base tablet:text-base mobile:text-sm">
            {leftColumn?.line1?.text1}
          </Body>
        ) : null}
        {leftColumn?.line1?.text2 ? (
          <Body className="font-normal text-white/[.5] desktop:text-base tablet:text-base mobile:text-sm truncate whitespace-nowrap overflow-hidden max-w-full">
            {leftColumn?.line1?.text2}
          </Body>
        ) : null}
        {leftColumn?.line1?.copyLink ? (
          <CopyToClipboard text={leftColumn.line1.copyLink}>
            <img
              src={CopyIcon}
              alt="copy-token-address"
              className="w-2.5 h-3"
              onClick={(e) => e.stopPropagation()}
            />
          </CopyToClipboard>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-x-2 mobile:gap-x-1.5">
        {timestamp ? (
          <BodySmall className="font-normal text-white">{timestamp}</BodySmall>
        ) : null}
        {leftColumn?.line2?.volume ? (
          <BodySmall className="font-normal mobile:hidden text-white">
            <span className="text-white/[.5]">Vol:</span> $
            {leftColumn?.line2?.volume}
          </BodySmall>
        ) : null}
        {leftColumn?.line2?.liquidity ? (
          <BodySmall className="font-normal text-white">
            <span className="text-white/[.5]">Liq:</span> $
            {leftColumn?.line2?.liquidity}
          </BodySmall>
        ) : null}
      </div>
    </div>
  );
};

export default LeftColumnTokenMarketDataRow;

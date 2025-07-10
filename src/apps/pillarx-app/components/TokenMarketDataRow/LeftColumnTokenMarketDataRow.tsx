/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useEffect, useRef, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { MdCheck } from 'react-icons/md';
import { formatDistanceToNowStrict, isValid, parseISO } from 'date-fns';
import { DateTime } from 'luxon';

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
  tileTitle?: string;
};

const LeftColumnTokenMarketDataRow = ({
  data,
  tileTitle,
}: LeftColumnTokenMarketDataRowProps) => {
  const { leftColumn } = data;
  const [copied, setCopied] = useState(false);
  const [width, setWidth] = useState<number | null>(null);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 3000);
      return () => clearTimeout(timer);
    }

    return undefined;
  }, [copied]);

  useEffect(() => {
    const updateWidth = () => {
      if (divRef.current) {
        setWidth(divRef.current.getBoundingClientRect().width);
      }
    };

    window.addEventListener('resize', updateWidth);
    updateWidth();

    return () => {
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  // Calculate timestamp/age
  const timestampToISO = DateTime.fromSeconds(leftColumn?.line2?.timestamp || 0).toISO() || '';
  const ISOToDate = parseISO(timestampToISO);
  let timestamp = isValid(ISOToDate)
    ? formatDistanceToNowStrict(
        DateTime.fromSeconds(leftColumn?.line2?.timestamp || 0).toISO() || '',
        { addSuffix: true }
      )
    : undefined;
  timestamp = timestamp && getShorterTimeUnits(timestamp);

  return (
    <div className="flex flex-col ml-1.5 h-full justify-between">
      <div className="flex gap-1 items-center">
        {leftColumn?.line1?.text1 ? (
          <Body
            className={`font-normal text-white desktop:text-base tablet:text-base mobile:text-sm ${width !== null && width < 50 && 'truncate whitespace-nowrap overflow-hidden min-w-[30px]'}`}
          >
            {leftColumn?.line1?.text1}
          </Body>
        ) : null}
        {leftColumn?.line1?.text2 ? (
          <div
            ref={divRef}
            className="whitespace-nowrap overflow-hidden max-w-full"
          >
            <Body className="font-normal text-white/[.5] desktop:text-base tablet:text-base mobile:text-sm truncate">
              {leftColumn?.line1?.text2}
            </Body>
          </div>
        ) : null}
        {leftColumn?.line1?.copyLink ? (
          <div className="flex flex-shrink-0">
            {copied ? (
              <MdCheck
                style={{
                  width: '12px',
                  height: '12px',
                  color: 'white',
                  opacity: 0.5,
                }}
              />
            ) : (
              <CopyToClipboard
                text={leftColumn.line1.copyLink}
                onCopy={() => setCopied(true)}
              >
                <img
                  src={CopyIcon}
                  alt="copy-token-address"
                  className="w-2.5 h-3"
                  onClick={(e) => e.stopPropagation()}
                />
              </CopyToClipboard>
            )}
          </div>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-x-2 mobile:gap-x-1.5">
        {/* Conditionally display timestamp if tileTitle contains 'Fresh' */}
        {tileTitle?.includes('Fresh') && timestamp ? (
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

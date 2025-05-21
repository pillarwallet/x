import { useState } from 'react';

// components
import RandomAvatar from '../RandomAvatar/RandomAvatar';

type TokenLogoMarketDataRowProps = {
  tokenLogo?: string;
  chainLogo?: string;
  tokenName?: string;
  size?: string;
  chainLogoSize?: string;
};

const TokenLogoMarketDataRow = ({
  tokenLogo,
  chainLogo,
  tokenName,
  size = 'w-10 h-10 mobile:w-9 mobile:h-9',
  chainLogoSize = 'w-[18px] h-[18px] mobile:w-[14px] mobile:h-[14px]',
}: TokenLogoMarketDataRowProps) => {
  const [isBrokenImage, setIsBrokenImage] = useState<boolean>(false);
  const [isBrokenImageChain, setIsBrokenImageChain] = useState<boolean>(false);

  return (
    <div className={`relative ${size} rounded-full flex-shrink-0 mr-2`}>
      {tokenLogo && !isBrokenImage ? (
        <img
          src={tokenLogo}
          alt="token-logo"
          className="w-full h-full object-fill rounded-full"
          data-testid="token-info-horizontal-logo"
          onError={() => setIsBrokenImage(true)}
        />
      ) : (
        <div className="w-full h-full overflow-hidden rounded-full">
          <RandomAvatar name={tokenName || ''} />
        </div>
      )}

      {/* Overlay text when no logo available */}
      {(!tokenLogo || isBrokenImage) && (
        <span className="absolute inset-0 flex items-center justify-center text-white text-base font-normal">
          {tokenName?.slice(0, 2)}
        </span>
      )}

      {/* Blockchain logo overlapping when only one blockchain for this token */}
      {chainLogo && !isBrokenImageChain ? (
        <div
          className={`absolute bottom-0 right-0 ${chainLogoSize} rounded-full overflow-hidden border-[1px] bg-white border-container_grey transform translate-x-[30%]`}
        >
          <img
            src={chainLogo}
            alt="logo"
            className="w-full h-full object-contain"
            onError={() => setIsBrokenImageChain(true)}
          />
        </div>
      ) : null}
    </div>
  );
};

export default TokenLogoMarketDataRow;

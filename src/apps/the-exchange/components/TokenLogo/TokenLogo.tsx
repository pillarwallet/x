import { useState } from 'react';

// components
import RandomAvatar from '../RandomAvatar/RandomAvatar';

type TokenLogoProps = {
  tokenName?: string;
  tokenLogo?: string;
  tokenChainLogo?: string;
  isBigger?: boolean;
  showLogo?: boolean;
};

const TokenLogo = ({
  tokenName,
  tokenLogo,
  tokenChainLogo,
  isBigger,
  showLogo,
}: TokenLogoProps) => {
  const [isBrokenImage, setIsBrokenImage] = useState<boolean>(false);

  if (!showLogo) return null;

  return (
    <div className="flex min-w-fit items-end">
      <div
        className={`${isBigger ? 'w-[30px] h-[30px]' : 'w-5 h-5'} relative rounded-full grayscale`}
      >
        {tokenLogo && !isBrokenImage ? (
          <img
            src={tokenLogo}
            alt="token-logo"
            className="w-full h-full object-fill rounded-full"
            onError={() => setIsBrokenImage(true)}
          />
        ) : (
          <div className="w-full h-full overflow-hidden rounded-full">
            <RandomAvatar name={tokenName || ''} />
          </div>
        )}

        {/* Overlay text when no token logo available */}
        {(!tokenLogo || isBrokenImage) && (
          <span
            className={`absolute inset-0 flex items-center justify-center text-white ${isBigger ? 'text-xs' : 'text-[8px]'} font-bold`}
          >
            {tokenName?.slice(0, 2)}
          </span>
        )}
      </div>

      <div
        className={`${isBigger ? 'w-3.5 h-3.5' : 'w-3 h-3'} rounded-full border border-white relative right-[7px] ${!tokenChainLogo && 'hidden'}`}
      >
        <img
          src={tokenChainLogo}
          alt="chain-logo"
          className={`w-full h-full object-fill rounded-full grayscale ${!tokenChainLogo && 'hidden'}`}
        />
      </div>
    </div>
  );
};

export default TokenLogo;

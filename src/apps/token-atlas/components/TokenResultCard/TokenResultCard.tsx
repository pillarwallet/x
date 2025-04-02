import { useState } from 'react';

// utils
import { chainNameDataCompatibility } from '../../../../services/tokensData';

// components
import RandomAvatar from '../RandomAvatar/RandomAvatar';

// components
import Body from '../Typography/Body';

type TokenResultCardProps = {
  onClick: () => void;
  tokenName?: string;
  tokenSymbol?: string;
  tokenChain?: string;
  tokenLogo?: string;
};

const TokenResultCard = ({
  onClick,
  tokenName,
  tokenSymbol,
  tokenChain,
  tokenLogo,
}: TokenResultCardProps) => {
  const [isBrokenImage, setIsBrokenImage] = useState<boolean>(false);

  return (
    <div
      id={`token-atlas-token-result-card-${tokenChain}-${tokenName}`}
      onClick={onClick}
      className="flex w-full bg-medium_grey rounded-lg p-4 justify-between items-center cursor-pointer"
      data-testid="token-result-card"
    >
      <div className="flex items-center min-w-0 flex-1">
        <div className="relative w-[30px] h-[30px] rounded-full mr-2">
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
            <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
              {tokenName?.slice(0, 2)}
            </span>
          )}
        </div>

        <div className="flex flex-col mr-2 min-w-0">
          {tokenName && (
            <Body className="text-base capitalize truncate min-w-0">
              {tokenName}
            </Body>
          )}
          {tokenSymbol && (
            <Body className="text-white_grey">{tokenSymbol}</Body>
          )}
        </div>
      </div>

      {tokenChain && (
        <div className="flex-1 min-w-0 text-right">
          <Body className="text-base font-medium capitalize truncate min-w-0">
            On {chainNameDataCompatibility(tokenChain)}
          </Body>
        </div>
      )}
    </div>
  );
};

export default TokenResultCard;

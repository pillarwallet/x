import { useState } from 'react';

// components
import RandomAvatar from '../RandomAvatar/RandomAvatar';
import Body from '../Typography/Body';

type TokenCardProps = {
  tokenLogo?: string;
  tokenName?: string;
  tokenSymbol?: string;
  blockchainLogo?: string;
  onClick: () => void;
};

const TokenCard = ({
  tokenLogo,
  tokenName,
  tokenSymbol,
  blockchainLogo,
  onClick,
}: TokenCardProps) => {
  const [isBrokenImage, setIsBrokenImage] = useState<boolean>(false);

  return (
    <div
      id="token-atlas-token-card"
      className="flex flex-col relative w-[108px] h-[125px] bg-medium_grey rounded-lg px-4 pb-4 pt-6 items-center justify-center cursor-pointer"
      onClick={onClick}
      data-testid="token-card"
    >
      {blockchainLogo && (
        <img
          src={blockchainLogo}
          alt="chain-logo"
          className="absolute top-2 right-2 w-4 h-4 object-fill rounded-full"
          data-testid="token-card-chain-logo"
        />
      )}

      <div className="relative w-[40px] h-[40px] rounded-full">
        {tokenLogo && !isBrokenImage ? (
          <img
            src={tokenLogo}
            alt="token-logo"
            className="w-full h-full object-fill rounded-full"
            data-testid="token-card-token-logo"
            onError={() => setIsBrokenImage(true)}
          />
        ) : (
          <div className="w-full h-full overflow-hidden rounded-full">
            <RandomAvatar name={`${tokenName}-chain` || ''} />
          </div>
        )}

        {/* Overlay text when no token logo available */}
        {(!tokenLogo || isBrokenImage) && (
          <span className="absolute inset-0 flex items-center justify-center text-white text-base font-bold">
            {tokenName?.slice(0, 2)}
          </span>
        )}
      </div>

      <Body className="text-base capitalize w-full truncate text-center">
        {tokenName}
      </Body>
      <Body className="text-white_grey">{tokenSymbol}</Body>
    </div>
  );
};

export default TokenCard;

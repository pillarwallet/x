// utils
import { convertChainIdtoName } from '../../utils/converters';

// components
import RandomAvatar from '../RandomAvatar/RandomAvatar';

// components
import Body from '../Typography/Body';

type TokenResultCardProps = {
  onClick: () => void;
  tokenName?: string;
  tokenSymbol?: string;
  tokenChain?: number;
  tokenLogo?: string;
};

const TokenResultCard = ({
  onClick,
  tokenName,
  tokenSymbol,
  tokenChain,
  tokenLogo,
}: TokenResultCardProps) => {
  return (
    <div
      id="token-atlas-token-result-card"
      onClick={onClick}
      className="flex w-full bg-medium_grey rounded-lg p-4 justify-between items-center cursor-pointer"
      data-testid="token-result-card"
    >
      <div className="flex items-center">
        {tokenLogo ? (
          <img
            src={tokenLogo}
            alt="token-logo"
            className="w-[30px] h-[30px] object-fill rounded-full mr-2"
          />
        ) : (
          <div className="w-[30px] h-[30px] object-fill rounded-full mr-2 overflow-hidden">
            <RandomAvatar name={tokenName || ''} />
          </div>
        )}
        <div className="flex flex-col mr-2">
          {tokenName && (
            <Body className="text-base capitalize">{tokenName}</Body>
          )}
          {tokenSymbol && (
            <Body className="text-white_grey">{tokenSymbol}</Body>
          )}
        </div>
      </div>
      {tokenChain && (
        <Body className="text-base font-medium capitalize">
          On {convertChainIdtoName(tokenChain)}
        </Body>
      )}
    </div>
  );
};

export default TokenResultCard;

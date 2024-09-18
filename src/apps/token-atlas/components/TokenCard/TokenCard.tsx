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
  return (
    <div
      id="token-atlas-token-card"
      className="flex flex-col relative w-[108px] h-[125px] bg-medium_grey rounded-lg px-4 pb-4 pt-6 items-center justify-center cursor-pointer"
      onClick={onClick}
      data-testid="token-card"
    >
      {blockchainLogo ? (
        <img
          src={blockchainLogo}
          alt="chain-logo"
          className="absolute top-2 right-2 w-4 h-4 object-fill rounded-full"
          data-testid="token-card-chain-logo"
        />
      ) : (
        <div className="absolute top-2 right-2 w-4 h-4 object-fill rounded-full overflow-hidden">
          <RandomAvatar />
        </div>
      )}
      {tokenLogo ? (
        <img
          src={tokenLogo}
          alt="token-logo"
          className="w-[40px] h-[40px] object-fill rounded-full"
          data-testid="token-card-token-logo"
        />
      ) : (
        <div className="w-[40px] h-[40px] object-fill rounded-full overflow-hidden">
          <RandomAvatar />
        </div>
      )}
      <Body className="text-base capitalize w-full truncate text-center">
        {tokenName}
      </Body>
      <Body className="text-white_grey">{tokenSymbol}</Body>
    </div>
  );
};

export default TokenCard;

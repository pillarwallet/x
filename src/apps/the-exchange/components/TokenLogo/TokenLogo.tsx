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
  if (!showLogo) return null;

  return (
    <div className="flex min-w-fit items-end">
      {tokenLogo ? (
        <img
          src={tokenLogo}
          alt="token-logo"
          className={`${isBigger ? 'w-[30px] h-[30px]' : 'w-5 h-5'} object-fill rounded-full grayscale`}
        />
      ) : (
        <div
          className={`${isBigger ? 'w-[30px] h-[30px]' : 'w-5 h-5'} object-fill rounded-full grayscale overflow-hidden`}
        >
          <RandomAvatar name={tokenName || ''} />
        </div>
      )}

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

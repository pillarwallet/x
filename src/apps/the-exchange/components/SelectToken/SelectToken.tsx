// types
import { CardPosition } from '../../utils/types';

// utils
import { getChainName } from '../../../../utils/blockchain';
import { limitDigits } from '../../../token-atlas/utils/converters';

// components
import Body from '../Typography/Body';

// images
import TokenLogo from '../TokenLogo/TokenLogo';

type SelectTokenProps = {
  type: CardPosition;
  tokenName?: string;
  tokenChain?: number;
  tokenLogo?: string;
  tokenBalance?: number;
  tokenPrice?: number;
  onClick?: () => void;
};

const SelectToken = ({
  type,
  tokenName,
  tokenChain,
  tokenLogo,
  tokenBalance,
  tokenPrice,
  onClick,
}: SelectTokenProps) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      id="select-token-info-exchange"
      onClick={handleClick}
      className="flex justify-between items-start mb-4"
    >
      <div className="flex w-full flex-col">
        <Body className="capitalize line-clamp-2 text-ellipsis break-all">
          {tokenName ?? type}
        </Body>
        <Body className="font-normal capitalize">
          {tokenChain ? `On ${getChainName(tokenChain)}` : 'Select Token'}
        </Body>
        {tokenBalance && (
          <Body className="font-normal">
            {limitDigits(tokenBalance)}{' '}
            {tokenPrice && (
              <span className="text-black_grey/[.4]">
                ${(tokenPrice * tokenBalance).toFixed(4)}
              </span>
            )}
          </Body>
        )}
      </div>
      <TokenLogo
        tokenName={tokenName}
        tokenLogo={tokenLogo}
        showLogo={Boolean(tokenName)}
      />
    </div>
  );
};

export default SelectToken;

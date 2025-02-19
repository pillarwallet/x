// types
import { CardPosition } from '../../utils/types';

// utils
import { convertChainIdtoName } from '../../../../utils/blockchain';

// components
import Body from '../Typography/Body';

// images
import TokenLogo from '../TokenLogo/TokenLogo';

type SelectTokenProps = {
  type: CardPosition;
  tokenName?: string;
  tokenChain?: number;
  tokenLogo?: string;
  onClick?: () => void;
};

const SelectToken = ({
  type,
  tokenName,
  tokenChain,
  tokenLogo,
  onClick,
}: SelectTokenProps) => {
  return (
    <div
      id="select-token-info-exchange"
      onClick={onClick}
      className="flex justify-between items-start"
    >
      <div className="flex w-full flex-col">
        <Body className="capitalize line-clamp-2 text-ellipsis break-all">
          {tokenName ?? type}
        </Body>
        <Body className="font-normal capitalize">
          {tokenChain
            ? `On ${convertChainIdtoName(tokenChain)}`
            : 'Select Token'}
        </Body>
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

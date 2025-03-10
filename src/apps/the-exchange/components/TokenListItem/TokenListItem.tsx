// components
import TokenLogo from '../TokenLogo/TokenLogo';
import Body from '../Typography/Body';
import BodySmall from '../Typography/BodySmall';

type TokenListItemProps = {
  tokenName: string;
  tokenSymbol: string;
  chainName: string;
  onClick: () => void;
  tokenLogo?: string;
  testId?: string;
};

const TokenListItem = ({
  tokenName,
  tokenSymbol,
  chainName,
  onClick,
  tokenLogo,
  testId,
}: TokenListItemProps) => {
  return (
    <div
      id={testId}
      onClick={onClick}
      className="flex justify-between items-end border-b py-4 border-b-black_grey group group-hover:border-b-black_grey/[.6] cursor-pointer"
      data-testid="token-list-item"
    >
      <div className="flex items-center">
        <TokenLogo
          tokenName={tokenName}
          tokenLogo={tokenLogo}
          isBigger
          showLogo={Boolean(tokenName)}
        />
        <div className="flex flex-col ml-[10px]">
          <Body className="group-hover:opacity-60 truncate max-w-[150px]">
            {tokenName}
          </Body>
          <BodySmall className="group-hover:opacity-60">
            {tokenSymbol}
          </BodySmall>
        </div>
      </div>
      <BodySmall className="group-hover:opacity-60 capitalize truncate xs:max-w-[150px]">
        On {chainName === 'XDAI' ? 'Gnosis' : chainName}
      </BodySmall>
    </div>
  );
};

export default TokenListItem;

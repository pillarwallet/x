// utils
import {
  Token,
  chainNameDataCompatibility,
  chainNameToChainIdTokensData,
} from '../../../../services/tokensData';
import { getLogoForChainId } from '../../../../utils/blockchain';
import { limitDigits } from '../../../token-atlas/utils/converters';

// components
import TokenLogo from '../TokenLogo/TokenLogo';
import Body from '../Typography/Body';
import BodySmall from '../Typography/BodySmall';

type TokenListItemProps = {
  token: Token;
  onClick: () => void;
  testId?: string;
};

const TokenListItem = ({ token, onClick, testId }: TokenListItemProps) => {
  return (
    <div
      id={testId}
      onClick={onClick}
      className="flex justify-between items-end border-b py-4 border-b-black_grey group group-hover:border-b-black_grey/[.6] cursor-pointer"
      data-testid="token-list-item"
    >
      <div className="flex items-center">
        <TokenLogo
          tokenName={token.name}
          tokenLogo={token.logo}
          isBigger
          showLogo={Boolean(token.name)}
          tokenChainLogo={getLogoForChainId(
            chainNameToChainIdTokensData(token.blockchain)
          )}
        />
        <div className="flex flex-col ml-[10px]">
          <Body className="group-hover:opacity-60 truncate max-w-[150px]">
            {token.name}
          </Body>
          <BodySmall className="group-hover:opacity-60">
            {token.symbol}
          </BodySmall>
        </div>
      </div>
      {token.balance ? (
        <div className="flex flex-col ml-[10px] items-end">
          <Body className="group-hover:opacity-60 truncate max-w-[150px]">
            {limitDigits(token.balance)}
          </Body>

          <BodySmall className="group-hover:opacity-60">
            ${token.price && (token.price * token.balance).toFixed(4)}
          </BodySmall>
        </div>
      ) : (
        <BodySmall className="group-hover:opacity-60 capitalize truncate xs:max-w-[150px]">
          On {chainNameDataCompatibility(token.blockchain)}
        </BodySmall>
      )}
    </div>
  );
};

export default TokenListItem;

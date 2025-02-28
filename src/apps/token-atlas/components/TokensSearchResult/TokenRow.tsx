// services
import {
  Token,
  chainNameToChainIdTokensData,
} from '../../../../services/tokensData';

// components
import TokenResultCard from '../TokenResultCard/TokenResultCard';

const TokenRow = ({
  index,
  style,
  data,
}: {
  index: number;
  style: React.CSSProperties;
  data: { tokenList: Token[]; handleChooseToken: (token: Token) => void };
}) => {
  const { tokenList, handleChooseToken } = data;
  const token = tokenList[index];

  if (!token) return null;

  return (
    <div style={style}>
      <TokenResultCard
        key={index}
        onClick={() => handleChooseToken(token)}
        tokenName={token.name}
        tokenSymbol={token.symbol}
        tokenChain={chainNameToChainIdTokensData(token.blockchain)}
        tokenLogo={token.logo}
      />
    </div>
  );
};

export default TokenRow;

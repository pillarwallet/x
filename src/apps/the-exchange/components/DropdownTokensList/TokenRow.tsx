// types
import { Token } from '../../../../services/tokensData';

// components
import TokenListItem from '../TokenListItem/TokenListItem';

const TokenRow = ({
  index,
  style,
  data,
}: {
  index: number;
  style: React.CSSProperties;
  data: { tokenList: Token[]; handleClick: (token: Token) => void };
}) => {
  const token = data.tokenList[index];
  const onClick = data.handleClick;

  if (!token) return null;

  return (
    <div style={style}>
      <TokenListItem
        testId={`token-list-item-exchange-${token.blockchain}-${token.name}`}
        onClick={() => onClick(token)}
        token={token}
      />
    </div>
  );
};

export default TokenRow;

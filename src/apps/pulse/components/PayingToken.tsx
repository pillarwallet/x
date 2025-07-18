import { getLogoForChainId } from '../../../utils/blockchain';
import { PayingToken as PayingTokenType } from '../types/tokens';

interface PayingTokenProps {
  payingToken: PayingTokenType;
}

export default function PayingToken(props: PayingTokenProps) {
  const { payingToken } = props;
  return (
    <div
      className="flex justify-between"
      style={{ marginTop: 10, marginBottom: 10 }}
    >
      <div className="flex items-center">
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <img
            src={payingToken.logo}
            alt="Main"
            style={{
              width: 32,
              height: 32,
              borderRadius: 50,
              marginLeft: 5,
              marginRight: 5,
            }}
          />
          <img
            src={getLogoForChainId(payingToken.chainId)}
            style={{
              position: 'absolute',
              bottom: '-1px',
              right: '2px',
              width: 12,
              height: 12,
              borderRadius: '50%',
            }}
            alt="Chain logo"
          />
        </div>
        <div style={{ marginLeft: 5 }}>
          <div style={{ fontSize: 13 }}>{payingToken.name}</div>
          <div style={{ fontSize: 13, color: 'grey' }}>
            {payingToken.actualBal} {payingToken.symbol}
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center" style={{ marginRight: 10 }}>
        <div className="flex" style={{ fontSize: 13, textAlign: 'right' }}>
          {payingToken.totalRaw}
        </div>
        <div
          className="flex justify-end"
          style={{ fontSize: 12, color: 'grey', textAlign: 'right' }}
        >
          ${payingToken.totalUsd.toFixed(2)}
        </div>
      </div>
    </div>
  );
}

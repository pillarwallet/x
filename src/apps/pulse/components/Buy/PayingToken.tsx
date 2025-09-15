import { getLogoForChainId } from '../../../../utils/blockchain';
import { PayingToken as PayingTokenType } from '../../types/tokens';

interface PayingTokenProps {
  payingToken: PayingTokenType;
}

export default function PayingToken(props: PayingTokenProps) {
  const { payingToken } = props;
  return (
    <div className="flex justify-between">
      <div className="flex items-center">
        <div className="relative inline-block mr-2">
          <img
            src={payingToken.logo}
            alt="Main"
            className="w-8 h-8 rounded-full"
          />
          <img
            src={getLogoForChainId(payingToken.chainId)}
            className="absolute -bottom-px right-0.5 w-3 h-3 rounded-full border border-[#1E1D24]"
            alt="Chain logo"
          />
        </div>
        <div>
          <div className="text-[13px] font-normal text-white">
            {payingToken.name}
          </div>
          <div className="text-[13px] font-normal text-white/50">
            {payingToken.actualBal} {payingToken.symbol}
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center text-right">
        <div className="text-[13px] font-normal text-white">
          {payingToken.totalRaw}
        </div>
        <div className="text-xs font-normal text-white/50">
          ${payingToken.totalUsd.toFixed(2)}
        </div>
      </div>
    </div>
  );
}

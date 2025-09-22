import { useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { MdCheck } from 'react-icons/md';

// utils
import { getLogoForChainId } from '../../../../utils/blockchain';

// types
import { PayingToken as PayingTokenType } from '../../types/tokens';

// icons
import CopyIcon from '../../assets/copy-icon.svg';

interface PayingTokenProps {
  payingToken: PayingTokenType;
}

export default function PayingToken(props: PayingTokenProps) {
  const { payingToken } = props;
  const [isAddressCopied, setIsAddressCopied] = useState(false);

  useEffect(() => {
    if (isAddressCopied) {
      const timer = setTimeout(() => {
        setIsAddressCopied(false);
      }, 3000);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [isAddressCopied]);

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
          <div className="flex items-center text-[13px] font-normal text-white">
            <span>
              {payingToken.name === 'USDC' ? 'USD Coin' : payingToken.name}
            </span>
            <span className="ml-1 text-white/50">{payingToken.symbol}</span>
          </div>
          <div className="flex items-center text-[13px] font-normal text-white/50">
            <span>
              {payingToken.address
                ? `${payingToken.address.slice(0, 6)}...${payingToken.address.slice(-4)}`
                : 'Address not available'}
            </span>
            {payingToken.address && (
              <CopyToClipboard
                text={payingToken.address}
                onCopy={() => setIsAddressCopied(true)}
              >
                <div className="flex items-center ml-1 cursor-pointer">
                  {isAddressCopied ? (
                    <MdCheck className="w-[10px] h-3 text-white" />
                  ) : (
                    <img
                      src={CopyIcon}
                      alt="copy-address-icon"
                      className="w-[10px] h-3"
                    />
                  )}
                </div>
              </CopyToClipboard>
            )}
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

import { useEffect, useState } from 'react';

// types
import { TokenContract } from '../../../../types/api';

// reducer
import { useGetBlockchainsListQuery } from '../../../token-atlas/api/token';

// components
import RandomAvatar from '../RandomAvatar/RandomAvatar';
import TokensPercentage from '../TokensPercentage/TokensPercentage';
import Body from '../Typography/Body';
import BodySmall from '../Typography/BodySmall';

type HorizontalTokenProps = {
  tokenIndex: number;
  tokenLogo?: string;
  tokenSymbol?: string;
  tokenName?: string;
  tokenValue?: number;
  tokenChains?: TokenContract[];
  percentage?: number;
  isLast?: boolean;
  onClick?: () => void;
};

const HorizontalToken = ({
  tokenIndex,
  tokenLogo,
  tokenSymbol,
  tokenName,
  tokenValue,
  tokenChains,
  percentage,
  isLast,
  onClick,
}: HorizontalTokenProps) => {
  const [blockchainLogo, setBlockchainLogo] = useState<string | undefined>(
    undefined
  );
  const [isBrokenImage, setIsBrokenImage] = useState<boolean>(false);

  const { data: blockchainListData, isSuccess } = useGetBlockchainsListQuery();

  useEffect(() => {
    if (tokenChains?.length === 1 && blockchainListData && isSuccess) {
      const chainData = blockchainListData?.result?.data.find(
        (chain) => chain.name === tokenChains[0].blockchain
      );
      setBlockchainLogo(chainData?.logo);
    }
  }, [blockchainListData, isSuccess, tokenChains]);

  return (
    <div
      className={`flex w-full justify-between py-5 cursor-pointer ${!isLast && 'border-b border-[#1F1D23] mobile:border-[#27262F]'} ${isLast && tokenIndex === 3 && 'mobile:border-b mobile:border-[#27262F]'}`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <BodySmall className="text-purple_light mr-[18px]">
          0{tokenIndex}
        </BodySmall>
        <div className="relative w-[50px] h-[50px] rounded-full mr-3.5">
          {tokenLogo && !isBrokenImage ? (
            <img
              src={tokenLogo}
              alt="token-logo"
              className="w-full h-full object-fill rounded-full"
              data-testid="horizontal-token-logo"
              onError={() => setIsBrokenImage(true)}
            />
          ) : (
            <div className="w-full h-full overflow-hidden rounded-full">
              <RandomAvatar name={tokenName || ''} />
            </div>
          )}

          {/* Overlay text when no token logo available */}
          {(!tokenLogo || isBrokenImage) && (
            <span className="absolute inset-0 flex items-center justify-center text-white text-lg font-bold">
              {tokenName?.slice(0, 2)}
            </span>
          )}

          {/* Blockchain logo overlapping when only one blockchain for this token */}
          {tokenChains?.length === 1 ? (
            <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full overflow-hidden border-[1px] bg-white border-container_grey transform translate-x-1/3 translate-y-1/3">
              <img
                src={blockchainLogo}
                alt="logo"
                className="w-full h-full object-contain"
              />
            </div>
          ) : null}
        </div>

        <div className="flex flex-col">
          {tokenSymbol && <Body>{tokenSymbol}</Body>}
          {tokenName && (
            <BodySmall className="text-purple_light">{tokenName}</BodySmall>
          )}
        </div>
      </div>
      <div className="flex flex-col items-center">
        {tokenValue && <Body>${tokenValue.toFixed(4)}</Body>}
        <TokensPercentage percentage={percentage} />
      </div>
    </div>
  );
};

export default HorizontalToken;

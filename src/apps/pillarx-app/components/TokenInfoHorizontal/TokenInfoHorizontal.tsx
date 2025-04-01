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

type TokenInfoHorizontalProps = {
  logo?: string;
  tokenName?: string;
  tokenValue?: number;
  percentage?: number;
  tokenChains?: TokenContract[];
  onClick?: () => void;
};

const TokenInfoHorizontal = ({
  logo,
  tokenName,
  tokenValue,
  percentage,
  tokenChains,
  onClick,
}: TokenInfoHorizontalProps) => {
  const [blockchainLogo, setBlockchainLogo] = useState<string | undefined>(
    undefined
  );
  const [isBrokenImage, setIsBrokenImage] = useState<boolean>(false);

  const { data: blockchainListData, isSuccess } = useGetBlockchainsListQuery();

  useEffect(() => {
    if (tokenChains?.length === 1 && blockchainListData && isSuccess) {
      const chainData = blockchainListData.data.find(
        (chain) => chain.name === tokenChains[0].blockchain
      );
      setBlockchainLogo(chainData?.logo);
    }
  }, [blockchainListData, isSuccess, tokenChains]);

  return (
    <div
      className="flex flex-col py-5 px-[22px] gap-1 w-[122px] h-auto items-center cursor-pointer tablet:w-[120px] mobile:w-[100px] mobile:px-3.5"
      onClick={onClick}
    >
      <div className="relative w-[70px] h-[70px] rounded-full mb-3.5">
        {logo && !isBrokenImage ? (
          <img
            src={logo}
            alt="token-logo"
            className="w-full h-full object-fill rounded-full"
            data-testid="token-info-horizontal-logo"
            onError={() => setIsBrokenImage(true)}
          />
        ) : (
          <div className="w-full h-full overflow-hidden rounded-full">
            <RandomAvatar name={tokenName || ''} />
          </div>
        )}

        {/* Overlay text when no logo available */}
        {(!logo || isBrokenImage) && (
          <span className="absolute inset-0 flex items-center justify-center text-white text-lg font-bold">
            {tokenName?.slice(0, 2)}
          </span>
        )}

        {/* Blockchain logo overlapping when only one blockchain for this token */}
        {tokenChains?.length === 1 ? (
          <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full overflow-hidden border-[1px] bg-white border-container_grey transform translate-x-1/5 translate-y-1/5">
            <img
              src={blockchainLogo}
              alt="logo"
              className="w-full h-full object-contain"
            />
          </div>
        ) : null}
      </div>

      {tokenName && <Body className="text-center">{tokenName}</Body>}
      {tokenValue && (
        <BodySmall className="text-center">${tokenValue.toFixed(4)}</BodySmall>
      )}
      <TokensPercentage percentage={percentage} />
    </div>
  );
};

export default TokenInfoHorizontal;

import { useEtherspotUtils } from '@etherspot/transaction-kit';
import { useNavigate } from 'react-router-dom';

// types
import { TokenData } from '../../../../types/api';

// utils
import { chainNameFromViemToMobula } from '../../../../services/tokensData';
import { CompatibleChains } from '../../../../utils/blockchain';

// components
import HorizontalToken from '../HorizontalToken/HorizontalToken';

type TokensVerticalListProps = {
  position: 'left' | 'right';
  data: TokenData[];
};

const TokensVerticalList = ({ position, data }: TokensVerticalListProps) => {
  const navigate = useNavigate();
  const { isZeroAddress } = useEtherspotUtils();
  const listStartIndex = position === 'left' ? 1 : 4;

  return (
    <div
      className={`flex flex-col flex-1 mobile:p-0 mobile:border-0 ${position === 'left' ? 'pr-10 border-r-[3px] border-[#1F1D23]' : 'pl-10'}`}
    >
      {data.map((token, index) => {
        const compatibleTokenContract = token.contracts?.find((contract) =>
          CompatibleChains.some(
            (chain) =>
              chainNameFromViemToMobula(chain.chainName) === contract.blockchain
          )
        );
        return (
          <HorizontalToken
            key={index}
            onClick={() =>
              navigate(
                `/token-atlas?${!isZeroAddress(compatibleTokenContract?.address || '') ? `&asset=${compatibleTokenContract?.address}` : `&asset=${token.symbol}`}&blockchain=${compatibleTokenContract?.blockchain}`
              )
            }
            tokenIndex={index + listStartIndex}
            tokenName={token.name}
            tokenSymbol={token.symbol}
            tokenValue={undefined}
            percentage={undefined}
            isLast={index === data.length - 1}
            tokenLogo={token.logo}
            tokenChains={token.contracts}
          />
        );
      })}
    </div>
  );
};

export default TokensVerticalList;

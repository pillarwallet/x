import { useEtherspotUtils } from '@etherspot/transaction-kit';
import { createRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// types
import { Projection, TokenData } from '../../../../types/api';

// hooks
import useRefDimensions from '../../hooks/useRefDimensions';

// utils
import { chainNameFromViemToMobula } from '../../../../services/tokensData';
import { CompatibleChains } from '../../../../utils/blockchain';

// components
import TileContainer from '../TileContainer/TileContainer';
import TokenInfoHorizontal from '../TokenInfoHorizontal/TokenInfoHorizontal';
import Body from '../Typography/Body';

type TokensHorizontalTileProps = {
  data: Projection | undefined;
  isDataLoading: boolean;
};

const TokensHorizontalTile = ({
  data,
  isDataLoading,
}: TokensHorizontalTileProps) => {
  const navigate = useNavigate();
  const { isZeroAddress } = useEtherspotUtils();
  const [tokenHorizontalWidth, setTokenHorizontalWidth] = useState<number>(0);
  const { data: dataTokens, meta } = data || {};
  const dataTokensHorizontal = dataTokens as TokenData[] | undefined;

  const windowWidth = window.innerWidth;

  useEffect(() => {
    const handleTokenHorizontalWidthResize = () => {
      if (windowWidth >= 1024) {
        setTokenHorizontalWidth(159);
      } else if (windowWidth >= 800) {
        setTokenHorizontalWidth(152);
      } else {
        // 102px for width of the TokenInfoHorizontal component 100px + 2px of space
        setTokenHorizontalWidth(102);
      }
    };

    handleTokenHorizontalWidthResize();
    window.addEventListener('resize', handleTokenHorizontalWidthResize);

    return () => {
      window.removeEventListener('resize', handleTokenHorizontalWidthResize);
    };
  }, [windowWidth]);

  const divRef = createRef<HTMLDivElement>();
  const dimensions = useRefDimensions(divRef);

  const numberTokensHorizontal =
    Math.floor(dimensions.width / tokenHorizontalWidth) ?? 0;

  if (!data || !dataTokensHorizontal?.length || isDataLoading) {
    return null;
  }

  return (
    <div ref={divRef}>
      <TileContainer
        id="tokens-horizontal-tile"
        className="flex-col px-10 pt-[30px] pb-5 tablet:p-5 mobile:p-0 mobile:bg-[#1F1D23]"
      >
        <Body className="text-purple_light mb-2.5">{meta?.display?.title}</Body>
        <div className="flex justify-between">
          {dataTokensHorizontal
            ?.slice(0, numberTokensHorizontal)
            .map((token, index) => {
              const compatibleTokenContract = token.contracts?.find(
                (contract) =>
                  CompatibleChains.some(
                    (chain) =>
                      chainNameFromViemToMobula(chain.chainName) ===
                      contract.blockchain
                  )
              );
              return (
                <TokenInfoHorizontal
                  key={index}
                  logo={token.logo}
                  tokenName={token.name}
                  tokenValue={undefined}
                  percentage={undefined}
                  tokenChains={token.contracts}
                  onClick={() =>
                    navigate(
                      `/token-atlas?${!isZeroAddress(compatibleTokenContract?.address || '') ? `&asset=${compatibleTokenContract?.address}` : `&asset=${token.symbol}`}&blockchain=${compatibleTokenContract?.blockchain}`
                    )
                  }
                />
              );
            })}
        </div>
      </TileContainer>
    </div>
  );
};

export default TokensHorizontalTile;

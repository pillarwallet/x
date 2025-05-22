import { CircularProgress } from '@mui/material';
import { RefObject } from 'react';
import { TokenAtlasInfoData } from '../../../../types/api';
import useRefDimensions from '../../../pillarx-app/hooks/useRefDimensions';
import { useAppDispatch, useAppSelector } from '../../hooks/useReducerHooks';
import { setIsAllChainsVisible } from '../../reducer/tokenAtlasSlice';
import ChainCard from '../ChainCard/ChainCard';
import Body from '../Typography/Body';

type BlockchainCardsProps = {
  isLoadingTokenDataInfo: boolean;
  divDimensionRef: RefObject<HTMLDivElement>;
};

const BlockchainCards = ({
  isLoadingTokenDataInfo,
  divDimensionRef,
}: BlockchainCardsProps) => {
  const dispatch = useAppDispatch();
  const tokenDataInfo = useAppSelector(
    (state) => state.tokenAtlas.tokenDataInfo as TokenAtlasInfoData | undefined
  );
  const isAllChainsVisible = useAppSelector(
    (state) => state.tokenAtlas.isAllChainsVisible as boolean
  );
  const dimensions = useRefDimensions(divDimensionRef);
  // This is to make sure that if the chains do not all fit in one line, we add the number of hidden chains
  const tokenBlockchainsList =
    tokenDataInfo?.contracts.map((contract) => contract.blockchain) || [];
  const numberVisibleCards = Math.floor((dimensions.width - 50) / 158);

  const numberHiddenCards = Math.max(
    tokenBlockchainsList.length - numberVisibleCards,
    0
  );

  const handleShowAllChains = () => {
    dispatch(setIsAllChainsVisible(!isAllChainsVisible));
  };

  return (
    <div className="flex flex-col gap-2">
      <Body>Blockchains</Body>
      <div
        id="token-atlas-info-column-blockchain-list"
        className="w-full h-fit flex flex-wrap gap-2"
      >
        {isLoadingTokenDataInfo && (
          <CircularProgress
            size={32}
            sx={{ color: '#979797' }}
            data-testid="circular-loading"
          />
        )}
        {isAllChainsVisible
          ? tokenBlockchainsList.map((chain, index) => (
              <ChainCard key={index} chainName={chain} />
            ))
          : tokenBlockchainsList
              .slice(0, numberVisibleCards)
              .map((chain, index) => (
                <ChainCard key={index} chainName={chain} />
              ))}
        {numberHiddenCards !== 0 && (
          <div
            className="flex rounded-full bg-medium_grey p-2 items-center h-8 cursor-pointer"
            onClick={handleShowAllChains}
          >
            {numberHiddenCards > 0 && !isAllChainsVisible ? (
              <Body>+ {numberHiddenCards}</Body>
            ) : (
              <Body className="text-[9px] font-medium">Show less</Body>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlockchainCards;

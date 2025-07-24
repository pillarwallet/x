import _ from 'lodash';
import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// api
import { useRecordPresenceMutation } from '../../../../services/pillarXApiPresence';
import { useGetTrendingTokensQuery } from '../../api/token';

// hooks
import useTransactionKit from '../../../../hooks/useTransactionKit';
import { useAppDispatch, useAppSelector } from '../../hooks/useReducerHooks';

// reducer
import {
  setIsSearchTokenModalOpen,
  setSelectedChain,
  setSelectedToken,
} from '../../reducer/tokenAtlasSlice';

// types
import { BlockchainData, TokenData } from '../../../../types/api';
import { SelectedTokenType } from '../../types/types';

// components
import SkeletonLoader from '../../../../components/SkeletonLoader';
import {
  chainNameFromViemToMobula,
  chainNameToChainIdTokensData,
} from '../../../../services/tokensData';
import { CompatibleChains } from '../../../../utils/blockchain';
import TokenCard from '../TokenCard/TokenCard';
import Body from '../Typography/Body';

const TokensSlider = () => {
  /**
   * Import the recordPresence mutation from the
   * pillarXApiPresence service. We use this to
   * collect data on when the Trending Tokens get scrolled
   */
  const [recordPresence] = useRecordPresenceMutation();

  const { walletAddress: accountAddress } = useTransactionKit();

  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    data: trendingTokensData,
    isLoading,
    isFetching,
  } = useGetTrendingTokensQuery();

  const blockchainList = useAppSelector(
    (state) => state.tokenAtlas.blockchainList as BlockchainData[]
  );

  // look for trending tokens with compatible chains and reduce the list the 20 first trending tokens
  const trendingTokens =
    trendingTokensData?.result
      ?.filter((token) =>
        token.contracts?.some((contract) =>
          CompatibleChains.some(
            (chain) =>
              chainNameFromViemToMobula(chain.chainName) === contract.blockchain
          )
        )
      )
      .slice(0, 20) || [];

  // Ref to track the slider container
  const sliderRef = useRef<HTMLDivElement>(null);

  // Debounced recordPresence function with 2-second delay
  const debouncedTokenTrendingScroll = _.debounce(() => {
    recordPresence({
      address: accountAddress,
      action: 'app:tokenAtlas:trendingScroll',
      value: 'TRENDING_SCROLL',
    });
  }, 2000);

  // Handle the scroll event
  const handleHorizontalScroll = () => {
    if (sliderRef.current) {
      debouncedTokenTrendingScroll();
    }

    // Clean-up debounce on component unmount
    return () => {
      debouncedTokenTrendingScroll.cancel();
    };
  };

  // Scroll listener
  useEffect(() => {
    const sliderElement = sliderRef.current;
    if (sliderElement) {
      sliderElement.addEventListener('scroll', handleHorizontalScroll);
    }

    return () => {
      if (sliderElement) {
        sliderElement.removeEventListener('scroll', handleHorizontalScroll);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sliderRef]);

  const handleChooseToken = (token: TokenData) => {
    const compatibleTokenContract = token.contracts?.find((contract) =>
      CompatibleChains.some(
        (chain) =>
          chainNameFromViemToMobula(chain.chainName) === contract.blockchain
      )
    );
    const tokenData: SelectedTokenType = {
      id: token.id || 0,
      symbol: token.symbol || '',
      address: compatibleTokenContract?.address || '',
      decimals: undefined,
      chainId: chainNameToChainIdTokensData(
        compatibleTokenContract?.blockchain
      ),
      name: token.name || '',
      icon: token.logo,
      price: token.price || 0,
    };
    dispatch(setSelectedToken(tokenData));
    dispatch(setIsSearchTokenModalOpen(false));
    dispatch(setSelectedChain({ chainId: 0, chainName: 'all' }));
    if (location.search !== '') {
      navigate('/token-atlas');
    }
  };

  if (isLoading || isFetching) {
    return (
      <div
        id="token-atlas-token-slider-loading"
        className="flex flex-col overflow-x-scroll"
        data-testid="token-slider-loader"
      >
        <Body className="text-white_light_grey mb-4">Trending tokens</Body>
        <div className="flex">
          <div className="flex gap-4 mb-4">
            <SkeletonLoader $height="125px" $width="108px" $radius="9px" />
            <SkeletonLoader $height="125px" $width="108px" $radius="9px" />
            <SkeletonLoader $height="125px" $width="108px" $radius="9px" />
            <SkeletonLoader $height="125px" $width="108px" $radius="9px" />
            <SkeletonLoader $height="125px" $width="108px" $radius="9px" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id="token-atlas-token-slider"
      className="flex flex-col overflow-x-scroll"
      ref={sliderRef}
    >
      <Body className="text-white_light_grey mb-4">Trending tokens</Body>
      <div className="flex">
        <div className="flex gap-4 mb-4">
          {trendingTokens &&
            trendingTokens.map((token, index) => {
              const blockchainLogo =
                token.contracts?.length === 1
                  ? blockchainList.find(
                      (chain) => chain.name === token.contracts?.[0]?.blockchain
                    )?.logo
                  : undefined;
              return (
                <TokenCard
                  key={index}
                  onClick={() => handleChooseToken(token)}
                  tokenLogo={token.logo}
                  tokenName={token.name}
                  tokenSymbol={token.symbol}
                  blockchainLogo={blockchainLogo}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default TokensSlider;

import { useWalletAddress } from '@etherspot/transaction-kit';

// styles
import { useEffect } from 'react';
import styled from 'styled-components';
import './styles/tailwindTokenAtlas.css';

// api
import { useRecordPresenceMutation } from '../../services/pillarXApiPresence';
import { useGetSearchTokensQuery } from '../../services/pillarXApiSearchTokens';
import {
  useGetTokenMarketDataQuery,
  useGetTokenMarketHistoryPairQuery,
} from './api/token';

// reducer
import {
  setIsGraphErroring,
  setIsGraphLoading,
  setIsTokenDataErroring,
  setSelectedToken,
  setTokenDataGraph,
  setTokenDataInfo,
} from './reducer/tokenAtlasSlice';

// hooks
import { useAppDispatch, useAppSelector } from './hooks/useReducerHooks';

// utils
import {
  chainIdToChainNameTokensData,
  chainNameToChainIdTokensData,
  convertAPIResponseToTokens,
} from '../../services/tokensData';
import { getNativeAssetForChainId } from '../../utils/blockchain';
import { getGraphResolution } from './utils/converters';

// types
import { TokenAssetResponse, TokenPriceGraphPeriod } from '../../types/api';
import { PeriodFilter, SelectedTokenType } from './types/types';

// components
import HeaderSearch from './components/HeaderSearch/HeaderSeach';
import SearchTokenModal from './components/SearchTokenModal/SearchTokenModal';
import TokenGraphColumn from './components/TokenGraphColumn/TokenGraphColumn';
import TokenInfoColumn from './components/TokenInfoColumn/TokenInfoColumn';

const defaultToken = {
  id: 102502677,
  symbol: 'PLR',
  address: '0xa6b37fc85d870711c56fbcb8afe2f8db049ae774',
  decimals: 18,
  chainId: 137,
  name: 'pillar',
  icon: undefined,
};

export const App = () => {
  /**
   * Import the recordPresence mutation from the
   * pillarXApiPresence service. We use this to
   * collect data on what asset is being selected
   */
  const [recordPresence] = useRecordPresenceMutation();

  const accountAddress = useWalletAddress();

  const dispatch = useAppDispatch();
  const selectedToken =
    useAppSelector(
      (state) => state.tokenAtlas.selectedToken as SelectedTokenType | undefined
    ) || defaultToken;
  const priceGraphPeriod = useAppSelector(
    (state) => state.tokenAtlas.priceGraphPeriod as TokenPriceGraphPeriod
  );
  const periodFilter = useAppSelector(
    (state) => state.tokenAtlas.periodFilter as PeriodFilter
  );

  /**
   * Formats the native/gas token object, since nativeToken below
   * and selectedToken object types are slightly different.
   */
  const formattedNativeToken = {
    address: selectedToken.address,
    chainId: selectedToken.chainId,
    name: selectedToken.name,
    symbol: selectedToken.symbol,
    decimals: selectedToken.decimals,
    logoURI: selectedToken.icon,
  };

  // Checks what is the native/gas token of the selected token chain id
  const nativeToken = getNativeAssetForChainId(selectedToken.chainId || 0);

  // Checks if the selected token is one of the native/gas tokens
  const isNativeToken =
    nativeToken.name === formattedNativeToken.name &&
    nativeToken.symbol === formattedNativeToken.symbol &&
    nativeToken.address === formattedNativeToken.address;

  /**
   * Checks if the selected token is actually a native/gas token.
   * Mobula's token list includes wrapped tokens but not native/gas
   * tokens, therefore we check here if a wrapped token is selected.
   */
  const isWrappedOrNativeToken =
    isNativeToken ||
    (selectedToken.name === 'POL' && selectedToken.symbol === 'POL') ||
    (selectedToken.name === 'Wrapped Ether' &&
      selectedToken.symbol === 'WETH') ||
    (selectedToken.name === 'Wrapped XDAI' && selectedToken.symbol === 'WXDAI');

  /**
   * If the user selected a wrapped token it will get its
   * native/gas token because Mobula's token list does not
   * recognise wrapped tokens and treat them as native/gas.
   * For data querying purpose, we consider wrapped tokens here
   * as their native/gas token.
   */
  const getSymbol = (symbol: string) => {
    if (isWrappedOrNativeToken && symbol === 'WETH') {
      return 'ETH';
    }
    if (isWrappedOrNativeToken && symbol === 'WXDAI') {
      return 'XDAI';
    }
    return symbol;
  };

  const {
    data: tokenData,
    isLoading: isLoadingTokenDataInfo,
    isFetching: isFetchingTokenDataInfo,
    isSuccess: isSuccessTokenDataInfo,
    error: tokenDataError,
  } = useGetTokenMarketDataQuery({
    asset: isWrappedOrNativeToken ? undefined : selectedToken.address,
    symbol: isWrappedOrNativeToken
      ? getSymbol(selectedToken.symbol)
      : undefined,
    blockchain: chainIdToChainNameTokensData(selectedToken.chainId),
  });

  const {
    data: marketHistoryPair,
    isLoading: isMarketHistoryPairLoading,
    isFetching: isMarketHistoryPairFetching,
    isSuccess: isMarketHistoryPairSuccess,
    error: marketHistoryPairError,
  } = useGetTokenMarketHistoryPairQuery({
    asset: isWrappedOrNativeToken ? undefined : selectedToken.address,
    symbol: isWrappedOrNativeToken
      ? getSymbol(selectedToken.symbol)
      : undefined,
    blockchain: chainIdToChainNameTokensData(selectedToken.chainId),
    period: getGraphResolution(periodFilter),
    from: priceGraphPeriod.from,
    to: priceGraphPeriod.to,
  });

  // This is to query the API when tokens are being clicked from the home feed
  const query = new URLSearchParams(window.location.search);

  const asset = query.get('asset');
  const chain = query.get('blockchain');

  // API call to search tokens and assets
  const { data: searchData } = useGetSearchTokensQuery(
    {
      searchInput: asset || '',
      filterBlockchains: chain || undefined,
    },
    { skip: !asset && !chain }
  );

  // This useEffect is to check if some url query params have been specified
  useEffect(() => {
    if (!searchData) return;

    const result = convertAPIResponseToTokens(
      searchData?.result?.data as TokenAssetResponse[],
      asset || ''
    );

    // if it is considered a native token, Token Atlas would have handled the request
    // with showing the asset as a symbol rather than an contract address
    const nativeOrGasToken = result.filter(
      (token) => token.blockchain === chain && token.symbol === asset
    );

    if (nativeOrGasToken.length > 0) {
      const clickedNativeToken = nativeOrGasToken[0];
      dispatch(
        setSelectedToken({
          id: clickedNativeToken?.id,
          symbol: clickedNativeToken?.symbol,
          address: clickedNativeToken?.contract,
          decimals: clickedNativeToken?.decimals,
          chainId: chainNameToChainIdTokensData(clickedNativeToken?.blockchain),
          name: clickedNativeToken?.name,
          icon: clickedNativeToken?.logo,
        })
      );
    } else {
      const clickedToken = result[0];
      dispatch(
        setSelectedToken({
          id: clickedToken?.id,
          symbol: clickedToken?.symbol,
          address: clickedToken?.contract,
          decimals: clickedToken?.decimals,
          chainId: chainNameToChainIdTokensData(clickedToken?.blockchain),
          name: clickedToken?.name,
          icon: clickedToken?.logo,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asset, searchData]);

  // This useEffect is to make sure that the default token is PLR token
  useEffect(() => {
    if (selectedToken === defaultToken) {
      dispatch(setSelectedToken(defaultToken));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedToken]);

  // This useEffect is to update the token data when the selected token changes
  useEffect(() => {
    if (tokenData && isSuccessTokenDataInfo) {
      dispatch(setTokenDataInfo(tokenData?.result?.data));
      dispatch(setIsTokenDataErroring(false));
    }
    if (!isSuccessTokenDataInfo || asset === 'undefined') {
      dispatch(setTokenDataInfo(undefined));
      dispatch(setIsTokenDataErroring(true));
    }
    if (tokenDataError) {
      dispatch(setIsTokenDataErroring(true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenData, isSuccessTokenDataInfo, tokenDataError]);

  // This useEffect is to update the token graph data when the selected token and the graph period changes
  useEffect(() => {
    if (marketHistoryPair && isMarketHistoryPairSuccess) {
      dispatch(setTokenDataGraph(marketHistoryPair));
      dispatch(setIsGraphErroring(false));
    }
    if (!isMarketHistoryPairSuccess || asset === 'undefined') {
      dispatch(setTokenDataGraph(undefined));
      dispatch(setIsGraphErroring(true));
    }
    if (marketHistoryPairError) {
      dispatch(setIsGraphErroring(true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marketHistoryPair, isMarketHistoryPairSuccess, marketHistoryPairError]);

  // This useEffect is to update the graph loading status when the API requests are in progress
  useEffect(() => {
    if (isMarketHistoryPairLoading || isMarketHistoryPairFetching) {
      dispatch(setIsGraphLoading(true));
    }
    if (!isMarketHistoryPairLoading && !isMarketHistoryPairFetching) {
      dispatch(setIsGraphLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMarketHistoryPairLoading, isMarketHistoryPairFetching]);

  // This useEffect is to update the user activity when they select or load a different token
  useEffect(() => {
    if (accountAddress) {
      recordPresence({
        address: accountAddress,
        action: 'app:tokenAtlas:tokenSelect',
        value: {
          chainId: selectedToken.chainId,
          address: selectedToken.address,
          symbol: selectedToken.symbol,
          name: selectedToken.name,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedToken, accountAddress]);

  return (
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    <Wrapper>
      <SearchTokenModal />
      <HeaderSearch />
      <div className="flex w-full mobile:flex-col">
        <TokenGraphColumn
          className="basis-3/5"
          isLoadingTokenDataInfo={
            isLoadingTokenDataInfo || isFetchingTokenDataInfo
          }
        />
        <TokenInfoColumn
          className="basis-2/5"
          isLoadingTokenDataInfo={
            isLoadingTokenDataInfo || isFetchingTokenDataInfo
          }
        />
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
  margin: 0 auto;
  flex-direction: column;
  background-color: #222222;

  @media (min-width: 768px) {
    padding: 52px 60px;
  }

  @media (max-width: 768px) {
    padding: 24px 16px;
  }
`;

export default App;

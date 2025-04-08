import { useWalletAddress } from '@etherspot/transaction-kit';

// styles
import { useEffect } from 'react';
import styled from 'styled-components';
import './styles/tailwindTokenAtlas.css';

// api
import { useRecordPresenceMutation } from '../../services/pillarXApiPresence';
import {
  useGetTokenInfoQuery,
  useGetTokenMarketHistoryPairQuery,
} from './api/token';

// reducer
import {
  setIsGraphErroring,
  setIsGraphLoading,
  setSelectedToken,
  setTokenDataGraph,
  setTokenDataInfo,
} from './reducer/tokenAtlasSlice';

// hooks
import { useAppDispatch, useAppSelector } from './hooks/useReducerHooks';

// utils
import { chainIdToChainNameTokensData } from '../../services/tokensData';
import { getNativeAssetForChainId } from '../../utils/blockchain';
import { getGraphResolution } from './utils/converters';

// types
import { TokenPriceGraphPeriod } from '../../types/api';
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
  } = useGetTokenInfoQuery({
    id: isWrappedOrNativeToken ? undefined : selectedToken.id,
    asset: isWrappedOrNativeToken
      ? undefined
      : selectedToken.name || selectedToken.address,
    symbol: getSymbol(selectedToken.symbol),
  });

  const {
    data: marketHistoryPair,
    isLoading: isMarketHistoryPairLoading,
    isFetching: isMarketHistoryPairFetching,
    isSuccess: isMarketHistoryPairSuccess,
    error: marketHistoryPairError,
  } = useGetTokenMarketHistoryPairQuery({
    asset: isWrappedOrNativeToken ? undefined : selectedToken.address,
    symbol: isWrappedOrNativeToken ? selectedToken.symbol : undefined,
    blockchain: chainIdToChainNameTokensData(selectedToken.chainId),
    period: getGraphResolution(periodFilter),
    from: priceGraphPeriod.from,
    to: priceGraphPeriod.to,
  });

  // This is to query the API when tokens are being clicked from the home feed
  const query = new URLSearchParams(window.location.search);

  const id = query.get('id');
  const asset = query.get('asset');
  const symbol = query.get('symbol');

  // This useEffect is to check if some url query params have been specified
  useEffect(() => {
    if (asset || symbol) {
      dispatch(
        setSelectedToken({
          id: Number(id),
          symbol: symbol || '',
          address: '',
          decimals: undefined,
          chainId: undefined,
          name: asset || '',
          icon: '',
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asset, symbol]);

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
      dispatch(setTokenDataInfo(tokenData.data));
    }
    if (!isSuccessTokenDataInfo) {
      dispatch(setTokenDataInfo(undefined));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenData, isSuccessTokenDataInfo]);

  // This useEffect is to update the token graph data when the selected token and the graph period changes
  useEffect(() => {
    if (marketHistoryPair && isMarketHistoryPairSuccess) {
      dispatch(setTokenDataGraph(marketHistoryPair));
      dispatch(setIsGraphErroring(false));
    }
    if (!isMarketHistoryPairSuccess) {
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

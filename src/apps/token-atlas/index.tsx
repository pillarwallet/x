import { useWalletAddress } from '@etherspot/transaction-kit';

// styles
import { useEffect } from 'react';
import styled from 'styled-components';
import './styles/tailwindTokenAtlas.css';

// api
import { useRecordPresenceMutation } from '../../services/pillarXApiPresence';
import { useGetTokenGraphQuery, useGetTokenInfoQuery } from './api/token';

// reducer
import {
  setIsGraphLoading,
  setSelectedToken,
  setTokenDataGraph,
  setTokenDataInfo,
} from './reducer/tokenAtlasSlice';

// hooks
import { useAppDispatch, useAppSelector } from './hooks/useReducerHooks';

// utils
import { getNativeAssetForChainId } from '../../utils/blockchain';

// types
import { TokenPriceGraphPeriod } from '../../types/api';
import { SelectedTokenType } from './types/types';

// components
import HeaderSearch from './components/HeaderSearch/HeaderSeach';
import SearchTokenModal from './components/SearchTokenModal/SearchTokenModal';
import TokenGraphColumn from './components/TokenGraphColumn/TokenGraphColumn';
import TokenInfoColumn from './components/TokenInfoColumn/TokenInfoColumn';

const defaultToken = {
  id: 102502677,
  symbol: 'PLR',
  address: '',
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
      (state) => state.tokenAtlas.selectedToken as SelectedTokenType
    ) || defaultToken;
  const priceGraphPeriod = useAppSelector(
    (state) => state.tokenAtlas.priceGraphPeriod as TokenPriceGraphPeriod
  );

  const formattedNativeToken = {
    address: selectedToken.address,
    chainId: selectedToken.chainId,
    name: selectedToken.name,
    symbol: selectedToken.symbol,
    decimals: selectedToken.decimals,
    logoURI: selectedToken.icon,
  };

  const nativeToken = getNativeAssetForChainId(selectedToken.chainId || 0);

  const isNativeToken =
    nativeToken.name === formattedNativeToken.name &&
    nativeToken.symbol === formattedNativeToken.symbol &&
    nativeToken.address === formattedNativeToken.address;

  const {
    data: tokenData,
    isLoading: isLoadingTokenDataInfo,
    isFetching: isFetchingTokenDataInfo,
    isSuccess: isSuccessTokenDataInfo,
  } = useGetTokenInfoQuery({
    id: isNativeToken ? undefined : selectedToken.id,
    asset: isNativeToken
      ? undefined
      : selectedToken.name || selectedToken.address,
    symbol: selectedToken.symbol,
  });
  const {
    data: tokenGraph,
    isLoading: isLoadingTokenDataGraph,
    isFetching: isFetchingTokenDataGraph,
    isSuccess: isSuccessTokenDataGraph,
  } = useGetTokenGraphQuery({
    id: isNativeToken ? undefined : selectedToken.id,
    asset: isNativeToken
      ? undefined
      : selectedToken.name || selectedToken.address,
    symbol: selectedToken.symbol,
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
    if (tokenGraph && isSuccessTokenDataGraph) {
      dispatch(setTokenDataGraph(tokenGraph.data));
    }
    if (!isSuccessTokenDataGraph) {
      dispatch(setTokenDataGraph(undefined));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenGraph, isSuccessTokenDataGraph]);

  // This useEffect is to update the graph loading status when the API requests are in progress
  useEffect(() => {
    if (isLoadingTokenDataGraph || isFetchingTokenDataGraph) {
      dispatch(setIsGraphLoading(true));
    }
    if (!isLoadingTokenDataGraph && !isFetchingTokenDataGraph) {
      dispatch(setIsGraphLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingTokenDataGraph, isFetchingTokenDataGraph]);

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

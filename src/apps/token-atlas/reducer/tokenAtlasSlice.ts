/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { sub } from 'date-fns';

// types
import { Token } from '../../../services/tokensData';
import {
  BlockchainData,
  MarketHistoryPairData,
  TokenAtlasInfoData,
  TokenPriceGraphPeriod,
} from '../../../types/api';
import { ChainType, PeriodFilter, SelectedTokenType } from '../types/types';

// utils
import { convertDateToUnixTimestamp } from '../../../utils/common';

export type TokenAltasState = {
  isSearchTokenModalOpen: boolean;
  isSelectChainDropdownOpen: boolean;
  selectedChain: ChainType;
  searchTokenResult: Token[] | undefined;
  selectedToken: SelectedTokenType | undefined;
  tokenDataInfo: TokenAtlasInfoData | undefined;
  tokenDataGraph: MarketHistoryPairData | undefined;
  isAllChainsVisible: boolean;
  priceGraphPeriod: TokenPriceGraphPeriod;
  periodFilter: PeriodFilter;
  isGraphLoading: boolean;
  blockchainList: BlockchainData[] | undefined;
  searchToken: string;
  isTokenSearchLoading: boolean;
  isTokenSearchErroring: boolean;
  isGraphErroring: boolean;
  isTokenDataErroring: boolean;
};

const initialState: TokenAltasState = {
  isSearchTokenModalOpen: false,
  isSelectChainDropdownOpen: false,
  selectedChain: { chainId: 0, chainName: 'all' },
  searchTokenResult: undefined,
  selectedToken: undefined,
  tokenDataInfo: undefined,
  tokenDataGraph: undefined,
  isAllChainsVisible: false,
  priceGraphPeriod: {
    from: convertDateToUnixTimestamp(sub(new Date(), { days: 1 })),
    to: undefined,
  },
  periodFilter: PeriodFilter.DAY,
  isGraphLoading: false,
  blockchainList: [],
  searchToken: '',
  isTokenSearchLoading: false,
  isTokenSearchErroring: false,
  isGraphErroring: false,
  isTokenDataErroring: false,
};

const tokenAtlasSlice = createSlice({
  name: 'tokenAtlas',
  initialState,
  reducers: {
    setIsSearchTokenModalOpen(state, action: PayloadAction<boolean>) {
      state.isSearchTokenModalOpen = action.payload;
    },
    setIsSelectChainDropdownOpen(state, action: PayloadAction<boolean>) {
      state.isSelectChainDropdownOpen = action.payload;
    },
    setSelectedChain(state, action: PayloadAction<ChainType>) {
      state.selectedChain = action.payload;
    },
    setSearchTokenResult(state, action: PayloadAction<Token[] | undefined>) {
      state.searchTokenResult = action.payload;
    },
    setSelectedToken(
      state,
      action: PayloadAction<SelectedTokenType | undefined>
    ) {
      state.selectedToken = action.payload;
    },
    setTokenDataInfo(
      state,
      action: PayloadAction<TokenAtlasInfoData | undefined>
    ) {
      state.tokenDataInfo = action.payload;
    },
    setTokenDataGraph(
      state,
      action: PayloadAction<MarketHistoryPairData | undefined>
    ) {
      state.tokenDataGraph = action.payload;
    },
    setIsAllChainsVisible(state, action: PayloadAction<boolean>) {
      state.isAllChainsVisible = action.payload;
    },
    setPriceGraphPeriod(state, action: PayloadAction<TokenPriceGraphPeriod>) {
      state.priceGraphPeriod = action.payload;
    },
    setPeriodFilter(state, action: PayloadAction<PeriodFilter>) {
      state.periodFilter = action.payload;
    },
    setIsGraphLoading(state, action: PayloadAction<boolean>) {
      state.isGraphLoading = action.payload;
    },
    setBlockchainList(
      state,
      action: PayloadAction<BlockchainData[] | undefined>
    ) {
      state.blockchainList = action.payload;
    },
    setSearchToken(state, action: PayloadAction<string>) {
      state.searchToken = action.payload;
    },
    setIsTokenSearchLoading(state, action: PayloadAction<boolean>) {
      state.isTokenSearchLoading = action.payload;
    },
    setIsTokenSearchErroring(state, action: PayloadAction<boolean>) {
      state.isTokenSearchErroring = action.payload;
    },
    setIsGraphErroring(state, action: PayloadAction<boolean>) {
      state.isGraphErroring = action.payload;
    },
    setIsTokenDataErroring(state, action: PayloadAction<boolean>) {
      state.isTokenDataErroring = action.payload;
    },
  },
});

export const {
  setIsSearchTokenModalOpen,
  setIsSelectChainDropdownOpen,
  setSelectedChain,
  setSearchTokenResult,
  setSelectedToken,
  setTokenDataInfo,
  setTokenDataGraph,
  setIsAllChainsVisible,
  setPriceGraphPeriod,
  setPeriodFilter,
  setIsGraphLoading,
  setBlockchainList,
  setSearchToken,
  setIsTokenSearchLoading,
  setIsTokenSearchErroring,
  setIsGraphErroring,
  setIsTokenDataErroring,
} = tokenAtlasSlice.actions;

export default tokenAtlasSlice;

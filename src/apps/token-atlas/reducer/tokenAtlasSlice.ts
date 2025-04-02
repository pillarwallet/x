/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { sub } from 'date-fns';

// types
import { Token } from '../../../services/tokensData';
import {
  BlockchainData,
  TokenAtlasInfoData,
  TokenMarketHistory,
  TokenPriceGraphPeriod,
} from '../../../types/api';
import { ChainType, PeriodFilter, SelectedTokenType } from '../types/types';

// utils
import { convertDateToUnixTimestamp } from '../../../utils/common';

export type TokenAltasState = {
  isSearchTokenModalOpen: boolean;
  isSelectChainDropdownOpen: boolean;
  tokenListData: Token[];
  selectedChain: ChainType;
  searchTokenResult: Token[];
  selectedToken: SelectedTokenType | undefined;
  tokenDataInfo: TokenAtlasInfoData | undefined;
  tokenDataGraph: TokenMarketHistory | undefined;
  isAllChainsVisible: boolean;
  priceGraphPeriod: TokenPriceGraphPeriod;
  periodFilter: PeriodFilter;
  isGraphLoading: boolean;
  blockchainList: BlockchainData[] | undefined;
  searchToken: string;
  isTokenSearchLoading: boolean;
  isTokenSearchErroring: boolean;
};

const initialState: TokenAltasState = {
  isSearchTokenModalOpen: false,
  isSelectChainDropdownOpen: false,
  tokenListData: [],
  selectedChain: { chainId: 0, chainName: 'all' },
  searchTokenResult: [],
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
    setTokenListData(state, action: PayloadAction<Token[]>) {
      state.tokenListData = action.payload;
    },
    setSelectedChain(state, action: PayloadAction<ChainType>) {
      state.selectedChain = action.payload;
    },
    setSearchTokenResult(state, action: PayloadAction<Token[]>) {
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
      action: PayloadAction<TokenMarketHistory | undefined>
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
  },
});

export const {
  setIsSearchTokenModalOpen,
  setIsSelectChainDropdownOpen,
  setTokenListData,
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
} = tokenAtlasSlice.actions;

export default tokenAtlasSlice;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { sub } from 'date-fns';

// types
import { Token } from '@etherspot/prime-sdk/dist/sdk/data';
import { ChainType, PeriodFilter, SelectedTokenType } from '../types/types';
import { TokenAtlasInfoData, TokenMarketHistory, TokenPriceGraphPeriod } from '../../../types/api';

// utils
import { convertDateToUnixTimestamp } from '../utils/converters';


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
};

const initialState: TokenAltasState = {
    isSearchTokenModalOpen: false,
    isSelectChainDropdownOpen: false,
    tokenListData: [],
    selectedChain: { chainId: 0, chainName: 'all'},
    searchTokenResult: [],
    selectedToken: undefined,
    tokenDataInfo: undefined,
    tokenDataGraph: undefined,
    isAllChainsVisible: false,
    priceGraphPeriod: { from: convertDateToUnixTimestamp(sub(new Date(), { days: 1 })), to: undefined },
    periodFilter: PeriodFilter.DAY,
    isGraphLoading: false,
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
    setSelectedToken(state, action: PayloadAction<SelectedTokenType | undefined>) {
      state.selectedToken = action.payload;
    },
    setTokenDataInfo(state, action: PayloadAction<TokenAtlasInfoData | undefined>) {
      state.tokenDataInfo = action.payload;
    },
    setTokenDataGraph(state, action: PayloadAction<TokenMarketHistory | undefined>) {
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
} = tokenAtlasSlice.actions;

export default tokenAtlasSlice;

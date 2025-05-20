/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { sub } from 'date-fns';

// types
import {
  PortfolioData,
  TokenPriceGraphPeriod,
  WalletHistory,
} from '../../../types/api';

// utils
import { convertDateToUnixTimestamp } from '../../../utils/common';
import { PeriodFilterBalance, PeriodFilterPnl } from '../utils/portfolio';

export type WalletPortfolioState = {
  walletPortfolio: PortfolioData | undefined;
  isWalletPorfolioLoading: boolean;
  isWalletPortfolioErroring: boolean;
  walletPortfolioWithPnl: PortfolioData | undefined;
  isWalletPorfolioWithPnlLoading: boolean;
  isWalletPortfolioWithPnlErroring: boolean;
  priceGraphPeriod: TokenPriceGraphPeriod;
  periodFilter: PeriodFilterBalance;
  periodFilterPnl: PeriodFilterPnl;
  walletHistoryGraph: WalletHistory | undefined;
  isWalletHistoryGraphLoading: boolean;
  isWalletHistoryGraphErroring: boolean;
  topTokenUnrealizedPnL: WalletHistory | undefined;
  isTopTokenUnrealizedPnLLoading: boolean;
  isTopTokenUnrealizedPnLErroring: boolean;
  selectedBalanceOrPnl: 'balance' | 'pnl';
  isRefreshAll: boolean;
  isReceiveModalOpen: boolean;
};

const initialState: WalletPortfolioState = {
  walletPortfolio: undefined,
  isWalletPorfolioLoading: false,
  isWalletPortfolioErroring: false,
  walletPortfolioWithPnl: undefined,
  isWalletPorfolioWithPnlLoading: false,
  isWalletPortfolioWithPnlErroring: false,
  priceGraphPeriod: {
    from: convertDateToUnixTimestamp(sub(new Date(), { days: 1 })),
    to: undefined,
  },
  periodFilter: PeriodFilterBalance.DAY,
  periodFilterPnl: PeriodFilterPnl.DAY,
  walletHistoryGraph: undefined,
  isWalletHistoryGraphLoading: false,
  isWalletHistoryGraphErroring: false,
  topTokenUnrealizedPnL: undefined,
  isTopTokenUnrealizedPnLLoading: false,
  isTopTokenUnrealizedPnLErroring: false,
  selectedBalanceOrPnl: 'balance',
  isRefreshAll: false,
  isReceiveModalOpen: false,
};

const walletPortfolioSlice = createSlice({
  name: 'walletPortfolio',
  initialState,
  reducers: {
    setWalletPortfolio(
      state,
      action: PayloadAction<PortfolioData | undefined>
    ) {
      state.walletPortfolio = action.payload;
    },
    setIsWalletPorfolioLoading(state, action: PayloadAction<boolean>) {
      state.isWalletPorfolioLoading = action.payload;
    },
    setIsWalletPortfolioErroring(state, action: PayloadAction<boolean>) {
      state.isWalletPortfolioErroring = action.payload;
    },
    setWalletPortfolioWithPnl(
      state,
      action: PayloadAction<PortfolioData | undefined>
    ) {
      state.walletPortfolioWithPnl = action.payload;
    },
    setIsWalletPortfolioWithPnlLoading(state, action: PayloadAction<boolean>) {
      state.isWalletPorfolioWithPnlLoading = action.payload;
    },
    setIsWalletPortfolioWithPnlErroring(state, action: PayloadAction<boolean>) {
      state.isWalletPortfolioWithPnlErroring = action.payload;
    },
    setPriceGraphPeriod(state, action: PayloadAction<TokenPriceGraphPeriod>) {
      state.priceGraphPeriod = action.payload;
    },
    setPeriodFilter(state, action: PayloadAction<PeriodFilterBalance>) {
      state.periodFilter = action.payload;
    },
    setPeriodFilterPnl(state, action: PayloadAction<PeriodFilterPnl>) {
      state.periodFilterPnl = action.payload;
    },
    setWalletHistoryGraph(
      state,
      action: PayloadAction<WalletHistory | undefined>
    ) {
      state.walletHistoryGraph = action.payload;
    },
    setIsWalletHistoryGraphLoading(state, action: PayloadAction<boolean>) {
      state.isWalletHistoryGraphLoading = action.payload;
    },
    setIsWalletHistoryGraphErroring(state, action: PayloadAction<boolean>) {
      state.isWalletHistoryGraphErroring = action.payload;
    },
    setTopTokenUnrealizedPnL(
      state,
      action: PayloadAction<WalletHistory | undefined>
    ) {
      state.topTokenUnrealizedPnL = action.payload;
    },
    setIsTopTokenUnrealizedPnLLoading(state, action: PayloadAction<boolean>) {
      state.isTopTokenUnrealizedPnLLoading = action.payload;
    },
    setIsTopTokenUnrealizedPnLErroring(state, action: PayloadAction<boolean>) {
      state.isTopTokenUnrealizedPnLErroring = action.payload;
    },
    setSelectedBalanceOrPnl(state, action: PayloadAction<'balance' | 'pnl'>) {
      state.selectedBalanceOrPnl = action.payload;
    },
    setIsRefreshAll(state, action: PayloadAction<boolean>) {
      state.isRefreshAll = action.payload;
    },
    setIsReceiveModalOpen(state, action: PayloadAction<boolean>) {
      state.isReceiveModalOpen = action.payload;
    },
  },
});

export const {
  setWalletPortfolio,
  setIsWalletPorfolioLoading,
  setIsWalletPortfolioErroring,
  setWalletPortfolioWithPnl,
  setIsWalletPortfolioWithPnlLoading,
  setIsWalletPortfolioWithPnlErroring,
  setPriceGraphPeriod,
  setPeriodFilter,
  setPeriodFilterPnl,
  setWalletHistoryGraph,
  setIsWalletHistoryGraphLoading,
  setIsWalletHistoryGraphErroring,
  setTopTokenUnrealizedPnL,
  setIsTopTokenUnrealizedPnLLoading,
  setIsTopTokenUnrealizedPnLErroring,
  setSelectedBalanceOrPnl,
  setIsRefreshAll,
  setIsReceiveModalOpen,
} = walletPortfolioSlice.actions;

export default walletPortfolioSlice;

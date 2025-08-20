/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// types
import { PortfolioData } from '../../../types/api';

export type SwapState = {
  walletPortfolio: PortfolioData | undefined;
};

const initialState: SwapState = {
  walletPortfolio: undefined,
};

const gasTankSlice = createSlice({
  name: 'gasTank',
  initialState,
  reducers: {
    setWalletPortfolio(
      state,
      action: PayloadAction<PortfolioData | undefined>
    ) {
      state.walletPortfolio = action.payload;
    },
  },
});

export const {
  setWalletPortfolio,
} = gasTankSlice.actions;

export default gasTankSlice;

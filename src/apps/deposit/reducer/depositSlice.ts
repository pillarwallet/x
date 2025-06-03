/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// types
import { AddedAssets, BalanceInfo } from '../types/types';

export type DepositState = {
  depositStep: 'list' | 'send';
  selectedAsset: BalanceInfo | AddedAssets | undefined;
};

const initialState: DepositState = {
  depositStep: 'list',
  selectedAsset: undefined,
};

const depositSlice = createSlice({
  name: 'deposit',
  initialState,
  reducers: {
    setDepositStep(state, action: PayloadAction<'list' | 'send'>) {
      state.depositStep = action.payload;
    },
    setSelectedAsset(
      state,
      action: PayloadAction<BalanceInfo | AddedAssets | undefined>
    ) {
      state.selectedAsset = action.payload;
    },
  },
});

export const { setDepositStep, setSelectedAsset } = depositSlice.actions;

export default depositSlice;

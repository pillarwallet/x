import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { VIEW_TYPE } from '../constants/views';

interface ICoin {
  title: string;
  icon_url: string;
  networks: Array<Record<string, string>>
}

export type SwapFormData = {
  address_to?: string | null
  tag_to?: string | null
  email?: string | null
  amount_from?: string | null
  amount_to?: string | null
  coin_from?: string | null
  coin_to?: string | null
  network_from?: string | null
  network_to?: string | null
}

export type DetailSwapFormData = {
  address_from: string | null;
  address_to: string | null;
  amount_from: string | null;
  amount_to: string | null;
  coin_from: string | null;
  coin_to: string | null;
  network_from: string | null;
  network_to: string | null;
  rate: string | null;
  start_time: number | null;
  status: number | null;
  swap_duration: number | null;
  tag_from: string | null;
  tag_to: string | null;
}

export type EmcdSwapState = {
  swapID: string | null,
  depositAddress: string | null,
  currentView: VIEW_TYPE,
  backView: VIEW_TYPE,
  coins: ICoin[],
  formData: SwapFormData,
  detailSwapFormData: DetailSwapFormData,
}

const initialState: EmcdSwapState = {
  swapID: null,
  depositAddress: null,
  currentView: VIEW_TYPE.EXCHANGE,
  backView: VIEW_TYPE.EXCHANGE,
  coins: [],
  formData: {},
  detailSwapFormData: {
    address_from: null,
    address_to: null,
    amount_from: null,
    amount_to: null,
    coin_from: null,
    coin_to: null,
    network_from: null,
    network_to: null,
    rate: null,
    start_time: null,
    status: null,
    swap_duration: null,
    tag_from: null,
    tag_to: null,
  }
}

const emcdSwapSlice = createSlice({
  name: 'emcdSwap',
  initialState,
  reducers: {
    setCurrentView(state, action: PayloadAction<VIEW_TYPE>) {
      state.backView = state.currentView
      state.currentView = action.payload
    },

    setBackView(state) {
      state.currentView = state.backView
    },

    setCoins(state, action: PayloadAction<ICoin[]>) {
      state.coins = action.payload;
    },

    setSwapID(state, action: PayloadAction<string | null>) {
      state.swapID = action.payload;
    },

    setDepositAddress(state, action: PayloadAction<string | null>) {
      state.depositAddress = action.payload;
    },

    setFormData(state, action: PayloadAction<Partial<SwapFormData>>) {
      state.formData = {
        ...state.formData,
        ...action.payload,
      }
    },

    setDetailSwapFormData(state, action: PayloadAction<DetailSwapFormData>) {
      state.detailSwapFormData = action.payload
    },

    setDetailSwapStatus(state, action: PayloadAction<number>) {
      state.detailSwapFormData.status = action.payload
    }
  }
})

export const { setCurrentView, setCoins, setFormData, setSwapID, setDetailSwapFormData, setDepositAddress, setBackView, setDetailSwapStatus } = emcdSwapSlice.actions

// Геттер
export const selectCurrentView = (state: { emcdSwap: EmcdSwapState }) =>
  state.emcdSwap.currentView

export const selectCoins = (state: { emcdSwap: EmcdSwapState }) =>
  state.emcdSwap.coins;

export const selectFormData = (state: { emcdSwap: EmcdSwapState }) =>
  state.emcdSwap.formData;

export const selectDetailFormDataSwap = (state: { emcdSwap: EmcdSwapState }) =>
  state.emcdSwap.detailSwapFormData;

export const selectSwapID = (state: { emcdSwap: EmcdSwapState }) =>
  state.emcdSwap.swapID;

export const selectDepositAddress = (state: { emcdSwap: EmcdSwapState }) =>
  state.emcdSwap.depositAddress;

export const selectDetailSwapStatus = (state: { emcdSwap: EmcdSwapState }) =>
  state.emcdSwap.detailSwapFormData.status;

export default emcdSwapSlice
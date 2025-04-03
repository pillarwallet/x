/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// types
import { Token } from '../../../services/tokensData';
import { ChainType, SwapOffer } from '../utils/types';

export type SwapState = {
  isSwapOpen: boolean;
  isReceiveOpen: boolean;
  swapChain?: ChainType;
  receiveChain?: ChainType;
  swapToken?: Token;
  receiveToken?: Token;
  amountSwap: number;
  amountReceive: number;
  bestOffer?: SwapOffer;
  searchTokenResult: Token[] | undefined;
  usdPriceSwapToken: number;
  usdPriceReceiveToken: number;
  isOfferLoading: boolean;
  searchToken: string;
  isTokenSearchLoading: boolean;
  isTokenSearchErroring: boolean;
};

const initialState: SwapState = {
  isSwapOpen: false,
  isReceiveOpen: false,
  swapChain: {
    chainId: 0,
    chainName: 'all',
  },
  receiveChain: {
    chainId: 0,
    chainName: 'all',
  },
  swapToken: undefined,
  receiveToken: undefined,
  amountSwap: 0,
  amountReceive: 0,
  bestOffer: undefined,
  searchTokenResult: undefined,
  usdPriceSwapToken: 0,
  usdPriceReceiveToken: 0,
  isOfferLoading: false,
  searchToken: '',
  isTokenSearchLoading: false,
  isTokenSearchErroring: false,
};

const swapSlice = createSlice({
  name: 'swap',
  initialState,
  reducers: {
    setIsSwapOpen(state, action: PayloadAction<boolean>) {
      state.isSwapOpen = action.payload;
    },
    setIsReceiveOpen(state, action: PayloadAction<boolean>) {
      state.isReceiveOpen = action.payload;
    },
    setSwapChain(state, action: PayloadAction<ChainType | undefined>) {
      state.swapChain = action.payload;
    },
    setReceiveChain(state, action: PayloadAction<ChainType | undefined>) {
      state.receiveChain = action.payload;
    },
    setSwapToken(state, action: PayloadAction<Token | undefined>) {
      state.swapToken = action.payload;
    },
    setReceiveToken(state, action: PayloadAction<Token | undefined>) {
      state.receiveToken = action.payload;
    },
    setAmountSwap(state, action: PayloadAction<number>) {
      state.amountSwap = action.payload;
    },
    setAmountReceive(state, action: PayloadAction<number>) {
      state.amountReceive = action.payload;
    },
    setBestOffer(state, action: PayloadAction<SwapOffer | undefined>) {
      state.bestOffer = action.payload;
    },
    setSearchTokenResult(state, action: PayloadAction<Token[] | undefined>) {
      state.searchTokenResult = action.payload;
    },
    setUsdPriceSwapToken(state, action: PayloadAction<number>) {
      state.usdPriceSwapToken = action.payload;
    },
    setUsdPriceReceiveToken(state, action: PayloadAction<number>) {
      state.usdPriceReceiveToken = action.payload;
    },
    setIsOfferLoading(state, action: PayloadAction<boolean>) {
      state.isOfferLoading = action.payload;
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
  setIsSwapOpen,
  setIsReceiveOpen,
  setSwapChain,
  setReceiveChain,
  setSwapToken,
  setReceiveToken,
  setAmountSwap,
  setAmountReceive,
  setBestOffer,
  setSearchTokenResult,
  setUsdPriceSwapToken,
  setUsdPriceReceiveToken,
  setIsOfferLoading,
  setSearchToken,
  setIsTokenSearchLoading,
  setIsTokenSearchErroring,
} = swapSlice.actions;

export default swapSlice;

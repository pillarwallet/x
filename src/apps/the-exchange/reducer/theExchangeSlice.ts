/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// types
import { Token } from '../../../services/tokensData';
import { ChainType, SwapOffer } from '../utils/types';

export type SwapState = {
  swapTokenData: Token[];
  receiveTokenData: Token[];
  isSwapOpen: boolean;
  isReceiveOpen: boolean;
  swapChain?: ChainType;
  receiveChain?: ChainType;
  swapToken?: Token;
  receiveToken?: Token;
  amountSwap: number;
  amountReceive: number;
  bestOffer?: SwapOffer;
  searchTokenResult: Token[];
  usdPriceSwapToken: number;
  usdPriceReceiveToken: number;
  isOfferLoading: boolean;
};

const initialState: SwapState = {
  swapTokenData: [],
  receiveTokenData: [],
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
  searchTokenResult: [],
  usdPriceSwapToken: 0,
  usdPriceReceiveToken: 0,
  isOfferLoading: false,
};

const swapSlice = createSlice({
  name: 'swap',
  initialState,
  reducers: {
    setSwapTokenData(state, action: PayloadAction<Token[]>) {
      state.swapTokenData = action.payload;
    },
    setReceiveTokenData(state, action: PayloadAction<Token[]>) {
      state.receiveTokenData = action.payload;
    },
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
    setSearchTokenResult(state, action: PayloadAction<Token[]>) {
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
  },
});

export const {
  setSwapTokenData,
  setReceiveTokenData,
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
} = swapSlice.actions;

export default swapSlice;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Token } from '@etherspot/prime-sdk/dist/sdk/data';
import { AmountType, ChainType, SwapOffer } from '../utils/types';

export type SwapState = {
  swapTokenData: Token[];
  receiveTokenData: Token[];
  isSwapOpen: boolean;
  isReceiveOpen: boolean;
  swapChain?: ChainType;
  receiveChain?: ChainType;
  swapToken?: Token;
  receiveToken?: Token;
  amountSwap?: AmountType;
  amountReceive?: AmountType;
  bestOffer?: SwapOffer;
  searchTokenResult: Token[];
}

const initialState: SwapState = {
  swapTokenData: [],
  receiveTokenData: [],
  isSwapOpen: false,
  isReceiveOpen: false,
  swapChain: undefined,
  receiveChain: undefined,
  swapToken: undefined,
  receiveToken: undefined,
  amountSwap: undefined,
  amountReceive: undefined,
  bestOffer: undefined,
  searchTokenResult: [],
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
    setAmountSwap(state, action: PayloadAction<AmountType | undefined>) {
      state.amountSwap = action.payload;
    },
    setAmountReceive(state, action: PayloadAction<AmountType | undefined>) {
      state.amountReceive = action.payload;
    },
    setBestOffer(state, action: PayloadAction<SwapOffer | undefined>) {
      state.bestOffer = action.payload;
    },
    setSearchTokenResult(state, action: PayloadAction<Token[]>) {
      state.searchTokenResult = action.payload;
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
} = swapSlice.actions;

export default swapSlice;

import React, { createContext, useContext, useState, useMemo } from 'react';
import { Token } from '@etherspot/prime-sdk/dist/sdk/data';

// types
import { SwapOffer } from '../utils/types';

type AmountType = {
  tokenAmount: number;
  usdAmount: number;
}

type ChainType = {
  chainId: number;
  chainName: string;
}

interface SwapDataContextType {
  swapTokenData: Token[];
  setSwapTokenData: React.Dispatch<React.SetStateAction<Token[]>>;
  receiveTokenData: Token[];
  setReceiveTokenData: React.Dispatch<React.SetStateAction<Token[]>>;
  isSwapOpen: boolean;
  setIsSwapOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isReceiveOpen: boolean;
  setIsReceiveOpen: React.Dispatch<React.SetStateAction<boolean>>;
  swapChain: ChainType | undefined;
  setSwapChain: React.Dispatch<React.SetStateAction<ChainType | undefined>>;
  receiveChain: ChainType | undefined;
  setReceiveChain: React.Dispatch<React.SetStateAction<ChainType | undefined>>;
  swapToken: Token | undefined;
  setSwapToken: React.Dispatch<React.SetStateAction<Token | undefined>>;
  receiveToken: Token | undefined;
  setReceiveToken: React.Dispatch<React.SetStateAction<Token | undefined>>;
  amountSwap: AmountType | undefined;
  setAmountSwap: React.Dispatch<React.SetStateAction<AmountType | undefined>>;
  amountReceive: AmountType | undefined;
  setAmountReceive: React.Dispatch<React.SetStateAction<AmountType | undefined>>;
  bestOffer: SwapOffer | undefined;
  setBestOffer: React.Dispatch<React.SetStateAction<SwapOffer | undefined>>;
  searchTokenResult: Token[];
  setSearchTokenResult: React.Dispatch<React.SetStateAction<Token[]>>;

}

export const SwapDataContext = createContext<SwapDataContextType>({
  swapTokenData: [],
  setSwapTokenData: () => {},
  receiveTokenData: [],
  setReceiveTokenData: () => {},
  isSwapOpen: false,
  setIsSwapOpen: () => {},
  isReceiveOpen: false,
  setIsReceiveOpen: () => {},
  swapChain: undefined,
  setSwapChain: () => {},
  receiveChain: undefined,
  setReceiveChain: () => {},
  swapToken: undefined,
  setSwapToken: () => {},
  receiveToken: undefined,
  setReceiveToken: () => {},
  amountSwap: undefined,
  setAmountSwap: () => {},
  amountReceive: undefined,
  setAmountReceive: () => {},
  bestOffer: undefined,
  setBestOffer: () => {},
  searchTokenResult: [],
  setSearchTokenResult: () => {},
});

export const SwapDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [swapTokenData, setSwapTokenData] = useState<Token[]>([]);
  const [receiveTokenData, setReceiveTokenData] = useState<Token[]>([]);
  const [isSwapOpen, setIsSwapOpen] = useState<boolean>(false);
  const [isReceiveOpen, setIsReceiveOpen] = useState<boolean>(false);
  const [swapChain, setSwapChain] = useState<ChainType | undefined>(undefined);
  const [receiveChain, setReceiveChain] = useState<ChainType | undefined>(undefined);
  const [swapToken, setSwapToken] = useState<Token | undefined>(undefined);
  const [receiveToken, setReceiveToken] = useState<Token | undefined>(undefined);
  const [amountSwap, setAmountSwap] = useState<AmountType | undefined>(undefined);
  const [amountReceive, setAmountReceive] = useState<AmountType | undefined>(undefined);
  const [bestOffer, setBestOffer] = useState<SwapOffer | undefined>(undefined)
  const [searchTokenResult, setSearchTokenResult] = useState<Token[]>([]);

  const contextValue = useMemo(() => ({
    swapTokenData,
    setSwapTokenData,
    receiveTokenData,
    setReceiveTokenData,
    isSwapOpen,
    setIsSwapOpen,
    isReceiveOpen,
    setIsReceiveOpen,
    swapChain,
    setSwapChain,
    receiveChain,
    setReceiveChain,
    swapToken,
    setSwapToken,
    receiveToken,
    setReceiveToken,
    amountSwap,
    setAmountSwap,
    amountReceive,
    setAmountReceive,
    bestOffer,
    setBestOffer,
    searchTokenResult,
    setSearchTokenResult,
  }), [
    swapTokenData,
    receiveTokenData,
    isSwapOpen,
    isReceiveOpen,
    swapChain,
    receiveChain,
    swapToken,
    receiveToken,
    amountSwap,
    amountReceive,
    bestOffer,
    searchTokenResult,
  ]);

  return (
    <SwapDataContext.Provider value={contextValue}>
      {children}
    </SwapDataContext.Provider>
  );
};

export const useSwapDataContext = () => useContext(SwapDataContext);

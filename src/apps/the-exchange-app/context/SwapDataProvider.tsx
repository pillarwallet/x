import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ExchangeOffer, Token } from '@etherspot/prime-sdk/dist/sdk/data';
import usePillarSwapAssets from '../hooks/usePillarSwapAssets';

type AmountType = {
  tokenAmount: number;
  usdAmount: number;
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
  swapChain: number | undefined;
  setSwapChain: React.Dispatch<React.SetStateAction<number | undefined>>;
  receiveChain: number | undefined;
  setReceiveChain: React.Dispatch<React.SetStateAction<number | undefined>>;
  swapToken: Token | undefined;
  setSwapToken: React.Dispatch<React.SetStateAction<Token | undefined>>;
  receiveToken: Token | undefined;
  setReceiveToken: React.Dispatch<React.SetStateAction<Token | undefined>>;
  amountSwap: AmountType | undefined;
  setAmountSwap: React.Dispatch<React.SetStateAction<AmountType | undefined>>;
  amountReceive: AmountType | undefined;
  setAmountReceive: React.Dispatch<React.SetStateAction<AmountType | undefined>>;
  bestOffer: ExchangeOffer | undefined;
  setBestOffer: React.Dispatch<React.SetStateAction<ExchangeOffer | undefined>>;

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
});

export const SwapDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { getPillarSwapAssets } = usePillarSwapAssets();
  const [swapTokenData, setSwapTokenData] = useState<Token[]>([]);
  const [receiveTokenData, setReceiveTokenData] = useState<Token[]>([]);
  const [isSwapOpen, setIsSwapOpen] = useState<boolean>(false);
  const [isReceiveOpen, setIsReceiveOpen] = useState<boolean>(false);
  const [swapChain, setSwapChain] = useState<number | undefined>(undefined);
  const [receiveChain, setReceiveChain] = useState<number | undefined>(undefined);
  const [swapToken, setSwapToken] = useState<Token | undefined>(undefined);
  const [receiveToken, setReceiveToken] = useState<Token | undefined>(undefined);
  const [amountSwap, setAmountSwap] = useState<AmountType | undefined>(undefined);
  const [amountReceive, setAmountReceive] = useState<AmountType | undefined>(undefined);
  const [bestOffer, setBestOffer] = useState<ExchangeOffer | undefined>(undefined)

  useEffect(() => {
    const getAssetsSwap = async (chainId: number | undefined) => {
      try {
        const assets = await getPillarSwapAssets(chainId || undefined);
        setSwapTokenData(assets);
      } catch (error) {
        console.error('Error fetching supported assets:', error);
      }
    };

    getAssetsSwap(swapChain || undefined);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [swapChain]);

  useEffect(() => {
    const getAssetsReceive = async (chainId: number | undefined) => {
      try {
        const assets = await getPillarSwapAssets(chainId || undefined);
        setReceiveTokenData(assets);
      } catch (error) {
        console.error('Error fetching supported assets:', error);
      }
    };

    getAssetsReceive(receiveChain || undefined);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receiveChain]);

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
  ]);

  return (
    <SwapDataContext.Provider value={contextValue}>
      {children}
    </SwapDataContext.Provider>
  );
};

export const useSwapDataContext = () => useContext(SwapDataContext);

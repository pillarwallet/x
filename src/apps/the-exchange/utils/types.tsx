import { BridgingProvider, ExchangeOffer } from '@etherspot/prime-sdk/dist/sdk/data';
import { Route } from '@lifi/sdk';

export enum CardPosition {
    SWAP = 'SWAP',
    RECEIVE = 'RECEIVE'
}

export type SwapType = {
    fromAmount: number,
    fromTokenAddress: string,
    fromChainId: number;
    fromTokenDecimals: number;
    toTokenAddress: string,
    toChainId: number,
    toTokenDecimals: number;
    slippage: number;
    fromAccountAddress?: string
    provider?: BridgingProvider;
}

export type SwapOffer = {
    tokenAmountToReceive: number;
    offer: Route | ExchangeOffer;
}

export type AmountType = {
    tokenAmount: number;
    usdAmount: number;
  }
  
export type ChainType = {
    chainId: number;
    chainName: string;
  }

import { ExchangeOffer } from '@etherspot/data-utils/dist/cjs/sdk/data/classes/exchange-offer';
import { BridgingProvider } from '@etherspot/data-utils/dist/cjs/sdk/data/constants';
import { Route } from '@lifi/types';

export enum CardPosition {
  SWAP = 'SWAP',
  RECEIVE = 'RECEIVE',
}

export type SwapType = {
  fromAmount: number;
  fromTokenAddress: string;
  fromChainId: number;
  fromTokenDecimals: number;
  toTokenAddress: string;
  toChainId: number;
  toTokenDecimals: number;
  slippage: number;
  fromAccountAddress?: string;
  provider?: BridgingProvider;
};

export type SwapOffer = {
  tokenAmountToReceive: number;
  offer: Route | ExchangeOffer;
};

export type ChainType = {
  chainId: number;
  chainName: string;
};

import { BridgingProvider } from '@etherspot/data-utils/dist/cjs/sdk/data/constants';
import { Route } from '@lifi/sdk';
import { Hex } from 'viem';

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
  offer: Route;
};

export type ChainType = {
  chainId: number;
  chainName: string;
};

export type StepTransaction = {
  to?: string;
  data?: Hex;
  value?: bigint;
  gasLimit?: bigint;
  gasPrice?: bigint;
  chainId?: number;
  type?: number | string;
  transactionType?: StepType;
};

export type StepType = 'swap' | 'cross' | 'lifi' | 'custom' | 'approval';

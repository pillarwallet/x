import { BigNumberish } from 'ethers';

export interface IApiTransaction {
  id: string;
  value: BigNumberish;
  to: string;
  data?: string;
  status: string;
  hash?: string;
  userOpHash?: string;
  blockTimestamp: number;
  asset?: {
    address: string;
    decimals: number;
    name: string;
    symbol: string;
    value: BigNumberish;
  }
}

export interface ITransaction {
  to: string;
  value?: BigNumberish;
  data?: string;
  chainId: number;
}

import { BigNumberish } from 'ethers';

export interface Transaction {
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

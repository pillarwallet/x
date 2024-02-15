import { BigNumberish } from 'ethers';

export interface Transaction {
  id: string;
  value: BigNumberish;
  to: string;
  data?: string;
  status: string;
  hash?: string;
  userOpHash?: string;
}

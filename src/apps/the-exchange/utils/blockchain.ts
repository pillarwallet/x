import { BigNumber, BigNumberish } from 'ethers';
import { formatUnits, formatEther } from 'ethers/lib/utils';

export const processBigNumber = (val: BigNumber): number =>
    Number(val.toString());

export const processEth = (val: BigNumberish, dec: number): number => {
    if (typeof val === 'bigint') {
      return +parseFloat(formatEther(val)).toFixed(2);
    }
  
    return +parseFloat(formatUnits(val as BigNumberish, dec));
  };
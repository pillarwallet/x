import { prepareNetworkName } from '@etherspot/prime-sdk';

export const convertChainIdtoName = (chainId: number) => prepareNetworkName(chainId) ?? chainId.toString();

export const hasThreeZerosAfterDecimal = (num: number): boolean => {
    const decimalPart = num.toString().split('.')[1] || '';
    return decimalPart.startsWith('000');
};

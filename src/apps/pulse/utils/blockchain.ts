export const formatNativeTokenAddress = (address: string): string => {
  const ETH_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

  if (address.toLowerCase() === ETH_ADDRESS) {
    return '0x0000000000000000000000000000000000000000';
  }

  return address;
};

export const NATIVE_TOKEN_ADDRESSES = new Set([
  '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  '0x0000000000000000000000000000000000000000',
  '0x0000000000000000000000000000000000001010',
]);

export const isNativeToken = (address: string) =>
  NATIVE_TOKEN_ADDRESSES.has(address.toLowerCase());

export const NativeSymbols: Record<number, string> = {
  1: 'ETH',
  137: 'POL',
  8453: 'ETH',
  42161: 'ETH',
  10: 'ETH',
  56: 'BNB',
  100: 'XDAI',
};

export const getNativeTokenSymbol = (chainId: number): string => {
  return NativeSymbols[chainId] || 'ETH';
};
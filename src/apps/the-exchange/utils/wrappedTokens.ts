export const NATIVE_TOKEN_ADDRESSES = new Set([
  '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  '0x0000000000000000000000000000000000000000',
]);

// Not including XDAI below
export const WRAPPED_NATIVE_TOKEN_ADDRESSES: Record<number, string> = {
  // Ethereum
  1: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
  // Polygon
  137: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', // WMATIC
  // Optimism
  10: '0x4200000000000000000000000000000000000006', // WETH
  // Arbitrum
  42161: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', // WETH
  // Base
  8453: '0x4200000000000000000000000000000000000006', // WETH
  // BNB
  56: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', // WBNB
};

export const isWrappedToken = (tokenAddress: string, chainId: number) => {
  return (
    tokenAddress.toLowerCase() ===
    WRAPPED_NATIVE_TOKEN_ADDRESSES[chainId]?.toLowerCase()
  );
};

export const isNativeToken = (address: string) =>
  NATIVE_TOKEN_ADDRESSES.has(address.toLowerCase());

export const getWrappedTokenAddressIfNative = (
  tokenAddress: string,
  chainId: number
): string => {
  if (isNativeToken(tokenAddress)) {
    const wrappedAddress = WRAPPED_NATIVE_TOKEN_ADDRESSES[chainId];
    // fallback to token address in the case of XDAI token
    return wrappedAddress || tokenAddress;
  }
  return tokenAddress;
};

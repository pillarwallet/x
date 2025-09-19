export const formatNativeTokenAddress = (address: string): string => {
  const ETH_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

  if (address.toLowerCase() === ETH_ADDRESS) {
    return '0x0000000000000000000000000000000000000000';
  }

  return address;
};

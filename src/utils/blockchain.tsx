import { ethers } from 'ethers';
import { TokenListToken } from '@etherspot/prime-sdk';

export const isValidEthereumAddress = (address: string | undefined): boolean => {
  if (!address) return false;

  try {
    return ethers.utils.isAddress(address);
  } catch (e) {
    //
  }

  return false;
};

export const MAINNET_CHAIN_ID = {
  ETHEREUM_MAINNET: 1,
  POLYGON: 137,
  BINANCE: 56,
  XDAI: 100,
  AVALANCHE: 43114,
  OPTIMISM: 10,
  ARBITRUM: 42161,
};

export const nativeAssetPerChainId: { [chainId: number]: TokenListToken | undefined } = {
  [MAINNET_CHAIN_ID.ETHEREUM_MAINNET]: {
    chainId: MAINNET_CHAIN_ID.ETHEREUM_MAINNET,
    address: ethers.constants.AddressZero,
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
    logoURI: 'https://public.etherspot.io/buidler/chain_logos/ethereum.png',
  },
  [MAINNET_CHAIN_ID.POLYGON]: {
    chainId: MAINNET_CHAIN_ID.POLYGON,
    address: ethers.constants.AddressZero,
    name: 'Matic',
    symbol: 'MATIC',
    decimals: 18,
    logoURI: 'https://public.etherspot.io/buidler/chain_logos/native_tokens/matic.png',
  },
  [MAINNET_CHAIN_ID.XDAI]: {
    chainId: MAINNET_CHAIN_ID.XDAI,
    address: ethers.constants.AddressZero,
    name: 'xDAI',
    symbol: 'XDAI',
    decimals: 18,
    logoURI: 'https://public.etherspot.io/buidler/chain_logos/native_tokens/xdai.png',
  },
  [MAINNET_CHAIN_ID.AVALANCHE]: {
    chainId: MAINNET_CHAIN_ID.AVALANCHE,
    address: ethers.constants.AddressZero,
    name: 'Avalanche',
    symbol: 'AVAX',
    decimals: 18,
    logoURI: 'https://public.etherspot.io/buidler/chain_logos/avalanche.svg',
  },
  [MAINNET_CHAIN_ID.OPTIMISM]: {
    chainId: MAINNET_CHAIN_ID.OPTIMISM,
    address: ethers.constants.AddressZero,
    name: 'Optimism',
    symbol: 'ETH',
    decimals: 18,
    logoURI: 'https://public.etherspot.io/buidler/chain_logos/ethereum.png',
  },
  [MAINNET_CHAIN_ID.ARBITRUM]: {
    chainId: MAINNET_CHAIN_ID.ARBITRUM,
    address: ethers.constants.AddressZero,
    name: 'Arbitrum',
    symbol: 'ETH',
    decimals: 18,
    logoURI: 'https://public.etherspot.io/buidler/chain_logos/ethereum.png',
  },
};

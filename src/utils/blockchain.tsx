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

/**
 * Cross-check with:
 * - https://etherspot.fyi/prime-sdk/chains-supported#testnets
 * - https://docs.privy.io/guide/configuration/networks#default-configuration
 */
export const MAINNET_CHAIN_ID = {
  ETHEREUM_MAINNET: 1,
  POLYGON: 137,
  OPTIMISM: 10,
  ARBITRUM: 42161,
  GNOSIS: 100,
  BASE: 8453,
  AVALANCHE: 43114,
  BINANCE: 56,
  LINEA: 59144,
};

/**
 * Cross-check with:
 * - https://etherspot.fyi/prime-sdk/chains-supported
 * - https://docs.privy.io/guide/configuration/networks#default-configuration
 */
export const TESTNET_CHAIN_ID = {
  POLYGON_MUMBAI: 80001,
  SEPOLIA: 11155111,
  GOERLI: 5,
  BASE_GOERLI: 84531,
  ARBITRUM_GOERLI: 421613,
};

export const getNativeAssetForChainId = (chainId: number): TokenListToken => {
  // return different native asset for chains where it's not Ether (ETH), otherwise return Ether (ETH)
  const nativeAsset = {
    chainId,
    address: ethers.constants.AddressZero,
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
    logoURI: 'https://public.etherspot.io/buidler/chain_logos/ethereum.png',
  };

  if (chainId === MAINNET_CHAIN_ID.POLYGON
    || chainId === TESTNET_CHAIN_ID.POLYGON_MUMBAI) {
    nativeAsset.name = 'Matic';
    nativeAsset.symbol = 'MATIC';
    nativeAsset.logoURI = 'https://public.etherspot.io/buidler/chain_logos/native_tokens/matic.png';
  }

  if (chainId === MAINNET_CHAIN_ID.GNOSIS) {
    nativeAsset.name = 'XDAI';
    nativeAsset.symbol = 'XDAI';
    nativeAsset.logoURI = 'https://public.etherspot.io/buidler/chain_logos/native_tokens/xdai.png';
  }

  if (chainId === MAINNET_CHAIN_ID.AVALANCHE) {
    nativeAsset.name = 'AVAX';
    nativeAsset.symbol = 'AVAX';
    nativeAsset.logoURI = 'https://public.etherspot.io/buidler/chain_logos/avalanche.svg';
  }

  if (chainId === MAINNET_CHAIN_ID.BINANCE) {
    nativeAsset.name = 'BNB';
    nativeAsset.symbol = 'BNB';
    nativeAsset.logoURI = 'https://public.etherspot.io/buidler/chain_logos/native_tokens/bnb.png';
  }

  if (chainId === MAINNET_CHAIN_ID.ARBITRUM) {
    nativeAsset.name = 'BNB';
    nativeAsset.symbol = 'BNB';
    nativeAsset.logoURI = 'https://public.etherspot.io/buidler/chain_logos/binance.svg';
  }

  return nativeAsset;
}

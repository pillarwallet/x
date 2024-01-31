import { ethers } from 'ethers';
import { TokenListToken } from '@etherspot/prime-sdk';
import {
  polygon,
  gnosis,
  avalanche,
  bsc,
  polygonMumbai,
} from 'viem/chains';

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
 * Cross-check for supported with:
 * - https://etherspot.fyi/prime-sdk/chains-supported
 * - https://docs.privy.io/guide/configuration/networks#default-configuration
 */
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

  // only mumbai testnet is supported on Prime SDK
  if (chainId === polygon.id
    || chainId === polygonMumbai.id) {
    nativeAsset.name = 'Matic';
    nativeAsset.symbol = 'MATIC';
    nativeAsset.logoURI = 'https://public.etherspot.io/buidler/chain_logos/native_tokens/matic.png';
  }

  // gnosis testnet not supported on Prime SDK
  if (chainId === gnosis.id) {
    nativeAsset.name = 'XDAI';
    nativeAsset.symbol = 'XDAI';
    nativeAsset.logoURI = 'https://public.etherspot.io/buidler/chain_logos/native_tokens/xdai.png';
  }

  // avalanche testnet not supported on Prime SDK
  if (chainId === avalanche.id) {
    nativeAsset.name = 'AVAX';
    nativeAsset.symbol = 'AVAX';
    nativeAsset.logoURI = 'https://public.etherspot.io/buidler/chain_logos/avalanche.svg';
  }

  // bsc testnet not supported on Prime SDK
  if (chainId === bsc.id) {
    nativeAsset.name = 'BNB';
    nativeAsset.symbol = 'BNB';
    nativeAsset.logoURI = 'https://public.etherspot.io/buidler/chain_logos/native_tokens/bnb.png';
  }

  return nativeAsset;
}

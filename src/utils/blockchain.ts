import { Nft, NftCollection, TokenListToken } from '@etherspot/prime-sdk/dist/sdk/data';
import { ethers } from 'ethers';
import {
  avalanche,
  base,
  bsc,
  gnosis,
  polygon,
  sepolia,
} from 'viem/chains';

// images
import logoAvalanche from '../assets/images/logo-avalanche.png';
import logoBsc from '../assets/images/logo-bsc.png';
import logoEvm from '../assets/images/logo-evm.png';
import logoGnosis from '../assets/images/logo-gnosis.png';
import logoPolygon from '../assets/images/logo-polygon.png';

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
  // return different native asset for chains where it's not Matic (MATIC), otherwise return Matic (MATIC)
  // only mumbai testnet is supported on Prime SDK
  const nativeAsset = {
    chainId,
    address: ethers.constants.AddressZero,
    name: 'Matic',
    symbol: 'MATIC',
    decimals: 18,
    logoURI: 'https://public.etherspot.io/buidler/chain_logos/native_tokens/matic.png',
  };

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
    nativeAsset.logoURI = 'https://public.etherspot.io/buidler/chain_logos/binance.svg';
  }

  return nativeAsset;
}

export const supportedChains = [
  polygon,
  gnosis,
  base,
  sepolia,
];

export const visibleChains = supportedChains
  .filter((chain) => process.env.REACT_APP_USE_TESTNETS === 'true' ? chain.testnet : !chain.testnet)

export const parseNftTitle = (collection: NftCollection, nft: Nft): string => {
  return nft.name
    ? nft.name
    : collection.contractName + ' #' + nft.tokenId
}

export const getLogoForChainId = (chainId: number): string => {

  if (chainId === polygon.id) {
    return logoPolygon;
  }

  if (chainId === gnosis.id) {
    return logoGnosis;
  }

  if (chainId === avalanche.id) {
    return logoAvalanche;
  }

  if (chainId === bsc.id) {
    return logoBsc;
  }

  return logoEvm;
}

export const truncateAddress = (address: string, displayLength = 10): string => {
  return address.slice(0, Math.round(displayLength * 0.6)) + '...' + address.slice(-Math.round(displayLength * 0.4));
}

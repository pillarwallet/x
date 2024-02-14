import { ethers } from 'ethers';
import { AccountBalance, TokenListToken } from '@etherspot/prime-sdk';
import {
  polygon,
  gnosis,
  avalanche,
  bsc,
  polygonMumbai, mainnet, goerli, sepolia,
} from 'viem/chains';
import { ITransaction } from '@etherspot/transaction-kit';

// services
import { callBlastApi } from '../services/blastApi';
import { callMainApi } from '../services/mainApi';

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
    nativeAsset.logoURI = 'https://public.etherspot.io/buidler/chain_logos/binance.svg';
  }

  return nativeAsset;
}

// TODO: remove this when Prime SDK supports Sepolia
export const usdcOnSepolia: TokenListToken = {
  chainId: sepolia.id,
  address: '0x39eBE23d1934987064DDc5F85b21e5Cf13803B4A',
  name: 'USDC',
  symbol: 'USDC',
  decimals: 18,
  logoURI: 'https://public.etherspot.io/buidler/token_logos/usdc-logo.png',
};

export const supportedChains = [
  mainnet,
  polygon,
  gnosis,
  avalanche,
  bsc,
  goerli,
  sepolia,
  polygonMumbai,
];

export const getNativeAssetBalance = async (chainId: number, walletAddress: string): Promise<AccountBalance> => {
  let balance = ethers.BigNumber.from('0');

  const blastApiResult = await callBlastApi(chainId, 'eth_getBalance', [walletAddress, 'latest']);

  try {
    balance = ethers.BigNumber.from(blastApiResult as string);
  } catch (e) {
    console.warn('Failed to get native asset balance', { blastApiResult });
  }

  return {
    token: getNativeAssetForChainId(chainId).address,
    balance,
    superBalance: balance,
  }
}

export const getAssetBalance = async (
  chainId: number,
  assetAddress: string,
  walletAddress: string
): Promise<AccountBalance> => {
  let balance = ethers.BigNumber.from('0');

  const erc20Interface = new ethers.utils.Interface(['function balanceOf(address) view returns (uint256)']);
  const data = erc20Interface.encodeFunctionData('balanceOf', [walletAddress]);
  const blastApiResult = await callBlastApi(chainId, 'eth_call', [{
    to: assetAddress,
    data,
  },'latest']);

  try {
    balance = ethers.BigNumber.from(blastApiResult as string);
  } catch (e) {
    console.warn('Failed to get native asset balance', { blastApiResult });
  }

  return {
    token: assetAddress,
    balance,
    superBalance: balance,
  }
}

export const getAccountTransactionHistory = async (
  chainId: number,
  walletAddress: string,
): Promise<ITransaction[]> => {
  const callPath = `account-history/${walletAddress}/${chainId}`;
  const result = await callMainApi<{ transactions?: ITransaction[] }>(callPath);
  return result?.transactions ?? [];
}

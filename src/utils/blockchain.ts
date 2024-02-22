import { ethers } from 'ethers';
import { AccountBalance, NftCollection, TokenListToken } from '@etherspot/prime-sdk';
import {
  polygon,
  gnosis,
  avalanche,
  bsc,
  polygonMumbai,
  mainnet,
  sepolia,
} from 'viem/chains';

// services
import { callBlastApi } from '../services/blastApi';
import { callMainApi } from '../services/mainApi';

// types
import { Transaction } from '../types/blockchain';

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
  sepolia,
  polygonMumbai,
];

export const visibleChains = supportedChains
  .filter((chain) => process.env.REACT_APP_USE_TESTNETS === 'true' ? chain.testnet : !chain.testnet)

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

const receiptStatusToMessage: { [key: string]: string } = {
  0: 'Failed',
  1: 'Completed',
}

type ApiTransaction = {
  to_address: string;
  value: string;
  block_timestamp: string;
  receipt_status?: string;
  hash?: string; // native asset type
  transaction_hash?: string; // token transfer type
  input?: string;
  token_name?: string;
  token_symbol?: string;
  token_decimals?: string;
  address?: string;
  internal_transactions?: {
    from: string;
    to: string;
    type: string;
  }[];
}

export const getAccountTransactionHistory = async (
  chainId: number,
  walletAddress: string,
): Promise<Transaction[]> => {
  const callPath = `account-history/${walletAddress}/${chainId}`;
  const result = await callMainApi<{ transactions?: ApiTransaction[] }>(callPath);

  // TODO: scrap all these native x erc20 mappings when Prime SDK supports Sepolia 💀
  return (result?.transactions ?? []).map(({
    receipt_status,
    hash,
    transaction_hash,
    input,
    value,
    block_timestamp,
    to_address,
    token_name,
    token_symbol,
    token_decimals,
    address: token_address,
    internal_transactions,
  }) => {
    let to = to_address;

    if (internal_transactions?.length
      && internal_transactions[0]?.type === 'DELEGATECALL') {
      to = internal_transactions[0].to;
    }

    return {
      id: hash ?? transaction_hash ?? '0x',
      value: token_name ? '0' : value,
      to,
      data: input,
      hash: hash ?? transaction_hash,
      status: receiptStatusToMessage[receipt_status ?? 1] ?? 'Pending',
      blockTimestamp: +(new Date(block_timestamp)),
      asset: token_name
        ? {
          address: token_address as string,
          decimals: +(token_decimals as string),
          name: token_name as string,
          symbol: token_symbol as string,
          value,
        }
        : undefined,
    }
  });
}

export const getAccountNfts = async (
  chainId: number,
  walletAddress: string,
): Promise<NftCollection[]> => {
  const callPath = `nfts/${walletAddress}/${chainId}`;
  const result = await callMainApi<{ collections?: NftCollection[] }>(callPath);
  return result?.collections ?? [];
}

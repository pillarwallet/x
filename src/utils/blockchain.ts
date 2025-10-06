/* eslint-disable no-restricted-syntax */
import { Nft } from '@etherspot/data-utils/dist/cjs/sdk/data/classes/nft';
import { NftCollection } from '@etherspot/data-utils/dist/cjs/sdk/data/classes/nft-collection';
import { ethers } from 'ethers';
import { encodeFunctionData, erc20Abi, parseUnits } from 'viem';
import {
  arbitrum,
  avalanche,
  base,
  bsc,
  gnosis,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from 'viem/chains';

// utils
import { isNativeToken } from '../apps/the-exchange/utils/wrappedTokens';

// types
import { TokenListToken } from '../types/blockchain';

// images
import logoArbitrum from '../assets/images/logo-arbitrum.png';
import logoAvalanche from '../assets/images/logo-avalanche.png';
import logoBase from '../assets/images/logo-base.png';
import logoBsc from '../assets/images/logo-bsc.png';
import logoEthereum from '../assets/images/logo-ethereum.png';
import logoEvm from '../assets/images/logo-evm.png';
import logoGnosis from '../assets/images/logo-gnosis.png';
import logoOptimism from '../assets/images/logo-optimism.png';
import logoPolygon from '../assets/images/logo-polygon.png';

export const isTestnet = (() => {
  const storedIsTestnet = localStorage.getItem('isTestnet');
  if (storedIsTestnet === null || storedIsTestnet === undefined) {
    return import.meta.env.VITE_USE_TESTNETS === 'true';
  }
  return storedIsTestnet === 'true';
})();

export const isGnosisEnabled =
  import.meta.env.VITE_FEATURE_FLAG_GNOSIS === 'true';

export const isValidEthereumAddress = (
  address: string | undefined
): boolean => {
  if (!address) return false;

  try {
    return ethers.utils.isAddress(address);
  } catch (e) {
    //
  }

  return false;
};

// WRAPPED POL & POL are interchangeably Polygon native assets
export const WRAPPED_POL_TOKEN_ADDRESS =
  '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270';

export const isPolygonAssetNative = (address: string, chainId: number) =>
  (address === ethers.constants.AddressZero ||
    address === WRAPPED_POL_TOKEN_ADDRESS) &&
  chainId === 137;

/**
 * Cross-check for supported with:
 * - https://etherspot.fyi/prime-sdk/chains-supported
 * - https://docs.privy.io/guide/configuration/networks#default-configuration
 */
export const getNativeAssetForChainId = (chainId: number): TokenListToken => {
  // return different native asset for chains where it's not POL (POL), otherwise return POL (POL)
  // only mumbai testnet is supported on Prime SDK
  const nativeAsset = {
    chainId,
    address:
      ethers.constants.AddressZero ||
      (chainId === 137 && WRAPPED_POL_TOKEN_ADDRESS),
    name: 'POL',
    symbol: 'POL',
    decimals: 18,
    logoURI:
      'https://public.etherspot.io/buidler/chain_logos/native_tokens/matic.png',
  };

  if (chainId === mainnet.id) {
    nativeAsset.name = 'Ether';
    nativeAsset.symbol = 'ETH';
    nativeAsset.logoURI =
      'https://public.etherspot.io/buidler/chain_logos/ethereum.png';
  }

  if (isGnosisEnabled && chainId === gnosis.id) {
    nativeAsset.name = 'XDAI';
    nativeAsset.symbol = 'XDAI';
    nativeAsset.logoURI =
      'https://public.etherspot.io/buidler/chain_logos/native_tokens/xdai.png';
  }

  if (chainId === avalanche.id) {
    nativeAsset.name = 'AVAX';
    nativeAsset.symbol = 'AVAX';
    nativeAsset.logoURI =
      'https://public.etherspot.io/buidler/chain_logos/avalanche.svg';
  }

  if (chainId === bsc.id) {
    nativeAsset.name = 'BNB';
    nativeAsset.symbol = 'BNB';
    nativeAsset.logoURI =
      'https://public.etherspot.io/buidler/chain_logos/binance.svg';
  }

  if (chainId === optimism.id) {
    nativeAsset.name = 'Ether';
    nativeAsset.symbol = 'ETH';
    nativeAsset.logoURI =
      'https://public.etherspot.io/buidler/chain_logos/ethereum.png';
  }

  if (chainId === arbitrum.id) {
    nativeAsset.name = 'Ether';
    nativeAsset.symbol = 'ETH';
    nativeAsset.logoURI =
      'https://public.etherspot.io/buidler/chain_logos/ethereum.png';
  }

  if (chainId === base.id) {
    nativeAsset.name = 'Ether';
    nativeAsset.symbol = 'ETH';
    nativeAsset.logoURI =
      'https://public.etherspot.io/buidler/chain_logos/ethereum.png';
  }

  if (chainId === sepolia.id) {
    nativeAsset.name = 'Sepolia ETH';
    nativeAsset.symbol = 'SETH';
    nativeAsset.logoURI =
      'https://public.etherspot.io/buidler/chain_logos/ethereum.png';
  }

  return nativeAsset;
};

const allSupportedChains = [
  mainnet,
  polygon,
  gnosis,
  base,
  bsc,
  optimism,
  arbitrum,
  sepolia,
];

export const supportedChains = allSupportedChains.filter(
  (chain) => isGnosisEnabled || chain.id !== 100
);

export const visibleChains = supportedChains.filter((chain) =>
  isTestnet ? chain.testnet : !chain.testnet
);

export const parseNftTitle = (collection: NftCollection, nft: Nft): string => {
  return nft.name ? nft.name : `${collection.contractName} #${nft.tokenId}`;
};

export const getLogoForChainId = (chainId: number): string => {
  if (chainId === mainnet.id) {
    return logoEthereum;
  }

  if (chainId === polygon.id) {
    return logoPolygon;
  }

  if (isGnosisEnabled && chainId === gnosis.id) {
    return logoGnosis;
  }

  if (chainId === avalanche.id) {
    return logoAvalanche;
  }

  if (chainId === bsc.id) {
    return logoBsc;
  }

  if (chainId === optimism.id) {
    return logoOptimism;
  }

  if (chainId === arbitrum.id) {
    return logoArbitrum;
  }

  if (chainId === base.id) {
    return logoBase;
  }

  return logoEvm;
};

export const truncateAddress = (
  address: string,
  displayLength = 10
): string => {
  return `${address.slice(
    0,
    Math.round(displayLength * 0.6)
  )}...${address.slice(-Math.round(displayLength * 0.4))}`;
};

export const decodeSendTokenCallData = (callData: string) =>
  ethers.utils.defaultAbiCoder.decode(
    ['address', 'uint256'],
    ethers.utils.hexDataSlice(callData, 4)
  );

export const isApproveTransaction = (callData: string) => {
  const methodId = callData.slice(0, 10);

  // ERC-20 approve method id in hexadecimal format
  const approveMethodId = '0x095ea7b3';
  return methodId === approveMethodId;
};

export const getBlockScan = (chain: number, isAddress: boolean = false) => {
  switch (chain) {
    case 1:
      return `https://etherscan.io/${isAddress ? 'address' : 'tx'}/`;
    case 137:
      return `https://polygonscan.com/${isAddress ? 'address' : 'tx'}/`;
    case 8453:
      return `https://basescan.org/${isAddress ? 'address' : 'tx'}/`;
    case 100:
      return isGnosisEnabled
        ? `https://gnosisscan.io/${isAddress ? 'address' : 'tx'}/`
        : '';
    case 56:
      return `https://bscscan.com/${isAddress ? 'address' : 'tx'}/`;
    case 10:
      return `https://optimistic.etherscan.io/${isAddress ? 'address' : 'tx'}/`;
    case 42161:
      return `http://arbiscan.io/${isAddress ? 'address' : 'tx'}/`;
    default:
      return '';
  }
};

export const getBlockScanName = (chain: number) => {
  switch (chain) {
    case 1:
      return 'Etherscan';
    case 137:
      return 'Polygonscan';
    case 8453:
      return 'Basescan';
    case 100:
      return isGnosisEnabled ? 'Gnosisscan' : '';
    case 56:
      return 'Bscscan';
    case 10:
      return 'Optimistic Etherscan';
    case 42161:
      return 'Arbiscan';
    default:
      return '';
  }
};

export const getChainName = (chain: number) => {
  switch (chain) {
    case 1:
      return 'Ethereum';
    case 137:
      return 'Polygon';
    case 8453:
      return 'Base';
    case 100:
      return isGnosisEnabled ? 'Gnosis' : `${chain}`;
    case 56:
      return 'BNB Smart Chain';
    case 10:
      return 'Optimism';
    case 42161:
      return 'Arbitrum';
    default:
      return `${chain}`;
  }
};

const allCompatibleChains = [
  {
    chainId: 1,
    chainName: 'Ethereum',
  },
  {
    chainId: 137,
    chainName: 'Polygon',
  },
  {
    chainId: 8453,
    chainName: 'Base',
  },
  {
    chainId: 100,
    chainName: 'Gnosis',
  },
  {
    chainId: 56,
    chainName: 'BNB Smart Chain',
  },
  {
    chainId: 10,
    chainName: 'Optimism',
  },
  {
    chainId: 42161,
    chainName: 'Arbitrum',
  },
];

export const CompatibleChains = allCompatibleChains.filter(
  (chain) => isGnosisEnabled || chain.chainId !== 100
);

const allStablecoinAddresses: Record<number, Set<string>> = {
  1: new Set([
    // Ethereum mainnet
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
    '0xdac17f958d2ee523a2206206994597c13d831ec7', // USDT
  ]),
  137: new Set([
    // Polygon
    '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359', // USDC
    '0xc2132d05d31c914a87c6611c10748aeb04b58e8f', // USDT
  ]),
  8453: new Set([
    // Base
    '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913', // USDC
    '0xfde4c96c8593536e31f229ea8f37b2ada2699bb2', // Bridged USDT
  ]),
  100: new Set([
    // Gnosis
    '0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83', // USDC
    '0x4ecaba5870353805a9f068101a40e0f32ed605c6', // USDT
  ]),
  56: new Set([
    // BNB Smart Chain
    '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', // USDC
    '0x55d398326f99059fF775485246999027B3197955', // BSC-USD
  ]),
  10: new Set([
    // Optimism
    '0x0b2c639c533813f4aa9d7837caf62653d097ff85', // USDC
    '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58', // USDT
  ]),
  42161: new Set([
    // Arbitrum
    '0xaf88d065e77c8cc2239327c5edb3a432268e5831', // USDC
    '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9', // USDT
  ]),
};

const STABLECOIN_ADDRESSES = Object.fromEntries(
  Object.entries(allStablecoinAddresses).filter(
    ([chainId]) => isGnosisEnabled || chainId !== '100'
  )
) as Record<number, Set<string>>;

export function isStableCoin(address: string, chainId: number): boolean {
  if (!address || !chainId) return false;
  const set = STABLECOIN_ADDRESSES[chainId];
  if (!set) return false;
  return set.has(address.toLowerCase());
}

// Simple utility to safely convert values to BigInt
export const safeBigIntConversion = (value: unknown): bigint => {
  if (typeof value === 'bigint') return value;
  if (typeof value === 'string' && value.includes('.')) return BigInt(0); // Skip decimal strings
  try {
    return BigInt(String(value || 0));
  } catch {
    return BigInt(0);
  }
};

export const buildTransactionData = ({
  tokenAddress,
  recipient,
  amount,
  decimals,
}: {
  tokenAddress: string;
  recipient: string;
  amount: string | bigint;
  decimals: number;
}) => {
  // Validate recipient address
  if (!recipient || !isValidEthereumAddress(recipient)) {
    throw new Error('Invalid recipient address');
  }

  // Validate amount
  if (typeof amount === 'string') {
    if (!amount || amount === '0' || amount === '0.0' || amount === '0.00') {
      throw new Error('Invalid amount: must be a positive value');
    }
    if (Number.isNaN(Number(amount)) || Number(amount) <= 0) {
      throw new Error('Invalid amount: must be a positive valid number');
    }
  } else if (typeof amount === 'bigint') {
    if (amount <= BigInt(0)) {
      throw new Error('Invalid amount: must be a positive value');
    }
  }

  // Validate decimals
  if (decimals < 0 || decimals > 18 || !Number.isInteger(decimals)) {
    throw new Error('Invalid decimals: must be an integer between 0 and 18');
  }

  // Validate token address (for ERC20 tokens)
  if (!isNativeToken(tokenAddress) && !isValidEthereumAddress(tokenAddress)) {
    throw new Error('Invalid token address');
  }

  try {
    // Ensure amount is properly formatted as a string with appropriate precision
    const amountString =
      typeof amount === 'string' ? amount : amount.toString();

    if (isNativeToken(tokenAddress)) {
      // Native token transfer
      try {
        const parsedValue = parseUnits(amountString, decimals);
        // Ensure the parsed value is a valid bigint
        if (typeof parsedValue !== 'bigint') {
          throw new Error(`parseUnits returned invalid value: ${parsedValue}`);
        }
        return {
          to: recipient,
          value: parsedValue,
          data: '0x',
        };
      } catch (parseError) {
        console.error(
          'parseUnits error:',
          parseError,
          'amountString:',
          amountString,
          'decimals:',
          decimals
        );
        throw new Error(
          `Failed to parse units: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`
        );
      }
    }
    // ERC20 transfer
    try {
      const parsedAmount = parseUnits(amountString, decimals);
      // Ensure the parsed amount is a valid bigint
      if (typeof parsedAmount !== 'bigint') {
        throw new Error(`parseUnits returned invalid value: ${parsedAmount}`);
      }
      return {
        to: tokenAddress,
        value: '0',
        data: encodeFunctionData({
          abi: erc20Abi,
          functionName: 'transfer',
          args: [recipient as `0x${string}`, parsedAmount],
        }),
      };
    } catch (parseError) {
      console.error(
        'parseUnits error:',
        parseError,
        'amountString:',
        amountString,
        'decimals:',
        decimals
      );
      throw new Error(
        `Failed to parse units: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`
      );
    }
  } catch (error) {
    throw new Error(
      `Failed to build transaction data: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

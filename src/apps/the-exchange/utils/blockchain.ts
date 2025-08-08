import { BigNumber, BigNumberish } from 'ethers';
import { formatEther, formatUnits } from 'ethers/lib/utils';
import { decodeFunctionData, erc20Abi, parseUnits } from 'viem';

// types
import {
  Token,
  chainNameToChainIdTokensData,
} from '../../../services/tokensData';
import { StepTransaction } from './types';

// utils
import { isNativeToken } from './wrappedTokens';

export const processBigNumber = (val: BigNumber): number =>
  Number(val.toString());

export const processEth = (val: BigNumberish, dec: number): number => {
  if (typeof val === 'bigint') {
    return +parseFloat(formatEther(val)).toFixed(2);
  }

  return +parseFloat(formatUnits(val as BigNumberish, dec));
};

// Utility: get native token symbol for a chain
export const NATIVE_SYMBOLS: Record<number, string> = {
  1: 'ETH',
  100: 'xDAI',
  137: 'POL',
  10: 'ETH',
  42161: 'ETH',
  56: 'BNB',
  8453: 'ETH',
};

// Helper: Detect if a tx is a native fee step
export const isNativeFeeTx = (
  tx: StepTransaction,
  feeReceiver: string
): boolean => {
  return (
    typeof tx.to === 'string' &&
    typeof feeReceiver === 'string' &&
    tx.to.toLowerCase() === feeReceiver.toLowerCase()
  );
};

// Helper: Detect if a tx is an ERC20 (stablecoin or wrapped) fee step
export const isERC20FeeTx = (
  tx: StepTransaction,
  swapToken: Token
): boolean => {
  return (
    typeof tx.to === 'string' &&
    typeof swapToken.contract === 'string' &&
    tx.to.toLowerCase() === swapToken.contract.toLowerCase() &&
    tx.value === BigInt(0) &&
    typeof tx.data === 'string' &&
    tx.data.startsWith('0xa9059cbb')
  );
};

// Helper: Extract fee amount from tx
export const getFeeAmount = (
  tx: StepTransaction,
  swapToken: Token,
  decimals: number
): string => {
  if (tx.value && tx.data === '0x') {
    // Native
    return formatEther(tx.value);
  }
  if (isERC20FeeTx(tx, swapToken)) {
    try {
      const decoded = decodeFunctionData({
        abi: erc20Abi,
        data: tx.data || '0x',
      });
      if (decoded.args && Array.isArray(decoded.args) && decoded.args.length > 1 && typeof decoded.args[1] === 'bigint') {
        return formatUnits(decoded.args[1], decimals);
      }
    } catch (e) {
      console.warn('Failed to decode ERC20 transfer data:', e);
      return '0';
    }
  }
  return '0';
};

// Helper: Get fee symbol
export const getFeeSymbol = (
  tx: StepTransaction,
  swapToken: Token,
  chainId: number
): string => {
  if (tx.value && tx.data === '0x') {
    return NATIVE_SYMBOLS[chainId] || 'NATIVE';
  }
  return swapToken.symbol;
};

// Extract ERC20 token balance from walletPortfolio for a given contract and chainId
export const getTokenBalanceFromPortfolio = (
  walletPortfolio: Token[] | undefined,
  contract: string,
  chainId: number
): string | undefined => {
  if (!walletPortfolio) return undefined;
  const token = walletPortfolio.find(
    (t) =>
      t.contract.toLowerCase() === contract.toLowerCase() &&
      chainNameToChainIdTokensData(t.blockchain) === chainId
  );
  return token ? String(token.balance) : undefined;
};

// Convert to wei as bigint
export const toWei = (amount: string | number, decimals = 18): bigint => {
  return parseUnits(String(amount), decimals);
};

// Extract native token balance from walletPortfolio for a given chainId
export const getNativeBalanceFromPortfolio = (
  walletPortfolio: Token[] | undefined,
  chainId: number
): string | undefined => {
  if (!walletPortfolio) return undefined;
  // Find the native token for the chain (by contract address)
  const nativeToken = walletPortfolio.find(
    (token) =>
      chainNameToChainIdTokensData(token.blockchain) === chainId &&
      isNativeToken(token.contract)
  );
  return nativeToken ? String(nativeToken.balance) : undefined;
};

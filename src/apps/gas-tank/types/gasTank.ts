/**
 * Gas Tank transaction types and interfaces
 */

export type GasTankTransactionType = 'Deposit' | 'TransactionRepayment';

/**
 * Swap data interfaces
 */
export interface SwapAsset {
  id: number;
  symbol: string;
  decimals: number;
  logo?: string;
  name?: string;
}

export interface SwapTransactionData {
  id: string;
  amount_usd: number;
  amount: number;
  asset: SwapAsset;
}

/**
 * Raw transaction data from API
 */
export interface GasTankHistoryTransaction {
  id: string;
  timestamp: number | string;
  chainId: number;
  amount: string | number; // In USDC smallest units (wei-like format)
  transactionType: GasTankTransactionType;
  transactionHash?: string; // Transaction hash for block explorer link
  amountUsd?: string; // Only for Deposit transactions
  sender?: string;
  blockHash?: string;
  swap?: SwapTransactionData[];
  tokenLogo?: string;
}

/**
 * API response from getGasTankHistory endpoint
 */
export interface GasTankHistoryResponse {
  history: GasTankHistoryTransaction[];
}

/**
 * Processed transaction ready for display
 */
export interface ProcessedGasTankTransaction {
  id: string;
  timestamp: number;
  chainId: number;
  type: 'Top-up' | 'Spend';
  usdcAmount: string; // Formatted USDC amount (e.g., \"0.21\")
  displayAmount: string; // Display string (e.g., \"+0.09 USDC\" or \"-0.21 USDC (gas)\")
  transactionHash?: string; // Transaction hash for block explorer link
  tokenLogo?: string;
  tokenSymbol: string;
}

/**
 * Hook return type for useGasTankHistory
 */
export interface UseGasTankHistoryReturn {
  transactions: ProcessedGasTankTransaction[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

import { useState, useEffect } from 'react';
import { utils } from 'ethers';
import {
  GasTankHistoryTransaction,
  GasTankHistoryResponse,
  ProcessedGasTankTransaction,
  UseGasTankHistoryReturn,
} from '../types/gasTank';

/**
 * Hook for fetching and processing gas tank transaction history
 * Handles API calls, data transformation, and USDC amount conversion
 */
export const useGasTankHistory = (
  walletAddress: string | null
): UseGasTankHistoryReturn => {
  const [transactions, setTransactions] = useState<ProcessedGasTankTransaction[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchHistory = async () => {
    if (!walletAddress) {
      setTransactions([]);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const paymasterUrl = import.meta.env.VITE_PAYMASTER_URL;
      const response = await fetch(
        `${paymasterUrl}/getGasTankHistory?sender=${walletAddress}`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch gas tank history: ${response.status} ${response.statusText}`
        );
      }

      const data = (await response.json()) as GasTankHistoryResponse;
      const processed = processTransactions(data.history || []);

      // Sort by timestamp, newest first
      processed.sort((a, b) => b.timestamp - a.timestamp);

      setTransactions(processed);
    } catch (err) {
      console.error('Error fetching gas tank history:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error occurred';
      setError(new Error(errorMessage));
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Transform raw API transactions to display format
   * Handles both Deposit and TransactionRepayment types
   */
  const processTransactions = (
    rawTransactions: GasTankHistoryTransaction[]
  ): ProcessedGasTankTransaction[] => {
    return rawTransactions.map((tx) => {
      const timestamp = typeof tx.timestamp === 'string'
        ? parseInt(tx.timestamp, 10)
        : tx.timestamp;

      // Default values
      let type: 'Top-up' | 'Spend' = 'Spend';
      let usdcAmount = '0';
      let displayAmount = '$0.00';
      let tokenSymbol = 'USDC';
      let tokenLogo = tx.tokenLogo;

      // Extract details based on types and swap data
      if (tx.transactionType === 'Deposit') {
        type = 'Top-up';
        const amount = typeof tx.amount === 'string' ? parseFloat(tx.amount) : tx.amount;
        usdcAmount = amount.toFixed(2);
        displayAmount = `+$${amount.toFixed(2)}`;
      } else {
        type = 'Spend';
        const usdcDecimals = tx.chainId === 56 ? 18 : 6;
        const amountInWei = typeof tx.amount === 'string' ? tx.amount : tx.amount.toString();
        try {
          const rawAmount = utils.formatUnits(amountInWei, usdcDecimals);
          const amount = parseFloat(rawAmount);
          usdcAmount = amount.toFixed(2);
          displayAmount = amount > 0 ? `-$${amount.toFixed(2)}` : '-$0.00';
        } catch (err) {
          console.error(`Failed to convert amount for transaction ${tx.id}`, err);
        }
      }

      // Override with swap data if present
      if (tx.swap && tx.swap.length > 0) {
        const swapData = tx.swap[0];
        tokenSymbol = swapData.asset.symbol;
        if (swapData.asset.logo) {
          tokenLogo = swapData.asset.logo;
        }

        // Use swap amounts
        // amount is token amount
        usdcAmount = swapData.amount.toFixed(4); // Show more decimals for tokens which might be small
        
        // amount_usd is the dollar value
        const usdVal = swapData.amount_usd;
        const sign = type === 'Top-up' ? '+' : '-';
        displayAmount = `${sign}$${usdVal.toFixed(2)}`;
      }

      return {
        id: tx.id,
        timestamp,
        chainId: tx.chainId,
        type,
        usdcAmount,
        displayAmount,
        transactionHash: tx.transactionHash,
        tokenLogo,
        tokenSymbol,
      };
    });
  };

  // Fetch history on mount or when wallet address changes
  useEffect(() => {
    fetchHistory();
  }, [walletAddress]);

  return {
    transactions,
    isLoading,
    error,
    refetch: fetchHistory,
  };
};

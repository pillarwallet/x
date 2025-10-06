import { useState, useEffect, useCallback } from 'react';
import { useWalletAddress } from '@etherspot/transaction-kit';
import { logExchangeError } from '../utils/sentry';

interface ChainBalance {
  chainId: string;
  balance: string;
}

interface GasTankBalanceResponse {
  balance: {
    [chainId: string]: ChainBalance;
  };
}

interface UseGasTankBalanceReturn {
  totalBalance: number;
  chainBalances: ChainBalance[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

interface UseGasTankBalanceOptions {
  pauseAutoRefresh?: boolean;
}

const useGasTankBalance = (options: UseGasTankBalanceOptions = {}): UseGasTankBalanceReturn => {
  const { pauseAutoRefresh = false } = options;
  const walletAddress = useWalletAddress();
  const [totalBalance, setTotalBalance] = useState(0);
  const [chainBalances, setChainBalances] = useState<ChainBalance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const paymasterUrl = import.meta.env.VITE_PAYMASTER_URL;

  const fetchGasTankBalance = useCallback(async () => {
    if (!walletAddress) {
      setError(null);
      setTotalBalance(0);
      setChainBalances([]);
      return;
    }

    if (!paymasterUrl) {
      setError('Paymaster URL is not configured');
      setTotalBalance(0);
      setChainBalances([]);
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${paymasterUrl}/getGasTankBalance?sender=${walletAddress}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch gas tank balance: ${response.status}`);
      }

      const data: GasTankBalanceResponse = await response.json();

      // Extract chain balances
      const balances: ChainBalance[] = Object.values(data.balance || {});
      setChainBalances(balances);

      // Calculate total balance by summing all chain balances
      const total = balances.reduce((sum, chainBalance) => {
        const balance = parseFloat(chainBalance.balance) || 0;
        return sum + balance;
      }, 0);

      setTotalBalance(total);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      logExchangeError(errorMessage, { "error": err }, { component: 'useGasTankBalance', action: 'failed_to_fetch_gas_tank_balance' });
      console.error('Error fetching gas tank balance:', err);

      // Set default values on error
      setTotalBalance(0);
      setChainBalances([]);
    } finally {
      setIsLoading(false);
    }
  }, [walletAddress, paymasterUrl]);

  // Initial fetch and when wallet address changes
  useEffect(() => {
    fetchGasTankBalance();
  }, [fetchGasTankBalance]);

  // Auto-refresh disabled
  // useEffect(() => {
  //   if (!walletAddress || pauseAutoRefresh) return;

  //   const interval = setInterval(() => {
  //     fetchGasTankBalance();
  //   }, 30000); // 30 seconds

  //   // Cleanup interval on component unmount
  //   return () => clearInterval(interval);
  // }, [walletAddress, fetchGasTankBalance, pauseAutoRefresh]);

  return {
    totalBalance,
    chainBalances,
    isLoading,
    error,
    refetch: fetchGasTankBalance,
  };
};

export default useGasTankBalance;

import { useState, useEffect } from 'react';

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
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useGasTankBalance(
  walletAddress: string | null
): UseGasTankBalanceReturn {
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [chainBalances, setChainBalances] = useState<ChainBalance[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const paymasterUrl = import.meta.env.VITE_PAYMASTER_URL;

  const fetchGasTankBalance = async () => {
    if (!walletAddress || !paymasterUrl) {
      setTotalBalance(0);
      setChainBalances([]);
      setIsLoading(false);
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
        err instanceof Error ? err : new Error('Unknown error occurred');
      console.error('Error fetching gas tank balance:', errorMessage);
      setError(
        new Error(
          'Something went wrong while fetching gas tank balance. Please try again later'
        )
      );
      setTotalBalance(0);
      setChainBalances([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch when wallet address or paymaster URL changes
  useEffect(() => {
    fetchGasTankBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress, paymasterUrl]);

  // Polling: Refetch balance every 30 seconds
  useEffect(() => {
    if (!walletAddress || !paymasterUrl) return;

    const POLL_INTERVAL = 30000; // 30 seconds
    const intervalId = setInterval(() => {
      fetchGasTankBalance();
    }, POLL_INTERVAL);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress, paymasterUrl]);

  return {
    totalBalance,
    chainBalances,
    isLoading,
    error,
    refetch: fetchGasTankBalance,
  };
}

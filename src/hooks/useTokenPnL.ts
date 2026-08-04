import { useCallback, useEffect, useState } from 'react';
import { RelayRequest } from '../services/relayApi';
import { fetchRelayRequestByHash } from '../services/relayApiAsync';
import { PnLMetrics, WalletTransactionsMobulaResponse } from '../types/api';
import {
  calculatePnLFromRelay,
  calculatePnL as computePnLMetrics,
} from '../utils/pnl';

interface UseTokenPnLProps {
  token: {
    contract: string;
    symbol: string;
    decimals: number;
    balance?: number;
    price?: number;
  };
  transactionsData: WalletTransactionsMobulaResponse | undefined;
  walletAddress: string | undefined;
  chainId: number;
}

export interface TokenPnLResult {
  pnl: PnLMetrics | null;
  isLoading: boolean;
  refetch: () => void;
  debug: {
    mobulaTxCount: number;
    relayRequestCount: number;
    relayResponseCount: number;
    status: string;
  };
}

export const useTokenPnL = (props: UseTokenPnLProps | null): TokenPnLResult => {
  const [result, setResult] = useState<TokenPnLResult>({
    pnl: null,
    isLoading: false,
    refetch: () => {},
    debug: {
      mobulaTxCount: 0,
      relayRequestCount: 0,
      relayResponseCount: 0,
      status: 'Idle',
    },
  });

  const token = props?.token;
  const tokenContract = props?.token?.contract;
  const tokenSymbol = props?.token?.symbol;
  const tokenDecimals = props?.token?.decimals;
  const tokenBalance = props?.token?.balance;
  const tokenPrice = props?.token?.price;
  const transactionsData = props?.transactionsData;
  const transactions = transactionsData?.data?.transactions;
  const walletAddress = props?.walletAddress;
  const chainId = props?.chainId;

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refetch = useCallback(() => {
    setResult((prev) => ({ ...prev, isLoading: true }));
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    // Update refetch function in result
    setResult((prev) => ({ ...prev, refetch }));
  }, [refetch]);

  // Reset state when token changes
  useEffect(() => {
    if (tokenSymbol) {
      setResult((prev) => ({
        ...prev,
        pnl: null,
        isLoading: true,
        debug: { ...prev.debug, status: 'Resetting' },
      }));
    }
  }, [tokenSymbol]);

  useEffect(() => {
    // Early return if no token or wallet address
    if (!token || !walletAddress) {
      setResult((prev) => ({
        ...prev,
        pnl: null,
        isLoading: false,
        debug: {
          mobulaTxCount: 0,
          relayRequestCount: 0,
          relayResponseCount: 0,
          status: 'No Token',
        },
      }));
      return undefined;
    }

    // NEW: Skip PnL calculation for small balances (< $0.50)
    // This avoids "Suspiciously high execution price" warnings for dust
    const balanceUSD = (tokenPrice || 0) * (tokenBalance || 0);
    if (balanceUSD < 0.5) {
      setResult((prev) => ({
        ...prev,
        pnl: null,
        isLoading: false,
        debug: { ...prev.debug, status: 'Skipped - Small Balance' },
      }));
      return undefined;
    }

    let isMounted = true;

    const calculatePnL = async (): Promise<void> => {
      // Skip if no data
      if (!transactions || !walletAddress) {
        if (isMounted)
          setResult((prev) => ({
            ...prev,
            isLoading: false,
            debug: { ...prev.debug, status: 'No Data' },
          }));
        return;
      }

      if (isMounted)
        setResult((prev) => ({
          ...prev,
          isLoading: true,
          debug: { ...prev.debug, status: 'Starting' },
        }));

      // Ensure minimum loading duration for better UX (skeleton animation visibility)
      const startTime = Date.now();
      const minLoadingDuration = 100; // ms

      const waitMinDuration = async () => {
        const elapsed = Date.now() - startTime;
        const remainingDelay = Math.max(0, minLoadingDuration - elapsed);
        if (remainingDelay > 0) {
          await new Promise((resolve) => {
            setTimeout(resolve, remainingDelay);
          });
        }
      };

      // Starting PnL calculation

      try {
        // Find relevant transaction hashes for this token
        const relevantHashes: string[] = [];
        const contractAddress = tokenContract?.toLowerCase() || '';

        transactions.forEach((tx) => {
          const txContract =
            (tx.asset.contracts && tx.asset.contracts[0]) || tx.asset.contract;

          if (txContract && txContract.toLowerCase() === contractAddress) {
            relevantHashes.push(tx.hash);
          }
        });

        if (isMounted)
          setResult((prev) => ({
            ...prev,
            debug: { ...prev.debug, mobulaTxCount: relevantHashes.length },
          }));

        if (relevantHashes.length === 0) {
          await waitMinDuration();
          if (isMounted)
            setResult((prev) => ({
              ...prev,
              isLoading: false,
              debug: { ...prev.debug, status: 'No Mobula Txs' },
            }));
          return;
        }

        // Fetch Relay data for these hashes (limit to first 20 to avoid too many requests)
        const relayRequests: RelayRequest[] = [];
        const hashesToFetch = relevantHashes.slice(0, 20);

        if (isMounted)
          setResult((prev) => ({
            ...prev,
            debug: {
              ...prev.debug,
              relayRequestCount: hashesToFetch.length,
              status: 'Fetching Relay',
            },
          }));

        const relayResults = await Promise.all(
          hashesToFetch.map(async (hash) => {
            try {
              const relayRequest = await fetchRelayRequestByHash(hash);
              return relayRequest;
            } catch (e) {
              console.error(`Failed to fetch Relay for ${hash}:`, e);
              return null;
            }
          })
        );

        if (!isMounted) return;

        relayRequests.push(
          ...relayResults.filter((req): req is RelayRequest => req !== null)
        );

        if (!isMounted) return;

        if (isMounted)
          setResult((prev) => ({
            ...prev,
            debug: { ...prev.debug, relayResponseCount: relayRequests.length },
          }));

        if (relayRequests.length === 0) {
          await waitMinDuration();
          if (isMounted)
            setResult((prev) => ({
              ...prev,
              isLoading: false,
              debug: { ...prev.debug, status: 'No Relay Data' },
            }));
          return;
        }

        // Calculate PnL from Relay data
        const trades = calculatePnLFromRelay(relayRequests, {
          address: tokenContract || '',
          symbol: tokenSymbol || '',
          decimals: tokenDecimals || 18,
          chainId: chainId!,
          price: tokenPrice,
        });

        if (trades.length === 0) {
          await waitMinDuration();
          if (isMounted)
            setResult((prev) => ({
              ...prev,
              isLoading: false,
              debug: { ...prev.debug, status: 'No Trades Reconstructed' },
            }));
        } else {
          const pnlMetrics = computePnLMetrics(trades, tokenPrice || 0);

          // Check if PnL calculation returned null (e.g., no BUY transactions)
          if (!pnlMetrics) {
            await waitMinDuration();
            if (isMounted) {
              setResult((prev) => ({
                ...prev,
                pnl: null,
                isLoading: false,
                debug: { ...prev.debug, status: 'No Valid PnL (No Buys)' },
              }));
            }
            return;
          }

          // Override balanceToken with actual wallet balance if available
          // This ensures the displayed balance matches the actual wallet balance
          // even if trades haven't been fully captured or processed yet
          const actualBalanceToken =
            tokenBalance !== undefined ? tokenBalance : pnlMetrics.balanceToken;
          const actualBalanceUSDC = actualBalanceToken * (tokenPrice || 0);

          // Recalculate unrealised PnL using actual balance and cost basis from trades
          // The cost basis is calculated from trades: costBasis = currentValue - unrealisedPnL
          // We keep the cost basis the same (based on trades) and only adjust the current value
          const costBasisUSDC =
            pnlMetrics.balanceUSDC - pnlMetrics.unrealisedPnLUSDC;
          const actualUnrealisedPnLUSDC = actualBalanceUSDC - costBasisUSDC;
          const actualUnrealisedPnLPct =
            costBasisUSDC > 0
              ? (actualUnrealisedPnLUSDC / costBasisUSDC) * 100
              : 0;

          const adjustedPnLMetrics = {
            ...pnlMetrics,
            balanceToken: actualBalanceToken,
            balanceUSDC: actualBalanceUSDC,
            unrealisedPnLUSDC: actualUnrealisedPnLUSDC,
            unrealisedPnLPct: actualUnrealisedPnLPct,
          };

          await waitMinDuration();

          if (isMounted) {
            // PnL calculation complete
            setResult((prev) => ({
              ...prev,
              pnl: adjustedPnLMetrics,
              isLoading: false,
              debug: { ...prev.debug, status: 'Complete' },
            }));
          }
        }
      } catch (error) {
        console.error(`Error calculating PnL for ${tokenSymbol}:`, error);
        await waitMinDuration();
        if (isMounted)
          setResult((prev) => ({
            ...prev,
            isLoading: false,
            debug: { ...prev.debug, status: 'Error' },
          }));
      }
    };

    calculatePnL();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // Use specific dependencies to avoid infinite loops from unstable props object
    // token, // Removed to avoid infinite loop as it's a new object on every render
    tokenContract,
    tokenSymbol,
    tokenDecimals,
    tokenBalance,
    tokenPrice,
    // Use transactionsData instead of transactions to ensure we detect changes
    // even if RTK Query returns the same array reference
    transactionsData,
    walletAddress,
    chainId,
    refreshTrigger,
  ]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!props) return undefined;

    const interval = setInterval(() => {
      setResult((prev) => ({ ...prev, isLoading: true }));
      setRefreshTrigger((prev) => prev + 1);
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenSymbol, walletAddress, chainId]);

  return result;
};

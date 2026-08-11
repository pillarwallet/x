/**
 * Hook for fetching and managing trading signals
 */

import { useCallback, useEffect, useState } from 'react';
import { getTradingSignals } from '../api/insightsApi';
import type { TradingSignal } from '../types';

interface UseTradingSignalsOptions {
  enabled?: boolean;
}

export const useTradingSignals = (options: UseTradingSignalsOptions = {}) => {
  const { enabled = true } = options;
  const [signals, setSignals] = useState<TradingSignal[]>([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<Error | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const fetchSignals = useCallback(async (isRefresh = false) => {
    if (!enabled) {
      return;
    }

    try {
      // Only set loading to true on initial load, not on refreshes
      if (!isRefresh) {
        setLoading(true);
      }

      const result = await getTradingSignals();
      console.log('🔍 [useTradingSignals] API response:', result);

      if (result.error) {
        throw result.error;
      }

      // Firebase function returns { signals: [...] }
      const signalsArray = (result.signals || result.data || []) as TradingSignal[];
      console.log(`✅ [useTradingSignals] Loaded ${signalsArray.length} signals:`, signalsArray);

      // Log first signal structure for debugging
      if (signalsArray.length > 0) {
        const firstSignal = signalsArray[0];
        console.log('📊 [useTradingSignals] First signal structure:', {
          id: firstSignal.id,
          ticker: firstSignal.ticker,
          status: firstSignal.status,
          profit_loss_percent: firstSignal.profit_loss_percent,
          realized_pnl_percent: firstSignal.realized_pnl_percent,
          current_price: firstSignal.current_price,
          entry_price: firstSignal.entry_price,
        });
      }

      setSignals(signalsArray);
      setError(null);

      // Mark initial load as complete
      if (isInitialLoad) {
        setIsInitialLoad(false);
      }
    } catch (err) {
      console.error('❌ [useTradingSignals] Error fetching signals:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch signals'));
      setSignals([]); // Clear signals on error
    } finally {
      setLoading(false);
    }
  }, [enabled, isInitialLoad]);

  useEffect(() => {
    if (!enabled) {
      setSignals([]);
      setLoading(false);
      setError(null);
      return undefined;
    }

    fetchSignals(false); // Initial load

    // Poll for updates every 30 seconds instead of realtime subscription
    const interval = setInterval(() => {
      fetchSignals(true); // Refresh - don't trigger loading state
    }, 30000);

    return () => clearInterval(interval);
  }, [enabled, fetchSignals]);

  return {
    signals,
    loading,
    error,
    refetch: fetchSignals,
    setSignals, // Allow manual updates
  };
};


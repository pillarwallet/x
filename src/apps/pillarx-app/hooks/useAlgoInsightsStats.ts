import { useMemo } from 'react';
import { useTradingSignals } from '../../insights/hooks/useTradingSignals';
import { TradingSignal as InsightSignal } from '../../insights/types';

export interface AlgoInsightsStats {
  pnl1m: number;
  pnl3m: number;
  pnl6m: number;
  riskLevel: string;
  pnlStatus: {
    winning: number;
    losing: number;
    neutral: number;
  };
  cumulativePnl: {
    '1w': { value: number; history: { timestamp: number; value: number }[] };
    '1m': { value: number; history: { timestamp: number; value: number }[] };
    '3m': { value: number; history: { timestamp: number; value: number }[] };
    '6m': { value: number; history: { timestamp: number; value: number }[] };
  };
}

export const useAlgoInsightsStats = () => {
  const { signals, loading } = useTradingSignals({ enabled: true });

  const stats = useMemo<AlgoInsightsStats | null>(() => {
    if (loading || signals.length === 0) return null;

    // Helper to calculate PnL for a set of signals
    const calculatePnL = (filterFn: (s: InsightSignal) => boolean) => {
      return signals
        .filter(filterFn)
        .reduce((sum, s) => sum + (s.realized_pnl_percent || 0), 0);
    };

    const now = Date.now();
    const oneMonthAgo = now - 30 * 24 * 60 * 60 * 1000;
    const threeMonthsAgo = now - 90 * 24 * 60 * 60 * 1000;
    const sixMonthsAgo = now - 180 * 24 * 60 * 60 * 1000;

    // PnL metrics
    const pnl1m = calculatePnL((s) => {
      const closedAt = s.closed_at ? new Date(s.closed_at).getTime() : 0;
      return closedAt > oneMonthAgo;
    });

    const pnl3m = calculatePnL((s) => {
      const closedAt = s.closed_at ? new Date(s.closed_at).getTime() : 0;
      return closedAt > threeMonthsAgo;
    });

    const pnl6m = calculatePnL((s) => {
      const closedAt = s.closed_at ? new Date(s.closed_at).getTime() : 0;
      return closedAt > sixMonthsAgo;
    });

    // PnL Status (Winning/Losing/Neutral)
    const closedSignals = signals.filter(
      (s) =>
        s.status === 'closed' ||
        s.status === 'completed' ||
        s.status === 'stopped'
    );
    const totalClosed = closedSignals.length;

    let winning = 0;
    let losing = 0;
    let neutral = 0;

    if (totalClosed > 0) {
      winning =
        (closedSignals.filter((s) => (s.realized_pnl_percent || 0) > 0).length /
          totalClosed) *
        100;
      losing =
        (closedSignals.filter((s) => (s.realized_pnl_percent || 0) < 0).length /
          totalClosed) *
        100;
      neutral =
        (closedSignals.filter((s) => (s.realized_pnl_percent || 0) === 0)
          .length /
          totalClosed) *
        100;
    }

    // Cumulative PnL History Generation
    const generateHistory = (cutoffTime: number) => {
      // Sort signals by close time
      const relevantSignals = signals
        .filter(
          (s) => s.closed_at && new Date(s.closed_at).getTime() > cutoffTime
        )
        .sort(
          (a, b) =>
            new Date(a.closed_at!).getTime() - new Date(b.closed_at!).getTime()
        );

      let runningPnL = 0;
      const history = relevantSignals.map((s) => {
        runningPnL += s.realized_pnl_percent || 0;
        return {
          timestamp: new Date(s.closed_at!).getTime() / 1000,
          value: runningPnL,
        };
      });

      // Ensure we have a starting point? Or just the trade history.
      // If history is empty, return empty array
      return history;
    };

    // For cumulative values in the object, we use the specific period totals calculated above
    // but the history needs to be generated point-by-point.

    return {
      pnl1m: Number(pnl1m.toFixed(2)),
      pnl3m: Number(pnl3m.toFixed(2)),
      pnl6m: Number(pnl6m.toFixed(2)),
      riskLevel: 'Low Risk', // Placeholder logic
      pnlStatus: {
        winning: Number(winning.toFixed(1)),
        losing: Number(losing.toFixed(1)),
        neutral: Number(neutral.toFixed(1)),
      },
      cumulativePnl: {
        '1w': {
          value: Number(
            calculatePnL((s) =>
              s.closed_at
                ? new Date(s.closed_at).getTime() >
                  now - 7 * 24 * 60 * 60 * 1000
                : false
            ).toFixed(2)
          ),
          history: generateHistory(now - 7 * 24 * 60 * 60 * 1000),
        },
        '1m': {
          value: Number(pnl1m.toFixed(2)),
          history: generateHistory(oneMonthAgo),
        },
        '3m': {
          value: Number(pnl3m.toFixed(2)),
          history: generateHistory(threeMonthsAgo),
        },
        '6m': {
          value: Number(pnl6m.toFixed(2)),
          history: generateHistory(sixMonthsAgo),
        },
      },
    };
  }, [signals, loading]);

  return { stats, loading };
};

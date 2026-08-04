import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import {
  TrendingUp,
  TrendingDown,
  Target,
  Shield,
  Trophy,
  RefreshCw,
} from 'lucide-react';
import {
  getUserState,
  getOpenOrders,
  getMarkPrice,
} from '../lib/hyperliquid/client';
import {
  parsePositionForSymbol,
  parseReduceOnlyOrders,
} from '../lib/hyperliquid/parsers';
import { computePnl, formatPrice, formatPnl } from '../lib/hyperliquid/pnl';
import { cn } from '../lib/utils';

interface PositionCardProps {
  symbol: string;
  address?: `0x${string}` | string;
}

export function PositionCard({ symbol, address }: PositionCardProps) {
  const [loading, setLoading] = useState(false);
  const [side, setSide] = useState<'long' | 'short' | null>(null);
  const [size, setSize] = useState(0);
  const [entryPx, setEntryPx] = useState(0);
  const [markPx, setMarkPx] = useState(0);
  const [stopLoss, setStopLoss] = useState<number | undefined>();
  const [takeProfits, setTakeProfits] = useState<number[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    if (!address || !symbol) return;

    let alive = true;

    async function load() {
      try {
        setLoading(true);

        const [state, orders, mark] = await Promise.all([
          getUserState(address as string),
          getOpenOrders(address as string, symbol),
          getMarkPrice(symbol),
        ]);

        if (!alive) return;

        // Parse position for the symbol
        const pos = state ? parsePositionForSymbol(state, symbol) : null;

        if (pos) {
          setSide(pos.side);
          setSize(pos.size);
          setEntryPx(pos.entryPx);

          // Parse SL/TP from reduce-only orders
          const { sl, tps } = parseReduceOnlyOrders(
            orders,
            symbol,
            pos.side,
            pos.entryPx
          );
          setStopLoss(sl);
          setTakeProfits(tps);
        } else {
          setSide(null);
          setSize(0);
          setEntryPx(0);
          setStopLoss(undefined);
          setTakeProfits([]);
        }

        setMarkPx(mark ?? 0);
        setLastUpdate(new Date());
      } catch (error) {
        console.error('Error loading position:', error);
      } finally {
        setLoading(false);
      }
    }

    load();
    const id = setInterval(load, 2000);

    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [address, symbol]);

  const pnl = useMemo(() => {
    if (!side || !size || !entryPx || !markPx) {
      return { pnlUsd: 0, pnlPct: 0 };
    }
    return computePnl(side, size, entryPx, markPx);
  }, [side, size, entryPx, markPx]);

  if (!address) {
    return null;
  }

  if (!side) {
    return (
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            <span>Position: {symbol}</span>
            <Badge variant="outline" className="text-muted-foreground">
              No Position
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            No open {symbol} position
          </div>
        </CardContent>
      </Card>
    );
  }

  const isProfitable = pnl.pnlUsd > 0;
  const isLong = side === 'long';

  return (
    <Card className="shadow-card border-2 hover:border-primary/30 transition-colors">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            Position: {symbol}
            <Badge
              variant="outline"
              className={cn(
                isLong
                  ? 'text-success border-success'
                  : 'text-destructive border-destructive'
              )}
            >
              {isLong ? (
                <>
                  <TrendingUp className="h-3 w-3 mr-1" />
                  LONG
                </>
              ) : (
                <>
                  <TrendingDown className="h-3 w-3 mr-1" />
                  SHORT
                </>
              )}
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <RefreshCw className={cn('h-3 w-3', loading && 'animate-spin')} />
            {lastUpdate && <span>{lastUpdate.toLocaleTimeString()}</span>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Size and Prices */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-secondary/50 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Size</p>
            <p className="font-mono-numbers font-semibold">
              {formatPrice(size, 4)}
            </p>
          </div>
          <div className="p-3 bg-secondary/50 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Entry Price</p>
            <p className="font-mono-numbers font-semibold">
              ${formatPrice(entryPx, 2)}
            </p>
          </div>
        </div>

        {/* Mark Price */}
        <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
          <p className="text-xs text-muted-foreground mb-1">
            Current Mark Price
          </p>
          <p className="font-mono-numbers font-semibold text-lg">
            ${formatPrice(markPx, 2)}
          </p>
        </div>

        {/* PnL */}
        <div
          className={cn(
            'p-4 rounded-lg border-2',
            isProfitable
              ? 'bg-success/10 border-success/30'
              : 'bg-destructive/10 border-destructive/30'
          )}
        >
          <p className="text-xs text-muted-foreground mb-2">Unrealized PnL</p>
          <div className="flex items-baseline gap-3">
            <p
              className={cn(
                'font-mono-numbers font-bold text-2xl',
                isProfitable ? 'text-success' : 'text-destructive'
              )}
            >
              {formatPnl(pnl.pnlUsd)}
            </p>
            <p
              className={cn(
                'font-mono-numbers font-semibold text-lg',
                isProfitable ? 'text-success' : 'text-destructive'
              )}
            >
              ({formatPnl(pnl.pnlPct, true)})
            </p>
          </div>
        </div>

        {/* SL and TP */}
        <div className="space-y-2">
          {stopLoss && (
            <div className="flex items-center gap-3 p-3 bg-destructive/10 rounded-lg">
              <div className="p-2 bg-destructive/20 rounded">
                <Shield className="h-4 w-4 text-destructive" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Stop Loss</p>
                <p className="font-mono-numbers font-semibold text-destructive">
                  ${formatPrice(stopLoss, 2)}
                </p>
              </div>
            </div>
          )}

          {takeProfits.length > 0 && (
            <div className="flex items-start gap-3 p-3 bg-success/10 rounded-lg">
              <div className="p-2 bg-success/20 rounded">
                <Trophy className="h-4 w-4 text-success" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">
                  Take Profit Targets
                </p>
                <div className="flex flex-wrap gap-2">
                  {takeProfits.map((tp, idx) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="text-success border-success font-mono-numbers"
                    >
                      ${formatPrice(tp, 2)}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!stopLoss && takeProfits.length === 0 && (
            <div className="text-center py-3 text-sm text-muted-foreground">
              No SL/TP orders detected
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

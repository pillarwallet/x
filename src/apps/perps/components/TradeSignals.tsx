import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Copy, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from './ui/skeleton';

interface TradeSignal {
  symbol: string;
  side: 'long' | 'short';
  entry: number | [number, number];
  stopLoss: number;
  takeProfits: number[];
  timestamp?: string;
}

interface TradeSignalsProps {
  onCopySignal: (signal: TradeSignal) => void;
}

export function TradeSignals({ onCopySignal }: TradeSignalsProps) {
  const [signals, setSignals] = useState<TradeSignal[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadSignals();
  }, []);

  const loadSignals = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with your own trade signals API endpoint
      // const response = await fetch('YOUR_API_ENDPOINT_HERE');

      // For now, return empty signals
      console.warn('Trade signals API not configured');
      setSignals([]);
    } catch (error: any) {
      console.error('Failed to load signals:', error);
      toast.error('Failed to load trade signals');
      setSignals([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopySignal = (signal: TradeSignal) => {
    onCopySignal(signal);
    toast.success('Signal copied to trade form!', {
      description: `${signal.side.toUpperCase()} ${signal.symbol}`,
    });
  };

  const getEntryDisplay = (entry: number | [number, number]) => {
    if (Array.isArray(entry)) {
      return `${entry[0]} - ${entry[1]}`;
    }
    return entry.toFixed(2);
  };

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-8 w-20" />
          </div>
          <Skeleton className="h-48 w-full" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Trade Signals</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={loadSignals}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
            />
            Refresh
          </Button>
        </div>

        <ScrollArea className="h-96">
          <div className="space-y-3">
            {signals.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No trade signals available
              </div>
            ) : (
              signals.map((signal, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg bg-card hover:bg-accent/5 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`p-1.5 rounded ${
                          signal.side === 'long'
                            ? 'bg-success/10 text-success'
                            : 'bg-destructive/10 text-destructive'
                        }`}
                      >
                        {signal.side === 'long' ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold">{signal.symbol}</h4>
                        <Badge
                          variant={
                            signal.side === 'long' ? 'default' : 'destructive'
                          }
                          className="text-xs"
                        >
                          {signal.side.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopySignal(signal)}
                      className="gap-2"
                    >
                      <Copy className="h-3 w-3" />
                      Copy
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Entry:</span>
                      <span className="ml-2 font-mono font-semibold">
                        {getEntryDisplay(signal.entry)}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Stop Loss:</span>
                      <span className="ml-2 font-mono font-semibold text-destructive">
                        {signal.stopLoss.toFixed(2)}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">
                        Take Profits:
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {signal.takeProfits.map((tp, tpIndex) => (
                          <Badge
                            key={tpIndex}
                            variant="secondary"
                            className="font-mono text-xs"
                          >
                            {tp.toFixed(2)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {signal.timestamp && (
                    <div className="text-xs text-muted-foreground mt-2">
                      {new Date(signal.timestamp).toLocaleString()}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
}

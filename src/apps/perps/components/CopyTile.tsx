import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { TrendingUp, TrendingDown, Target, Shield, Trophy } from 'lucide-react';
import type { CopyTile as CopyTileType } from '../lib/hyperliquid/types';
import { getEntryPrice } from '../lib/hyperliquid/math';

interface CopyTileProps {
  tile: CopyTileType;
  onExecute: () => void;
  isExecuting: boolean;
  disabled: boolean;
}

export function CopyTile({
  tile,
  onExecute,
  isExecuting,
  disabled,
}: CopyTileProps) {
  const entryPrice = getEntryPrice(tile.entry);
  const isLong = tile.side === 'long';

  const formatPrice = (price: number | number[]) => {
    if (Array.isArray(price)) {
      return `$${price[0]} - $${price[1]}`;
    }
    return `$${price}`;
  };

  const formatTakeProfits = () => {
    if (typeof tile.takeProfits === 'number') {
      return `$${tile.takeProfits}`;
    }
    if (tile.takeProfits.length === 2 && !Array.isArray(tile.takeProfits[0])) {
      return `$${tile.takeProfits[0]} - $${tile.takeProfits[1]}`;
    }
    return tile.takeProfits.map((tp) => `$${tp}`).join(', ');
  };

  return (
    <Card className="shadow-card border-2 hover:border-primary/50 transition-colors">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              {tile.symbol}
              <Badge
                variant="outline"
                className={
                  isLong
                    ? 'text-success border-success'
                    : 'text-destructive border-destructive'
                }
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
            <CardDescription>
              Copy Trade • $10 Notional • 5× Leverage
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
            <div className="p-2 bg-primary/10 rounded">
              <Target className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Entry</p>
              <p className="font-mono-numbers font-semibold">
                {formatPrice(tile.entry)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-destructive/10 rounded-lg">
            <div className="p-2 bg-destructive/20 rounded">
              <Shield className="h-4 w-4 text-destructive" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Stop Loss</p>
              <p className="font-mono-numbers font-semibold text-destructive">
                ${tile.stopLoss}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-success/10 rounded-lg">
            <div className="p-2 bg-success/20 rounded">
              <Trophy className="h-4 w-4 text-success" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Take Profits</p>
              <p className="font-mono-numbers font-semibold text-success">
                {formatTakeProfits()}
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={onExecute}
          disabled={disabled || isExecuting}
          className="w-full gradient-primary shadow-glow"
          size="lg"
        >
          {isExecuting ? 'Executing...' : 'Execute Copy Trade'}
        </Button>

        {disabled && (
          <p className="text-xs text-center text-muted-foreground">
            Connect wallet and setup Hyperliquid to trade
          </p>
        )}
      </CardContent>
    </Card>
  );
}

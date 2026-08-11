import { useState } from 'react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { ClipboardPaste } from 'lucide-react';
import { toast } from 'sonner';

interface StrategyPayload {
  orderSide: 'buy' | 'sell';
  ticker: string;
  exchange: string;
  entryPrice: number;
  stopLoss: number;
  tp1?: number;
  tp2?: number;
  tp3?: number;
  tp4?: number;
  tp5?: number;
}

interface ParsedStrategy {
  ticker: string;
  side: 'long' | 'short';
  entryPrice: number;
  stopLoss: number;
  takeProfits: string;
}

interface PasteStrategyButtonProps {
  onStrategyPasted: (strategy: ParsedStrategy) => void;
}

export function PasteStrategyButton({
  onStrategyPasted,
}: PasteStrategyButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [jsonInput, setJsonInput] = useState('');

  const parseStrategy = (json: string): ParsedStrategy | null => {
    try {
      const payload: StrategyPayload = JSON.parse(json);

      // Validate required fields
      if (!payload.ticker || !payload.orderSide || !payload.entryPrice) {
        toast.error('Invalid strategy payload', {
          description:
            'Missing required fields: ticker, orderSide, or entryPrice',
        });
        return null;
      }

      // Extract ticker symbol (remove USDT.P suffix)
      const ticker = payload.ticker.replace(/USDT\.P$/i, '');

      // Convert orderSide to long/short
      const side = payload.orderSide === 'buy' ? 'long' : 'short';

      // Collect take profits (tp1, tp2, tp3)
      const tps: number[] = [];
      if (payload.tp1) tps.push(payload.tp1);
      if (payload.tp2) tps.push(payload.tp2);
      if (payload.tp3) tps.push(payload.tp3);

      return {
        ticker,
        side,
        entryPrice: payload.entryPrice,
        stopLoss: payload.stopLoss,
        takeProfits: tps.join(', '),
      };
    } catch (error) {
      toast.error('Invalid JSON', {
        description: 'Please paste a valid JSON strategy payload',
      });
      return null;
    }
  };

  const handlePaste = () => {
    const strategy = parseStrategy(jsonInput);
    if (strategy) {
      onStrategyPasted(strategy);
      setIsOpen(false);
      setJsonInput('');
      toast.success('Strategy loaded!', {
        description: `${strategy.side.toUpperCase()} ${strategy.ticker} @ $${strategy.entryPrice}`,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <ClipboardPaste className="h-4 w-4" />
          Paste Strategy
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Paste Trading Strategy</DialogTitle>
          <DialogDescription>
            Paste your JSON strategy payload to auto-populate the trade form
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="strategy-json">Strategy JSON</Label>
            <Textarea
              id="strategy-json"
              placeholder={`{\n  "orderSide": "sell",\n  "ticker": "UNIUSDT.P",\n  "exchange": "BINANCE",\n  "entryPrice": 5.762,\n  "stopLoss": 6.037,\n  "tp1": 5.487,\n  "tp2": 5.212,\n  "tp3": 4.937\n}`}
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="font-mono text-xs min-h-[200px]"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePaste}>Load Strategy</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

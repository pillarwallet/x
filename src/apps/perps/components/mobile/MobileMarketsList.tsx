import { Search, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface Market {
  coin: string;
  coinIcon?: string;
  price: string;
  maxLeverage: number;
  volume: string;
  change: string;
  changePercent: string;
}

interface MobileMarketsListProps {
  markets: Market[];
  onMarketSelect?: (coin: string) => void;
}

export function MobileMarketsList({
  markets,
  onMarketSelect,
}: MobileMarketsListProps) {
  return (
    <div className="bg-white rounded-t-3xl p-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          Markets
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </h2>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full bg-gray-100"
          >
            <Search className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            className="h-9 px-3 rounded-full bg-gray-100 text-sm"
          >
            By Price
            <ChevronDown className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Markets List */}
      <div className="space-y-3">
        {markets.map((market) => (
          <button
            key={market.coin}
            onClick={() => onMarketSelect?.(market.coin)}
            className="w-full flex items-center justify-between py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
          >
            {/* Left: Icon and Info */}
            <div className="flex items-center gap-3">
              {/* Coin Icon */}
              <div
                className={`h-12 w-12 rounded-full flex items-center justify-center ${getCoinColor(market.coin)}`}
              >
                <span className="text-white font-bold">
                  {getCoinInitial(market.coin)}
                </span>
              </div>

              {/* Coin Info */}
              <div className="text-left">
                <p className="font-semibold text-base">{market.coin}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="uppercase">Up to {market.maxLeverage}x</span>
                  <span>•</span>
                  <span className="uppercase">Vol {market.volume}</span>
                </div>
              </div>
            </div>

            {/* Right: Price and Change */}
            <div className="text-right">
              <p className="font-semibold text-base">${market.price}</p>
              <p
                className={`text-sm font-medium ${market.change.startsWith('-')
                    ? 'text-red-500'
                    : 'text-green-500'
                  }`}
              >
                {market.changePercent}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function getCoinColor(coin: string): string {
  const colors: Record<string, string> = {
    BTC: 'bg-orange-500',
    ETH: 'bg-gray-800',
    XYZ100: 'bg-gray-600',
    PAXG: 'bg-yellow-500',
    GOLD: 'bg-blue-600',
    ZEC: 'bg-yellow-600',
  };
  return colors[coin] || 'bg-gray-500';
}

function getCoinInitial(coin: string): string {
  if (coin === 'XYZ100') return '100';
  return coin.charAt(0);
}

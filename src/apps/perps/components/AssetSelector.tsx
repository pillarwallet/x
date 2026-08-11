import { useState, useMemo } from 'react';
import { Search, ArrowUpDown } from 'lucide-react';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { AssetInfo, EnhancedAsset } from '../lib/hyperliquid/types';
import { Skeleton } from './ui/skeleton';
import { TokenIcon } from './TokenIcon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface AssetSelectorProps {
  selectedSymbol: string | null;
  onSelect: (symbol: string, asset: AssetInfo) => void;
  assets: EnhancedAsset[];
}

type SortBy = 'price' | 'volume' | 'change';

export function AssetSelector({
  selectedSymbol,
  onSelect,
  assets,
}: AssetSelectorProps) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('volume');

  // Loading state is now determined by whether assets array is empty
  const isLoading = assets.length === 0;

  const filteredAndSortedAssets = useMemo(() => {
    let filtered = assets;

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = assets.filter((asset) =>
        asset.symbol.toLowerCase().includes(searchLower)
      );
    }

    // Sort
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return b.price - a.price;
        case 'volume':
          return b.volume - a.volume;
        case 'change':
          return b.priceChangePercent - a.priceChangePercent;
        default:
          return 0;
      }
    });
  }, [assets, search, sortBy]);

  const formatPrice = (price: number): string => {
    if (price >= 1000) {
      return price.toLocaleString('en-US', { maximumFractionDigits: 0 });
    }
    return price.toFixed(2);
  };

  const formatVolume = (volume: number): string => {
    if (volume >= 1e9) {
      return `$${(volume / 1e9).toFixed(1)}B`;
    }
    if (volume >= 1e6) {
      return `$${(volume / 1e6).toFixed(1)}M`;
    }
    if (volume >= 1e3) {
      return `$${(volume / 1e3).toFixed(1)}K`;
    }
    return `$${volume.toFixed(0)}`;
  };

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="pt-2 px-4 pb-4">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search assets (e.g., BTC, ETH)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" title="Sort assets">
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortBy('price')}>
                Sort by Price
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('volume')}>
                Sort by Volume
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('change')}>
                Sort by Change %
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <ScrollArea className="h-[500px]">
          <div className="space-y-1">
            {filteredAndSortedAssets.map((asset) => {
              const isPositive = asset.priceChangePercent >= 0;

              return (
                <button
                  key={asset.symbol}
                  onClick={() => onSelect(asset.symbol, asset)}
                  className={`w-full text-left px-3 py-2.5 rounded-md transition-colors ${selectedSymbol === asset.symbol
                    ? 'bg-secondary'
                    : 'hover:bg-secondary/50'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Token Logo */}
                    <TokenIcon
                      symbol={asset.symbol}
                      size={32}
                      className="flex-shrink-0"
                    />

                    {/* Token Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center mb-0.5">
                        <span className="font-semibold">{asset.symbol}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Vol {formatVolume(asset.volume)}</span>
                        <span>{asset.maxLeverage}x max</span>
                      </div>
                    </div>

                    {/* Price & Change */}
                    <div className="text-right flex-shrink-0">
                      <div className="font-semibold">
                        ${formatPrice(asset.price)}
                      </div>
                      <div
                        className={`text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}
                      >
                        {isPositive ? '+' : ''}
                        {asset.priceChangePercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
            {filteredAndSortedAssets.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No assets found
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
}

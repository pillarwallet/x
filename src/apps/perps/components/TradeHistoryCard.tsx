import { useState, useEffect, useCallback } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { Button } from '../components/ui/button';
import { RefreshCw } from 'lucide-react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '../components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { getUserFills } from '../lib/hyperliquid/client';
import { TokenIcon } from './TokenIcon';
import { formatDistanceToNow } from 'date-fns';

interface TradeHistoryCardProps {
    masterAddress: string;
}

interface Trade {
    coin: string;
    side: string;
    px: string;
    sz: string;
    time: number;
    closedPnl?: string;
    fee?: string;
    hash?: string;
    tid?: number;
}

export function TradeHistoryCard({ masterAddress }: TradeHistoryCardProps) {
    const [trades, setTrades] = useState<Trade[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [showAllHistory, setShowAllHistory] = useState(false);

    const fetchTrades = useCallback(async () => {
        if (!masterAddress) return;

        console.log('[TradeHistory] Fetching trades for address:', masterAddress);
        setIsLoading(true);
        try {
            const fills = await getUserFills(masterAddress);
            console.log('[TradeHistory] Raw fills from API:', fills);
            console.log('[TradeHistory] Number of fills:', fills?.length || 0);

            // Process and sort trades by time (most recent first)
            const processedTrades = fills
                .map((fill: any) => ({
                    coin: fill.coin,
                    side: fill.side,
                    px: fill.px,
                    sz: fill.sz,
                    time: fill.time,
                    closedPnl: fill.closedPnl,
                    fee: fill.fee,
                    hash: fill.hash,
                    tid: fill.tid,
                }))
                .sort((a: Trade, b: Trade) => b.time - a.time);

            console.log('[TradeHistory] Processed trades:', processedTrades);
            console.log('[TradeHistory] Number of processed trades:', processedTrades.length);
            setTrades(processedTrades);
        } catch (error) {
            console.error('Error fetching trades:', error);
        } finally {
            setIsLoading(false);
        }
    }, [masterAddress]);

    useEffect(() => {
        if (!isOpen) return;

        fetchTrades();
        const interval = setInterval(fetchTrades, 10000);
        return () => clearInterval(interval);
    }, [fetchTrades, isOpen]);

    // Removed auto-collapse/expand logic to rely on manual user control

    const formatNumber = (value: string | number, decimals: number = 2): string => {
        if (!value) return '-';
        return parseFloat(value.toString()).toFixed(decimals);
    };

    const formatPrice = (value: string | number): string => {
        if (!value) return '-';
        const val = parseFloat(value.toString());
        if (val >= 1000) return val.toFixed(2);
        if (val >= 1) return val.toFixed(4);
        return val.toFixed(6);
    };

    const formatTime = (timestamp: number): string => {
        try {
            return new Date(timestamp).toLocaleString('en-GB', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            });
        } catch {
            return new Date(timestamp).toLocaleString();
        }
    };

    const calculateTradeValue = (price: string, size: string): string => {
        const value = parseFloat(price) * parseFloat(size);
        return value.toFixed(2);
    };

    return (
        <>
            <style>{`
                .desktop-table-view {
                    display: none;
                }
                .mobile-card-view {
                    display: block;
                }
                @media (min-width: 768px) {
                    .desktop-table-view {
                        display: block;
                    }
                    .mobile-card-view {
                        display: none;
                    }
                }
            `}</style>
            <Card className="shadow-card border-border/50 overflow-hidden">
                <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                    <CardHeader className="py-3">
                        <div className="flex items-center justify-between">
                            <CollapsibleTrigger className="flex items-center gap-2 hover:opacity-80 transition-opacity focus-visible:outline-none">
                                <CardTitle className="text-lg font-semibold">Trade History</CardTitle>
                                <ChevronDown
                                    className={`h-4 w-4 transition-transform ${isOpen ? 'transform rotate-180' : ''
                                        }`}
                                />
                            </CollapsibleTrigger>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={fetchTrades}
                                disabled={isLoading}
                                className="h-8 w-8"
                            >
                                <RefreshCw
                                    className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
                                />
                            </Button>
                        </div>
                    </CardHeader>

                    <CollapsibleContent>
                        <CardContent className="pt-0">
                            {isLoading ? (
                                <div className="space-y-2 p-4">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <Skeleton key={i} className="h-12 w-full rounded-lg" />
                                    ))}
                                </div>
                            ) : trades.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground text-sm">
                                    No trades found
                                </div>
                            ) : (
                                <div className="w-full">
                                    {/* Desktop Table View */}
                                    <div className="overflow-x-auto desktop-table-view">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-border">
                                                    <th className="text-left py-2 px-2 font-medium text-muted-foreground">Coin</th>
                                                    <th className="text-left py-2 px-2 font-medium text-muted-foreground">Direction</th>
                                                    <th className="text-right py-2 px-2 font-medium text-muted-foreground">Price</th>
                                                    <th className="text-left py-2 px-2 font-medium text-muted-foreground">Time</th>
                                                    <th className="text-right py-2 px-2 font-medium text-muted-foreground">Size</th>
                                                    <th className="text-right py-2 px-2 font-medium text-muted-foreground">Value (USDC)</th>
                                                    <th className="text-right py-2 px-2 font-medium text-muted-foreground">Closed PnL</th>
                                                    <th className="text-right py-2 px-2 font-medium text-muted-foreground">Fee</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {trades
                                                    .filter(trade => {
                                                        if (showAllHistory) return true;
                                                        const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
                                                        return trade.time > thirtyDaysAgo;
                                                    })
                                                    .map((trade, index) => {
                                                        const isBuy = trade.side === 'B';
                                                        const pnl = parseFloat(trade.closedPnl || '0');
                                                        const isPnlPositive = pnl >= 0;

                                                        return (
                                                            <tr
                                                                key={`${trade.hash}-${trade.tid}-${index}`}
                                                                className="border-b border-border/50 hover:bg-muted/50 transition-colors"
                                                            >
                                                                <td className="py-2 px-2">
                                                                    <div className="flex items-center gap-2">
                                                                        <TokenIcon symbol={trade.coin} className="h-5 w-5" />
                                                                        <span className="font-medium">{trade.coin}</span>
                                                                    </div>
                                                                </td>
                                                                <td className="py-2 px-2">
                                                                    <span
                                                                        className={`px-2 py-0.5 rounded text-xs font-semibold ${isBuy
                                                                            ? 'bg-green-500/10 text-green-500'
                                                                            : 'bg-red-500/10 text-red-500'
                                                                            }`}
                                                                    >
                                                                        {isBuy ? 'Buy' : 'Sell'}
                                                                    </span>
                                                                </td>
                                                                <td className="py-2 px-2 text-right font-mono">
                                                                    ${formatPrice(trade.px)}
                                                                </td>
                                                                <td className="py-2 px-2 text-muted-foreground text-xs">
                                                                    {formatTime(trade.time)}
                                                                </td>
                                                                <td className="py-2 px-2 text-right font-mono">
                                                                    {formatNumber(trade.sz, 4)}
                                                                </td>
                                                                <td className="py-2 px-2 text-right font-mono">
                                                                    ${calculateTradeValue(trade.px, trade.sz)}
                                                                </td>
                                                                <td className="py-2 px-2 text-right">
                                                                    {trade.closedPnl ? (
                                                                        <span
                                                                            className={`font-mono font-semibold ${isPnlPositive ? 'text-green-500' : 'text-red-500'
                                                                                }`}
                                                                        >
                                                                            {isPnlPositive ? '+' : ''}${formatNumber(trade.closedPnl)}
                                                                        </span>
                                                                    ) : (
                                                                        <span className="text-muted-foreground">-</span>
                                                                    )}
                                                                </td>
                                                                <td className="py-2 px-2 text-right font-mono text-muted-foreground">
                                                                    ${formatNumber(trade.fee || '0')}
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Mobile Card View */}
                                    <div className="space-y-4 mobile-card-view">
                                        {trades
                                            .filter(trade => {
                                                if (showAllHistory) return true;
                                                const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
                                                return trade.time > thirtyDaysAgo;
                                            })
                                            .map((trade, index) => {
                                                const isBuy = trade.side === 'B';
                                                const pnl = parseFloat(trade.closedPnl || '0');
                                                const isPnlPositive = pnl >= 0;

                                                return (
                                                    <div
                                                        key={`${trade.hash}-${trade.tid}-${index}`}
                                                        className="border-b border-border/50 pb-4 last:border-0 last:pb-0"
                                                    >
                                                        <div className="flex flex-wrap items-center justify-between mb-2">
                                                            <div className="flex items-center gap-2 max-w-[70%]">
                                                                <TokenIcon symbol={trade.coin} className="h-6 w-6 shrink-0" />
                                                                <span className="font-semibold truncate">{trade.coin}</span>
                                                                <span
                                                                    className={`px-2 py-0.5 rounded text-xs font-semibold shrink-0 ${isBuy
                                                                        ? 'bg-green-500/10 text-green-500'
                                                                        : 'bg-red-500/10 text-red-500'
                                                                        }`}
                                                                >
                                                                    {isBuy ? 'Buy' : 'Sell'}
                                                                </span>
                                                            </div>
                                                            <span className="text-xs text-muted-foreground shrink-0 ml-auto text-right max-w-[40%] break-words">
                                                                {formatTime(trade.time)}
                                                            </span>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                                            <div>
                                                                <div className="text-muted-foreground text-xs">Price</div>
                                                                <div className="font-mono">${formatPrice(trade.px)}</div>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="text-muted-foreground text-xs">Value</div>
                                                                <div className="font-mono">${calculateTradeValue(trade.px, trade.sz)}</div>
                                                            </div>
                                                            <div>
                                                                <div className="text-muted-foreground text-xs">Size</div>
                                                                <div className="font-mono">{formatNumber(trade.sz, 4)}</div>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="text-muted-foreground text-xs">PnL</div>
                                                                {trade.closedPnl ? (
                                                                    <span
                                                                        className={`font-mono font-semibold ${isPnlPositive ? 'text-green-500' : 'text-red-500'
                                                                            }`}
                                                                    >
                                                                        {isPnlPositive ? '+' : ''}${formatNumber(trade.closedPnl)}
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-muted-foreground">-</span>
                                                                )}
                                                            </div>
                                                            <div className="col-span-2 text-right border-t border-border/30 pt-2 mt-1">
                                                                <span className="text-muted-foreground text-xs mr-2">Fee:</span>
                                                                <span className="font-mono text-muted-foreground">${formatNumber(trade.fee || '0')}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                    {!showAllHistory && trades.some(t => t.time <= Date.now() - 30 * 24 * 60 * 60 * 1000) && (
                                        <div className="flex justify-center mt-4 pb-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setShowAllHistory(true)}
                                                className="text-xs"
                                            >
                                                Load older trades
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </CollapsibleContent>
                </Collapsible>
            </Card>
        </>
    );
}

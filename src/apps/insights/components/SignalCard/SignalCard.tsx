/**
 * Signal Card component - displays individual trading signal information
 */

import { forwardRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  TrendingUp,
  Target,
  XCircle,
  RefreshCw,
  CheckCircle2,
  ChevronUp,
  ChevronDown,
  ArrowUpCircle,
  Copy,
  Check
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { SparklineChart } from '../SparklineChart';
import { normalizeSymbol, formatPrice } from '../../utils/formatUtils';
import { getEffectiveStopLoss, hasTrailingStop } from '../../lib/stopLossUtils';
import { generateSignalTimeline, getNextTP } from '../../utils/signalUtils';
import type { TradingSignal, LeverageType, SparklineDataPoint } from '../../types';

interface SignalCardProps {
  signal: TradingSignal;
  leverage: LeverageType;
  sparklineData?: SparklineDataPoint[];
  logoMap: Record<string, string>;
  animateOnMount?: boolean;
}

export const SignalCard = forwardRef<HTMLDivElement, SignalCardProps>(
  ({ signal, leverage, sparklineData, logoMap, animateOnMount = true }, ref) => {
    const applyLeverage = (pnl: number) => pnl * leverage;
    const [timelineOpen, setTimelineOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const copyStrategy = async () => {
      const strategy = {
        orderSide: signal.order_side,
        ticker: signal.ticker,
        exchange: "BINANCE",
        entryPrice: signal.entry_price,
        stopLoss: signal.stop_loss,
        tp1: signal.tp1,
        tp2: signal.tp2,
        tp3: signal.tp3
      };

      try {
        await navigator.clipboard.writeText(JSON.stringify(strategy));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy strategy:', err);
      }
    };

    const getTimeSinceCreated = () => {
      const now = new Date();
      const created = new Date(signal.created_at);
      const diffMs = now.getTime() - created.getTime();
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMinutes / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffDays > 0) {
        const remainingHours = diffHours % 24;
        return remainingHours > 0 ? `${diffDays}d ${remainingHours}h` : `${diffDays}d`;
      }
      if (diffHours > 0) {
        const remainingMinutes = diffMinutes % 60;
        return remainingMinutes > 0 ? `${diffHours}h ${remainingMinutes}m` : `${diffHours}h`;
      }
      return `${diffMinutes}m`;
    };

    const isOpen = signal.status === 'active';
    const timeline = generateSignalTimeline(signal);
    const nextTP = getNextTP(signal);

    return (
      <motion.div
        ref={ref}
        layout
        initial={animateOnMount ? { opacity: 0, y: 20 } : false}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="glass-card rounded-3xl p-5 md:p-7 hover:card-glow-purple hover:glass-card-hover transition-all duration-500"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3 md:mb-4">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-primary/40 to-primary/10 flex items-center justify-center border border-primary/30 overflow-hidden glow-violet-strong">
              {(() => {
                const symbol = normalizeSymbol(signal.ticker);
                const logoUrl = logoMap[symbol];

                return logoUrl ? (
                  <>
                    <img
                      src={logoUrl}
                      alt={signal.ticker.replace('.P', '')}
                      className="w-6 h-6 md:w-8 md:h-8 object-contain"
                      onError={(e) => {
                        console.error(`❌ Failed to load logo for ${signal.ticker} (${symbol}) from URL: ${logoUrl}, showing fallback`);
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.nextElementSibling;
                        if (fallback) {
                          (fallback as HTMLElement).style.display = 'flex';
                          (fallback as HTMLElement).classList.remove('hidden');
                        }
                      }}
                    />
                    <span className="text-lg md:text-xl font-bold text-primary hidden items-center justify-center">{symbol.substring(0, 1)}</span>
                  </>
                ) : (
                  <span className="text-lg md:text-xl font-bold text-primary flex items-center justify-center">{symbol.substring(0, 1)}</span>
                );
              })()}
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-1">{signal.ticker.replace('.P', '')}</h3>
              <Badge className={signal.order_side === 'buy' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-orange-500/20 text-orange-400 border-orange-500/30'}>
                {signal.order_side === 'buy' ? 'LONG' : 'SHORT'}
              </Badge>
              <Badge className={isOpen ? 'bg-violet-500/20 text-violet-400 border-violet-500/30 ml-2' : 'bg-slate-500/20 text-slate-400 border-slate-500/30 ml-2'}>
                {signal.status?.toUpperCase() || 'ACTIVE'}
              </Badge>
            </div>
          </div>
          <div className="text-right flex items-center gap-3">
            {isOpen && (
              <button
                onClick={copyStrategy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/20 transition-all duration-200 text-xs font-medium text-white"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="hidden md:inline">Copy Strategy</span>
                  </>
                )}
              </button>
            )}
            <div className="text-muted-foreground text-sm flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {getTimeSinceCreated()}
            </div>
          </div>
        </div>

        {/* Price Information Grid */}
        <TooltipProvider>
          <div className="grid grid-cols-3 gap-2 md:gap-4 mb-3 md:mb-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="cursor-help">
                  <p className="text-[10px] md:text-xs text-muted-foreground mb-1">Entry Price</p>
                  <p className="text-sm md:text-lg font-semibold text-white">${formatPrice(signal.entry_price, signal.ticker).replace('.', ',')}</p>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>The initial price at which the position was opened</p>
              </TooltipContent>
            </Tooltip>
            <div>
              <p className="text-[10px] md:text-xs text-muted-foreground mb-1">Current Price</p>
              <p className="text-sm md:text-lg font-semibold text-white">${signal.current_price ? formatPrice(signal.current_price, signal.ticker).replace('.', ',') : 'N/A'}</p>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="cursor-help">
                  <p className="text-[10px] md:text-xs text-muted-foreground mb-1">Stop Loss</p>
                  {(() => {
                    const isTrailing = hasTrailingStop(signal) || (
                      signal.order_side === 'buy'
                        ? signal.stop_loss > signal.entry_price
                        : signal.stop_loss < signal.entry_price
                    );

                    return isTrailing ? (
                      <p className="text-sm md:text-lg font-semibold text-green-400 flex items-center gap-1">
                        <span className="text-xs">{signal.order_side === 'buy' ? '↑' : '↓'}</span>
                        ${formatPrice(getEffectiveStopLoss(signal), signal.ticker).replace('.', ',')}
                        <span className="text-[10px] text-green-400/60">(trailing)</span>
                      </p>
                    ) : (
                      <p className="text-sm md:text-lg font-semibold text-rose-400">${formatPrice(signal.stop_loss, signal.ticker).replace('.', ',')}</p>
                    );
                  })()}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>If price drops to this level, the remaining position closes to limit losses</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>

        {/* Take Profits */}
        <TooltipProvider>
          <div className="mb-3 md:mb-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-[10px] md:text-xs text-muted-foreground mb-2 cursor-help inline-block">Take Profit Targets (33.33% of position each)</p>
              </TooltipTrigger>
              <TooltipContent>
                <p>Each target automatically sells 33.33% of the position when reached, locking in profits</p>
              </TooltipContent>
            </Tooltip>
            <div className="grid grid-cols-3 gap-1.5 md:gap-2">
              {[
                { key: 'tp1', price: signal.tp1, hit: signal.tp1_hit },
                { key: 'tp2', price: signal.tp2, hit: signal.tp2_hit },
                { key: 'tp3', price: signal.tp3, hit: signal.tp3_hit },
              ].filter(({ price }) => price != null).map(({ key, price, hit }) => {
                const isClosed = ['completed', 'stopped', 'closed'].includes(signal.status || 'active');
                const priceReachedTP = signal.current_price && (
                  signal.order_side === 'buy'
                    ? signal.current_price >= price
                    : signal.current_price <= price
                );
                const isHit = hit || (isClosed && priceReachedTP);

                const tpPercent = signal.order_side?.toLowerCase() === 'sell'
                  ? ((signal.entry_price - price) / signal.entry_price) * 100
                  : ((price - signal.entry_price) / signal.entry_price) * 100;
                const lockedInPercent = isHit ? (tpPercent * 0.3333) : null;
                const displayedLockedIn = lockedInPercent !== null ? applyLeverage(lockedInPercent).toFixed(2) : null;
                const displayedPotential = applyLeverage(tpPercent * 0.3333).toFixed(2);

                return (
                  <Tooltip key={key}>
                    <TooltipTrigger asChild>
                      <div className={`rounded-2xl p-2 md:p-2.5 border cursor-help transition-all duration-300 ${isHit ? 'bg-emerald-500/20 border-emerald-500/40 glow-violet' : 'bg-card/30 border-primary/10 hover:border-primary/30'}`}>
                        <p className="text-[10px] md:text-xs text-muted-foreground font-medium">{key.toUpperCase()}</p>
                        <p className="text-xs md:text-sm font-semibold text-white">${formatPrice(price, signal.ticker).replace('.', ',')}</p>
                        {isHit ? (
                          <p className="text-[10px] md:text-xs text-emerald-400 mt-0.5 font-bold">+{displayedLockedIn}% ✓</p>
                        ) : (
                          <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5">+{displayedPotential}%</p>
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isHit ? `Locked in +${displayedLockedIn}% profit` : `Target: +${(tpPercent * leverage).toFixed(4)}% gain (33.33% of position = +${displayedPotential}%)`}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </div>
        </TooltipProvider>

        {/* Sparkline - Only for open trades with data */}
        {isOpen && signal.status === 'active' && sparklineData && sparklineData.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-muted-foreground mb-2">Price Action</p>
            <SparklineChart
              data={sparklineData}
              currentPrice={signal.current_price || signal.entry_price}
              stopLoss={getEffectiveStopLoss(signal)}
              nextTP={nextTP}
              orderSide={signal.order_side as 'buy' | 'sell'}
            />
          </div>
        )}

        {/* Timeline Section - Collapsible */}
        <div className="mb-4 pt-4 border-t border-border/30">
          <button
            onClick={() => setTimelineOpen(!timelineOpen)}
            className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-white transition-colors mb-3 w-full"
          >
            <span>Timeline</span>
            {timelineOpen ? (
              <ChevronUp className="w-4 h-4 ml-auto" />
            ) : (
              <ChevronDown className="w-4 h-4 ml-auto" />
            )}
          </button>

          {timelineOpen && (
            <div className="space-y-2">
              {timeline.map((event, idx) => {
                const IconComponent = {
                  TrendingUp,
                  Target,
                  XCircle,
                  RefreshCw,
                  CheckCircle2,
                }[event.icon];

                return (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/50 border border-slate-800/50"
                  >
                    {IconComponent && <IconComponent className={`w-5 h-5 ${event.iconColor} mt-0.5`} />}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-white">{event.label}</div>
                          {event.detail && (
                            <div className="text-xs text-slate-400 mt-0.5">{event.detail}</div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-white">
                            ${formatPrice(event.price, signal.ticker)}
                          </div>
                          {event.pnl !== null && event.pnl !== undefined && (
                            <div className={`text-xs ${event.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                              {applyLeverage(event.pnl) > 0 ? '+' : ''}{applyLeverage(event.pnl).toFixed(2)}%
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {new Date(event.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* P/L Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border/30">
          {isOpen ? (
            <>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Unrealized P/L</p>
                <p className={`text-xl font-bold flex items-center gap-1 ${(signal.profit_loss_percent || 0) >= 0 ? 'text-[hsl(142,76%,58%)]' : 'text-[hsl(348,83%,58%)]'
                  }`}>
                  {applyLeverage(signal.profit_loss_percent || 0) >= 0 ? '+' : ''}{applyLeverage(signal.profit_loss_percent || 0).toFixed(2).replace('.', ',')}%
                  {(signal.profit_loss_percent || 0) >= 0 && <ArrowUpCircle className="w-4 h-4" />}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-1">Created At</p>
                <p className="text-sm text-white">
                  {new Date(signal.created_at).toLocaleString()}
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Realized P/L</p>
                <p className={`text-xl font-bold flex items-center gap-1 ${(signal.realized_pnl_percent || 0) >= 0 ? 'text-[hsl(142,76%,58%)]' : 'text-[hsl(348,83%,58%)]'
                  }`}>
                  {applyLeverage(signal.realized_pnl_percent || 0) >= 0 ? '+' : ''}{applyLeverage(signal.realized_pnl_percent || 0).toFixed(2).replace('.', ',')}%
                  {(signal.realized_pnl_percent || 0) >= 0 && <ArrowUpCircle className="w-4 h-4" />}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Exit Price</p>
                <p className="text-sm text-white font-semibold">
                  {signal.status === 'stopped' || signal.stop_loss_hit
                    ? `$${formatPrice(getEffectiveStopLoss(signal), signal.ticker)}`
                    : signal.status === 'closed'
                      ? `$${formatPrice(signal.current_price || signal.entry_price, signal.ticker)}`
                      : signal.status === 'completed'
                        ? `$${formatPrice(signal.current_price || signal.entry_price, signal.ticker)}`
                        : `$${formatPrice(signal.entry_price, signal.ticker)}`
                  }
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Close Reason</p>
                <p className="text-sm text-white">
                  {signal.status === 'stopped'
                    ? '⛔ Stop Loss'
                    : signal.status === 'completed'
                      ? '✅ All TPs'
                      : signal.status === 'closed'
                        ? '🔄 Opposite Signal'
                        : '⛔ Stop Loss'
                  }
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-1">Closed At</p>
                <p className="text-sm text-white">
                  {signal.closed_at ? new Date(signal.closed_at).toLocaleString() : 'N/A'}
                </p>
              </div>
            </>
          )}
        </div>
      </motion.div>
    );
  }
);

SignalCard.displayName = 'SignalCard';


import { useEffect, useState } from 'react';
import type { AssetInfo } from '../lib/hyperliquid/types';

interface PriceTickerProps {
  selectedAsset: AssetInfo | null;
}

interface TickerData {
  markPrice: string;
  oraclePrice: string;
  change24h: string;
  changePercent24h: string;
  volume24h: string;
  openInterest: string;
  fundingRate: string;
  nextFundingTime: string;
}

export function PriceTicker({ selectedAsset }: PriceTickerProps) {
  const [tickerData, setTickerData] = useState<TickerData | null>(null);

  useEffect(() => {
    if (!selectedAsset) return;

    let ws: WebSocket | null = null;

    const connect = () => {
      ws = new WebSocket('wss://api.hyperliquid.xyz/ws');

      ws.onopen = () => {
        console.log('[Ticker] WebSocket connected');
        // Subscribe to all mids (prices)
        const midsMsg = {
          method: 'subscribe',
          subscription: { type: 'allMids' },
        };
        console.log(
          '[Ticker] Sending allMids subscription:',
          JSON.stringify(midsMsg)
        );
        ws?.send(JSON.stringify(midsMsg));
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('[Ticker] WebSocket message:', message);

          if (message.channel === 'allMids' && message.data) {
            const price = message.data.mids?.[selectedAsset.symbol];
            if (price) {
              setTickerData((prev) =>
                prev
                  ? {
                    ...prev,
                    markPrice: price,
                  }
                  : null
              );
            }
          }
        } catch (e) {
          console.error('[Ticker] WebSocket message error:', e);
        }
      };

      ws.onerror = (err) => {
        console.error('[Ticker] WebSocket error:', err);
      };

      ws.onclose = () => {
        console.log('[Ticker] WebSocket disconnected');
        setTimeout(connect, 3000);
      };
    };

    connect();

    return () => {
      if (ws) {
        ws.onclose = null;
        ws.close();
      }
    };
  }, [selectedAsset]);

  // Fetch initial market data from REST API
  useEffect(() => {
    if (!selectedAsset) return;

    const fetchMarketData = async () => {
      try {
        const response = await fetch('https://api.hyperliquid.xyz/info', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'metaAndAssetCtxs' }),
        });
        const data = await response.json();

        if (data && data.length >= 2) {
          const assetCtx = data[1]?.find(
            (ctx: any) => ctx.coin === selectedAsset.symbol
          );
          if (assetCtx) {
            const prevDayPx = parseFloat(assetCtx.prevDayPx || '0');
            const markPx = parseFloat(assetCtx.markPx || '0');
            const change24h = markPx - prevDayPx;
            const changePercent24h =
              prevDayPx > 0
                ? ((change24h / prevDayPx) * 100).toFixed(2)
                : '0.00';

            setTickerData({
              markPrice: assetCtx.markPx || '0',
              oraclePrice: assetCtx.oraclePx || '0',
              change24h: change24h.toFixed(2),
              changePercent24h,
              volume24h: assetCtx.dayNtlVlm || '0',
              openInterest: assetCtx.openInterest || '0',
              fundingRate: assetCtx.funding || '0',
              nextFundingTime: '00:00:00', // TODO: Calculate from funding time
            });
          }
        }
      } catch (error) {
        console.error('[Ticker] Failed to fetch market data:', error);
      }
    };

    fetchMarketData();
  }, [selectedAsset]);

  if (!selectedAsset || !tickerData) {
    return null;
  }

  const isPositive = parseFloat(tickerData.changePercent24h) >= 0;

  return (
    <div className="flex items-center gap-6 px-4 pb-2 bg-card/50 border-b border-border text-sm">
      {/* Symbol with icon */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-xs">
          {selectedAsset.symbol.charAt(0)}
        </div>
        <span className="font-semibold text-base">
          {selectedAsset.symbol}-USDC
        </span>
        <span className="text-xs text-muted-foreground">
          {selectedAsset.maxLeverage}x
        </span>
      </div>

      {/* Mark Price */}
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">Mark</span>
        <span className="font-semibold">
          {(() => {
            const price = parseFloat(tickerData.markPrice);
            if (price < 1 && price > 0) {
              return '$' + price.toFixed(5);
            }
            return '$' + price.toFixed(2);
          })()}
        </span>
      </div>

      {/* Oracle Price */}
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">Oracle</span>
        <span className="font-semibold">
          {(() => {
            const price = parseFloat(tickerData.oraclePrice);
            if (price < 1 && price > 0) {
              return '$' + price.toFixed(5);
            }
            return '$' + price.toFixed(2);
          })()}
        </span>
      </div>

      {/* 24h Change */}
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">24H Change</span>
        <span
          className={`font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}
        >
          {tickerData.change24h} / {isPositive ? '+' : ''}
          {tickerData.changePercent24h}%
        </span>
      </div>

      {/* 24h Volume */}
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">24H Volume</span>
        <span className="font-semibold">
          $
          {parseFloat(tickerData.volume24h).toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}
        </span>
      </div>

      {/* Open Interest */}
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">Open Interest</span>
        <span className="font-semibold">
          $
          {parseFloat(tickerData.openInterest).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      </div>

      {/* Funding Rate */}
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">
          Funding / Countdown
        </span>
        <span className="font-semibold">
          {(parseFloat(tickerData.fundingRate) * 100).toFixed(4)}%{' '}
          {tickerData.nextFundingTime}
        </span>
      </div>
    </div>
  );
}

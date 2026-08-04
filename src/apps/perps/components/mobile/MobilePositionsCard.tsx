import { ChevronRight } from 'lucide-react';
import { Badge } from '../ui/badge';

interface Position {
  coin: string;
  coinIcon?: string;
  leverage: number;
  side: 'LONG' | 'SHORT';
  value: string;
  pnl: string;
  pnlPercent: string;
  entryPrice: string;
  markPrice: string;
  liqPrice: string;
}

interface MobilePositionsCardProps {
  positions: Position[];
  totalValue: string;
  totalPnl: string;
  totalPnlPercent: string;
  openOrders?: any[];
  onPositionClick?: (coin: string) => void;
}

export function MobilePositionsCard({
  positions,
  totalValue,
  totalPnl,
  totalPnlPercent,
  openOrders,
  onPositionClick,
}: MobilePositionsCardProps) {
  const isNegative = totalPnl.startsWith('-');

  // Helper to aggregate TP and SL orders for a specific coin
  const getOpenTP_SL = (coin: string, side: 'LONG' | 'SHORT', markPrice: string) => {
    if (!openOrders) return { tps: [], sls: [] };

    const isLong = side === 'LONG';
    const markPx = parseFloat(markPrice.replace(/,/g, ''));
    const positionOrders = openOrders.filter(
      (o) => o.coin === coin && o.reduceOnly
    );

    const tps: { price: number }[] = [];
    const sls: { price: number }[] = [];

    positionOrders.forEach((order) => {
      const isBuy = order.side === 'B';
      const isClosing = (isLong && !isBuy) || (!isLong && isBuy);

      if (isClosing) {
        const triggerPx = parseFloat(
          order.trigger?.triggerPx ||
          order.triggerCondition?.triggerPx ||
          '0'
        );
        const limitPx = parseFloat(order.limitPx || '0');
        const price = triggerPx > 0 ? triggerPx : limitPx;

        // Classify as TP or SL based on price relative to mark price
        if (isLong) {
          if (price > markPx) tps.push({ price });
          else sls.push({ price });
        } else {
          if (price < markPx) tps.push({ price });
          else sls.push({ price });
        }
      }
    });

    // Sort and return
    tps.sort((a, b) => a.price - b.price);
    sls.sort((a, b) => a.price - b.price);

    return { tps, sls };
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-gray-500">
          Open Positions
        </h3>
        <span
          className={`text-sm font-bold ${isNegative ? 'text-red-500' : 'text-green-500'}`}
        >
          {isNegative ? '↓' : '↑'} {totalPnlPercent}
        </span>
      </div>

      {/* Total Value */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-3xl font-bold">${totalValue}</span>
        <span
          className={`text-lg font-bold ${isNegative ? 'text-red-500' : 'text-green-500'}`}
        >
          {totalPnl}
        </span>
      </div>

      {/* Positions List */}
      <div className="space-y-3">
        {positions.map((position, index) => (
          <div
            key={index}
            className="border-t border-gray-100 pt-3 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => onPositionClick?.(position.coin)}
          >
            {/* Position Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {/* Coin Icon */}
                <div className="h-10 w-10 rounded-full bg-yellow-500 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {position.coin.charAt(0)}
                  </span>
                </div>

                {/* Coin Name and Badges */}
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{position.coin}</span>

                  <Badge
                    className={`text-xs px-2 py-0.5 ${position.side === 'LONG'
                      ? 'bg-green-100 text-green-700 hover:bg-green-100'
                      : 'bg-red-100 text-red-700 hover:bg-red-100'
                      }`}
                  >
                    {position.side}
                  </Badge>

                  <span className={`text-xs font-bold ${position.side === 'LONG' ? 'text-green-500' : 'text-green-500'}`}>
                    {position.leverage}x
                  </span>

                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* Value and PNL */}
              <div className="text-right">
                <div className="font-semibold">${position.value}</div>
                <div
                  className={`text-sm ${position.pnl.startsWith('-') ? 'text-red-500' : 'text-green-500'}`}
                >
                  {position.pnl}
                </div>
              </div>
            </div>

            {/* Price Grid */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <p className="text-gray-500 uppercase mb-1">Entry</p>
                <p className="font-medium">${position.entryPrice}</p>
              </div>
              <div>
                <p className="text-gray-500 uppercase mb-1">Mark Price</p>
                <p className="font-medium">${position.markPrice}</p>
              </div>
              <div>
                <p className="text-gray-500 uppercase mb-1">Liq. Price</p>
                <p className="font-medium">${position.liqPrice}</p>
              </div>
            </div>
            <div>
              <p className="text-gray-500 uppercase mb-1">TP / SL</p>
              <div className="font-medium">
                {(() => {
                  const isLong = position.side === 'LONG';
                  const { tps, sls } = getOpenTP_SL(
                    position.coin,
                    position.side,
                    position.markPrice
                  );

                  if (tps.length === 0 && sls.length === 0) return '-';

                  // Show closest orders only
                  const closestTp = isLong
                    ? tps[0]
                    : tps[tps.length - 1];
                  const closestSl = isLong
                    ? sls[sls.length - 1]
                    : sls[0];

                  return (
                    <div className="flex gap-2 justify-end">
                      {closestTp && (
                        <span className="text-green-500">
                          $
                          {closestTp.price.toLocaleString(
                            undefined,
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                        </span>
                      )}
                      {closestSl && (
                        <span className="text-red-500">
                          $
                          {closestSl.price.toLocaleString(
                            undefined,
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                        </span>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Open Orders Section */}
      {openOrders && openOrders.length > 0 && (
        <div className="mt-6 border-t border-gray-100 pt-4">
          <h3 className="text-base font-semibold text-gray-500 mb-3">
            Open Orders
          </h3>
          <div className="space-y-3">
            {openOrders.map((order: any, index: number) => {
              const buy = order.side === 'B';
              return (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 text-sm border-b border-gray-50 last:border-0"
                >
                  <div className="flex flex-col">
                    <span className="font-bold">{order.coin}</span>
                    <span
                      className={`text-xs ${buy ? 'text-green-500' : 'text-red-500'}`}
                    >
                      {buy ? 'Long' : 'Short'}{' '}
                      {order.reduceOnly ? '(Red.)' : ''}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-medium">
                      {order.sz} @{' '}
                      {(() => {
                        const price = parseFloat(
                          order.limitPx || order.trigger?.triggerPx || 0
                        );
                        return Math.abs(price) < 1
                          ? price.toFixed(5)
                          : price.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          });
                      })()}
                    </span>
                    <span className="text-xs text-gray-400">Limit</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

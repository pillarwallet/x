import { buildOrderAction } from './signing';
export { roundToSzDecimals } from './math';
import { roundToSzDecimals } from './math';

export function computeSizeUSD(
  notionalUSD: number,
  leverage: number,
  entryPx: number,
  szDecimals: number
): number {
  const totalNotional = notionalUSD * leverage;
  const rawSize = totalNotional / entryPx;

  // Floor to the asset's minimum increment to avoid rounding up invalid sizes
  const step = Math.pow(10, -szDecimals);
  const size = Math.floor(rawSize / step) * step;

  return roundToSzDecimals(size, szDecimals);
}

export function buildEntryOrder(
  coinId: number,
  side: 'long' | 'short',
  size: number,
  price: number | undefined
) {
  const isBuy = side === 'long';

  if (price === undefined) {
    // Market order - use a very high/low limit price
    const marketPrice = isBuy ? 999999999 : 0.00000001;
    return buildOrderAction({
      coin: coinId,
      isBuy,
      sz: size,
      limitPx: marketPrice,
      orderType: { limit: { tif: 'Ioc' } },
      reduceOnly: false,
    });
  }

  return buildOrderAction({
    coin: coinId,
    isBuy,
    sz: size,
    limitPx: price,
    orderType: { limit: { tif: 'Gtc' } },
    reduceOnly: false,
  });
}

export function buildReduceOnlyOrder(
  coinId: number,
  side: 'long' | 'short',
  price: number,
  size: number
) {
  // For reduce-only, we use opposite direction
  const isBuy = side === 'short'; // Close long = sell, close short = buy

  return buildOrderAction({
    coin: coinId,
    isBuy,
    sz: size,
    limitPx: price,
    orderType: { limit: { tif: 'Gtc' } },
    reduceOnly: true,
  });
}

export function splitTPs(
  totalSize: number,
  tps: number[]
): Array<{ price: number; size: number }> {
  if (tps.length === 0) return [];

  const sizePerTP = totalSize / tps.length;
  return tps.map((price) => ({
    price,
    size: sizePerTP,
  }));
}

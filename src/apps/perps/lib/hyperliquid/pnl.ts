export function computePnl(
  side: 'long' | 'short',
  size: number,
  entryPx: number,
  markPx: number
) {
  const m = side === 'long' ? 1 : -1;
  const pnlUsd = (markPx - entryPx) * size * m;
  const pnlPct = ((markPx - entryPx) / entryPx) * 100 * m;
  return { pnlUsd, pnlPct };
}

export function formatPrice(price: number, decimals: number = 2): string {
  return price.toFixed(decimals);
}

export function formatPnl(pnl: number, isPercentage: boolean = false): string {
  const formatted = isPercentage ? pnl.toFixed(2) : pnl.toFixed(2);
  const sign = pnl > 0 ? '+' : '';
  return isPercentage ? `${sign}${formatted}%` : `${sign}$${formatted}`;
}

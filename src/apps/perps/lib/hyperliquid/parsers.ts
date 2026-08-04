export interface ParsedPosition {
  side: 'long' | 'short';
  size: number;
  entryPx: number;
}

export interface ParsedOrders {
  sl: number | undefined;
  tps: number[];
}

export function parsePositionForSymbol(
  userState: any,
  symbol: string
): ParsedPosition | null {
  if (!userState || !userState.assetPositions) {
    return null;
  }

  const position = userState.assetPositions.find(
    (pos: any) => pos.position?.coin === symbol
  );

  if (!position || !position.position) {
    return null;
  }

  const szi = parseFloat(position.position.szi);
  if (szi === 0) {
    return null;
  }

  return {
    side: szi > 0 ? 'long' : 'short',
    size: Math.abs(szi),
    entryPx: parseFloat(position.position.entryPx),
  };
}

export function parseReduceOnlyOrders(
  orders: any[],
  symbol: string,
  side: 'long' | 'short',
  entryPx: number
): ParsedOrders {
  if (!orders || !Array.isArray(orders)) {
    return { sl: undefined, tps: [] };
  }

  const reduceOnlyOrders = orders.filter(
    (order: any) => order.coin === symbol && order.reduceOnly === true
  );

  let sl: number | undefined = undefined;
  const tps: number[] = [];

  for (const order of reduceOnlyOrders) {
    const limitPx = parseFloat(order.limitPx);

    if (side === 'long') {
      // For long: price < entry = SL, price > entry = TP
      if (limitPx < entryPx) {
        // Stop loss
        if (!sl || limitPx > sl) {
          sl = limitPx;
        }
      } else if (limitPx > entryPx) {
        // Take profit
        tps.push(limitPx);
      }
    } else {
      // For short: price > entry = SL, price < entry = TP
      if (limitPx > entryPx) {
        // Stop loss
        if (!sl || limitPx < sl) {
          sl = limitPx;
        }
      } else if (limitPx < entryPx) {
        // Take profit
        tps.push(limitPx);
      }
    }
  }

  // Sort TPs: ascending for long, descending for short
  if (side === 'long') {
    tps.sort((a, b) => a - b);
  } else {
    tps.sort((a, b) => b - a);
  }

  return { sl, tps };
}

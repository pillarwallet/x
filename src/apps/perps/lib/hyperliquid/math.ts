export function calculatePositionSize(
  notional: number,
  leverage: number,
  entryPrice: number
): number {
  const totalNotional = notional * leverage;
  return totalNotional / entryPrice;
}

export function roundToSzDecimals(
  size: number,
  szDecimals: number = 3
): number {
  const multiplier = Math.pow(10, szDecimals);
  return Math.round(size * multiplier) / multiplier;
}

export function getEntryPrice(entry: number | number[]): number {
  if (Array.isArray(entry)) {
    return (entry[0] + entry[1]) / 2;
  }
  return entry;
}

export function validateCopyTrade(params: {
  symbol: string;
  side: 'long' | 'short';
  entry: number | number[];
  stopLoss: number;
  takeProfits: number | number[];
}): { valid: boolean; error?: string } {
  const entryPrice = getEntryPrice(params.entry);

  if (params.side === 'long') {
    // For long: SL < entry < TP
    if (params.stopLoss >= entryPrice) {
      return {
        valid: false,
        error: 'Stop loss must be below entry for long positions',
      };
    }

    const tps = Array.isArray(params.takeProfits)
      ? params.takeProfits
      : [params.takeProfits];

    const minTp = Math.min(...tps);

    if (minTp <= entryPrice) {
      return {
        valid: false,
        error: 'Take profits must be above entry for long positions',
      };
    }
  } else {
    // For short: TP < entry < SL
    if (params.stopLoss <= entryPrice) {
      return {
        valid: false,
        error: 'Stop loss must be above entry for short positions',
      };
    }

    const tps = Array.isArray(params.takeProfits)
      ? params.takeProfits
      : [params.takeProfits];

    const maxTp = Math.max(...tps);

    if (maxTp >= entryPrice) {
      return {
        valid: false,
        error: 'Take profits must be below entry for short positions',
      };
    }
  }

  return { valid: true };
}

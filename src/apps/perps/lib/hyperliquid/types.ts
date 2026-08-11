import { z } from 'zod';

export const CopyTileSchema = z.object({
  symbol: z.string().min(1),
  side: z.enum(['long', 'short']),
  entry: z.union([
    z.number().positive(),
    z.tuple([z.number().positive(), z.number().positive()]),
  ]),
  stopLoss: z.number().positive(),
  takeProfits: z.union([
    z.array(z.number().positive()).min(1),
    z.tuple([z.number().positive(), z.number().positive()]),
  ]),
});

export type CopyTileEntry = number | [number, number];
export type CopyTileTakeProfits = number[] | [number, number];

export interface CopyTile {
  symbol: string;
  side: 'long' | 'short';
  entry: CopyTileEntry;
  stopLoss: number;
  takeProfits: CopyTileTakeProfits;
}

export interface UserState {
  assetPositions: Array<{
    position: {
      coin: string;
      szi: string;
      leverage: {
        type: 'isolated' | 'cross';
        value: number;
        rawUsd?: string;
      };
      entryPx: string;
      positionValue: string;
      unrealizedPnl: string;
    };
  }>;
  crossMarginSummary: {
    accountValue: string;
    totalMarginUsed: string;
    totalNtlPos: string;
    totalRawUsd: string;
  };
  marginSummary: {
    accountValue: string;
    totalMarginUsed: string;
    totalNtlPos: string;
    totalRawUsd: string;
  };
}

export interface HyperliquidAction {
  type: string;
  [key: string]: any;
}

export interface SignedAction {
  action: HyperliquidAction;
  nonce: number;
  signature: {
    r: string;
    s: string;
    v: number;
  };
  vaultAddress?: string | null;
}

export interface AssetInfo {
  id: number;
  symbol: string;
  szDecimals: number;
  maxLeverage: number;
}

export interface EnhancedAsset extends AssetInfo {
  price: number;
  volume: number;
  priceChange: number;
  priceChangePercent: number;
}

// Position from Hyperliquid API
export interface HyperliquidPosition {
  coin: string;
  szi: string; // Size (positive for long, negative for short)
  leverage: {
    type: 'isolated' | 'cross';
    value: number;
    rawUsd?: string;
  };
  entryPx: string;
  positionValue: string;
  unrealizedPnl: string;
  returnOnEquity: string;
  marginUsed: string;
  liquidationPx?: string;
  markPx?: string;
}

// Open Order from Hyperliquid API
export interface HyperliquidOrder {
  oid: number; // Order ID
  coin: string;
  side: 'A' | 'B'; // A = Ask (Sell), B = Bid (Buy)
  limitPx: string;
  sz: string; // Size
  timestamp: number;
  origSz: string;
  reduceOnly: boolean;
  orderType?: string; // e.g., "Limit", "Stop Market", "Take Profit"
  triggerPx?: string;
  trigger?: {
    triggerPx: string;
    isMarket: boolean;
    tpsl: 'tp' | 'sl';
  };
  triggerCondition?: {
    triggerPx: string;
  };
}

// Universe asset metadata from Hyperliquid API
export interface UniverseAsset {
  name: string; // Symbol
  szDecimals: number;
  maxLeverage: number;
  onlyIsolated?: boolean;
}

// Asset context (market data) from Hyperliquid API
export interface AssetContext {
  dayNtlVlm: string;
  funding: string;
  impactPxs: string[];
  markPx: string;
  midPx: string;
  openInterest: string;
  oraclePx: string;
  premium: string;
  prevDayPx: string;
}

// Market data for display
export interface MarketData extends UniverseAsset {
  markPx: number;
  dayNtlVlm: number;
  funding: number;
  openInterest: number;
  priceChange24h: number;
  priceChangePercent24h: number;
}

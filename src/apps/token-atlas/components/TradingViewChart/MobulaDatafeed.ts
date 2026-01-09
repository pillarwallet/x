import {
  IBasicDataFeed,
  LibrarySymbolInfo,
  ResolutionString,
  SearchSymbolsCallback,
  SubscribeBarsCallback,
  Timezone,
} from 'charting_library';

// api
import { tokenOhlcvHistory } from '../../api/token';

// store
import { store } from '../../../../store';

type Bar = {
  time: number; // JS timestamp in ms
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

type MobulaDatafeedOptions = {
  /**
   * Optional "static" bars source. When provided, getBars will return bars
   * from this array and will not do any network calls.
   *
   * Each bar.time must be a JS timestamp in milliseconds.
   */
  bars?: Bar[];
  /**
   * Token address for WebSocket subscription
   */
  address?: string;
  /**
   * Chain ID in format "evm:1" for Ethereum
   */
  chainId?: string;
  /**
   * Mobula API key for WebSocket authentication
   */
  apiKey?: string;
  /**
   * Optional callback for real-time price updates
   * Called whenever a new price is received from the WebSocket
   */
  onPriceUpdate?: (price: number) => void;
  /**
   * Timezone for the symbol info
   * Falls back to 'Etc/UTC' if detection fails
   */
  timezone?: Timezone;
};

type WebSocketSubscription = {
  onTick: SubscribeBarsCallback;
  resolution: ResolutionString;
  lastBar?: Bar;
  subscriptionId?: string;
};

type MobulaOhlcvData = {
  t?: number; // timestamp in ms
  o?: number; // open
  h?: number; // high
  l?: number; // low
  c?: number; // close
  v?: number; // volume
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  volume?: number;
};

type MobulaWebSocketMessage =
  | {
      event: 'subscribed' | 'error' | 'pong';
      type?: 'ohlcv' | 'pong';
      subscriptionId?: string;
      subscription_id?: string;
      payload?: { period?: string };
      data?: MobulaOhlcvData | MobulaOhlcvData[];
      error?: string;
      status?: 'error';
    }
  | MobulaOhlcvData;

// Import OhlcvHistory type from api types

// Constants
const MIN_VALID_TIMESTAMP_MS = 1000000000000; // Year 2001 in milliseconds
const PING_INTERVAL_MS = 30000; // 30 seconds
const MAX_RECONNECT_ATTEMPTS = 5;
const WS_SUBSCRIPTION_DELAY_MS = 100; // Delay before subscribing after WebSocket open

export class MobulaDatafeed implements IBasicDataFeed {
  private symbolInfo: LibrarySymbolInfo;

  private barsCache: Map<string, Bar[]> = new Map();

  private staticBars?: Bar[];

  private ws: WebSocket | null = null;

  private wsSubscriptions: Map<string, WebSocketSubscription> = new Map();

  private pingInterval: ReturnType<typeof setInterval> | null = null;

  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

  private reconnectAttempts = 0;

  private address?: string;

  private chainId?: string;

  private apiKey?: string;

  private onPriceUpdate?: (price: number) => void;

  constructor(symbol: string, name: string, options?: MobulaDatafeedOptions) {
    if (!symbol || !name) {
      throw new Error('Symbol and name are required');
    }

    this.staticBars = options?.bars;
    this.address = options?.address;
    this.chainId = options?.chainId;
    this.apiKey = options?.apiKey;
    this.onPriceUpdate = options?.onPriceUpdate;

    const timezone: Timezone = (options?.timezone || 'Etc/UTC') as Timezone;

    this.symbolInfo = {
      name: symbol,
      description: name,
      type: 'crypto',
      session: '24x7',
      timezone,
      ticker: symbol,
      exchange: 'PillarX',
      listed_exchange: 'PillarX',
      format: 'price',
      minmov: 1,
      pricescale: 100,
      has_intraday: true,
      has_weekly_and_monthly: true,
      supported_resolutions: [
        '1',
        '5',
        '15',
        '30',
        '60',
        '240',
        '1D',
        '1W',
        '1M',
      ] as ResolutionString[],
      volume_precision: 2,
      data_status: 'streaming',
    };
  }

  onReady(
    callback: (configuration: {
      supported_resolutions: ResolutionString[];
      supports_marks: boolean;
      supports_timescale_marks: boolean;
      supports_time: boolean;
    }) => void
  ): void {
    try {
      setTimeout(() => {
        callback({
          supported_resolutions: this.symbolInfo.supported_resolutions ?? [],
          supports_marks: false,
          supports_timescale_marks: false,
          supports_time: true,
        });
      }, 0);
    } catch (error) {
      console.error('MobulaDatafeed: Error in onReady', error);
      // Still call callback with defaults to prevent chart from hanging
      callback({
        supported_resolutions: [],
        supports_marks: false,
        supports_timescale_marks: false,
        supports_time: true,
      });
    }
  }

  searchSymbols(
    _userInput: string,
    _exchange: string,
    _symbolType: string,
    onResult: SearchSymbolsCallback
  ): void {
    // We only support the currently selected symbol in this datafeed.
    try {
      setTimeout(() => {
        onResult([
          {
            symbol: this.symbolInfo.name,
            description: this.symbolInfo.description,
            exchange: this.symbolInfo.exchange,
            ticker: this.symbolInfo.ticker,
            type: this.symbolInfo.type,
          },
        ]);
      }, 0);
    } catch (error) {
      console.error('MobulaDatafeed: Error in searchSymbols', error);
      onResult([]);
    }
  }

  resolveSymbol(
    _symbolName: string,
    onResolve: (symbolInfo: LibrarySymbolInfo) => void,
    onError: (reason: string) => void
  ): void {
    try {
      if (!this.symbolInfo.name || !this.symbolInfo.description) {
        onError('Invalid symbol configuration');
        return;
      }

      setTimeout(() => {
        onResolve(this.symbolInfo);
      }, 0);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Unknown error resolving symbol';
      console.error('MobulaDatafeed: Error in resolveSymbol', error);
      onError(errorMessage);
    }
  }

  getBars(
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    periodParams: {
      from: number;
      to: number;
      firstDataRequest: boolean;
    },
    onResult: (bars: Bar[], meta: { noData: boolean }) => void,
    onError: (reason: string) => void
  ): void {
    try {
      // Validate inputs
      if (!symbolInfo || !resolution) {
        onError('Invalid symbol or resolution');
        return;
      }

      // Ensure timestamps are valid (positive and reasonable)
      // If they're negative or too old, use a default range based on resolution
      const now = Math.floor(Date.now() / 1000); // Current time in seconds

      // Calculate default time range based on resolution
      const getDefaultTimeRange = (
        res: ResolutionString
      ): { from: number; to: number } => {
        const to = now;
        let from: number;

        switch (res) {
          case '1':
          case '1min':
          case '5':
          case '5min':
          case '15':
          case '15min':
          case '30':
          case '30min':
            from = now - 86400; // 24 hours for intraday
            break;
          case '60':
          case '1H':
          case 'H':
            from = now - 7 * 86400; // 7 days for hourly
            break;
          case '240':
          case '4H':
            from = now - 30 * 86400; // 30 days for 4-hourly
            break;
          case '1D':
          case 'D':
            from = now - 365 * 86400; // 1 year for daily
            break;
          case '1W':
          case 'W':
            from = now - 2 * 365 * 86400; // 2 years for weekly
            break;
          case '1M':
          case 'M':
            from = now - 5 * 365 * 86400; // 5 years for monthly
            break;
          default:
            from = now - 7 * 86400; // Default: 7 days
        }

        return { from, to };
      };

      let fromTimestamp = periodParams.from;
      let toTimestamp = periodParams.to;

      // Validate timestamps: must be positive, reasonable (not in future), and from < to
      const isValidTimestamp = (ts: number): boolean => {
        // Allow 1 hour in the future for clock skew.
        return ts > 0 && ts <= now + 3600;
      };

      const needsDefaultRange =
        !isValidTimestamp(fromTimestamp) ||
        !isValidTimestamp(toTimestamp) ||
        fromTimestamp >= toTimestamp;

      if (needsDefaultRange) {
        const defaultRange = getDefaultTimeRange(resolution);
        fromTimestamp = defaultRange.from;
        toTimestamp = defaultRange.to;
      }

      // Create cache key using validated timestamps
      const cacheKey = `${symbolInfo.name}_${resolution}_${fromTimestamp}_${toTimestamp}`;

      // Check cache first
      if (this.barsCache.has(cacheKey)) {
        const cachedBars = this.barsCache.get(cacheKey)!;
        onResult(cachedBars, { noData: cachedBars.length === 0 });
        return;
      }

      // If static bars were provided, serve them without calling the network.
      if (this.staticBars) {
        const bars: Bar[] = this.staticBars
          .filter((b) => {
            const tSec = Math.floor(b.time / 1000);
            return tSec >= fromTimestamp && tSec < toTimestamp;
          })
          .sort((a, b) => a.time - b.time);

        this.barsCache.set(cacheKey, bars);
        onResult(bars, { noData: bars.length === 0 });
        return;
      }

      // Fetch data from Mobula API
      if (!this.address || !this.chainId) {
        this.barsCache.set(cacheKey, []);
        onResult([], { noData: true });
        return;
      }

      // Fetch historical data from Mobula API
      this.fetchBarsFromMobula(
        resolution,
        fromTimestamp,
        toTimestamp,
        cacheKey,
        onResult,
        onError
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to get bars';
      console.error('MobulaDatafeed: Error in getBars', error);
      onError(errorMessage);
    }
  }

  private async fetchBarsFromMobula(
    resolution: ResolutionString,
    fromTimestamp: number,
    toTimestamp: number,
    cacheKey: string,
    onResult: (bars: Bar[], meta: { noData: boolean }) => void,
    onError: (reason: string) => void
  ): Promise<void> {
    try {
      if (!this.address || !this.chainId) {
        onError('Missing address or chainId');
        return;
      }

      const period = MobulaDatafeed.convertResolutionToPeriod(resolution);

      // Use RTK Query's initiate method to call the query imperatively
      // This ensures we use the same endpoint, retry logic, and configuration as other Mobula API calls
      const result = await store.dispatch(
        tokenOhlcvHistory.endpoints.getTokenOhlcvHistory.initiate({
          address: this.address,
          chainId: this.chainId,
          period,
          from: fromTimestamp, // RTK Query endpoint already converts to milliseconds
          to:
            toTimestamp && toTimestamp > fromTimestamp
              ? toTimestamp
              : undefined,
        })
      );

      // Handle RTK Query result
      if ('error' in result && result.error) {
        const { error } = result;
        let errorMessage = 'Unknown error';

        if ('data' in error && error.data) {
          const errorData = error.data as
            | { message?: string; error?: string }
            | string;
          if (typeof errorData === 'object' && errorData !== null) {
            errorMessage = errorData.message || errorData.error || errorMessage;
          } else if (typeof errorData === 'string') {
            errorMessage = errorData;
          }
        } else if ('error' in error && typeof error.error === 'string') {
          errorMessage = error.error;
        } else if ('status' in error) {
          errorMessage = `HTTP error! status: ${error.status}`;
        }

        console.error('MobulaDatafeed: API error response', {
          error,
          errorMessage,
        });

        throw new Error(errorMessage);
      }

      // RTK Query returns the data directly (already parsed)
      if (!result.data) {
        this.barsCache.set(cacheKey, []);
        onResult([], { noData: true });
        return;
      }

      const { data } = result;

      // Mobula API returns { result: { data: [...] } } format
      const raw = data?.result?.data || [];

      if (!Array.isArray(raw)) {
        this.barsCache.set(cacheKey, []);
        onResult([], { noData: true });
        return;
      }

      // Convert Mobula format to TradingView Bar format
      // Mobula format: { t: number (ms), o: number, h: number, l: number, c: number, v: number }
      const bars: Bar[] = raw
        .filter((b: MobulaOhlcvData) => {
          if (!b || typeof b.t !== 'number') return false;
          const tSec = Math.floor(b.t / 1000);
          return tSec >= fromTimestamp && tSec <= toTimestamp;
        })
        .map((b: MobulaOhlcvData) => ({
          time: b.t ?? 0,
          open: b.o ?? 0,
          high: b.h ?? 0,
          low: b.l ?? 0,
          close: b.c ?? 0,
          volume: b.v ?? 0,
        }))
        .sort((a, b) => a.time - b.time);

      this.barsCache.set(cacheKey, bars);
      onResult(bars, { noData: bars.length === 0 });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Unknown error fetching bars from Mobula API';
      console.error(
        'MobulaDatafeed: Error fetching bars from Mobula API',
        error
      );
      this.barsCache.set(cacheKey, []);
      onError(`Failed to fetch bars: ${errorMessage}`);
    }
  }

  private static convertResolutionToPeriod(
    resolution: ResolutionString
  ): string {
    switch (resolution) {
      case '1':
        return '1m';
      case '5':
        return '5m';
      case '15':
        return '15m';
      case '30':
        return '30m';
      case '60':
        return '1h';
      case '120':
        return '2h';
      case '240':
        return '4h';
      case '1D':
      case 'D':
        return '1d';
      case '1W':
      case 'W':
        return '1w';
      case '1M':
      case 'M':
        return '1M';
      default:
        return '1h';
    }
  }

  // Calculates the start time of the next bar based on the resolution
  // Following TradingView tutorial pattern: https://www.tradingview.com/charting-library-docs/latest/tutorials/tutorials/implement_datafeed_tutorial/Streaming-Implementation
  // Returns time in milliseconds
  private static getNextBarTime(
    barTime: number,
    resolution: ResolutionString
  ): number {
    const date = new Date(barTime);
    const interval = parseInt(resolution, 10);

    if (resolution === '1D' || resolution === 'D') {
      date.setUTCDate(date.getUTCDate() + 1);
      date.setUTCHours(0, 0, 0, 0);
    } else if (!Number.isNaN(interval)) {
      // Handles '1', '5', '15', '30', '60', '120', '240' (minutes)
      date.setUTCMinutes(date.getUTCMinutes() + interval);
    } else if (resolution === '1W' || resolution === 'W') {
      date.setUTCDate(date.getUTCDate() + 7);
      date.setUTCHours(0, 0, 0, 0);
    } else if (resolution === '1M' || resolution === 'M') {
      date.setUTCMonth(date.getUTCMonth() + 1);
      date.setUTCDate(1);
      date.setUTCHours(0, 0, 0, 0);
    }
    return date.getTime();
  }

  private connectWebSocket(): void {
    if (!this.address || !this.chainId || !this.apiKey) {
      return;
    }

    // Use the production WebSocket endpoint
    // According to Mobula docs, the WebSocket endpoint should be wss://api.mobula.io
    const wsUrl = 'wss://api.mobula.io';

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.addEventListener('open', () => {
        this.reconnectAttempts = 0;
        this.startPingInterval();

        // Small delay before subscribing to ensure connection is fully established
        setTimeout(() => {
          this.resubscribeAll();
        }, WS_SUBSCRIPTION_DELAY_MS);
      });

      this.ws.addEventListener('message', (event) => {
        try {
          const data = JSON.parse(event.data) as MobulaWebSocketMessage;

          // Handle error messages first
          if (
            'event' in data &&
            (data.event === 'error' ||
              data.status === 'error' ||
              data.error !== undefined)
          ) {
            console.error('MobulaDatafeed: WebSocket error response', data);
            return;
          }

          // Handle pong response
          if (
            ('event' in data && data.event === 'pong') ||
            ('type' in data && data.type === 'pong')
          ) {
            return;
          }

          // Check for OHLCV data FIRST (before subscription confirmation)
          // Mobula sends OHLCV data directly with open, high, low, close, volume fields
          // According to Mobula docs, OHLCV messages have these properties directly
          const hasOhlcvData =
            ('open' in data && typeof data.open === 'number') ||
            ('close' in data && typeof data.close === 'number') ||
            ('high' in data && typeof data.high === 'number') ||
            ('low' in data && typeof data.low === 'number') ||
            ('volume' in data && typeof data.volume === 'number') ||
            ('o' in data && typeof data.o === 'number') ||
            ('c' in data && typeof data.c === 'number') ||
            ('h' in data && typeof data.h === 'number') ||
            ('l' in data && typeof data.l === 'number') ||
            ('v' in data && typeof data.v === 'number');

          if (hasOhlcvData) {
            this.handleOhlcvUpdate(data);
            return;
          }

          // Handle subscription confirmation
          // Subscription confirmation has event: 'subscribed' and subscriptionId, but no OHLCV data
          if (
            ('event' in data && data.event === 'subscribed') ||
            ('subscriptionId' in data &&
              data.subscriptionId !== undefined &&
              !hasOhlcvData)
          ) {
            this.handleSubscriptionConfirmation(data);
          }
        } catch (error) {
          console.error(
            'MobulaDatafeed: Error parsing WebSocket message',
            error,
            event.data
          );
        }
      });

      this.ws.addEventListener('error', (error) => {
        console.error('MobulaDatafeed: WebSocket error', error);
      });

      this.ws.addEventListener('close', (event) => {
        this.stopPingInterval();

        // Don't reconnect if it was a clean close (code 1000) or if we have no subscriptions
        // Code 1005 means "No Status Rcvd" - usually means connection was closed abnormally
        if (event.code !== 1000 && this.wsSubscriptions.size > 0) {
          // Only reconnect if we have active subscriptions
          this.attemptReconnect();
        } else {
          // Clean close or no subscriptions - reset reconnect attempts
          this.reconnectAttempts = 0;
        }
      });
    } catch (error) {
      console.error('MobulaDatafeed: Failed to create WebSocket', error);
      this.attemptReconnect();
    }
  }

  private startPingInterval(): void {
    this.stopPingInterval();
    this.pingInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        try {
          // Mobula expects an \"event\" and \"payload\" field even for ping messages.
          this.ws.send(
            JSON.stringify({
              event: 'ping',
              payload: {},
            })
          );
        } catch (error) {
          console.error('MobulaDatafeed: Error sending ping', error);
        }
      }
    }, PING_INTERVAL_MS);
  }

  private stopPingInterval(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      console.error('MobulaDatafeed: Max reconnect attempts reached');
      return;
    }

    this.reconnectAttempts += 1;
    const delay = Math.min(1000 * 2 ** this.reconnectAttempts, 30000);

    this.reconnectTimeout = setTimeout(() => {
      this.connectWebSocket();
    }, delay);
  }

  private resubscribeAll(): void {
    this.wsSubscriptions.forEach((subscription, subscriberUID) => {
      this.subscribeToOhlcv(
        subscriberUID,
        subscription.resolution,
        subscription.onTick
      );
    });
  }

  private subscribeToOhlcv(
    subscriberUID: string,
    resolution: ResolutionString,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _onTick: SubscribeBarsCallback
  ): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return;
    }

    if (!this.address || !this.chainId || !this.apiKey) {
      return;
    }

    const period = MobulaDatafeed.convertResolutionToPeriod(resolution);

    // Try the format from Mobula documentation
    const subscription = {
      type: 'ohlcv',
      authorization: this.apiKey,
      payload: {
        asset: this.address,
        chainId: this.chainId,
        period,
        subscriptionTracking: true,
      },
    };

    try {
      this.ws.send(JSON.stringify(subscription));
    } catch (error) {
      console.error('MobulaDatafeed: Error sending subscription', error);
    }
  }

  private handleSubscriptionConfirmation(data: MobulaWebSocketMessage): void {
    if (!('subscriptionId' in data) && !('subscription_id' in data)) {
      return;
    }

    let subscriptionId: string | undefined;
    if ('subscriptionId' in data && data.subscriptionId) {
      subscriptionId = data.subscriptionId;
    } else if ('subscription_id' in data && data.subscription_id) {
      subscriptionId = data.subscription_id;
    }

    if (!subscriptionId) {
      return;
    }

    // Find the subscription - if we have multiple, match by period or assign to first available
    const period =
      'payload' in data && data.payload ? data.payload.period : undefined;

    Array.from(this.wsSubscriptions.entries()).forEach(
      ([subscriberUID, subscription]) => {
        if (!subscription.subscriptionId) {
          // If period matches or no period specified, assign this subscription ID
          let shouldAssign = false;
          if (!period) {
            shouldAssign = true;
          } else {
            const expectedPeriod = MobulaDatafeed.convertResolutionToPeriod(
              subscription.resolution
            );
            if (period === expectedPeriod) {
              shouldAssign = true;
            }
          }
          if (shouldAssign) {
            const updatedSubscription = {
              ...subscription,
              subscriptionId,
            };
            this.wsSubscriptions.set(subscriberUID, updatedSubscription);
          }
        }
      }
    );
  }

  private handleOhlcvUpdate(data: MobulaWebSocketMessage): void {
    // Mobula sends OHLCV data directly in the message object
    let ohlcv: MobulaOhlcvData | MobulaOhlcvData[] | null = null;

    if ('open' in data || 'close' in data || 'o' in data || 'c' in data) {
      ohlcv = data as MobulaOhlcvData;
    } else if ('data' in data && data.data !== undefined) {
      ohlcv = data.data;
    } else if ('ohlcv' in data) {
      ohlcv = data.ohlcv as MobulaOhlcvData | MobulaOhlcvData[];
    } else if (
      'payload' in data &&
      data.payload &&
      'data' in data.payload &&
      data.payload.data !== undefined
    ) {
      ohlcv = data.payload.data as MobulaOhlcvData | MobulaOhlcvData[];
    }

    if (!ohlcv) {
      if ('event' in data && data.event === 'error') {
        console.error('MobulaDatafeed: WebSocket error', data);
      }
      return;
    }

    // Handle array of OHLCV updates
    const updates = Array.isArray(ohlcv) ? ohlcv : [ohlcv];
    const now = Date.now(); // Current time in milliseconds

    updates.forEach((item: MobulaOhlcvData) => {
      if (
        !item ||
        (item.open === undefined &&
          item.close === undefined &&
          item.o === undefined &&
          item.c === undefined)
      ) {
        return;
      }

      // Extract OHLCV values
      let open = 0;
      if (item.o !== undefined) {
        open = item.o;
      } else if (item.open !== undefined) {
        open = item.open;
      }

      let high = 0;
      if (item.h !== undefined) {
        high = item.h;
      } else if (item.high !== undefined) {
        high = item.high;
      }

      let low = 0;
      if (item.l !== undefined) {
        low = item.l;
      } else if (item.low !== undefined) {
        low = item.low;
      }

      let close = 0;
      if (item.c !== undefined) {
        close = item.c;
      } else if (item.close !== undefined) {
        close = item.close;
      }

      let volume = 0;
      if (item.v !== undefined) {
        volume = item.v;
      } else if (item.volume !== undefined) {
        volume = item.volume;
      }

      // Update all subscriptions
      Array.from(this.wsSubscriptions.entries()).forEach(
        ([subscriberUID, subscription]) => {
          const { lastBar } = subscription;

          // If we don't have a last bar, create one using current time
          if (!lastBar) {
            // Calculate current bar start time
            const currentBarTime = MobulaDatafeed.getCurrentBarStartTime(
              now,
              subscription.resolution
            );
            const firstBar: Bar = {
              time: currentBarTime,
              open,
              high,
              low,
              close,
              volume,
            };
            const updatedSubscription = {
              ...subscription,
              lastBar: firstBar,
            };
            this.wsSubscriptions.set(subscriberUID, updatedSubscription);

            const tickBar = MobulaDatafeed.createTickBar(
              currentBarTime,
              open,
              high,
              low,
              close,
              volume
            );
            if (!tickBar) {
              return;
            }

            subscription.onTick(tickBar);

            // Notify price update callback
            if (this.onPriceUpdate && close > 0) {
              this.onPriceUpdate(close);
            }
            return;
          }

          // Calculate the next bar's start time based on the last bar's time
          const nextBarTime = MobulaDatafeed.getNextBarTime(
            lastBar.time,
            subscription.resolution
          );

          // If current time >= next bar time, create a new bar
          // Otherwise, update the existing bar
          if (now >= nextBarTime) {
            // New bar - start a new candle
            const newBar: Bar = {
              time: nextBarTime,
              open: open !== 0 ? open : lastBar.close, // Use data open, or previous bar's close
              high,
              low,
              close,
              volume,
            };
            const updatedSubscription = {
              ...subscription,
              lastBar: newBar,
            };
            this.wsSubscriptions.set(subscriberUID, updatedSubscription);

            const tickBar = MobulaDatafeed.createTickBar(
              nextBarTime,
              newBar.open,
              newBar.high,
              newBar.low,
              newBar.close,
              newBar.volume
            );
            if (!tickBar) {
              return;
            }

            subscription.onTick(tickBar);

            // Notify price update callback
            if (this.onPriceUpdate && newBar.close > 0) {
              this.onPriceUpdate(newBar.close);
            }
          } else {
            // Update current bar - merge OHLCV values
            const updatedBar: Bar = {
              time: lastBar.time, // Keep the same timestamp
              open: lastBar.open, // Keep original open
              high: Math.max(lastBar.high, high),
              low: Math.min(lastBar.low, low),
              close, // Always update close with latest price
              volume, // Use volume directly (Mobula sends cumulative)
            };
            const updatedSubscription = {
              ...subscription,
              lastBar: updatedBar,
            };
            this.wsSubscriptions.set(subscriberUID, updatedSubscription);

            const tickBar = MobulaDatafeed.createTickBar(
              lastBar.time,
              updatedBar.open,
              updatedBar.high,
              updatedBar.low,
              updatedBar.close,
              updatedBar.volume
            );
            if (!tickBar) {
              return;
            }

            subscription.onTick(tickBar);

            // Notify price update callback (only on close price updates)
            if (this.onPriceUpdate && updatedBar.close > 0) {
              this.onPriceUpdate(updatedBar.close);
            }
          }
        }
      );
    });
  }

  /**
   * Creates a tickBar object for TradingView's onTick callback.
   * Returns null if timestamp is invalid.
   */
  private static createTickBar(
    timeInMs: number,
    open: number,
    high: number,
    low: number,
    close: number,
    volume: number
  ): {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  } | null {
    const time = Math.floor(timeInMs);

    // Validate timestamp is reasonable (not in 1970s or before year 2001)
    if (time < MIN_VALID_TIMESTAMP_MS) {
      console.error('MobulaDatafeed: Invalid timestamp (too small)', {
        time,
        timeInMs,
        date: new Date(timeInMs),
      });
      return null;
    }

    return {
      time,
      open: Number(open),
      high: Number(high),
      low: Number(low),
      close: Number(close),
      volume: Number(volume),
    };
  }

  /**
   * Calculate the start time of the current bar based on resolution.
   * Returns time in milliseconds.
   */
  private static getCurrentBarStartTime(
    now: number,
    resolution: ResolutionString
  ): number {
    const date = new Date(now);
    const utcDate = new Date(
      Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        0,
        0
      )
    );

    const interval = parseInt(resolution, 10);

    if (!Number.isNaN(interval)) {
      // Handles '1', '5', '15', '30', '60', '120', '240' (minutes)
      const currentMinute = utcDate.getUTCMinutes();
      const barMinute = Math.floor(currentMinute / interval) * interval;
      utcDate.setUTCMinutes(barMinute, 0, 0);
    } else if (resolution === '1D' || resolution === 'D') {
      utcDate.setUTCHours(0, 0, 0, 0);
    } else if (resolution === '1W' || resolution === 'W') {
      const dayOfWeek = utcDate.getUTCDay();
      utcDate.setUTCDate(utcDate.getUTCDate() - dayOfWeek);
      utcDate.setUTCHours(0, 0, 0, 0);
    } else if (resolution === '1M' || resolution === 'M') {
      utcDate.setUTCDate(1);
      utcDate.setUTCHours(0, 0, 0, 0);
    }

    return utcDate.getTime();
  }

  subscribeBars(
    _symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    onTick: SubscribeBarsCallback,
    subscriberUID: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _onResetCacheNeededCallback: () => void
  ): void {
    // Store subscription
    this.wsSubscriptions.set(subscriberUID, {
      onTick,
      resolution,
    });

    // Initialize last bar from static bars if available
    if (this.staticBars && this.staticBars.length > 0) {
      const lastBar = this.staticBars[this.staticBars.length - 1];
      const subscription = this.wsSubscriptions.get(subscriberUID);
      if (subscription) {
        const updatedSubscription = {
          ...subscription,
          lastBar,
        };
        this.wsSubscriptions.set(subscriberUID, updatedSubscription);
      }
    }

    // Connect WebSocket if not already connected
    if (!this.ws || this.ws.readyState === WebSocket.CLOSED) {
      this.connectWebSocket();
    } else if (this.ws.readyState === WebSocket.OPEN) {
      // Already connected, subscribe immediately
      this.subscribeToOhlcv(subscriberUID, resolution, onTick);
    }
  }

  unsubscribeBars(subscriberUID: string): void {
    const subscription = this.wsSubscriptions.get(subscriberUID);
    if (!subscription) {
      return;
    }

    // Unsubscribe from WebSocket if we have a subscription ID
    if (
      subscription.subscriptionId &&
      this.ws &&
      this.ws.readyState === WebSocket.OPEN
    ) {
      try {
        this.ws.send(
          JSON.stringify({
            type: 'unsubscribe',
            authorization: this.apiKey,
            payload: {
              subscriptionId: subscription.subscriptionId,
            },
          })
        );
      } catch (error) {
        console.error('MobulaDatafeed: Error unsubscribing', error);
      }
    }

    this.wsSubscriptions.delete(subscriberUID);

    // Close WebSocket if no more subscriptions
    if (this.wsSubscriptions.size === 0 && this.ws) {
      this.ws.close();
      this.ws = null;
      this.stopPingInterval();
    }
  }

  destroy(): void {
    // Unsubscribe from all streams
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(
          JSON.stringify({
            type: 'unsubscribe',
            authorization: this.apiKey,
            payload: {},
          })
        );
      } catch (error) {
        console.error('MobulaDatafeed: Error unsubscribing all', error);
      }
    }

    // Close WebSocket
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    // Clear intervals
    this.stopPingInterval();
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    // Clear subscriptions and cache
    this.wsSubscriptions.clear();
    this.barsCache.clear();
  }
}

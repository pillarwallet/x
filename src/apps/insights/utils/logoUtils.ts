/**
 * Logo utilities for fetching and caching token logos from Mobula
 */

// LocalStorage cache constants
const CACHE_KEY = 'mobula_logo_cache_v2';
const HIT_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const MISS_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

interface LogoCacheEntry {
  url?: string;
  updatedAt: number;
  miss?: boolean;
}

export const loadLogoCache = (): Record<string, LogoCacheEntry> => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return {};

    const cache: Record<string, LogoCacheEntry> = JSON.parse(cached);
    const now = Date.now();

    // Prune expired entries
    const pruned: Record<string, LogoCacheEntry> = {};
    Object.entries(cache).forEach(([symbol, entry]) => {
      const ttl = entry.miss ? MISS_TTL_MS : HIT_TTL_MS;
      if (now - entry.updatedAt < ttl) {
        pruned[symbol] = entry;
      }
    });

    return pruned;
  } catch (err) {
    console.error('Error loading logo cache:', err);
    return {};
  }
};

export const saveLogoCache = (cache: Record<string, LogoCacheEntry>) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (err) {
    console.error('Error saving logo cache:', err);
  }
};

export const getCachedLogo = (
  symbol: string,
  cache: Record<string, LogoCacheEntry>
): string | null => {
  const entry = cache[symbol];
  if (!entry) return null;

  const ttl = entry.miss ? MISS_TTL_MS : HIT_TTL_MS;
  if (Date.now() - entry.updatedAt >= ttl) return null;

  if (entry.miss) return null; // Don't return misses as valid URLs
  return entry.url || null;
};

/**
 * Fetch logo for a symbol from Mobula API
 */
export const fetchLogoFromMobula = async (
  symbol: string
): Promise<string | null> => {
  try {
    console.log(`🔍 Querying Mobula for ${symbol}`);
    const response = await fetch(
      `https://api.mobula.io/api/1/search?mode=og&sortBy=volume_24h&input=${symbol}`,
      {
        method: 'GET',
        headers: {
          Authorization: `${import.meta.env.MOBULA_API_KEY || 'your_api_key_here'}`,
        },
      }
    );
    const data = await response.json();

    if (data?.data?.length > 0) {
      console.log(`📊 ${symbol} results: ${data.data.length} items`);

      // Selection strategy: prefer exact symbol match with highest market_cap
      let selectedToken = null;

      // First, try exact symbol match (case-insensitive)
      const exactMatches = data.data.filter(
        (token: any) => token.symbol?.toUpperCase() === symbol
      );

      if (exactMatches.length > 0) {
        // Pick highest market_cap, fallback to liquidity, then volume
        selectedToken = exactMatches.reduce((best: any, current: any) => {
          const bestScore =
            best.market_cap || best.liquidity || best.volume || 0;
          const currentScore =
            current.market_cap || current.liquidity || current.volume || 0;
          return currentScore > bestScore ? current : best;
        });
        console.log(
          `✓ ${symbol} exact match: ${selectedToken.name} (${selectedToken.symbol}) - market_cap: ${selectedToken.market_cap}`
        );
      } else {
        // Fallback: pick item with highest market_cap that has a logo
        selectedToken = data.data
          .filter((token: any) => token.logo)
          .reduce((best: any, current: any) => {
            if (!best) return current;
            const bestScore =
              best.market_cap || best.liquidity || best.volume || 0;
            const currentScore =
              current.market_cap || current.liquidity || current.volume || 0;
            return currentScore > bestScore ? current : best;
          }, null);

        if (selectedToken) {
          console.log(
            `⚠️ ${symbol} fallback match: ${selectedToken.name} (${selectedToken.symbol})`
          );
        }
      }

      if (selectedToken?.logo) {
        return selectedToken.logo;
      }
    }

    return null;
  } catch (err) {
    console.error(`❌ Failed to fetch logo for ${symbol}:`, err);
    return null;
  }
};

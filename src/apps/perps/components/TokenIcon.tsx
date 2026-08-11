import { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface TokenIconProps {
  symbol: string;
  size?: number;
  className?: string;
}

export function TokenIcon({
  symbol,
  size = 24,
  className = '',
}: TokenIconProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Logic to clean symbol (e.g., kPEPE -> PEPE) for file lookup
  let fileSymbol = symbol;
  if (symbol.startsWith('k') && symbol.length > 2 && symbol !== 'kBENJI') {
    fileSymbol = symbol.slice(1);
  }
  // Handle specific edge cases if known, e.g. HYPE -> HYPE.svg (standard)

  const iconUrl = `https://app.hyperliquid.xyz/coins/${fileSymbol}.svg`;

  if (error) {
    return (
      <div
        className={`flex items-center justify-center bg-muted rounded-full ${className}`}
        style={{ width: size, height: size }}
      >
        <span className="font-bold text-[10px] text-muted-foreground select-none">
          {symbol.slice(0, 1)}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-full">
          <Loader2
            className="animate-spin text-muted-foreground opacity-50"
            size={size * 0.5}
          />
        </div>
      )}
      <img
        src={iconUrl}
        alt={symbol}
        className={`rounded-full transition-opacity duration-200 ${loading ? 'opacity-0' : 'opacity-100'}`}
        width={size}
        height={size}
        onLoad={() => setLoading(false)}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
        style={{ width: size, height: size, objectFit: 'cover' }}
      />
    </div>
  );
}

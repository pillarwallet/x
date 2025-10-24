import { Asset } from '../types';
import { formatBalance, formatUsdValue } from '../utils/blockchain';
import defaultLogo from '../images/logo-unknown.png';

interface AssetRowProps {
  asset: Asset;
  onClick: (asset: Asset) => void;
}

const AssetRow = ({ asset, onClick }: AssetRowProps) => {
  const priceChangeColor =
    asset.price_change_24h >= 0 ? 'text-green-400' : 'text-red-400';

  return (
    <button
      onClick={() => onClick(asset)}
      className="w-full bg-white/5 hover:bg-white/10 rounded-xl p-4 transition-all cursor-pointer group"
      type="button"
    >
      <div className="flex items-center gap-4">
        {/* Token Logo */}
        <div className="flex-shrink-0">
          <img
            src={asset.logo || defaultLogo}
            alt={asset.symbol || 'token'}
            className="w-12 h-12 rounded-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = defaultLogo;
            }}
          />
        </div>

        {/* Token Info */}
        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-baseline gap-2">
            <h3 className="text-base font-semibold text-white truncate">
              {asset.symbol || '(no symbol)'}
            </h3>
            <span className="text-xs text-white/60">{asset.chainName}</span>
          </div>
          <p className="text-sm text-white/60 truncate">
            {asset.name || '(no name)'}
          </p>
        </div>

        {/* Balance and Value */}
        <div className="text-right flex-shrink-0">
          <p className="text-base font-semibold text-white">
            {formatBalance(asset.balance)}
          </p>
          <p className="text-sm text-white/60">
            {formatUsdValue(asset.usdBalance)}
          </p>
          {asset.price_change_24h !== 0 && (
            <p className={`text-xs ${priceChangeColor}`}>
              {asset.price_change_24h > 0 ? '+' : ''}
              {asset.price_change_24h.toFixed(2)}%
            </p>
          )}
        </div>
      </div>
    </button>
  );
};

export default AssetRow;


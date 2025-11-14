// Core
import { useState, useCallback, useEffect } from 'react';

// Types
import { Asset } from '../types';

// Utils
import { formatUsdValue } from '../utils/blockchain';

// Components
import AssetRow from './AssetRow';
import SearchAssets from './SearchAssets';

interface AssetsListProps {
  assets: Asset[];
  totalValue: number;
  isLoading: boolean;
  isRefreshing?: boolean;
  onAssetClick: (asset: Asset) => void;
  onRefresh?: () => void;
}

const AssetsList = ({
  assets,
  totalValue,
  isLoading,
  isRefreshing = false,
  onAssetClick,
  onRefresh,
}: AssetsListProps) => {
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>(assets);

  // Update filtered assets when assets prop changes
  useEffect(() => {
    setFilteredAssets(assets);
  }, [assets]);

  const handleFilteredAssetsChange = useCallback((filtered: Asset[]) => {
    setFilteredAssets(filtered);
  }, []);
  if (isLoading) {
    return (
      <div className="w-full">
        {/* Loading Header */}
        <div className="bg-white/5 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 border-4 border-purple_medium border-t-transparent rounded-full animate-spin" />
            <span className="text-white/80 font-medium">Loading your assets...</span>
          </div>
          <div className="h-6 bg-white/10 rounded animate-pulse mb-2 w-32" />
          <div className="h-10 bg-white/10 rounded animate-pulse w-48" />
        </div>

        {/* Loading Asset Rows */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Your Assets</h2>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="bg-white/5 rounded-xl p-4"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex items-center gap-4">
                  {/* Avatar skeleton */}
                  <div className="w-12 h-12 rounded-full bg-white/10 animate-pulse" />
                  
                  {/* Content skeleton */}
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white/10 rounded animate-pulse w-24" />
                    <div className="h-3 bg-white/10 rounded animate-pulse w-32" />
                  </div>
                  
                  {/* Value skeleton */}
                  <div className="text-right space-y-2">
                    <div className="h-4 bg-white/10 rounded animate-pulse w-20 ml-auto" />
                    <div className="h-3 bg-white/10 rounded animate-pulse w-16 ml-auto" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!assets || assets.length === 0) {
    return (
      <div className="w-full bg-white/5 rounded-2xl p-8 text-center">
        <div className="text-4xl mb-4">💰</div>
        <h3 className="text-xl font-semibold text-white mb-2">
          No Assets Found
        </h3>
        <p className="text-white/60">
          Your wallet doesn't have any assets yet. Send some assets to your
          address to get started!
        </p>
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isRefreshing && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-transparent" />
            )}
            <span>{isRefreshing ? 'Checking...' : 'Check for assets again'}</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Total Portfolio Value */}
      <div className="bg-white/5 rounded-2xl p-6 mb-6">
        <h2 className="text-sm text-white/60 mb-2">Total Portfolio Value</h2>
        <p className="text-3xl font-bold text-white">
          {formatUsdValue(totalValue)}
        </p>
        <p className="text-xs text-white/40 mt-2">
          Across {assets.length} asset{assets.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Assets List */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Your Assets</h2>
        
        {/* Search */}
        <SearchAssets
          assets={assets}
          onFilteredAssetsChange={handleFilteredAssetsChange}
        />

        {/* Filtered Assets */}
        {filteredAssets.length === 0 ? (
          <div className="bg-white/5 rounded-xl p-8 text-center">
            <div className="text-3xl mb-3">🔍</div>
            <p className="text-white/60">No assets found matching your search</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAssets.map((asset) => (
              <AssetRow
                key={`${asset.contract}-${asset.chainId}`}
                asset={asset}
                onClick={onAssetClick}
              />
            ))}
          </div>
        )}
        
        {/* Result count if filtered */}
        {filteredAssets.length !== assets.length && filteredAssets.length > 0 && (
          <p className="text-xs text-white/60 mt-4 text-center">
            Showing {filteredAssets.length} of {assets.length} asset{assets.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>
    </div>
  );
};

export default AssetsList;


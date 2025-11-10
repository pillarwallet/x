// Core
import { useState, useMemo, useEffect } from 'react';

// Vendors
import Fuse from 'fuse.js';

// Types
import { Asset } from '../types';

interface SearchAssetsProps {
  assets: Asset[];
  onFilteredAssetsChange: (filteredAssets: Asset[]) => void;
}

const SearchAssets = ({ assets, onFilteredAssetsChange }: SearchAssetsProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Configure Fuse.js for fuzzy search
  const fuse = useMemo(() => {
    const options = {
      keys: [
        { name: 'symbol', weight: 2 },
        { name: 'name', weight: 1.5 },
        { name: 'chainName', weight: 1 },
      ],
      threshold: 0.3, // Lower = more strict matching
      includeScore: true,
      minMatchCharLength: 1,
    };
    return new Fuse(assets, options);
  }, [assets]);

  // Filter assets based on search query - use useEffect for side effects
  useEffect(() => {
    if (!searchQuery.trim()) {
      onFilteredAssetsChange(assets);
    } else {
      const results = fuse.search(searchQuery);
      const filteredAssets = results.map((result) => result.item);
      onFilteredAssetsChange(filteredAssets);
    }
  }, [searchQuery, assets, fuse, onFilteredAssetsChange]);

  const handleClear = () => {
    setSearchQuery('');
  };

  return (
    <div className="mb-4">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by token name, symbol, or chain..."
          className="w-full px-4 py-3 pl-12 pr-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple_medium transition-colors"
        />
        {/* Search Icon */}
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {/* Clear Button */}
        {searchQuery && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-white/40 hover:text-white transition-colors"
            type="button"
            aria-label="Clear search"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
      {searchQuery && (
        <p className="text-xs text-white/60 mt-2">
          Searching for "{searchQuery}"
        </p>
      )}
    </div>
  );
};

export default SearchAssets;


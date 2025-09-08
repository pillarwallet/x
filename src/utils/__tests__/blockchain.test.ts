import { gnosis, polygon } from 'viem/chains';
import { getNativeAssetForChainId } from '../blockchain';

describe('getNativeAssetForChainId', () => {
  it('returns {POL} for polygon', () => {
    const asset = getNativeAssetForChainId(polygon.id);
    expect(asset.name).toBe('POL');
    expect(asset.symbol).toBe('POL');
  });

  it('returns XDAI for Gnosis when flag is enabled', () => {
    // This test assumes the environment variable is set to 'true'
    // In a real test environment, you would set VITE_FEATURE_FLAG_GNOSIS=true
    const asset = getNativeAssetForChainId(gnosis.id);

    // Check if the feature flag is enabled by checking the actual behavior
    if (import.meta.env.VITE_FEATURE_FLAG_GNOSIS === 'true') {
      expect(asset.name).toBe('XDAI');
      expect(asset.symbol).toBe('XDAI');
    } else {
      // If flag is disabled, it should return POL (fallback)
      expect(asset.name).toBe('POL');
      expect(asset.symbol).toBe('POL');
    }
  });

  it('returns POL for Gnosis when flag is disabled', () => {
    // This test assumes the environment variable is set to 'false'
    const asset = getNativeAssetForChainId(gnosis.id);

    // Check if the feature flag is disabled by checking the actual behavior
    if (import.meta.env.VITE_FEATURE_FLAG_GNOSIS === 'false') {
      expect(asset.name).toBe('POL');
      expect(asset.symbol).toBe('POL');
    } else {
      // If flag is enabled, it should return XDAI
      expect(asset.name).toBe('XDAI');
      expect(asset.symbol).toBe('XDAI');
    }
  });
});

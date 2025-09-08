import { gnosis, polygon } from 'viem/chains';
import { getNativeAssetForChainId } from '../blockchain';

// Mock the environment variable
const originalEnv = import.meta.env;

describe('getNativeAssetForChainId', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Reset environment
    Object.defineProperty(import.meta, 'env', {
      value: originalEnv,
      writable: true,
    });
  });

  it('returns {POL} for polygon', () => {
    const asset = getNativeAssetForChainId(polygon.id);
    expect(asset.name).toBe('POL');
    expect(asset.symbol).toBe('POL');
  });

  describe('when Gnosis feature flag is enabled', () => {
    beforeEach(() => {
      Object.defineProperty(import.meta, 'env', {
        value: { ...originalEnv, VITE_FEATURE_FLAG_GNOSIS: 'true' },
        writable: true,
      });
    });

    it('returns XDAI for Gnosis', () => {
      const asset = getNativeAssetForChainId(gnosis.id);
      expect(asset.name).toBe('XDAI');
      expect(asset.symbol).toBe('XDAI');
    });
  });

  describe('when Gnosis feature flag is disabled', () => {
    beforeEach(() => {
      Object.defineProperty(import.meta, 'env', {
        value: { ...originalEnv, VITE_FEATURE_FLAG_GNOSIS: 'false' },
        writable: true,
      });
    });

    it('returns POL for Gnosis (fallback)', () => {
      const asset = getNativeAssetForChainId(gnosis.id);
      expect(asset.name).toBe('POL');
      expect(asset.symbol).toBe('POL');
    });
  });
});

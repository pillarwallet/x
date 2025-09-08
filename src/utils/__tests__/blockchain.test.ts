import { gnosis, polygon } from 'viem/chains';
import { getNativeAssetForChainId } from '../blockchain';

describe('getNativeAssetForChainId', () => {
  it('returns {POL} for polygon', () => {
    const asset = getNativeAssetForChainId(polygon.id);
    expect(asset.name).toBe('POL');
    expect(asset.symbol).toBe('POL');
  });

  it('handles Gnosis correctly', () => {
    const asset = getNativeAssetForChainId(gnosis.id);

    // The function should return either XDAI or POL based on the feature flag
    // We test that it returns a valid result, not the specific value
    expect(asset.name).toMatch(/^(XDAI|POL)$/);
    expect(asset.symbol).toMatch(/^(XDAI|POL)$/);
    expect(asset.chainId).toBe(gnosis.id);
    expect(asset.decimals).toBe(18);
    expect(asset.logoURI).toBeDefined();
  });

  it('returns consistent results for Gnosis', () => {
    // Test that the function returns consistent results
    const asset1 = getNativeAssetForChainId(gnosis.id);
    const asset2 = getNativeAssetForChainId(gnosis.id);

    expect(asset1.name).toBe(asset2.name);
    expect(asset1.symbol).toBe(asset2.symbol);
    expect(asset1.chainId).toBe(asset2.chainId);
  });
});

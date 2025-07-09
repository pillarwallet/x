import { gnosis, polygon } from 'viem/chains';
import { getNativeAssetForChainId } from '../blockchain';

describe('getNativeAssetForChainId', () => {
  it('returns {POL} for polygon', () => {
    const asset = getNativeAssetForChainId(polygon.id);
    expect(asset.name).toBe('POL');
    expect(asset.symbol).toBe('POL');
  });

  it('returns XDAI for Gnosis', () => {
    const asset = getNativeAssetForChainId(gnosis.id);
    expect(asset.name).toBe('XDAI');
    expect(asset.symbol).toBe('XDAI');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
});

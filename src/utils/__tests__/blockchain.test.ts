import { getNativeAssetForChainId } from '../blockchain';
import { polygon, mainnet } from 'viem/chains';

describe('getNativeAssetForChainId', () => {
  it('returns Ether for mainnet', () => {
    const asset = getNativeAssetForChainId(mainnet.id);
    expect(asset.name).toBe('Ether');
    expect(asset.symbol).toBe('ETH');
  });

  it('returns Matic for Polygon', () => {
    const asset = getNativeAssetForChainId(polygon.id);
    expect(asset.name).toBe('Matic');
    expect(asset.symbol).toBe('MATIC');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});


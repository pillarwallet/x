import { getNativeAssetForChainId, getNativeAssetBalance, getAssetBalance } from '../blockchain';
import { polygon, mainnet } from 'viem/chains';
import { ethers } from 'ethers';

// services
import * as blastApi from '../../services/blastApi';

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

describe('getNativeAssetBalance', () => {
  it('returns zero balance when API call fails', async () => {
    jest.spyOn(blastApi, 'callBlastApi').mockResolvedValue(undefined);
    const balance = await getNativeAssetBalance(mainnet.id, '0x1234567890abcdef');
    expect(balance.balance.toString()).toBe('0');
  });

  it('returns balance when API call succeeds', async () => {
    jest.spyOn(blastApi, 'callBlastApi').mockResolvedValue(ethers.BigNumber.from('1000'));
    const balance = await getNativeAssetBalance(mainnet.id, '0x1234567890abcdef');
    expect(balance.balance.toString()).toBe('1000');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});

describe('getAssetBalance', () => {
  it('throws error on wrong wallet address', async () => {
    const balance = getAssetBalance(mainnet.id, '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', '0x123ggg');
    expect(balance).rejects.toThrow();
  });

  it('returns zero balance when API call fails', async () => {
    jest.spyOn(blastApi, 'callBlastApi').mockResolvedValue(undefined);
    const balance = await getAssetBalance(mainnet.id, '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', '0x7F30B1960D5556929B03a0339814fE903c55a347');
    expect(balance.balance.toString()).toBe('0');
  });

  it('returns balance when API call succeeds', async () => {
    jest.spyOn(blastApi, 'callBlastApi').mockResolvedValue(ethers.BigNumber.from('1000'));
    const balance = await getAssetBalance(mainnet.id, '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', '0x7F30B1960D5556929B03a0339814fE903c55a347');
    expect(balance.balance.toString()).toBe('1000');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});

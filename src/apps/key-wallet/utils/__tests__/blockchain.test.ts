import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getChainById,
  isNativeAsset,
  switchChain,
  getCurrentChainId,
  sendTransaction,
  getBlockExplorerUrl,
  formatBalance,
  formatUsdValue,
  shortenAddress,
} from '../blockchain';
import { Asset } from '../../types';

// Mock viem functions
vi.mock('viem', async () => {
  const actual = await vi.importActual('viem');
  return {
    ...actual,
    createWalletClient: vi.fn(),
    createPublicClient: vi.fn(),
    encodeFunctionData: vi.fn(),
    parseUnits: vi.fn((value: string, decimals: number) => {
      const num = parseFloat(value);
      return BigInt(Math.floor(num * Math.pow(10, decimals)));
    }),
    // Keep the actual isAddress function - it works fine with valid addresses
    isAddress: actual.isAddress,
  };
});

describe('blockchain utils', () => {
  describe('getChainById', () => {
    it('returns correct chain for Ethereum mainnet', () => {
      const chain = getChainById(1);
      expect(chain.id).toBe(1);
      expect(chain.name).toBe('Ethereum');
    });

    it('returns correct chain for Polygon', () => {
      const chain = getChainById(137);
      expect(chain.id).toBe(137);
      expect(chain.name).toBe('Polygon');
    });

    it('returns correct chain for Base', () => {
      const chain = getChainById(8453);
      expect(chain.id).toBe(8453);
      expect(chain.name).toBe('Base');
    });

    it('throws error for unsupported chain ID', () => {
      expect(() => getChainById(99999)).toThrow('Unsupported chain ID: 99999');
    });
  });

  describe('isNativeAsset', () => {
    it('returns true for zero address', () => {
      expect(isNativeAsset('0x0000000000000000000000000000000000000000')).toBe(true);
    });

    it('returns true for ETH placeholder address', () => {
      expect(isNativeAsset('0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')).toBe(true);
      expect(isNativeAsset('0xEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE')).toBe(true);
    });

    it('returns false for regular contract address', () => {
      expect(isNativeAsset('0x1234567890123456789012345678901234567890')).toBe(false);
    });
  });

  describe('switchChain', () => {
    let mockProvider: any;

    beforeEach(() => {
      mockProvider = {
        request: vi.fn(),
      };
    });

    it('switches to chain successfully', async () => {
      mockProvider.request.mockResolvedValueOnce(null);
      
      await switchChain(1, mockProvider);
      
      expect(mockProvider.request).toHaveBeenCalledWith({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x1' }],
      });
    });

    it('adds chain if not present (error 4902)', async () => {
      const switchError = { code: 4902 };
      mockProvider.request
        .mockRejectedValueOnce(switchError)
        .mockResolvedValueOnce(null);

      await switchChain(137, mockProvider);

      expect(mockProvider.request).toHaveBeenCalledTimes(2);
      expect(mockProvider.request).toHaveBeenCalledWith({
        method: 'wallet_addEthereumChain',
        params: expect.arrayContaining([
          expect.objectContaining({
            chainId: '0x89',
            chainName: 'Polygon',
          }),
        ]),
      });
    });

    it('throws error if switch fails with non-4902 error', async () => {
      const switchError = { code: 4001, message: 'User rejected' };
      mockProvider.request.mockRejectedValueOnce(switchError);

      await expect(switchChain(1, mockProvider)).rejects.toThrow(
        'Failed to switch to Ethereum. Please switch manually in your wallet.'
      );
    });

    it('throws error if provider has no request method', async () => {
      await expect(switchChain(1, {})).rejects.toThrow(
        'Wallet provider does not support chain switching'
      );
    });
  });

  describe('getCurrentChainId', () => {
    let mockProvider: any;

    beforeEach(() => {
      mockProvider = {
        request: vi.fn(),
      };
    });

    it('returns chain ID successfully', async () => {
      mockProvider.request.mockResolvedValueOnce('0x1');
      
      const chainId = await getCurrentChainId(mockProvider);
      
      expect(chainId).toBe(1);
      expect(mockProvider.request).toHaveBeenCalledWith({
        method: 'eth_chainId',
      });
    });

    it('returns null if provider has no request method', async () => {
      const chainId = await getCurrentChainId({});
      expect(chainId).toBeNull();
    });

    it('returns null on error', async () => {
      mockProvider.request.mockRejectedValueOnce(new Error('Failed'));
      
      const chainId = await getCurrentChainId(mockProvider);
      expect(chainId).toBeNull();
    });
  });

  describe('sendTransaction', () => {
    let mockProvider: any;
    let mockWalletClient: any;
    let mockPublicClient: any;
    const mockAsset: Asset = {
      id: 1,
      name: 'Ethereum',
      symbol: 'ETH',
      logo: '',
      balance: 1.5,
      decimals: 18,
      price: 2500,
      price_change_24h: 0,
      contract: '0x0000000000000000000000000000000000000000',
      chainId: 1,
      chainName: 'Ethereum',
      usdBalance: 3750,
    };

    beforeEach(async () => {
      const viem = await import('viem');
      mockProvider = {
        request: vi.fn(),
      };
      mockWalletClient = {
        getAddresses: vi.fn().mockResolvedValue(['0x1234567890123456789012345678901234567890']),
        sendTransaction: vi.fn().mockResolvedValue('0xtxhash'),
      };
      mockPublicClient = {
        estimateGas: vi.fn().mockResolvedValue(BigInt(21000)),
      };

      vi.mocked(viem.createWalletClient).mockReturnValue(mockWalletClient as any);
      vi.mocked(viem.createPublicClient).mockReturnValue(mockPublicClient as any);
    });

    it('sends native token transaction successfully', async () => {
      const txHash = await sendTransaction(
        mockAsset,
        '0x1234567890123456789012345678901234567890',
        '1.0',
        mockProvider
      );
      
      expect(txHash).toBe('0xtxhash');
      expect(mockWalletClient.sendTransaction).toHaveBeenCalled();
      expect(mockPublicClient.estimateGas).toHaveBeenCalled();
    });

    it('sends ERC-20 token transaction successfully', async () => {
      const viem = await import('viem');
      const erc20Asset: Asset = {
        ...mockAsset,
        contract: '0x1234567890123456789012345678901234567890',
      };

      vi.mocked(viem.encodeFunctionData).mockReturnValue('0xencoded' as `0x${string}`);

      const txHash = await sendTransaction(
        erc20Asset,
        '0x1234567890123456789012345678901234567890',
        '1.0',
        mockProvider
      );
      
      expect(txHash).toBe('0xtxhash');
      expect(viem.encodeFunctionData).toHaveBeenCalled();
      expect(mockWalletClient.sendTransaction).toHaveBeenCalled();
    });

    it('throws error for invalid recipient address', async () => {
      await expect(
        sendTransaction(mockAsset, 'invalid-address', '1.0', mockProvider)
      ).rejects.toThrow('Invalid recipient address');
    });

    it('throws error for invalid amount', async () => {
      await expect(
        sendTransaction(
          mockAsset,
          '0x1234567890123456789012345678901234567890',
          'invalid',
          mockProvider
        )
      ).rejects.toThrow('Amount must be a positive number');
    });

    it('throws error for zero amount', async () => {
      await expect(
        sendTransaction(
          mockAsset,
          '0x1234567890123456789012345678901234567890',
          '0',
          mockProvider
        )
      ).rejects.toThrow('Amount must be a positive number');
    });

    it('throws error for insufficient balance', async () => {
      await expect(
        sendTransaction(
          mockAsset,
          '0x1234567890123456789012345678901234567890',
          '2.0',
          mockProvider
        )
      ).rejects.toThrow('Insufficient balance');
    });

    it('throws error when no account found', async () => {
      mockWalletClient.getAddresses.mockResolvedValueOnce([]);
      
      await expect(
        sendTransaction(
          mockAsset,
          '0x1234567890123456789012345678901234567890',
          '1.0',
          mockProvider
        )
      ).rejects.toThrow('No account found');
    });
  });

  describe('getBlockExplorerUrl', () => {
    it('returns correct URL for Ethereum', () => {
      expect(getBlockExplorerUrl(1, '0xtxhash')).toBe('https://etherscan.io/tx/0xtxhash');
    });

    it('returns correct URL for Polygon', () => {
      expect(getBlockExplorerUrl(137, '0xtxhash')).toBe('https://polygonscan.com/tx/0xtxhash');
    });

    it('returns correct URL for Base', () => {
      expect(getBlockExplorerUrl(8453, '0xtxhash')).toBe('https://basescan.org/tx/0xtxhash');
    });

    it('returns correct URL for BNB Smart Chain', () => {
      expect(getBlockExplorerUrl(56, '0xtxhash')).toBe('https://bscscan.com/tx/0xtxhash');
    });

    it('returns correct URL for Optimism', () => {
      expect(getBlockExplorerUrl(10, '0xtxhash')).toBe('https://optimistic.etherscan.io/tx/0xtxhash');
    });

    it('returns correct URL for Arbitrum', () => {
      expect(getBlockExplorerUrl(42161, '0xtxhash')).toBe('https://arbiscan.io/tx/0xtxhash');
    });

    it('returns empty string for unknown chain', () => {
      expect(getBlockExplorerUrl(99999, '0xtxhash')).toBe('');
    });
  });

  describe('formatBalance', () => {
    it('formats zero correctly', () => {
      expect(formatBalance(0)).toBe('0');
    });

    it('formats small values with less than symbol', () => {
      expect(formatBalance(0.00005)).toBe('<0.0001');
    });

    it('formats normal values with 4 decimals', () => {
      expect(formatBalance(1.23456789)).toBe('1.2346');
    });

    it('respects custom decimals', () => {
      expect(formatBalance(1.23456789, 2)).toBe('1.23');
    });
  });

  describe('formatUsdValue', () => {
    it('formats zero correctly', () => {
      expect(formatUsdValue(0)).toBe('$0.00');
    });

    it('formats small values with less than symbol', () => {
      expect(formatUsdValue(0.005)).toBe('<$0.01');
    });

    it('formats normal values with 2 decimals', () => {
      expect(formatUsdValue(1234.567)).toBe('$1,234.57');
    });

    it('formats large values with comma separators', () => {
      expect(formatUsdValue(1000000)).toBe('$1,000,000.00');
    });
  });

  describe('shortenAddress', () => {
    it('shortens address with default chars', () => {
      const address = '0x1234567890123456789012345678901234567890';
      expect(shortenAddress(address)).toBe('0x1234...7890');
    });

    it('shortens address with custom chars', () => {
      const address = '0x1234567890123456789012345678901234567890';
      expect(shortenAddress(address, 6)).toBe('0x123456...567890');
    });
  });
});

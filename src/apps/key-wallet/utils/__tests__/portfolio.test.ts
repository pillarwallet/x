import { describe, it, expect } from 'vitest';
import {
  transformPortfolioToAssets,
  getTotalPortfolioValue,
  groupAssetsByChain,
} from '../portfolio';
import { PortfolioData } from '../../../../types/api';

describe('portfolio utils', () => {
  describe('transformPortfolioToAssets', () => {
    it('returns empty array when portfolioData is undefined', () => {
      const result = transformPortfolioToAssets(undefined);
      expect(result).toEqual([]);
    });

    it('returns empty array when portfolioData.assets is undefined', () => {
      const portfolioData = {} as PortfolioData;
      const result = transformPortfolioToAssets(portfolioData);
      expect(result).toEqual([]);
    });

    it('returns empty array when portfolioData.assets is empty', () => {
      const portfolioData: PortfolioData = {
        assets: [],
      } as PortfolioData;
      const result = transformPortfolioToAssets(portfolioData);
      expect(result).toEqual([]);
    });

    it('filters out assets with zero balance', () => {
      const portfolioData: PortfolioData = {
        assets: [
          {
            asset: {
              id: 1,
              name: 'Ethereum',
              symbol: 'ETH',
              logo: 'eth-logo.png',
            },
            price: 2500,
            price_change_24h: 5.5,
            contracts_balances: [
              {
                address: '0x0000000000000000000000000000000000000000',
                chainId: 'eip155:1',
                balance: 0,
                decimals: 18,
              },
              {
                address: '0x0000000000000000000000000000000000000000',
                chainId: 'eip155:137',
                balance: 1.5,
                decimals: 18,
              },
            ],
          },
        ],
      } as PortfolioData;

      const result = transformPortfolioToAssets(portfolioData);
      expect(result).toHaveLength(1);
      expect(result[0].chainId).toBe(137);
      expect(result[0].balance).toBe(1.5);
    });

    it('transforms portfolio data correctly', () => {
      const portfolioData: PortfolioData = {
        assets: [
          {
            asset: {
              id: 1,
              name: 'Ethereum',
              symbol: 'ETH',
              logo: 'eth-logo.png',
            },
            price: 2500,
            price_change_24h: 5.5,
            contracts_balances: [
              {
                address: '0x0000000000000000000000000000000000000000',
                chainId: 'eip155:1',
                balance: 2.5,
                decimals: 18,
              },
            ],
          },
        ],
      } as PortfolioData;

      const result = transformPortfolioToAssets(portfolioData);
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: 1,
        name: 'Ethereum',
        symbol: 'ETH',
        logo: 'eth-logo.png',
        balance: 2.5,
        decimals: 18,
        price: 2500,
        price_change_24h: 5.5,
        contract: '0x0000000000000000000000000000000000000000',
        chainId: 1,
        chainName: 'Ethereum',
        usdBalance: 6250, // 2.5 * 2500
      });
    });

    it('sorts assets by USD balance (highest first)', () => {
      const portfolioData: PortfolioData = {
        assets: [
          {
            asset: {
              id: 1,
              name: 'Low Value Token',
              symbol: 'LVT',
              logo: 'lvt-logo.png',
            },
            price: 1,
            price_change_24h: 0,
            contracts_balances: [
              {
                address: '0x111',
                chainId: 'eip155:1',
                balance: 100,
                decimals: 18,
              },
            ],
          },
          {
            asset: {
              id: 2,
              name: 'High Value Token',
              symbol: 'HVT',
              logo: 'hvt-logo.png',
            },
            price: 1000,
            price_change_24h: 0,
            contracts_balances: [
              {
                address: '0x222',
                chainId: 'eip155:1',
                balance: 10,
                decimals: 18,
              },
            ],
          },
        ],
      } as PortfolioData;

      const result = transformPortfolioToAssets(portfolioData);
      expect(result).toHaveLength(2);
      expect(result[0].symbol).toBe('HVT'); // 1000 * 10 = 10000
      expect(result[1].symbol).toBe('LVT'); // 1 * 100 = 100
      expect(result[0].usdBalance).toBeGreaterThan(result[1].usdBalance);
    });

    it('handles unknown chain IDs', () => {
      const portfolioData: PortfolioData = {
        assets: [
          {
            asset: {
              id: 1,
              name: 'Test Token',
              symbol: 'TEST',
              logo: 'test-logo.png',
            },
            price: 10,
            price_change_24h: 0,
            contracts_balances: [
              {
                address: '0x111',
                chainId: 'eip155:99999',
                balance: 1,
                decimals: 18,
              },
            ],
          },
        ],
      } as PortfolioData;

      const result = transformPortfolioToAssets(portfolioData);
      expect(result[0].chainName).toBe('Unknown');
      expect(result[0].chainId).toBe(99999);
    });

    it('handles missing price values', () => {
      const portfolioData: PortfolioData = {
        assets: [
          {
            asset: {
              id: 1,
              name: 'Test Token',
              symbol: 'TEST',
              logo: 'test-logo.png',
            },
            price: null as any,
            price_change_24h: null as any,
            contracts_balances: [
              {
                address: '0x111',
                chainId: 'eip155:1',
                balance: 1,
                decimals: 18,
              },
            ],
          },
        ],
      } as PortfolioData;

      const result = transformPortfolioToAssets(portfolioData);
      expect(result[0].price).toBe(0);
      expect(result[0].price_change_24h).toBe(0);
      expect(result[0].usdBalance).toBe(0);
    });
  });

  describe('getTotalPortfolioValue', () => {
    it('returns 0 for empty array', () => {
      const result = getTotalPortfolioValue([]);
      expect(result).toBe(0);
    });

    it('calculates total value correctly', () => {
      const assets = [
        {
          id: 1,
          name: 'Token 1',
          symbol: 'T1',
          logo: '',
          balance: 10,
          decimals: 18,
          price: 100,
          price_change_24h: 0,
          contract: '0x1',
          chainId: 1,
          chainName: 'Ethereum',
          usdBalance: 1000,
        },
        {
          id: 2,
          name: 'Token 2',
          symbol: 'T2',
          logo: '',
          balance: 5,
          decimals: 18,
          price: 200,
          price_change_24h: 0,
          contract: '0x2',
          chainId: 1,
          chainName: 'Ethereum',
          usdBalance: 1000,
        },
      ];
      const result = getTotalPortfolioValue(assets);
      expect(result).toBe(2000);
    });
  });

  describe('groupAssetsByChain', () => {
    it('returns empty object for empty array', () => {
      const result = groupAssetsByChain([]);
      expect(result).toEqual({});
    });

    it('groups assets by chain name correctly', () => {
      const assets = [
        {
          id: 1,
          name: 'Token 1',
          symbol: 'T1',
          logo: '',
          balance: 10,
          decimals: 18,
          price: 100,
          price_change_24h: 0,
          contract: '0x1',
          chainId: 1,
          chainName: 'Ethereum',
          usdBalance: 1000,
        },
        {
          id: 2,
          name: 'Token 2',
          symbol: 'T2',
          logo: '',
          balance: 5,
          decimals: 18,
          price: 200,
          price_change_24h: 0,
          contract: '0x2',
          chainId: 137,
          chainName: 'Polygon',
          usdBalance: 1000,
        },
        {
          id: 3,
          name: 'Token 3',
          symbol: 'T3',
          logo: '',
          balance: 3,
          decimals: 18,
          price: 150,
          price_change_24h: 0,
          contract: '0x3',
          chainId: 1,
          chainName: 'Ethereum',
          usdBalance: 450,
        },
      ];

      const result = groupAssetsByChain(assets);
      expect(result).toEqual({
        Ethereum: [assets[0], assets[2]],
        Polygon: [assets[1]],
      });
    });
  });
});

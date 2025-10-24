import { PortfolioData } from '../../../types/api';
import { Asset } from '../types';

const chainIdToName: Record<number, string> = {
  1: 'Ethereum',
  137: 'Polygon',
  8453: 'Base',
  100: 'Gnosis',
  56: 'BNB Smart Chain',
  10: 'Optimism',
  42161: 'Arbitrum',
};

export const transformPortfolioToAssets = (
  portfolioData: PortfolioData | undefined
): Asset[] => {
  if (!portfolioData || !portfolioData.assets) {
    return [];
  }

  const assets: Asset[] = [];

  portfolioData.assets.forEach((assetData) => {
    assetData.contracts_balances.forEach((contract) => {
      if (contract.balance > 0) {
        const chainId = Number(contract.chainId.split(':')[1]);
        const usdBalance = contract.balance * (assetData.price || 0);

        assets.push({
          id: assetData.asset.id,
          name: assetData.asset.name,
          symbol: assetData.asset.symbol,
          logo: assetData.asset.logo,
          balance: contract.balance,
          decimals: contract.decimals,
          price: assetData.price || 0,
          price_change_24h: assetData.price_change_24h || 0,
          contract: contract.address,
          chainId,
          chainName: chainIdToName[chainId] || 'Unknown',
          usdBalance,
        });
      }
    });
  });

  // Sort by USD balance (highest first)
  assets.sort((a, b) => b.usdBalance - a.usdBalance);

  return assets;
};

export const getTotalPortfolioValue = (assets: Asset[]): number => {
  return assets.reduce((total, asset) => total + asset.usdBalance, 0);
};

export const groupAssetsByChain = (
  assets: Asset[]
): Record<string, Asset[]> => {
  const grouped: Record<string, Asset[]> = {};

  assets.forEach((asset) => {
    const chainName = asset.chainName;
    if (!grouped[chainName]) {
      grouped[chainName] = [];
    }
    grouped[chainName].push(asset);
  });

  return grouped;
};


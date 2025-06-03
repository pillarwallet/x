/* eslint-disable no-restricted-syntax */
import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';

// types
import {
  AssetMobula,
  ContractsBalanceMobula,
  PortfolioData,
  PrimeAssetType,
  WalletPortfolioMobulaResponse,
} from '../types/api';

// store
import { addMiddleware } from '../store';

// utils
import { CompatibleChains, isTestnet } from '../utils/blockchain';

// services
import { PortfolioToken, chainIdToChainNameTokensData } from './tokensData';

export const convertPortfolioAPIResponseToToken = (
  portfolioData: PortfolioData
): PortfolioToken[] => {
  if (!portfolioData) return [];

  return portfolioData.assets.flatMap((asset) =>
    asset.contracts_balances
      .filter((contract) => contract.balance > 0)
      .map((contract) => ({
        id: asset.asset.id,
        name: asset.asset.name,
        symbol: asset.asset.symbol,
        logo: asset.asset.logo,
        blockchain: chainIdToChainNameTokensData(
          Number(contract.chainId.split(':')[1])
        ),
        contract: contract.address,
        decimals: contract.decimals,
        balance: contract.balance,
        price: asset.price,
        price_change_24h: asset.price_change_24h,
        cross_chain_balance: asset.token_balance,
      }))
  );
};

export const getPrimeAssetsWithBalances = (
  walletPortfolio: PortfolioData,
  primeAssets: PrimeAssetType[]
): {
  name: string;
  symbol: string;
  primeAssets: { asset: AssetMobula; usd_balance: number }[];
}[] => {
  return primeAssets.map(({ name, symbol }) => {
    const primeAssetsMatch = walletPortfolio.assets
      .filter(
        (assetData) =>
          assetData.asset.name === name && assetData.asset.symbol === symbol
      )
      .map((assetData) => ({
        asset: assetData.asset,
        usd_balance: assetData.estimated_balance,
      }));

    return {
      name,
      symbol,
      primeAssets: primeAssetsMatch,
    };
  });
};

export const getTopNonPrimeAssetsAcrossChains = (
  walletPortfolio: PortfolioData,
  primeAssets: PrimeAssetType[]
): {
  asset: AssetMobula;
  usdBalance: number;
  tokenBalance: number;
  unrealizedPnLUsd: number;
  unrealizedPnLPercentage: number;
  contract: ContractsBalanceMobula;
  price: number;
}[] => {
  const primeAssetSet = new Set(
    primeAssets.map((a) => `${a.name}|${a.symbol}`)
  );

  // Here we are filtering the tokens and removing the ones that are Prime Assets
  // We then select the top three tokens with the highest USD value
  const nonPrimeAssetBalances = walletPortfolio.assets
    // Filter out assets that are prime assets
    .filter(
      (assetData) =>
        !primeAssetSet.has(`${assetData.asset.name}|${assetData.asset.symbol}`)
    )
    // Flat map to recreate an array of assets with their balances
    .flatMap((assetData) =>
      assetData.contracts_balances.map((contract) => {
        const usdBalance = contract.balance * assetData.price;
        const priceChangePercent = assetData.price_change_24h ?? 0;

        const previousBalance =
          priceChangePercent === -100
            ? 0
            : usdBalance / (1 + priceChangePercent / 100);

        const unrealizedPnLUsd = usdBalance - previousBalance;

        const unrealizedPnLPercentage =
          previousBalance > 0 ? (unrealizedPnLUsd / previousBalance) * 100 : 0;

        return {
          asset: assetData.asset,
          usdBalance,
          tokenBalance: contract.balance,
          unrealizedPnLUsd,
          unrealizedPnLPercentage,
          contract,
          price: assetData.price,
        };
      })
    );

  const topThree = nonPrimeAssetBalances
    .sort((a, b) => b.usdBalance - a.usdBalance)
    .slice(0, 3);

  return topThree;
};

const fetchBaseQueryWithRetry = retry(
  fetchBaseQuery({
    baseUrl: isTestnet
      ? 'https://hifidata-nubpgwxpiq-uc.a.run.app'
      : 'https://hifidata-7eu4izffpa-uc.a.run.app',
    headers: {
      'Content-Type': 'application/json',
    },
  }),
  { maxRetries: 5 }
);

// Define a service using a base path and params
export const pillarXApiWalletPortfolio = createApi({
  reducerPath: 'pillarXApiWalletPortfolio',
  baseQuery: fetchBaseQueryWithRetry,
  endpoints: (builder) => ({
    getWalletPortfolio: builder.query<
      WalletPortfolioMobulaResponse,
      { wallet: string; isPnl: boolean }
    >({
      query: ({ wallet, isPnl }) => {
        const chainIds = isTestnet
          ? [11155111]
          : CompatibleChains.map((chain) => chain.chainId);
        const chainIdsQuery = chainIds.map((id) => `chainIds=${id}`).join('&');

        return {
          url: `?${chainIdsQuery}&testnets=${String(isTestnet)}`,
          method: 'POST',
          body: {
            path: 'wallet/portfolio',
            params: {
              wallet,
              blockchains: CompatibleChains.map((chain) => chain.chainId).join(
                ','
              ),
              unlistedAssets: 'true',
              filterSpam: 'true',
              pnl: isPnl,
            },
          },
        };
      },
    }),
  }),
});

addMiddleware(pillarXApiWalletPortfolio);

export const { useGetWalletPortfolioQuery } = pillarXApiWalletPortfolio;

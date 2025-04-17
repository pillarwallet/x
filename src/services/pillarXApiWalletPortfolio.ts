import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';

// types
import { PortfolioData, WalletPortfolioMobulaResponse } from '../types/api';

// store
import { addMiddleware } from '../store';

// utils
import { CompatibleChains, isTestnet } from '../utils/blockchain';
import { Token, chainIdToChainNameTokensData } from './tokensData';

export const convertPortfolioAPIResponseToToken = (
  portfolioData: PortfolioData
): Token[] => {
  if (!portfolioData) return [];

  return portfolioData.assets.flatMap((asset) =>
    asset.contracts_balances.map((contract) => ({
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
    }))
  );
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
      { wallet: string }
    >({
      query: ({ wallet }) => {
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
            },
          },
        };
      },
    }),
  }),
});

addMiddleware(pillarXApiWalletPortfolio);

export const { useGetWalletPortfolioQuery } = pillarXApiWalletPortfolio;

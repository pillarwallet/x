/* eslint-disable @typescript-eslint/no-use-before-define */
import Fuse from 'fuse.js';

// types
import {
  AssetMobula,
  ContractsBalanceMobula,
  PortfolioData,
  PrimeAssetType,
  TokenAssetResponse,
} from '../types/api';

// utils
import {
  CompatibleChains,
  getNativeAssetForChainId,
} from '../utils/blockchain';

export type Token = {
  id: number;
  name: string;
  symbol: string;
  logo: string;
  blockchain: string;
  contract: string;
  decimals: number;
  balance?: number;
  price?: number;
};

export type PortfolioToken = Token & {
  price_change_24h?: number;
  cross_chain_balance?: number;
};

export type TokenRawDataItem = {
  id: number;
  name: string;
  symbol: string;
  logo: string;
  blockchains: string[];
  contracts: string[];
  decimals: number[];
};

export type TokenQueryParams = {
  id?: number;
  name?: string;
  symbol?: string;
  blockchain?: string;
};

export const chainNameDataCompatibility = (chainName: string) => {
  if (!chainName) return '';

  const chain = chainName.toLowerCase();

  if (chain === 'xdai') {
    return 'Gnosis';
  }

  if (chain === 'bnb smart chain (bep20)') {
    return 'BNB Smart Chain';
  }

  if (chain === 'optimistic') {
    return 'Optimism';
  }

  if (chain === 'arbitrum') {
    return 'Arbitrum';
  }

  return chainName;
};

export const chainNameFromViemToMobula = (chainName: string) => {
  if (chainName === 'Gnosis') {
    return 'XDAI';
  }

  if (chainName === 'BNB Smart Chain') {
    return 'BNB Smart Chain (BEP20)';
  }

  if (chainName === 'OP Mainnet' || chainName === 'Optimism') {
    return 'Optimistic';
  }

  if (chainName === 'Arbitrum One' || chainName === 'Arbitrum') {
    return 'Arbitrum';
  }

  return chainName;
};

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

// Converts chain id to Mobula blockchain name
export const chainIdToChainNameTokensData = (chainId: number | undefined) => {
  switch (chainId) {
    case 1:
      return 'Ethereum';
    case 137:
      return 'Polygon';
    case 8453:
      return 'Base';
    case 100:
      return 'XDAI';
    case 56:
      return 'BNB Smart Chain (BEP20)';
    case 10:
      return 'Optimistic';
    case 42161:
      return 'Arbitrum';
    case undefined:
      return '';
    default:
      return '';
  }
};

// Converts Mobula blockchain name to chain id
export const chainNameToChainIdTokensData = (chain: string | undefined) => {
  switch (chain) {
    case 'Ethereum':
      return 1;
    case 'Polygon':
      return 137;
    case 'Base':
      return 8453;
    case 'XDAI':
      return 100;
    case 'BNB Smart Chain (BEP20)':
      return 56;
    case 'Optimistic':
      return 10;
    case 'Arbitrum':
      return 42161;
    case undefined:
      return 0;
    default:
      return 0;
  }
};

/**
 * This function is used to convert the Mobula API response
 * into a simplified Token type that is being used accross PillarX.
 * Without a search input, it will add the native/gas token to the
 * list, since they are not part of the Mobula list.
 * Without a search input, it will look for native/gas token search,
 * and will also search for an exact match if the search input is
 * longer than 40 characters, which is likely a contract address.
 */
export const convertAPIResponseToTokens = (
  result: TokenAssetResponse[],
  searchInput?: string
): Token[] => {
  if (!result || result.length === 0) return [];

  // Gets the compatible chains with PillarX
  const allowedBlockchains = CompatibleChains.map((chain) =>
    chainNameFromViemToMobula(chain.chainName)
  );

  // Show the Mobula's API result, but also check for exceptions on the native/gas token
  const tokenData = result
    .filter((item) => item.type === 'token' || item.type === 'asset')
    .flatMap(
      (item) =>
        item.blockchains
          .map((blockchain, index) => {
            let { name, symbol } = item;
            const contract = item.contracts[index];

            // Rename Wrapped tokens
            if (name === 'XDAI' && symbol === 'XDAI') {
              name = 'Wrapped XDAI';
              symbol = 'WXDAI';
            }

            if (
              name === 'Ethereum' &&
              symbol === 'ETH' &&
              contract !== '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
            ) {
              name = 'Wrapped Ether';
              symbol = 'WETH';
            }

            if (
              name === 'BNB' &&
              symbol === 'BNB' &&
              contract !== '0xb8c77482e45f1f44de1745f52c74426c631bdd52'
            ) {
              name = 'Wrapped BNB';
              symbol = 'WBNB';
            }

            if (name === 'POL (ex-MATIC)' && symbol === 'POL') {
              name = 'POL';
              symbol = 'POL';
            }

            // Remove gas/native token contracts that are already included separately
            if (
              contract === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' ||
              (name === 'POL' &&
                contract === '0x0000000000000000000000000000000000001010')
            ) {
              return null;
            }

            return {
              id: item.id,
              name,
              symbol,
              logo: item.logo,
              blockchain,
              contract,
              decimals: item.decimals[index],
              price: item.price,
            };
          })
          .filter(
            (token) =>
              token !== null && allowedBlockchains.includes(token.blockchain)
          ) as Token[]
    );

  // Use Fuse.js to match native tokens that are not included in Mobula's token list
  // as well as look for an exact match of contract address
  if (searchInput) {
    const nativeTokens = CompatibleChains.map((chain) => {
      const nativeAsset = getNativeAssetForChainId(chain.chainId);
      return {
        id: chain.chainId,
        name: nativeAsset.name,
        symbol: nativeAsset.symbol,
        logo: nativeAsset.logoURI || '',
        blockchain: chainIdToChainNameTokensData(nativeAsset.chainId),
        contract: nativeAsset.address,
        decimals: nativeAsset.decimals,
      };
    });

    // If the search input is longer than 40 characters which is likely to be a
    // contract address, then we look into an exact match in native/gas token and
    // in Mobula's token data
    if (searchInput.length > 40) {
      const fuse = new Fuse([...nativeTokens, ...tokenData], {
        keys: ['name', 'symbol', 'contract'], // Fields to search in
        threshold: 0.2, // Allow some fuzziness for queries that are not contract like
        minMatchCharLength: 3,
        useExtendedSearch: true, // Enables exact match using '='
      });

      // Check if query length is above 40 characters have an exact match (likely a contract address)
      const searchQuery =
        searchInput.length > 40 ? `="${searchInput}"` : searchInput;

      const results = fuse.search(searchQuery);

      return results.map((r) => r.item);
    }

    // If the search input is not longer than 40 characters, then we only do
    // an approx match with native that we add to the Mobula's token data
    // since Mobula's token data does not include native/gas token
    const fuse = new Fuse(nativeTokens, {
      keys: ['name', 'symbol', 'contract'], // Fields to search in
      threshold: 0.3, // Allow some fuzziness for queries that are not contract like
    });

    const results = fuse.search(searchInput).map((token) => token.item);

    return [...results, ...tokenData];
  }

  // Adds nativeTokens to the list if no search input
  CompatibleChains.forEach((chain) => {
    const nativeAsset = getNativeAssetForChainId(chain.chainId);
    const nativeTokenOption: Token = {
      id: chain.chainId,
      name: nativeAsset.name,
      symbol: nativeAsset.symbol,
      logo: nativeAsset.logoURI || '',
      blockchain: chainIdToChainNameTokensData(nativeAsset.chainId),
      contract: nativeAsset.address,
      decimals: nativeAsset.decimals,
    };
    tokenData.push(nativeTokenOption);
  });

  return tokenData;
};

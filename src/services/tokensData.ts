/* eslint-disable @typescript-eslint/no-use-before-define */

import Fuse from 'fuse.js';
import tokens from '../data/tokens.json';
import { TokenAssetResponse } from '../types/api';
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

type TokenDataType = {
  data: TokenRawDataItem[];
};

let tokensData: Token[] = [];

export const chainNameDataCompatibility = (chainName: string) => {
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

/**
 * Loads the locally saved Mobula tokens list, rename the chain name,
 * adds the gas token for each compatible chains and rename tokens
 * that are in reality Wrapped tokens
 */
export const loadTokensData = (): Token[] => {
  /**
   * List all compatible blockchains with PillarX and rename
   * some chains that have a different name on Mobula
   */
  const allowedBlockchains = CompatibleChains.map((chain) =>
    chainNameFromViemToMobula(chain.chainName)
  );

  /**
   * Check if the tokens list has not been loaded yet and
   * list all tokens one by one with their respective chain
   * and contract address
   */
  if (tokensData.length === 0) {
    tokensData = (tokens as TokenDataType).data.flatMap((item) =>
      item.blockchains
        .map((blockchain, index) => {
          let { name } = item;
          let { symbol } = item;
          const contract = item.contracts[index];

          /**
           * Changes token name and symbol to its Wrapped token
           * since on Mobula the tokens below are actually the
           * Wrapped tokens according to their contract address
           */
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

          /**
           * Some contract addresses are the gas tokens on Mobula,
           * so we are removing them from the Mobula tokens list
           * since we are counting them already as native that we pushed
           * to that list earlier in this function
           */
          return contract !== '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' &&
            !(
              name === 'POL' &&
              contract === '0x0000000000000000000000000000000000001010'
            )
            ? {
                id: item.id,
                name,
                symbol,
                logo: item.logo,
                blockchain,
                contract,
                decimals: item.decimals[index],
              }
            : null;
        })
        .filter(
          (token): token is Token =>
            token !== null && allowedBlockchains.includes(token.blockchain)
        )
    );
    // Add native/gas tokens
    CompatibleChains.forEach((chain) => {
      const nativeAsset = getNativeAssetForChainId(chain.chainId);
      const nativeTokenOption: Token = {
        id: chain.chainId,
        name: nativeAsset.name,
        symbol: nativeAsset.symbol,
        logo: nativeAsset.logoURI,
        blockchain: chainIdToChainNameTokensData(nativeAsset.chainId),
        contract: nativeAsset.address,
        decimals: nativeAsset.decimals,
      };
      tokensData.push(nativeTokenOption);
    });
  }

  return tokensData;
};

export const queryTokenData = ({
  id,
  name,
  symbol,
  blockchain,
}: TokenQueryParams): Token[] => {
  const loadedTokens = loadTokensData();

  return loadedTokens.filter((item) => {
    return (
      (!id || item.id === id) &&
      (!name || item.name.toLowerCase() === name.toLowerCase()) &&
      (!symbol || item.symbol.toLowerCase() === symbol.toLowerCase()) &&
      (!blockchain || item.blockchain === blockchain)
    );
  });
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
  const tokenData = result.flatMap((item) =>
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
        };
      })
      .filter(
        (token): token is Token =>
          token !== null && allowedBlockchains.includes(token.blockchain)
      )
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
        logo: nativeAsset.logoURI,
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
      logo: nativeAsset.logoURI,
      blockchain: chainIdToChainNameTokensData(nativeAsset.chainId),
      contract: nativeAsset.address,
      decimals: nativeAsset.decimals,
    };
    tokenData.push(nativeTokenOption);
  });

  return tokenData;
};

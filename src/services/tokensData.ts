/* eslint-disable @typescript-eslint/no-use-before-define */
import Fuse from 'fuse.js';
import tokens from '../data/tokens.json';
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

// Fuzzy search of tokens by name, symbol, and blockchain
export const searchTokens = (query: string): Token[] => {
  const loadedTokens = loadTokensData();

  const fuse = new Fuse(loadedTokens, {
    keys: ['name', 'symbol', 'blockchain', 'contract'], // Fields to search in
    threshold: 0.3, // Adjust fuzziness
  });

  const results = fuse.search(query);

  return results.map((result) => result.item);
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

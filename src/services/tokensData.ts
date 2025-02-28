import Fuse from 'fuse.js';
import tokens from '../data/tokens.json';

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

export const loadTokensData = (): Token[] => {
  if (tokensData.length === 0) {
    tokensData = (tokens as TokenDataType).data.flatMap((item) =>
      item.blockchains.map((blockchain, index) => ({
        id: item.id,
        name: item.name,
        symbol: item.symbol,
        logo: item.logo,
        blockchain,
        contract: item.contracts[index],
        decimals: item.decimals[index],
      }))
    );
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
    keys: ['name', 'symbol', 'blockchain'], // Fields to search in
    threshold: 0.3, // Adjust fuzziness
  });

  const results = fuse.search(query);

  return results.map((result) => result.item);
};

// Mapping of chain id to Mobula blockchain name
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
    case undefined:
      return '';
    default:
      return '';
  }
};

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
    case undefined:
      return 0;
    default:
      return 1;
  }
};

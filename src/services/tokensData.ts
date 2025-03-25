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

export const loadTokensData = (): Token[] => {
  const allowedBlockchains = CompatibleChains.map((chain) =>
    chain.chainName === 'Gnosis' ? 'XDAI' : chain.chainName
  );

  if (tokensData.length === 0) {
    tokensData = (tokens as TokenDataType).data.flatMap((item) =>
      item.blockchains
        .map((blockchain, index) => {
          let { name } = item;
          let { symbol } = item;
          const contract = item.contracts[index];

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

          return contract !== '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
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
      return 0;
  }
};

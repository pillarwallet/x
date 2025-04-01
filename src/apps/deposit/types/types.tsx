export type BalanceInfo = {
  type?: 'BalanceInfo';
  name: string;
  chain: string;
  address: string;
  decimals: number;
  symbol: string;
  logoURI: string;
  balance: string;
};

export type AddedAssets = {
  type?: 'AddedAsset';
  assetType: 'token' | 'nft';
  tokenId?: string;
  chain: string;
  tokenAddress: string;
  balance: number;
};

export type Network =
  | 'ethereum'
  | 'polygon'
  | 'gnosis'
  | 'base'
  | 'bnb smart chain'
  | 'optimism'
  | 'arbitrum';

export type TokenList = {
  address: string;
  chainId: number;
  decimals: string;
  name: string;
  symbol: string;
  logoURI: string;
};

export type BalancesByChain = {
  [chain: string]: BalanceInfo[];
};

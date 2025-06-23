export type ChainType = {
  chainId: number;
  chainName: string;
};

export enum PeriodFilter {
  HOUR = 'HOUR',
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  YEAR = 'YEAR',
}

export type SelectedTokenType = {
  id: number;
  symbol: string;
  address: string;
  decimals?: number;
  chainId?: number;
  name: string;
  icon?: string;
  price?: number;
};

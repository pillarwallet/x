export type SelectedToken = {
  name: string;
  symbol: string;
  usdValue: string;
  logo: string;
  dailyPriceChange: number;
  chainId: number;
  decimals: number;
  address: string;
};

export type PayingToken = {
  name: string;
  symbol: string;
  logo: string;
  actualBal: string;
  totalUsd: number;
  totalRaw: string;
  chainId: number;
};

export enum SearchType {
  Fresh = 'Fresh',
  Trending = 'Trending',
  TopGainers = 'Top Gainers',
  MyHoldings = 'My Holdings',
}

export enum SortType {
  Up = 'Up',
  Down = 'Down',
}

type ParsedToken = {
  name: string;
  symbol: string;
  markrtCap: number;
  liquidity: number;
  volume: number;
  logo: string;
  price: number;
  priceChange: number;
  blockchain: string;
}

type SelectedToken = {
  name: string;
  symbol: string;
  usdValue: string;
  logo: string;
  dailyPriceChange: number;
  chainId: number;
  decimals: number;
  address: string;
}
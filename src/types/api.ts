export enum ApiLayout {
  TOKENS_HORIZONTAL = 'TOKENS_HORIZONTAL',
  TOKENS_VERTICAL = 'TOKENS_VERTICAL',
  GENERIC_BANNER = 'GENERIC_BANNER',
  EDITORIAL = 'EDITORIAL',
  AD = 'AD',
  MEDIA_GRID_HIGHLIGHTED = 'MEDIA_GRID_HIGHLIGHTED',
}

export type Asset = {
  name: string;
  symbol: string;
  id: number;
  contracts: string[];
  logo: string;
  blockchains: string[];
};

export type CrossChainBalance = {
  balance: number;
  balanceRaw: string;
  chainId: string;
  address: string;
};

export type ContractBalance = {
  balance: number;
  balanceRaw: string;
  chainId: string;
  address: string;
  decimals: number;
};

export type AssetData = {
  asset: Asset;
  realized_pnl: number;
  unrealized_pnl: number;
  allocation: number;
  price: number;
  price_bought: number;
  price_change_24h: number;
  price_change_1h: number;
  total_invested: number;
  min_buy_price: number;
  max_buy_price: number;
  estimated_balance: number;
  token_balance: number;
  cross_chain_balances: {
    [key: string]: CrossChainBalance;
  };
  contracts_balances: ContractBalance[];
};

export type TotalPnlHistory = {
  realized: number;
  unrealized: number;
};

export type WalletPortfolioData = {
  total_wallet_balance?: number;
  wallet?: string;
  wallets?: string[];
  total_realized_pnl?: number;
  total_unrealized_pnl?: number;
  assets?: AssetData[];
  total_pnl_history?: {
    [key in '24h' | '7d' | '30d' | '1y']?: TotalPnlHistory;
  };
};

export type GenericBannerDisplay = {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
  cta?: {
    text?: string;
    href?: string;
  };
};

export type EditorialDisplay = {
  tags?: {
    label?: string;
    icon?: string;
    color?: string;
  }[];
  title?: string;
  summary?: string;
  media?: string;
  href?: string;
  timestamp?: number;
  attribution?: {
    name?: string;
    icon?: string;
    href?: string;
  };
};

export type Advertisement = {
  slug: string;
};

export type Projection = {
  meta: {
    display?: GenericBannerDisplay | EditorialDisplay | TileTitle;
  };
  data?: TokenData[] | Advertisement | MediaGridData;
  layout: ApiLayout;
  id: string;
};

export type WalletData = {
  data: WalletPortfolioData;
};

export type ApiResponse = {
  projection: Projection[];
};

export type TokenContract = {
  address: string;
  blockchain: string;
  blockchainId?: string;
  decimals?: number;
};

export type TokenPlatform = {
  name: string;
  rank: number;
  weight: number;
};

export type TokenData = {
  id?: number;
  name?: string;
  symbol?: string;
  contracts?: TokenContract[];
  logo?: string;
  trending_score?: number;
  platforms?: TokenPlatform[];
  price_change_24h?: number;
  pair?: string;
};

export type TokenAtlasInfoData = {
  id: number;
  market_cap: number;
  market_cap_diluted: number;
  liquidity: number;
  price: number;
  priceNative?: number;
  off_chain_volume: number;
  volume: number;
  volume_change_24h: number;
  volume_7d: number;
  is_listed: boolean;
  price_change_24h: number;
  price_change_1h: number;
  price_change_7d: number;
  price_change_1m: number;
  price_change_1y: number;
  ath: number;
  atl: number;
  name: string;
  symbol: string;
  logo: string;
  decimals?: number;
  native?: {
    symbol: string;
    address: string;
    decimals: number;
    name: string;
    logo: string;
    id: number;
    type: string;
  };
  rank: number;
  contracts: TokenContract[];
  total_supply: string;
  circulating_supply: string;
};

export type TokenAtlasInfoApiResponse = {
  data?: TokenAtlasInfoData;
};

type HistoryPoint = {
  priceUSD: number;
  timestamp: number;
};

export type TokenMarketHistory = {
  price_history?: HistoryPoint[];
  market_cap_history?: HistoryPoint[];
  market_cap_diluted_history?: HistoryPoint[];
  volume_history?: HistoryPoint[];
  name?: string;
  blockchain?: string;
};

export type TokenAtlasGraphApiResponse = {
  data?: TokenMarketHistory;
};

export type TokenPriceGraphPeriod = {
  from: number;
  to?: number;
};

export type TrendingTokens = {
  data: TokenData[];
};

export type TokenBlockchainList = {
  symbol: string;
  address: string;
  decimals: number;
  name: string;
  type: string;
};

export type Stable = {
  symbol: string;
  address: string;
  blockchains: string[];
  blockchain: string;
  decimals: number;
  name: string;
  logo: string;
  contracts: string[];
  type: string;
};

export type Router = {
  factory: string;
  address: string;
  fee: number;
  name: string;
};

export type Eth = {
  symbol: string;
  address: string;
  decimals: number;
  name: string;
  logo: string;
  id: number;
  type: string;
};

export type BlockchainData = {
  coverage: string[];
  multicall_contract: string;
  color: string;
  evmChainId: number;
  supportedProtocols: string[];
  dexscreenerChain: string;
  chainId: string;
  coingeckoChain: string;
  stable: Stable;
  name: string;
  explorer: string;
  eth: Eth;
  logo: string;
  tokens: TokenBlockchainList[];
  rpcs: string[];
  shortName: string;
  routers: Router[];
  privateRpcs?: string[];
};

export type BlockchainList = {
  data: BlockchainData[];
};

export type TileTitle = {
  title: string;
};

export type MediaGridData = {
  grids: MediaGridCollectionItem[];
};

export type MediaGridCollectionItem = {
  collection?: string;
  name?: string;
  description?: string;
  image_url?: string;
  banner_image_url?: string;
  owner?: string;
  safelist_status?: string;
  category?: string;
  is_disabled?: boolean;
  is_nsfw?: boolean;
  trait_offers_enabled?: boolean;
  collection_offers_enabled?: boolean;
  opensea_url?: string;
  project_url?: string;
  wiki_url?: string;
  discord_url?: string;
  telegram_url?: string;
  twitter_username?: string;
  instagram_username?: string;
  contracts?: MediaGridContract[];
  items?: MediaGridItem[];
};

export type MediaGridItem = {
  collection?: string;
  description?: string;
  imageUrl?: string;
  name?: string;
  url?: string;
};

export type MediaGridContract = {
  address: string;
  chain: string;
};

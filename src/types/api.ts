export enum ApiLayout {
  TOKENS_HORIZONTAL = 'TOKENS_HORIZONTAL',
  TOKENS_VERTICAL = 'TOKENS_VERTICAL',
  GENERIC_BANNER = 'GENERIC_BANNER',
  EDITORIAL = 'EDITORIAL',
  AD = 'AD',
  MEDIA_GRID_HIGHLIGHTED = 'MEDIA_GRID_HIGHLIGHTED',
  PXPOINTS = 'PXPOINTS',
  TOKENS_WITH_MARKET_DATA = 'TOKENS_WITH_MARKET_DATA',
}

export enum LeaderboardRankChange {
  INCREASED = 'INCREASED',
  DECREASED = 'DECREASED',
  NO_CHANGE = 'NO_CHANGE',
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
  percentage_change: number;
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

export type Points = {
  address: {
    points: {
      total?: number;
      lastWeek?: number;
    };
    ranking: {
      global?: number;
      leaderboardPosition?: number;
    };
  };
  drops: {
    upcoming: {
      timestamp?: number;
    };
  };
  referrals: {
    code?: string;
    href?: string;
  };
};

export type TokensMarketDataRow = {
  link?: string;
  leftColumn?: {
    token?: {
      primaryImage?: string;
      secondaryImage?: string;
    };
    line1?: {
      text1?: string;
      text2?: string;
      copyLink?: string;
    };
    line2?: {
      timestamp?: number;
      volume?: string;
      liquidity?: string;
    };
  };
  rightColumn?: {
    line1?: {
      price?: string;
      direction?: string;
      percentage?: string;
    };
    line2?: {
      transactionCount?: string;
    };
  };
  meta?: {
    tokenData: {
      decimals: number;
      marketCap?: number;
    };
  };
};

export type TokensMarketData = {
  title?: {
    text?: string;
    leftDecorator?: string;
    rightDecorator?: string;
  };
  rows?: TokensMarketDataRow[];
};

export type Projection = {
  meta: {
    display?: GenericBannerDisplay | EditorialDisplay | TileTitle;
  };
  data?:
    | TokenData[]
    | Advertisement
    | MediaGridData
    | Points
    | TokensMarketData;
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
  price: number;
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
  result: {
    data: TokenAtlasInfoData;
  };
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
  result: TokenData[];
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
  result: { data: BlockchainData[] };
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

export type TransactionHistory = {
  results: TransactionHistoryItem;
};

export type TransactionHistoryItem = {
  outgoing: FlairTransaction[];
  incoming: { [chainId: string]: EtherscanTransaction[] };
};

export type FlairTransaction = {
  entityId: string;
  entityUpdatedAt: string;
  chainId: string;
  contractAddress: string;
  horizon: string;
  paymaster: string;
  sender: string;
  userOpHash: string;
  actualGasUsed: string;
  actualGasCost: string;
  txHash: string;
  success: boolean;
  nonce: string;
  blockNumber: string;
  transactionIndex: string;
  forkIndex: string;
  logIndex: string;
  localIndex: string;
  namespace: string;
};

export type EtherscanTransaction = {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  transactionIndex: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  isError: string;
  txreceipt_status: string;
  input: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  gasUsed: string;
  confirmations: string;
  methodId: string;
  functionName: string;
};

export type PointsChainData = {
  [chainId: string]: number; // Keys are chain IDs (as strings), values are numbers
};

export type PointsEligibilityData = {
  [chainId: string]: boolean;
};

export type PointsResult = {
  points?: number;
  totalTxFeesUsd?: number;
  pointsPerChain?: PointsChainData;
  transactionCount?: PointsChainData;
  address: string;
  isDeployPointsEligible?: PointsEligibilityData;
  pointsUpdatedAt?: number;
  txFeesUsd?: PointsChainData;
  totalSwapAmountUsd?: number;
  swapAmountUsd?: PointsChainData;
  totalSwapTxFeesUsd?: number;
  swapTxFeesUsd?: PointsChainData;
  completedSwap?: boolean;
  transactionHistory?: PointsTransactionHistoryItem;
};

export type PointsResultsData = {
  results: PointsResult[];
};

export type WeeklyLeaderboardData = PointsResult & {
  rankChange?: LeaderboardRankChange;
};

export type MarketHistoryPairData = {
  result: {
    data: {
      volume: number;
      open: number;
      high: number;
      low: number;
      close: number;
      time: number;
    }[];
  };
};

export type MobulaToken = {
  address: string;
  price: number | null;
  priceToken: number;
  priceTokenString: string;
  approximateReserveUSD: number;
  approximateReserveTokenRaw: string;
  approximateReserveToken: number;
  symbol: string;
  name: string;
  id: number;
  decimals: number;
  totalSupply: number;
  circulatingSupply: number;
  chainId: string;
  logo?: string | null;
};

export type Exchange = {
  name: string;
  logo: string;
};

export type Pair = {
  token0: MobulaToken;
  token1: MobulaToken;
  volume24h: number;
  liquidity: number;
  blockchain: string;
  address: string;
  createdAt: string | null;
  type: string;
  baseToken: string;
  exchange: Exchange;
  factory: string | null;
  quoteToken: string;
  price: number | null;
  priceToken: number;
  priceTokenString: string;
};

// This type is merging both Token and Asset types from
// the Mobula's search API
export type TokenAssetResponse = {
  name: string;
  symbol: string;
  contracts: string[];
  blockchains: string[];
  decimals: number[];
  logo: string | null;
  price: number | null;
  pairs: Pair[];
  type: 'token' | 'asset';
  volume_24h?: number;
  total_supply?: string; // Token-specific
  id?: number; // Asset-specific
  market_cap?: number; // Asset-specific
  liquidity?: number; // Asset-specific
  volume?: number; // Asset-specific
  twitter?: string | null; // Asset-specific
  website?: string | null; // Asset-specific
  price_change_24h: number | null;
};

export type PairResponse = {
  token0: MobulaToken;
  token1: MobulaToken;
  volume24h: number;
  liquidity: number;
  blockchain: string;
  address: string;
  type: string;
  baseToken: string;
  exchange: Exchange;
  quoteToken: string;
  price: number;
  priceToken: number;
  priceTokenString: string;
  createdAt: string | null;
  factory: string | null;
  pool_addr: number;
  price_change_1min?: number;
  price_change_5min?: number;
  price_change_1h?: number;
  price_change_4h?: number;
  price_change_12h?: number;
  price_change_24h?: number;
  trades_1min?: number;
  buys_1min?: number;
  sells_1min?: number;
  volume_1min?: number;
  buy_volume_1min?: number;
  sell_volume_1min?: number;
  sellers_1min?: number;
  buyers_1min?: number;
  traders_1min?: number;
  trades_5min?: number;
  buys_5min?: number;
  sells_5min?: number;
  volume_5min?: number;
  buy_volume_5min?: number;
  sell_volume_5min?: number;
  sellers_5min?: number;
  buyers_5min?: number;
  traders_5min?: number;
  trades_15min?: number;
  buys_15min?: number;
  sells_15min?: number;
  volume_15min?: number;
  buy_volume_15min?: number;
  sell_volume_15min?: number;
  sellers_15min?: number;
  buyers_15min?: number;
  traders_15min?: number;
  trades_1h?: number;
  buys_1h?: number;
  sells_1h?: number;
  volume_1h?: number;
  buy_volume_1h?: number;
  sell_volume_1h?: number;
  sellers_1h?: number;
  buyers_1h?: number;
  traders_1h?: number;
  trades_4h?: number;
  buys_4h?: number;
  sells_4h?: number;
  volume_4h?: number;
  buy_volume_4h?: number;
  sell_volume_4h?: number;
  sellers_4h?: number;
  buyers_4h?: number;
  traders_4h?: number;
  trades_12h?: number;
  buys_12h?: number;
  sells_12h?: number;
  volume_12h?: number;
  buy_volume_12h?: number;
  sell_volume_12h?: number;
  sellers_12h?: number;
  buyers_12h?: number;
  traders_12h?: number;
  trades_24h?: number;
  buys_24h?: number;
  sells_24h?: number;
  volume_24h?: number;
  buy_volume_24h?: number;
  sell_volume_24h?: number;
  sellers_24h?: number;
  buyers_24h?: number;
  traders_24h?: number;
};

export type MobulaApiResponse = {
  result: {
    data: TokenAssetResponse[] | PairResponse[];
  };
};

export type ContractsBalanceMobula = {
  address: string;
  balance: number;
  balanceRaw: string;
  chainId: string;
  decimals: number;
};

export type CrossChainBalanceMobula = {
  balance: number;
  balanceRaw: string;
  chainId: string;
  address: string;
};

export type CrossChainBalances = {
  [chainName: string]: CrossChainBalanceMobula;
};

export type AssetMobula = {
  id: number;
  name: string;
  symbol: string;
  logo: string;
  decimals: string[];
  contracts: string[];
  blockchains: string[];
};

export type AssetDataMobula = {
  contracts_balances: ContractsBalanceMobula[];
  cross_chain_balances: CrossChainBalances;
  price_change_24h: number;
  estimated_balance: number;
  price: number;
  token_balance: number;
  allocation: number;
  asset: AssetMobula;
  wallets: string[];
  realized_pnl?: number;
  unrealized_pnl?: number;
  price_bought?: number;
  total_invested?: number;
  min_buy_price?: number;
  max_buy_price?: number;
};

export type PnLEntry = [string, { realized: number; unrealized: number }];

export type PnLHistory = {
  '24h': PnLEntry[];
  '7d': PnLEntry[];
  '30d': PnLEntry[];
  '1y': PnLEntry[];
};

export type TotalPnLHistory = {
  '24h': {
    realized: number;
    unrealized: number;
  };
  '7d': {
    realized: number;
    unrealized: number;
  };
  '30d': {
    realized: number;
    unrealized: number;
  };
  '1y': {
    realized: number;
    unrealized: number;
  };
};

export type PortfolioData = {
  total_wallet_balance: number;
  wallets: string[];
  assets: AssetDataMobula[];
  pnl_history?: PnLHistory;
  total_realized_pnl?: number;
  total_unrealized_pnl?: number;
  total_pnl_history?: TotalPnLHistory;
  balances_length: number;
};

export type WalletPortfolioMobulaResponse = {
  result: { data: PortfolioData };
};

export type BalanceHistoryEntry = [timestamp: number, balance: number];

export type WalletHistory = {
  wallets: string[];
  balance_usd: number;
  balance_history: BalanceHistoryEntry[];
};

export type WalletHistoryMobulaResponse = {
  result: { data: WalletHistory };
};

export type PrimeAssetType = { name: string; symbol: string };

export type MigrationTimestamp = {
  _seconds?: number;
  _nanoseconds?: number;
};

export type PointsTransactionAsset = {
  id?: number | null;
  name?: string;
  symbol?: string;
  decimals?: number;
  totalSupply?: number;
  circulatingSupply?: number;
  price?: number;
  liquidity?: number;
  priceChange24hPercent?: number;
  marketCapUSD?: number;
  logo?: string | null;
  nativeChainId?: string | null;
  contract?: string;
};

export type PointsTransactionDetails = {
  hash?: string;
  chainId?: string;
  fees?: string;
  feesUSD?: number;
  date?: string;
};

export type PointsTransactionHistoryItem = {
  id?: string;
  timestamp?: number;
  from?: string;
  to?: string;
  contract?: string;
  hash?: string;
  amount_usd?: number;
  amount?: number;
  block_number?: number;
  type?: string;
  blockchain?: string;
  tx_cost?: number;
  transaction?: PointsTransactionDetails;
  asset?: PointsTransactionAsset;
};

export type MigrationPointsMatrix = {
  transferPoints?: number;
  transferUsd?: number;
  week1Usd?: number;
  week1WithBonus?: number;
  week2Usd?: number;
  week2WithBonus?: number;
  week3Usd?: number;
  week3WithBonus?: number;
  week4Usd?: number;
  week4WithBonus?: number;
};

export type MigrationProgress = {
  totalAmountUsd?: number;
  completedSwap?: boolean;
  completedSwapWeek1?: boolean;
  completedSwapWeek2?: boolean;
  completedSwapWeek3?: boolean;
  completedSwapWeek4?: boolean;
  totalSwapAmountUsd?: number;
  totalSwapAmountWeek1?: number;
  totalSwapAmountWeek2?: number;
  totalSwapAmountWeek3?: number;
  totalSwapAmountWeek4?: number;
  totalGasAmountUsd?: number;
  migratedAmountUsd?: number;
  migratedFeesUsd?: number;
  pointsMatrix?: MigrationPointsMatrix;
  totalPoints?: number;
};

export type MigrationEntry = {
  id?: string;
  source?: string;
  lastSeen?: MigrationTimestamp;
  pxAddresses: string[];
  baseDataCheckActive?: boolean;
  eoaOwnerAddress?: string;
  lastUpdatedAt?: number;
  totalWalletBalance?: number;
  lastTransactionHistoryFetch?: MigrationTimestamp;
  transactionHistory?: PointsTransactionHistoryItem[];
  progress?: MigrationProgress;
  totalPoints?: number;
};

export type MigrationApiResponse = {
  result: MigrationEntry[];
};

export type LeaderboardTableData = {
  totalPoints: number;
  totalAmountUsd: number;
  addresses: string[];
  completedSwap?: boolean;
  totalGas?: number;
  rankChange?: LeaderboardRankChange;
  source?: string | undefined;
  newDropTime?: number;
};

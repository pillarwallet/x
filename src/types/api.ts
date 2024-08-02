export enum ApiLayout {
  OVERVIEW = 'OVERVIEW',
  TOKENS_HORIZONTAL = 'TOKENS_HORIZONTAL',
  TOKENS_VERTICAL = 'TOKENS_VERTICAL',
  GENERIC_BANNER = 'GENERIC_BANNER',
  EDITORIAL = 'EDITORIAL',
}

export type Asset = {
    name: string;
    symbol: string;
    id: number;
    contracts: string[];
    logo: string;
    blockchains: string[];
  }
  
  export type CrossChainBalance = {
    balance: number;
    balanceRaw: string;
    chainId: string;
    address: string;
  }
  
  export type ContractBalance = {
    balance: number;
    balanceRaw: string;
    chainId: string;
    address: string;
    decimals: number;
  }
  
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
  }
  
  export type TotalPnlHistory = {
    realized: number;
    unrealized: number;
  }
  
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
  }

  export type GenericBannerDisplay = {
    title?: string;
    subtitle?: string;
    backgroundImage?: string;
    cta?: {
      text?: string;
      href?: string;
    };
  }

  export type EditorialDisplay = {
    tags?: {
      label?: string;
      icon?: string;
      color?: string;
    }[],
    title?: string;
    summary?: string;
    media?: string;
    href?: string;
    timestamp?: number;
    attribution?: {
      name?: string;
      icon?: string;
      href?: string;
    }
  }
  
  export type Projection = {
    meta: {
      display?: GenericBannerDisplay | EditorialDisplay;
    };
    data?: WalletPortfolioData | TokenData[];
    layout: ApiLayout;
    id: string;
  }
  
  export type ApiResponse = {
    projection: Projection[];
  }

  interface TokenContract {
    address: string;
    blockchain: string;
    decimals?: number;
  }
  
  interface TokenPlatform {
    name: string;
    rank: number;
    weight: number;
  }
  
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
  }
  

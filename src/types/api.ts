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
  
  export type ApiData = {
    total_wallet_balance: number;
    wallet: string;
    wallets: string[];
    total_realized_pnl: number;
    total_unrealized_pnl: number;
    assets: AssetData[];
    total_pnl_history: {
      [key in '24h' | '7d' | '30d' | '1y']?: TotalPnlHistory;
  };
  
  }
  
  // TO DO - meta type to change when api ready, layout should be enum
  export type Projection = {
    meta: unknown;
    data: ApiData;
    layout: string;
    id: string;
  }
  
  export type ApiResponse = {
    projection: Projection[];
  }
  
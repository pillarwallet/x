export interface Asset {
  id: number;
  name: string;
  symbol: string;
  logo: string;
  balance: number;
  decimals: number;
  price: number;
  price_change_24h: number;
  contract: string;
  chainId: number;
  chainName: string;
  usdBalance: number;
}

export interface SendFormData {
  amount: string;
  recipient: string;
}

export interface TransactionStatus {
  hash: string;
  chainId: number;
  status: 'pending' | 'success' | 'failed';
  timestamp: number;
}


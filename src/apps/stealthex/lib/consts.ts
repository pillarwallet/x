import { CurrencyData } from './backend/api';


export const defaultSendCurrency: CurrencyData = {
  address_explorer: 'https://blockchair.com/bitcoin/address/{}',
  symbol: 'btc',
  has_extra_id: false,
  extra_id: '',
  network: 'TRX',
  name: 'Bitcoin',
  image:
    'https://images.stealthex.io/coins-color/6255bc60422d1c0017b74f3f-btc_c.svg',
  validation_extra: null,
  validation_address:
    '^[13][a-km-zA-HJ-NP-Z1-9]{25,80}$|^(bc1)[0-9A-Za-z]{25,80}$',
  tx_explorer: null,
  warnings_from: [],
  warnings_to: [],
};

export const defaultReceiveCurrency: CurrencyData = {
  network: 'ETH',
  symbol: 'eth',
  has_extra_id: false,
  extra_id: '',
  name: 'Ethereum',
  image:
    'https://images.stealthex.io/coins-color/6255bcb6422d1c0017b74f5a-eth_c.svg',
  validation_extra: null,
  validation_address: '^(0x)[0-9A-Fa-f]{40}$',
  address_explorer: 'https://blockchair.com/ethereum/address/{}',
  tx_explorer: null,
  warnings_from: ['Do not deposit your ETH from a smart contract'],
  warnings_to: ['Do not provide a smart contract as your ETH payout address'],
};

export const defaultSendFiatCurrency: CurrencyData = {
  address_explorer: null,
  extra_id: '',
  has_extra_id: false,
  image:
    'https://images.stealthex.io/coins-color/644109245fc5480018c5d5e1-usd_90681e5a82.svg',
  network: null,
  name: 'US Dollar',
  symbol: 'usd',
  tx_explorer: null,
  validation_address: null,
  validation_extra: null,
  warnings_from: [],
  warnings_to: [],
};

export const defaultReceiveFiatCurrency: CurrencyData = {
  address_explorer: 'https://blockchair.com/bitcoin/address/{}',
  extra_id: '',
  has_extra_id: false,
  image:
    'https://images.stealthex.io/coins-color/6255bc60422d1c0017b74f3f-btc_c.svg',
  network: 'TRX',
  name: 'Bitcoin',
  symbol: 'btc',
  tx_explorer: 'https://blockchair.com/bitcoin/transaction/{}',
  validation_address:
    '^[13][a-km-zA-HJ-NP-Z1-9]{25,80}$|^(bc1)[0-9A-Za-z]{25,80}$',
  validation_extra: null,
  warnings_from: [],
  warnings_to: [],
};

export const defaultAmount = '0.1';
export const showPizzaDay = true;
export const coinPerPage = 25;
export const availableCoins = 1400;

export const fixedRevalidationMs = 4.5 * 60 * 1000; // 4.5m
export const floatRevalidationMs = 30 * 1000; // 30s

export const maxGeneratedSitemapSize = 50_000;
import { PrimeAssetType } from '../../../types/api';

const isGnosisEnabled = import.meta.env.VITE_FEATURE_FLAG_GNOSIS === 'true';

export const PAGE_LIMIT: number = 4;

const allPrimeAssetsMobula: PrimeAssetType[] = [
  { name: 'Ethereum', symbol: 'ETH' },
  { name: 'XDAI', symbol: 'XDAI' },
  { name: 'USDC', symbol: 'USDC' },
  { name: 'Binance Bridged USDC (BNB Smart Chain)', symbol: 'USDC' },
  { name: 'Tether', symbol: 'USDT' },
  { name: 'Binance Bridged USDT (BNB Smart Chain)', symbol: 'BSC-USD' },
  { name: 'Polygon', symbol: 'MATIC' },
  { name: 'POL (ex-MATIC)', symbol: 'POL' },
  { name: 'BNB', symbol: 'BNB' },
  { name: 'Dai', symbol: 'DAI' },
];

export const PRIME_ASSETS_MOBULA = allPrimeAssetsMobula.filter(
  (asset) => isGnosisEnabled || asset.name !== 'XDAI'
);

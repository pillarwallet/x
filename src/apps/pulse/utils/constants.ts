import { CompatibleChains, isGnosisEnabled } from '../../../utils/blockchain';

const allMobulaChainNames = [
  'Ethereum',
  'Polygon',
  'Base',
  'XDAI',
  'BNB Smart Chain (BEP20)',
  'Arbitrum',
  'Optimistic',
];

export const MOBULA_CHAIN_NAMES = allMobulaChainNames.filter(
  (name) => isGnosisEnabled || name !== 'XDAI'
);

export enum MobulaChainNames {
  Ethereum = 'Ethereum',
  Polygon = 'Polygon',
  Base = 'Base',
  XDAI = 'XDAI',
  BNB_Smart_Chain_BEP20 = 'BNB Smart Chain (BEP20)',
  Arbitrum = 'Arbitrum',
  Optimistic = 'Optimistic',
  All = 'All',
}

export const getChainId = (chain: MobulaChainNames) => {
  switch (chain) {
    case MobulaChainNames.Ethereum:
      return '1';
    case MobulaChainNames.Polygon:
      return '137';
    case MobulaChainNames.Base:
      return '8453';
    case MobulaChainNames.XDAI:
      return '100';
    case MobulaChainNames.BNB_Smart_Chain_BEP20:
      return '56';
    case MobulaChainNames.Arbitrum:
      return '42161';
    case MobulaChainNames.Optimistic:
      return '10';
    default:
      return CompatibleChains.reduce((acc, item, index) => {
        return acc + (index > 0 ? ',' : '') + item.chainId;
      }, '');
  }
};

export const getChainName = (chainId: number) => {
  switch (chainId) {
    case 1:
      return MobulaChainNames.Ethereum;
    case 137:
      return MobulaChainNames.Polygon;
    case 8453:
      return MobulaChainNames.Base;
    case 100:
      return MobulaChainNames.XDAI;
    case 56:
      return MobulaChainNames.BNB_Smart_Chain_BEP20;
    case 42161:
      return MobulaChainNames.Arbitrum;
    case 10:
      return MobulaChainNames.Optimistic;
    default:
      return '';
  }
};

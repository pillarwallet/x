import { Nft } from '@etherspot/data-utils/dist/cjs/sdk/data/classes/nft';
import { NftCollection } from '@etherspot/data-utils/dist/cjs/sdk/data/classes/nft-collection';
import { Token } from '../services/tokensData';
import { ITransaction } from './blockchain';

export interface AppManifest {
  title: string;
  description: string;
  translations: Record<string, string>;
}

export interface SendModalSingleTransactionData extends SendModalDataBase {
  transaction: ITransaction;
}

interface SendModalSingleBatchedTransactionsData extends SendModalDataBase {
  batches: {
    chainId: number;
    transactions: Omit<ITransaction, 'chainId'>[];
  }[];
}

export type SendModalData =
  | SendModalSingleTransactionData
  | SendModalSingleBatchedTransactionsData;

export interface SendModalDataBase {
  title: string;
  description?: string;
  onSent?: (userOpHashes: string[]) => void;
}

export type AvatarVariantType =
  | 'marble'
  | 'beam'
  | 'pixel'
  | 'sunset'
  | 'ring'
  | 'bauhaus';

export interface TokenAssetSelectOption extends SelectOption {
  type: 'token';
  asset: Token;
  chainId: number;
  balance: number;
}

export interface NftAssetSelectOption extends SelectOption {
  type: 'nft';
  nft: Nft;
  collection: NftCollection;
  chainId: number;
}

export type AssetSelectOption = TokenAssetSelectOption | NftAssetSelectOption;

export interface SelectOption {
  id: string;
  title: string;
  value: string | number;
  isLoadingValue?: boolean;
  imageSrc?: string;
}

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

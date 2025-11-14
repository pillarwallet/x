import type { WalletClient } from 'viem';

export type JsonRpcRequestArguments = {
  method: string;
  params?: readonly unknown[] | Record<string, unknown> | undefined;
};

export interface Eip1193LikeProvider {
  request: <Result = unknown>(args: JsonRpcRequestArguments) => Promise<Result>;
  on?: (...args: unknown[]) => unknown;
  removeListener?: (...args: unknown[]) => unknown;
  [key: string]: unknown;
}

export type WalletProviderLike = WalletClient | Eip1193LikeProvider;

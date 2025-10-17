import * as Sentry from '@sentry/react';
import type { WalletClient } from 'viem';
import { hexToBytes, type Hex } from 'viem';

/**
 * Creates an EIP-1193 compatible provider wrapper for a wallet client created from a private key.
 * This allows the private key wallet to work with libraries that expect EIP-1193 providers
 * (like EtherspotTransactionKit) without triggering external wallet prompts.
 *
 * @param walletClient - A viem WalletClient created with privateKeyToAccount
 * @returns An EIP-1193 compatible provider object
 */
export function createPrivateKeyProvider(walletClient: WalletClient) {
  const provider = {
    // EIP-1193 request method
    async request({ method, params }: { method: string; params?: any[] }) {
      Sentry.addBreadcrumb({
        category: 'private_key_provider',
        message: `RPC request: ${method}`,
        level: 'info',
        data: {
          method,
          hasParams: !!params,
        },
      });

      try {
        switch (method) {
          case 'eth_accounts':
          case 'eth_requestAccounts':
            return [walletClient.account?.address];

          case 'eth_chainId':
            return `0x${walletClient.chain?.id.toString(16)}`;

          case 'eth_sendTransaction': {
            const [transaction] = params || [];
            if (!transaction) {
              throw new Error('Transaction parameter missing');
            }

            Sentry.addBreadcrumb({
              category: 'private_key_provider',
              message: 'Signing transaction with private key',
              level: 'info',
              data: {
                to: transaction.to,
                from: transaction.from,
              },
            });

            // Send the transaction using the wallet client
            const hash = await walletClient.sendTransaction({
              to: transaction.to,
              value: transaction.value ? BigInt(transaction.value) : undefined,
              data: transaction.data,
              gas: transaction.gas ? BigInt(transaction.gas) : undefined,
              gasPrice: transaction.gasPrice
                ? BigInt(transaction.gasPrice)
                : undefined,
              maxFeePerGas: transaction.maxFeePerGas
                ? BigInt(transaction.maxFeePerGas)
                : undefined,
              maxPriorityFeePerGas: transaction.maxPriorityFeePerGas
                ? BigInt(transaction.maxPriorityFeePerGas)
                : undefined,
              nonce: transaction.nonce ? Number(transaction.nonce) : undefined,
            });

            Sentry.addBreadcrumb({
              category: 'private_key_provider',
              message: 'Transaction signed and sent',
              level: 'info',
              data: { hash },
            });

            return hash;
          }

          case 'personal_sign': {
            const [message, address] = params || [];
            if (!message || !address) {
              throw new Error('Message or address parameter missing');
            }

            Sentry.addBreadcrumb({
              category: 'private_key_provider',
              message: 'Signing message with private key',
              level: 'info',
            });

            // Sign the message using the wallet client
            const signature = await walletClient.signMessage({
              message: { raw: hexToBytes(message as Hex) },
            });

            return signature;
          }

          case 'eth_sign': {
            const [address, message] = params || [];
            if (!message || !address) {
              throw new Error('Message or address parameter missing');
            }

            Sentry.addBreadcrumb({
              category: 'private_key_provider',
              message: 'Signing message (eth_sign) with private key',
              level: 'info',
            });

            // Sign the message using the wallet client
            const signature = await walletClient.signMessage({
              message: { raw: hexToBytes(message as Hex) },
            });

            return signature;
          }

          case 'eth_signTypedData':
          case 'eth_signTypedData_v4': {
            const [address, typedData] = params || [];
            if (!typedData || !address) {
              throw new Error('TypedData or address parameter missing');
            }

            Sentry.addBreadcrumb({
              category: 'private_key_provider',
              message: 'Signing typed data with private key',
              level: 'info',
            });

            const parsedData =
              typeof typedData === 'string'
                ? JSON.parse(typedData)
                : typedData;

            // Sign typed data using the wallet client
            const signature = await walletClient.signTypedData({
              domain: parsedData.domain,
              types: parsedData.types,
              primaryType: parsedData.primaryType,
              message: parsedData.message,
            });

            return signature;
          }

          case 'eth_blockNumber':
          case 'eth_call':
          case 'eth_estimateGas':
          case 'eth_gasPrice':
          case 'eth_getBalance':
          case 'eth_getBlockByNumber':
          case 'eth_getCode':
          case 'eth_getTransactionByHash':
          case 'eth_getTransactionCount':
          case 'eth_getTransactionReceipt':
          case 'net_version': {
            // For read-only methods, use the wallet client's transport
            if (!walletClient.transport) {
              throw new Error('Transport not available for read operations');
            }
            
            const result = await walletClient.request({
              method: method as any,
              params: params as any,
            });
            
            return result;
          }

          default:
            Sentry.captureMessage(`Unsupported RPC method: ${method}`, {
              level: 'warning',
              tags: {
                component: 'private_key_provider',
                method,
              },
            });
            throw new Error(`Unsupported method: ${method}`);
        }
      } catch (error) {
        Sentry.captureException(error, {
          tags: {
            component: 'private_key_provider',
            method,
          },
          contexts: {
            rpc_error: {
              method,
              errorMessage:
                error instanceof Error ? error.message : String(error),
            },
          },
        });
        throw error;
      }
    },

    // EIP-1193 event emitter methods (minimal implementation)
    on: () => provider,
    removeListener: () => provider,
    once: () => provider,
  };

  return provider;
}


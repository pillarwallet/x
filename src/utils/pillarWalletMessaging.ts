import { isAddress } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import * as Sentry from '@sentry/react';

/**
 * Type for the private key response from the Pillar Wallet webview
 */
export type PillarWalletPkResponse = {
  type: 'pillarWalletPkResponse';
  value: {
    pk: string;
  };
};

/**
 * Type for the authentication request to the Pillar Wallet webview
 */
export type PillarWalletAuthRequest = {
  type: 'pillarXAuthRequest';
  value: 'pk';
};

/**
 * Callback function type for when a private key is successfully received
 */
export type OnPrivateKeyReceivedCallback = (address: string, privateKey: string) => void;

/**
 * Callback function type for when an error occurs
 */
export type OnErrorCallback = (error: Error) => void;

/**
 * Extend Window interface to include ReactNativeWebView
 */
declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}

/**
 * Requests a private key from the React Native webview
 * @param authRequestId - Unique identifier for this authentication request
 */
export const requestPrivateKey = (authRequestId: string): void => {
  const message: PillarWalletAuthRequest = {
    type: 'pillarXAuthRequest',
    value: 'pk',
  };

  Sentry.addBreadcrumb({
    category: 'authentication',
    message: 'Requesting private key from Pillar Wallet webview',
    level: 'info',
    data: {
      authRequestId,
      message: JSON.stringify(message),
    },
  });

  // Send message to React Native webview
  if (window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(JSON.stringify(message));
  } else {
    // Fallback for testing in browser
    window.postMessage(JSON.stringify(message), '*');
  }
};

/**
 * Creates a message handler for receiving private keys from the Pillar Wallet webview
 * @param authRequestId - Unique identifier for this authentication request
 * @param onSuccess - Callback function to execute when private key is successfully received
 * @param onError - Callback function to execute when an error occurs
 * @returns Event handler function
 */
export const createWebViewMessageHandler = (
  authRequestId: string,
  onSuccess: OnPrivateKeyReceivedCallback,
  onError: OnErrorCallback
) => {
  return (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);

      Sentry.addBreadcrumb({
        category: 'authentication',
        message: 'Received message from webview',
        level: 'info',
        data: {
          authRequestId,
          messageType: data?.type,
          hasValue: !!data?.value,
        },
      });

      // Check if this is the private key response
      if (data?.type === 'pillarWalletPkResponse' && data?.value?.pk) {
        const privateKey = data.value.pk;

        Sentry.addBreadcrumb({
          category: 'authentication',
          message: 'Private key received from Pillar Wallet webview',
          level: 'info',
          data: {
            authRequestId,
          },
        });

        try {
          // Convert private key to account address
          const account = privateKeyToAccount(privateKey as `0x${string}`);

          if (isAddress(account.address)) {
            Sentry.addBreadcrumb({
              category: 'authentication',
              message: 'Private key authentication successful',
              level: 'info',
              data: {
                authRequestId,
                accountAddress: account.address,
              },
            });

            Sentry.captureMessage('Pillar Wallet authentication successful', {
              level: 'info',
              tags: {
                component: 'authentication',
                action: 'pillar_wallet_auth_success',
                authRequestId,
              },
              contexts: {
                pillar_wallet_auth: {
                  authRequestId,
                  accountAddress: account.address,
                },
              },
            });

            // Execute success callback
            onSuccess(account.address, privateKey);
          } else {
            throw new Error('Invalid address derived from private key');
          }
        } catch (error) {
          console.error('Error processing private key:', error);

          Sentry.captureException(error, {
            tags: {
              component: 'authentication',
              action: 'pillar_wallet_auth_error',
              authRequestId,
            },
            contexts: {
              pillar_wallet_auth: {
                authRequestId,
                error: error instanceof Error ? error.message : String(error),
              },
            },
          });

          onError(error instanceof Error ? error : new Error(String(error)));
        }
      }
    } catch (error) {
      console.error('Error parsing webview message:', error);

      Sentry.captureException(error, {
        tags: {
          component: 'authentication',
          action: 'pillar_wallet_message_parse_error',
          authRequestId,
        },
        contexts: {
          pillar_wallet_auth: {
            authRequestId,
            error: error instanceof Error ? error.message : String(error),
          },
        },
      });
    }
  };
};

/**
 * Sets up the Pillar Wallet webview messaging listener
 * @param onSuccess - Callback function to execute when private key is successfully received
 * @param onError - Callback function to execute when an error occurs
 * @returns Cleanup function to remove the event listener
 */
export const setupPillarWalletMessaging = (
  onSuccess: OnPrivateKeyReceivedCallback,
  onError: OnErrorCallback
): (() => void) => {
  const authRequestId = `pillar_wallet_auth_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Set Sentry context for this authentication flow
  Sentry.setContext('pillar_wallet_auth', {
    authRequestId,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
  });

  Sentry.addBreadcrumb({
    category: 'authentication',
    message: 'Pillar Wallet authentication messaging setup initiated',
    level: 'info',
    data: {
      authRequestId,
    },
  });

  // Create the message handler
  const messageHandler = createWebViewMessageHandler(authRequestId, onSuccess, onError);

  // Add event listener for webview messages
  window.addEventListener('message', messageHandler);

  // Request private key after a short delay to ensure webview is ready
  const requestTimer = setTimeout(() => {
    requestPrivateKey(authRequestId);
  }, 100);

  // Return cleanup function
  return () => {
    window.removeEventListener('message', messageHandler);
    clearTimeout(requestTimer);
  };
};


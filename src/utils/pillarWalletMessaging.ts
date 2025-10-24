import { isAddress } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

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
export type OnPrivateKeyReceivedCallback = (
  address: string,
  privateKey: string
) => void;

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

  interface Document {
    addEventListener(
      type: 'message',
      listener: (event: MessageEvent) => void
    ): void;
    removeEventListener(
      type: 'message',
      listener: (event: MessageEvent) => void
    ): void;
  }
}

/**
 * Requests a private key from the React Native webview
 */
export const requestPrivateKey = (): void => {
  const message: PillarWalletAuthRequest = {
    type: 'pillarXAuthRequest',
    value: 'pk',
  };

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
 * @param onSuccess - Callback function to execute when private key is successfully received
 * @param onError - Callback function to execute when an error occurs
 * @returns Event handler function
 */
export const createWebViewMessageHandler = (
  onSuccess: OnPrivateKeyReceivedCallback,
  onError: OnErrorCallback
) => {
  return (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);

      // Check if this is the private key response
      if (data?.type === 'pillarWalletPkResponse' && data?.value?.pk) {
        const privateKey = data.value.pk;

        try {
          // Convert private key to account address
          const account = privateKeyToAccount(privateKey as `0x${string}`);

          if (isAddress(account.address)) {
            // Execute success callback
            onSuccess(account.address, privateKey);
          } else {
            throw new Error('Invalid address derived from private key');
          }
        } catch (error) {
          console.error('Error processing private key:', error);

          onError(error instanceof Error ? error : new Error(String(error)));
        }
      }
    } catch (error) {
      console.error('Error parsing webview message:', error);
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
  // Create the message handler
  const messageHandler = createWebViewMessageHandler(onSuccess, onError);

  // Add event listener for webview messages
  window.addEventListener('message', messageHandler);

  // For React Native webview, we also need to listen for direct document events
  // React Native webview messages sometimes come through document events
  const documentMessageHandler = (event: MessageEvent) => {
    // Check if this is a React Native webview message
    if (event.data && typeof event.data === 'string') {
      try {
        const data = JSON.parse(event.data);

        if (data?.type === 'pillarWalletPkResponse') {
          // Create a proper MessageEvent and call our handler
          const messageEvent = new MessageEvent('message', {
            data: event.data,
          });
          messageHandler(messageEvent);
        }
      } catch (e) {
        console.error('Error parsing document message, retrying in 5s:', e);
        // Retry request every 5 seconds on parsing errors
        setTimeout(() => {
          requestPrivateKey();
        }, 5000);
      }
    }
  };

  // Listen for document events (React Native webview specific)
  // Note: document.addEventListener('message') is not standard, but some React Native webviews use it
  document.addEventListener('message', documentMessageHandler);

  // Also listen for custom events that might be triggered by React Native
  const customEventHandler = (event: CustomEvent) => {
    if (event.detail && typeof event.detail === 'string') {
      try {
        const data = JSON.parse(event.detail);

        if (data?.type === 'pillarWalletPkResponse') {
          const messageEvent = new MessageEvent('message', {
            data: event.detail,
          });
          messageHandler(messageEvent);
        }
      } catch (e) {
        console.error('Error parsing custom event, retrying in 5s:', e);
        // Retry request every 5 seconds on parsing errors
        setTimeout(() => {
          requestPrivateKey();
        }, 5000);
      }
    }
  };

  window.addEventListener(
    'pillarWalletMessage',
    customEventHandler as EventListener
  );

  // Request private key after a short delay to ensure webview is ready
  const requestTimer = setTimeout(() => {
    requestPrivateKey();
  }, 100);

  // Return cleanup function
  return () => {
    window.removeEventListener('message', messageHandler);
    document.removeEventListener('message', documentMessageHandler);
    window.removeEventListener(
      'pillarWalletMessage',
      customEventHandler as EventListener
    );
    clearTimeout(requestTimer);
  };
};

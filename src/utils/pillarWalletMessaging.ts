/**
 * NOTE: Many of these functions are implmentation copies
 * from Viem's native implementation to prevent signing issues.
 */

import type {
  AuthorizationRequest,
  Hex,
  SignedAuthorization,
  SignableMessage,
  TransactionSerializable,
  TypedData,
} from 'viem';

/**
 * Type for signing requests to the Pillar Wallet webview
 */
export type PillarWalletSigningRequest = {
  type: 'pillarXSigningRequest';
  value:
    | 'signMessage'
    | 'signTransaction'
    | 'signTypedData'
    | 'signAuthorization';
  data: string; // stringified JSON
};

/**
 * Type for signing responses from the Pillar Wallet webview
 */
export type PillarWalletSigningResponse = {
  type: 'pillarWalletSigningResponse';
  value: {
    result?: string;
    error?: string;
  };
};

/**
 * Callback function type for signing responses
 */
export type OnSigningResponseCallback = (result: string) => void;

/**
 * Callback function type for signing errors
 */
export type OnSigningErrorCallback = (error: Error) => void;

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
 * Custom JSON stringify replacer that handles BigInt values
 * Converts BigInt to string for JSON serialization
 */
const bigIntReplacer = (_key: string, value: unknown): unknown => {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  return value;
};

/**
 * Sends a signing request to the React Native webview
 * @param requestType - Type of signing request (signMessage, signTransaction, signTypedData, signAuthorization)
 * @param data - The data to sign (will be stringified)
 * @returns Promise that resolves with the signed result or rejects with an error
 */
export const requestSigning = (
  requestType:
    | 'signMessage'
    | 'signTransaction'
    | 'signTypedData'
    | 'signAuthorization',
  data: unknown
): Promise<string> => {
  return new Promise((resolve, reject) => {
    let timeout: ReturnType<typeof setTimeout>;
    // Create message handler for this specific request
    const messageHandler = (event: MessageEvent) => {
      try {
        const payload = JSON.parse(event.data);

        // Check if this is a signing response
        if (payload?.type === 'pillarWalletSigningResponse' && payload?.value) {
          // Remove listener after receiving response
          window.removeEventListener('message', messageHandler);
          document.removeEventListener('message', messageHandler);
          clearTimeout(timeout);

          if (payload.value.error) {
            reject(new Error(payload.value.error));
          } else if (payload.value.result) {
            resolve(payload.value.result);
          } else {
            reject(new Error('Invalid signing response format'));
          }
        }
      } catch (error) {
        // Ignore parsing errors for other message types
      }
    };

    // Listen for responses
    window.addEventListener('message', messageHandler);
    document.addEventListener('message', messageHandler);

    // Set timeout to prevent hanging promises
    timeout = setTimeout(() => {
      window.removeEventListener('message', messageHandler);
      document.removeEventListener('message', messageHandler);
      reject(new Error('Signing request timeout'));
    }, 60000); // 60 second timeout

    // Send signing request
    // Use custom replacer to handle BigInt values
    const message: PillarWalletSigningRequest = {
      type: 'pillarXSigningRequest',
      value: requestType,
      data: JSON.stringify(data, bigIntReplacer),
    };

    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify(message));
    } else {
      // Fallback for testing in browser
      window.postMessage(JSON.stringify(message), '*');
      // In browser, we can't actually sign, so reject immediately
      clearTimeout(timeout);
      window.removeEventListener('message', messageHandler);
      document.removeEventListener('message', messageHandler);
      reject(new Error('ReactNativeWebView not available'));
    }
  });
};

/**
 * Signs a message via the React Native webview
 * @param message - The message to sign (SignableMessage type from viem)
 * @returns Promise that resolves with the signature
 */
export const signMessageViaWebView = (
  message: SignableMessage
): Promise<Hex> => {
  // Convert SignableMessage to the format expected by React Native
  // If message is an object with raw property, use it directly
  // Otherwise, convert to string
  let messagePayload: string | { raw: Hex };
  if (typeof message === 'object' && message !== null && 'raw' in message) {
    messagePayload = { raw: message.raw as Hex };
  } else if (typeof message === 'string') {
    messagePayload = message;
  } else {
    messagePayload = String(message);
  }

  return requestSigning('signMessage', {
    message: messagePayload,
  }) as Promise<Hex>;
};

/**
 * Signs a transaction via the React Native webview
 * @param transaction - The transaction to sign
 * @returns Promise that resolves with the signature
 */
export const signTransactionViaWebView = (
  transaction: TransactionSerializable
): Promise<Hex> => {
  return requestSigning('signTransaction', transaction) as Promise<Hex>;
};

/**
 * Signs typed data (EIP-712) via the React Native webview
 * @param typedData - The typed data to sign
 * @returns Promise that resolves with the signature
 */
export const signTypedDataViaWebView = (typedData: TypedData): Promise<Hex> => {
  return requestSigning('signTypedData', typedData) as Promise<Hex>;
};

/**
 * Signs an EIP-7702 authorization via the React Native webview
 * @param authorization - The authorization request parameters
 * @returns Promise that resolves with the signed authorization object
 */
export const signAuthorizationViaWebView = (
  authorization: AuthorizationRequest
): Promise<SignedAuthorization> => {
  return requestSigning('signAuthorization', authorization).then((result) => {
    // Parse the result as a SignedAuthorization object
    // The React Native app returns a JSON stringified SignedAuthorization
    try {
      const parsed = JSON.parse(result);
      // Validate that it has the required fields
      // Note: v might be a string if it was serialized from BigInt
      if (
        parsed &&
        typeof parsed.address === 'string' &&
        typeof parsed.chainId === 'number' &&
        typeof parsed.nonce === 'number' &&
        typeof parsed.r === 'string' &&
        typeof parsed.s === 'string' &&
        (typeof parsed.v === 'bigint' ||
          typeof parsed.v === 'number' ||
          typeof parsed.v === 'string') &&
        (typeof parsed.yParity === 'number' ||
          typeof parsed.yParity === 'boolean')
      ) {
        let yParityValue: number;
        if (typeof parsed.yParity === 'boolean') {
          yParityValue = parsed.yParity ? 1 : 0;
        } else {
          yParityValue = parsed.yParity;
        }
        // Convert v to BigInt, handling number, string, and bigint representations
        const vValue = BigInt(parsed.v);
        return {
          address: parsed.address as `0x${string}`,
          chainId: parsed.chainId,
          nonce: parsed.nonce,
          r: parsed.r as `0x${string}`,
          s: parsed.s as `0x${string}`,
          v: vValue,
          yParity: yParityValue,
        } as SignedAuthorization;
      }
      throw new Error('Invalid signed authorization format');
    } catch (error) {
      throw new Error(
        `Failed to parse signed authorization: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  });
};

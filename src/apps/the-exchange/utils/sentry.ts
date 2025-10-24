import * as Sentry from '@sentry/react';

// Minimal Sentry configuration for the-exchange app
export const initSentryForExchange = () => {
  Sentry.setTag('app', 'the-exchange');
  Sentry.setTag('module', 'exchange');
};

// Utility to get fallback wallet address for logging
// This function should be called from within a React component context
// where the wallet address is available
export const fallbackWalletAddressForLogging = (): string => {
  return 'unknown_wallet_address';
};

// Minimal error logging - only capture actual errors
export const logExchangeError = (
  error: Error | string,
  extra?: Record<string, unknown>,
  tags?: Record<string, string>
) => {
  const walletAddress = fallbackWalletAddressForLogging();

  Sentry.withScope((scope) => {
    scope.setLevel('error');
    scope.setTag('wallet_address', walletAddress);
    scope.setTag('app_module', 'the-exchange');
    scope.setTag('error_type', 'exchange_error');

    if (tags) {
      Object.entries(tags).forEach(([key, value]) => {
        scope.setTag(key, value);
      });
    }

    // Only include essential error data
    if (extra) {
      const essentialData = {
        operation: extra.operation,
        swapToken: extra.swapToken,
        receiveToken: extra.receiveToken,
        amount: extra.amount,
      };
      scope.setExtra('exchange_error_data', essentialData);
    }

    if (error instanceof Error) {
      Sentry.captureException(error);
    } else {
      Sentry.captureMessage(error, 'error');
    }
  });
};

// Remove all other logging functions to save quota
// Only keep error logging for critical failures

// Hook to get wallet address for logging
export const useWalletAddressForLogging = () => {
  // This hook is kept for compatibility but returns minimal data
  return 'unknown_wallet_address';
};

import * as Sentry from '@sentry/react';

// Minimal Sentry configuration for the pulse app
export const initSentryForPulse = () => {
  Sentry.setTag('app', 'pulse');
  Sentry.setTag('module', 'pulse');
};

// Utility to get fallback wallet address for logging
// This function should be called from within a React component context
// where the wallet address is available
export const fallbackWalletAddressForLogging = (): string => {
  return 'unknown_wallet_address';
};

// Minimal error logging - only capture actual errors
export const logPulseError = (
  error: Error | string,
  extra?: Record<string, unknown>,
  tags?: Record<string, string>
) => {
  const walletAddress = fallbackWalletAddressForLogging();

  Sentry.withScope((scope) => {
    scope.setLevel('error');
    scope.setTag('wallet_address', walletAddress);
    scope.setTag('app_module', 'pulse');
    scope.setTag('error_type', 'pulse_error');

    if (tags) {
      Object.entries(tags).forEach(([key, value]) => {
        scope.setTag(key, value);
      });
    }

    // Only include essential error data
    if (extra) {
      const essentialData = {
        operation: extra.operation,
        buyToken: extra.buyToken,
        sellToken: extra.sellToken,
        amount: extra.amount,
        chainId: extra.chainId,
        fromChainId: extra.fromChainId,
        toChainId: extra.toChainId,
      };
      scope.setExtra('pulse_error_data', essentialData);
    }

    if (error instanceof Error) {
      Sentry.captureException(error);
    } else {
      Sentry.captureMessage(error, 'error');
    }
  });
};

// Hook to get wallet address for logging
export const useWalletAddressForLogging = () => {
  // This hook is kept for compatibility but returns minimal data
  return 'unknown_wallet_address';
};

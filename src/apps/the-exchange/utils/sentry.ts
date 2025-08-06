import * as Sentry from '@sentry/react';
import { useWalletAddress } from '@etherspot/transaction-kit';

// Sentry configuration for the-exchange app
export const initSentryForExchange = () => {
  Sentry.setTag('app', 'the-exchange');
  Sentry.setTag('module', 'exchange');
};

// Utility to get wallet address with fallback
export const getWalletAddressForLogging = (): string => {
  try {
    // This will be called from within a component that has access to the hook
    return 'unknown_wallet_address';
  } catch (error) {
    return 'unknown_wallet_address';
  }
};

// Enhanced Sentry logging with wallet address context
export const logExchangeEvent = (
  message: string,
  level: Sentry.SeverityLevel = 'info',
  extra?: Record<string, unknown>,
  tags?: Record<string, string>
) => {
  const walletAddress = getWalletAddressForLogging();

  Sentry.withScope((scope) => {
    scope.setLevel(level);
    scope.setTag('wallet_address', walletAddress);
    scope.setTag('app_module', 'the-exchange');

    if (tags) {
      Object.entries(tags).forEach(([key, value]) => {
        scope.setTag(key, value);
      });
    }

    if (extra) {
      scope.setExtra('exchange_data', extra);
    }

    Sentry.captureMessage(message);
  });
};

// Log exchange errors with wallet address
export const logExchangeError = (
  error: Error | string,
  extra?: Record<string, unknown>,
  tags?: Record<string, string>
) => {
  const walletAddress = getWalletAddressForLogging();

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

    if (extra) {
      scope.setExtra('exchange_error_data', extra);
    }

    if (error instanceof Error) {
      Sentry.captureException(error);
    } else {
      Sentry.captureMessage(error, 'error');
    }
  });
};

// Log swap operations
export const logSwapOperation = (
  operation: string,
  data: Record<string, unknown>,
  walletAddress?: string
) => {
  Sentry.withScope((scope) => {
    scope.setLevel('info');
    scope.setTag(
      'wallet_address',
      walletAddress || getWalletAddressForLogging()
    );
    scope.setTag('app_module', 'the-exchange');
    scope.setTag('operation_type', 'swap');
    scope.setTag('swap_operation', operation);

    scope.setExtra('swap_data', data);

    Sentry.captureMessage(`Swap operation: ${operation}`, 'info');
  });
};

// Log token operations
export const logTokenOperation = (
  operation: string,
  tokenData: Record<string, unknown>,
  walletAddress?: string
) => {
  Sentry.withScope((scope) => {
    scope.setLevel('info');
    scope.setTag(
      'wallet_address',
      walletAddress || getWalletAddressForLogging()
    );
    scope.setTag('app_module', 'the-exchange');
    scope.setTag('operation_type', 'token');
    scope.setTag('token_operation', operation);

    scope.setExtra('token_data', tokenData);

    Sentry.captureMessage(`Token operation: ${operation}`, 'info');
  });
};

// Log offer operations
export const logOfferOperation = (
  operation: string,
  offerData: Record<string, unknown>,
  walletAddress?: string
) => {
  Sentry.withScope((scope) => {
    scope.setLevel('info');
    scope.setTag(
      'wallet_address',
      walletAddress || getWalletAddressForLogging()
    );
    scope.setTag('app_module', 'the-exchange');
    scope.setTag('operation_type', 'offer');
    scope.setTag('offer_operation', operation);

    scope.setExtra('offer_data', offerData);

    Sentry.captureMessage(`Offer operation: ${operation}`, 'info');
  });
};

// Log transaction operations
export const logTransactionOperation = (
  operation: string,
  transactionData: Record<string, unknown>,
  walletAddress?: string
) => {
  Sentry.withScope((scope) => {
    scope.setLevel('info');
    scope.setTag(
      'wallet_address',
      walletAddress || getWalletAddressForLogging()
    );
    scope.setTag('app_module', 'the-exchange');
    scope.setTag('operation_type', 'transaction');
    scope.setTag('transaction_operation', operation);

    scope.setExtra('transaction_data', transactionData);

    Sentry.captureMessage(`Transaction operation: ${operation}`, 'info');
  });
};

// Log user interactions
export const logUserInteraction = (
  interaction: string,
  data: Record<string, unknown>,
  walletAddress?: string
) => {
  Sentry.withScope((scope) => {
    scope.setLevel('info');
    scope.setTag(
      'wallet_address',
      walletAddress || getWalletAddressForLogging()
    );
    scope.setTag('app_module', 'the-exchange');
    scope.setTag('interaction_type', 'user_action');
    scope.setTag('user_interaction', interaction);

    scope.setExtra('interaction_data', data);

    Sentry.captureMessage(`User interaction: ${interaction}`, 'info');
  });
};

// Log performance metrics
export const logPerformanceMetric = (
  metric: string,
  value: number,
  unit: string = 'ms',
  walletAddress?: string
) => {
  Sentry.withScope((scope) => {
    scope.setLevel('info');
    scope.setTag(
      'wallet_address',
      walletAddress || getWalletAddressForLogging()
    );
    scope.setTag('app_module', 'the-exchange');
    scope.setTag('metric_type', 'performance');
    scope.setTag('metric_name', metric);

    scope.setExtra('performance_data', {
      metric,
      value,
      unit,
      timestamp: new Date().toISOString(),
    });

    Sentry.captureMessage(
      `Performance metric: ${metric} = ${value}${unit}`,
      'info'
    );
  });
};

// Hook to get wallet address for logging
export const useWalletAddressForLogging = () => {
  return useWalletAddress();
};

// Note: Error boundary removed due to TypeScript/JSX compatibility issues
// Use Sentry's default error boundary or create a separate React component file

// Transaction monitoring for exchange operations
export const startExchangeTransaction = (
  operation: string,
  data: Record<string, unknown> = {},
  walletAddress?: string
) => {
  const transaction = Sentry.startTransaction({
    name: `exchange.${operation}`,
    op: 'exchange.operation',
  });

  transaction.setTag(
    'wallet_address',
    walletAddress || getWalletAddressForLogging()
  );
  transaction.setTag('app_module', 'the-exchange');
  transaction.setTag('operation_type', operation);

  if (data) {
    transaction.setData('exchange_data', data);
  }

  return transaction;
};

// Breadcrumb utilities for exchange
export const addExchangeBreadcrumb = (
  message: string,
  category: string = 'exchange',
  data?: Record<string, unknown>,
  level: Sentry.SeverityLevel = 'info'
) => {
  const walletAddress = getWalletAddressForLogging();

  Sentry.addBreadcrumb({
    message,
    category,
    level,
    data: {
      ...data,
      wallet_address: walletAddress,
      app_module: 'the-exchange',
    },
  });
};

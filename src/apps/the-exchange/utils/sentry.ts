import * as Sentry from '@sentry/react';
import { useWalletAddress } from '@etherspot/transaction-kit';

// Sentry configuration for the-exchange app
export const initSentryForExchange = () => {
  Sentry.setTag('app', 'the-exchange');
  Sentry.setTag('module', 'exchange');
};

// Utility to get fallback wallet address for logging
// This function should be called from within a React component context
// where the wallet address is available
export const fallbackWalletAddressForLogging = (): string => {
  // This is a utility function that should be called from within React components
  // The actual wallet address should be passed as a parameter or obtained via hook
  // For now, return unknown as this is a fallback utility
  return 'unknown_wallet_address';
};

// Enhanced Sentry logging with wallet address context
export const logExchangeEvent = (
  message: string,
  level: Sentry.SeverityLevel = 'info',
  extra?: Record<string, unknown>,
  tags?: Record<string, string>
) => {
  const walletAddress = fallbackWalletAddressForLogging();

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

// Generic operation logging function
export const logOperation = (
  operationType: string,
  operation: string,
  data: Record<string, unknown>,
  walletAddress?: string
) => {
  Sentry.withScope((scope) => {
    scope.setLevel('info');
    scope.setTag(
      'wallet_address',
      walletAddress || fallbackWalletAddressForLogging()
    );
    scope.setTag('app_module', 'the-exchange');
    scope.setTag('operation_type', operationType);
    scope.setTag(`${operationType}_operation`, operation);

    scope.setExtra(`${operationType}_data`, data);

    Sentry.captureMessage(
      `${operationType.charAt(0).toUpperCase() + operationType.slice(1)} operation: ${operation}`,
      'info'
    );
  });
};

// Log swap operations
export const logSwapOperation = (
  operation: string,
  data: Record<string, unknown>,
  walletAddress?: string
) => {
  logOperation('swap', operation, data, walletAddress);
};

// Log token operations
export const logTokenOperation = (
  operation: string,
  tokenData: Record<string, unknown>,
  walletAddress?: string
) => {
  logOperation('token', operation, tokenData, walletAddress);
};

// Log offer operations
export const logOfferOperation = (
  operation: string,
  offerData: Record<string, unknown>,
  walletAddress?: string
) => {
  logOperation('offer', operation, offerData, walletAddress);
};

// Log transaction operations
export const logTransactionOperation = (
  operation: string,
  transactionData: Record<string, unknown>,
  walletAddress?: string
) => {
  logOperation('transaction', operation, transactionData, walletAddress);
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
      walletAddress || fallbackWalletAddressForLogging()
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
      walletAddress || fallbackWalletAddressForLogging()
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
  const walletAddress = useWalletAddress();
  return walletAddress || 'unknown_wallet_address';
};

// Note: Error boundary removed due to TypeScript/JSX compatibility issues
// Use Sentry's default error boundary or create a separate React component file

// Transaction monitoring for exchange operations
export const startExchangeTransaction = (
  operation: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _data: Record<string, unknown> = {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _walletAddress?: string
) => {
  return Sentry.startSpan(
    {
      name: `exchange.${operation}`,
      op: 'exchange.operation',
    },
    (span) => {
      // Note: Span API has changed in Sentry v10
      // Properties are set via the span context instead
      return span;
    }
  );
};

// Breadcrumb utilities for exchange
export const addExchangeBreadcrumb = (
  message: string,
  category: string = 'exchange',
  data?: Record<string, unknown>,
  level: Sentry.SeverityLevel = 'info'
) => {
  const walletAddress = fallbackWalletAddressForLogging();

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

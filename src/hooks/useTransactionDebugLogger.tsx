export const useTransactionDebugLogger = () => {
  const isEnabled = localStorage.getItem('debug_transactions') === 'true';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const transactionDebugLog = (...args: any[]) => {
    if (isEnabled) {
      // eslint-disable-next-line no-console
      console.log('[TRANSACTION-DEBUG]', ...args);
    }
  };

  return {
    transactionDebugLog,
  };
};

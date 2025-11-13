import { useMemo } from 'react';

// types
import { TransactionStatusState, TransactionStep } from '../types/types';

// utils
import { getStepStatus } from '../utils/utils';

interface UseTransactionStatusOptions {
  status: TransactionStatusState;
  isBuy: boolean;
  resourceLockTxHash?: string;
  completedTxHash?: string;
  isResourceLockFailed?: boolean;
  useRelayBuy?: boolean;
}

/**
 * Custom hook for managing transaction status logic
 */
export const useTransactionStatus = ({
  status,
  isBuy,
  resourceLockTxHash,
  completedTxHash,
  isResourceLockFailed = false,
  useRelayBuy = false,
}: UseTransactionStatusOptions) => {
  const getStepStatusForStep = useMemo(() => {
    return (step: TransactionStep) =>
      getStepStatus(
        step,
        status,
        isBuy,
        resourceLockTxHash,
        completedTxHash,
        isResourceLockFailed,
        useRelayBuy
      );
  }, [
    status,
    isBuy,
    resourceLockTxHash,
    completedTxHash,
    isResourceLockFailed,
    useRelayBuy,
  ]);

  const canClose = useMemo(() => {
    return status === 'Transaction Complete' || status === 'Transaction Failed';
  }, [status]);

  return {
    getStepStatusForStep,
    canClose,
  };
};

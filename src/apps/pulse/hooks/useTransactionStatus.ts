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
}: UseTransactionStatusOptions) => {
  const getStepStatusForStep = useMemo(() => {
    return (step: TransactionStep) =>
      getStepStatus(
        step,
        status,
        isBuy,
        resourceLockTxHash,
        completedTxHash,
        isResourceLockFailed
      );
  }, [
    status,
    isBuy,
    resourceLockTxHash,
    completedTxHash,
    isResourceLockFailed,
  ]);

  const canClose = useMemo(() => {
    return status === 'Transaction Complete' || status === 'Transaction Failed';
  }, [status]);

  return {
    getStepStatusForStep,
    canClose,
  };
};

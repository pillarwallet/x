import { format } from 'date-fns';
import React from 'react';

// constants
import {
  BUTTON_CONFIG,
  STATUS_COLORS,
  STATUS_CONFIG,
} from '../constants/constants';

// types
import {
  StepStatus,
  TransactionStatusState,
  TransactionStep,
} from '../types/types';

/**
 * Truncates a hash string to show first 6 and last 4 characters
 */
export const truncateHash = (hash: string): string => {
  if (!hash || hash === '-') return '-';
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
};

/**
 * Gets the color for a given transaction status
 */
export const getStatusColor = (status: TransactionStatusState): string => {
  return STATUS_COLORS[status] || '#8A77FF';
};

/**
 * Gets the configuration for a given transaction status
 */
export const getStatusConfig = (status: TransactionStatusState) => {
  return STATUS_CONFIG[status] || STATUS_CONFIG['Starting Transaction'];
};

/**
 * Gets the button configuration for a given transaction status
 */
export const getButtonConfig = (status: TransactionStatusState) => {
  return BUTTON_CONFIG[status] || BUTTON_CONFIG['Transaction Pending'];
};

/**
 * Determines if a hash is valid (not empty and not '-')
 */
export const isValidHash = (hash?: string): boolean => {
  return Boolean(hash && hash !== '-');
};

/**
 * Sanitizes error details by removing API keys
 */
export const sanitizeErrorDetails = (errorThrown: string): string => {
  if (!errorThrown) return errorThrown;

  return errorThrown.replace(
    /api-key=[A-Za-z0-9+/=]+/g,
    'api-key=***REDACTED***'
  );
};

/**
 * Formats timestamp for display
 */
export const formatTimestamp = (date: Date, includeDate = false): string => {
  if (includeDate) {
    return format(date, 'MMM d, yyyy HH:mm');
  }
  return format(date, 'HH:mm');
};

/**
 * Formats timestamp for progress steps
 */
export const formatStepTimestamp = (
  date: Date,
  step: TransactionStep
): React.ReactNode => {
  if (step === 'Submitted') {
    return (
      <>
        <span className="text-white">{format(date, 'MMM d, yyyy')}</span>
        <span className="text-white"> • </span>
        <span className="text-white/50">{format(date, 'HH:mm')}</span>
      </>
    );
  }

  return <span className="text-white/50">{format(date, 'HH:mm')}</span>;
};

/**
 * Gets status info for display
 */
export const getStatusInfo = (status: TransactionStatusState) => {
  switch (status) {
    case 'Transaction Pending':
      return { text: 'Pending', color: 'text-[#FFAB36]' };
    case 'Transaction Failed':
      return { text: 'Failed', color: 'text-[#FF366C]' };
    case 'Transaction Complete':
      return { text: 'Success', color: 'text-[#5CFF93]' };
    default:
      return { text: 'Starting...', color: 'text-white/50' };
  }
};

/**
 * Determines step status based on current transaction status
 */
export const getStepStatus = (
  step: TransactionStep,
  status: TransactionStatusState,
  isBuy: boolean,
  resourceLockTxHash?: string,
  completedTxHash?: string,
  isResourceLockFailed?: boolean
): StepStatus => {
  if (status === 'Starting Transaction') {
    return 'pending';
  }

  if (status === 'Transaction Pending') {
    if (step === 'Submitted') return 'completed';
    if (step === 'Pending') return 'pending';
    if (step === 'ResourceLock') {
      // For Buy, resource lock step shows pending until we have the hash
      if (isBuy) {
        return resourceLockTxHash ? 'completed' : 'pending';
      }
      return 'pending';
    }
    if (step === 'Completed') {
      // For Buy, completed step shows pending only if resource lock is done
      if (isBuy) {
        if (!resourceLockTxHash) {
          // If resource lock is not done yet, completed step should be inactive
          return 'inactive';
        }
        return completedTxHash ? 'completed' : 'pending';
      }
      return 'inactive';
    }
  }

  if (status === 'Transaction Complete') {
    if (step === 'Submitted') return 'completed';
    if (step === 'Pending') return 'completed';
    if (step === 'ResourceLock') {
      return isBuy ? 'completed' : 'inactive';
    }
    if (step === 'Completed') return 'completed';
  }

  if (status === 'Transaction Failed') {
    if (step === 'Submitted') return 'completed';
    if (step === 'Pending') return 'completed';
    if (step === 'ResourceLock') {
      if (isBuy) {
        if (isResourceLockFailed) return 'failed';
        return 'completed';
      }
      return 'inactive';
    }
    if (step === 'Completed') {
      if (isBuy && isResourceLockFailed) return 'inactive';
      return 'failed'; // For Sell, Completed should be failed when transaction fails
    }
  }

  return 'pending';
};

/**
 * Determines at which step the transaction failed
 */
export const determineFailureStep = (
  isResourceLockFailed: boolean,
  getStepStatusFn: (step: TransactionStep) => StepStatus
): string => {
  if (isResourceLockFailed) {
    return 'Resource Lock Creation';
  }

  const submittedStatus = getStepStatusFn('Submitted');
  const pendingStatus = getStepStatusFn('Pending');
  const resourceLockStatus = getStepStatusFn('ResourceLock');
  const completedStatus = getStepStatusFn('Completed');

  if (submittedStatus === 'failed') return 'Transaction Submission';
  if (pendingStatus === 'failed') return 'Transaction Pending';
  if (resourceLockStatus === 'failed') return 'Resource Lock Creation';
  if (completedStatus === 'failed') return 'Transaction Completion';

  return 'Unknown Step';
};

/**
 * Checks if transaction status allows closing
 */
export const canCloseTransaction = (
  status: TransactionStatusState
): boolean => {
  return status === 'Transaction Complete' || status === 'Transaction Failed';
};

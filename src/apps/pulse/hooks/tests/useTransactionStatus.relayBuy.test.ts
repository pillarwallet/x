import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

// hooks
import { useTransactionStatus } from '../useTransactionStatus';

// types
import type { TransactionStatusState } from '../../types/types';

describe('useTransactionStatus - Relay Buy Tests', () => {
  describe('Relay Buy (useRelayBuy=true)', () => {
    describe('Starting Transaction', () => {
      it('should show all steps as pending for Relay Buy', () => {
        const { result } = renderHook(() =>
          useTransactionStatus({
            status: 'Starting Transaction' as TransactionStatusState,
            isBuy: true,
            useRelayBuy: true,
          })
        );

        expect(result.current.getStepStatusForStep('Submitted')).toBe(
          'pending'
        );
        expect(result.current.getStepStatusForStep('Pending')).toBe('pending');
        expect(result.current.getStepStatusForStep('ResourceLock')).toBe(
          'pending'
        );
        expect(result.current.getStepStatusForStep('Completed')).toBe(
          'pending'
        );
        expect(result.current.canClose).toBe(false);
      });
    });

    describe('Transaction Pending', () => {
      it('should show Submitted completed, Pending pending, others inactive', () => {
        const { result } = renderHook(() =>
          useTransactionStatus({
            status: 'Transaction Pending' as TransactionStatusState,
            isBuy: true,
            useRelayBuy: true,
          })
        );

        expect(result.current.getStepStatusForStep('Submitted')).toBe(
          'completed'
        );
        expect(result.current.getStepStatusForStep('Pending')).toBe('pending');
        expect(result.current.getStepStatusForStep('Completed')).toBe(
          'inactive'
        );
        // ResourceLock should not be used for Relay Buy
        expect(result.current.getStepStatusForStep('ResourceLock')).toBe(
          'pending'
        );
        expect(result.current.canClose).toBe(false);
      });

      it('should ignore resourceLockTxHash for Relay Buy', () => {
        const { result } = renderHook(() =>
          useTransactionStatus({
            status: 'Transaction Pending' as TransactionStatusState,
            isBuy: true,
            resourceLockTxHash: '0x123',
            useRelayBuy: true,
          })
        );

        // ResourceLock hash should not affect Relay Buy steps
        expect(result.current.getStepStatusForStep('Submitted')).toBe(
          'completed'
        );
        expect(result.current.getStepStatusForStep('Pending')).toBe('pending');
        expect(result.current.getStepStatusForStep('ResourceLock')).toBe(
          'pending'
        );
        expect(result.current.getStepStatusForStep('Completed')).toBe(
          'inactive'
        );
      });
    });

    describe('Transaction Complete', () => {
      it('should show all steps as completed for Relay Buy', () => {
        const { result } = renderHook(() =>
          useTransactionStatus({
            status: 'Transaction Complete' as TransactionStatusState,
            isBuy: true,
            useRelayBuy: true,
          })
        );

        expect(result.current.getStepStatusForStep('Submitted')).toBe(
          'completed'
        );
        expect(result.current.getStepStatusForStep('Pending')).toBe(
          'completed'
        );
        expect(result.current.getStepStatusForStep('Completed')).toBe(
          'completed'
        );
        // ResourceLock should be inactive for Relay Buy
        expect(result.current.getStepStatusForStep('ResourceLock')).toBe(
          'inactive'
        );
        expect(result.current.canClose).toBe(true);
      });
    });

    describe('Transaction Failed', () => {
      it('should show Completed as failed for Relay Buy', () => {
        const { result } = renderHook(() =>
          useTransactionStatus({
            status: 'Transaction Failed' as TransactionStatusState,
            isBuy: true,
            useRelayBuy: true,
          })
        );

        expect(result.current.getStepStatusForStep('Submitted')).toBe(
          'completed'
        );
        expect(result.current.getStepStatusForStep('Pending')).toBe(
          'completed'
        );
        expect(result.current.getStepStatusForStep('Completed')).toBe('failed');
        // ResourceLock should be inactive for Relay Buy
        expect(result.current.getStepStatusForStep('ResourceLock')).toBe(
          'inactive'
        );
        expect(result.current.canClose).toBe(true);
      });

      it('should not mark ResourceLock as failed for Relay Buy', () => {
        const { result } = renderHook(() =>
          useTransactionStatus({
            status: 'Transaction Failed' as TransactionStatusState,
            isBuy: true,
            isResourceLockFailed: true,
            useRelayBuy: true,
          })
        );

        // isResourceLockFailed should not affect Relay Buy
        expect(result.current.getStepStatusForStep('ResourceLock')).toBe(
          'inactive'
        );
        expect(result.current.getStepStatusForStep('Completed')).toBe('failed');
      });
    });
  });

  describe('Intent SDK Buy vs Relay Buy Comparison', () => {
    it('should use ResourceLock for Intent SDK Buy but not for Relay Buy', () => {
      // Intent SDK Buy
      const intentSdkResult = renderHook(() =>
        useTransactionStatus({
          status: 'Transaction Pending' as TransactionStatusState,
          isBuy: true,
          resourceLockTxHash: '0x123',
          useRelayBuy: false,
        })
      ).result;

      // Relay Buy
      const relayBuyResult = renderHook(() =>
        useTransactionStatus({
          status: 'Transaction Pending' as TransactionStatusState,
          isBuy: true,
          resourceLockTxHash: '0x123',
          useRelayBuy: true,
        })
      ).result;

      // Intent SDK should show ResourceLock as completed
      expect(intentSdkResult.current.getStepStatusForStep('ResourceLock')).toBe(
        'completed'
      );
      expect(intentSdkResult.current.getStepStatusForStep('Pending')).toBe(
        'pending'
      );

      // Relay Buy should show Pending as pending, ResourceLock should not be used
      expect(relayBuyResult.current.getStepStatusForStep('Pending')).toBe(
        'pending'
      );
      expect(relayBuyResult.current.getStepStatusForStep('ResourceLock')).toBe(
        'pending'
      );
    });

    it('should handle completedTxHash differently for Intent SDK vs Relay Buy', () => {
      // Intent SDK Buy with completedTxHash
      const intentSdkResult = renderHook(() =>
        useTransactionStatus({
          status: 'Transaction Pending' as TransactionStatusState,
          isBuy: true,
          resourceLockTxHash: '0x123',
          completedTxHash: '0xabc',
          useRelayBuy: false,
        })
      ).result;

      // Relay Buy with completedTxHash (should be ignored)
      const relayBuyResult = renderHook(() =>
        useTransactionStatus({
          status: 'Transaction Pending' as TransactionStatusState,
          isBuy: true,
          completedTxHash: '0xabc',
          useRelayBuy: true,
        })
      ).result;

      // Intent SDK should show Completed as completed when completedTxHash exists
      expect(intentSdkResult.current.getStepStatusForStep('Completed')).toBe(
        'completed'
      );

      // Relay Buy should show Completed as inactive (completedTxHash not used)
      expect(relayBuyResult.current.getStepStatusForStep('Completed')).toBe(
        'inactive'
      );
    });

    it('should handle failure states differently', () => {
      // Intent SDK Buy with resource lock failure
      const intentSdkResult = renderHook(() =>
        useTransactionStatus({
          status: 'Transaction Failed' as TransactionStatusState,
          isBuy: true,
          isResourceLockFailed: true,
          useRelayBuy: false,
        })
      ).result;

      // Relay Buy with resource lock failure flag (should be ignored)
      const relayBuyResult = renderHook(() =>
        useTransactionStatus({
          status: 'Transaction Failed' as TransactionStatusState,
          isBuy: true,
          isResourceLockFailed: true,
          useRelayBuy: true,
        })
      ).result;

      // Intent SDK should show ResourceLock as failed
      expect(intentSdkResult.current.getStepStatusForStep('ResourceLock')).toBe(
        'failed'
      );
      expect(intentSdkResult.current.getStepStatusForStep('Completed')).toBe(
        'inactive'
      );

      // Relay Buy should show Completed as failed, ResourceLock inactive
      expect(relayBuyResult.current.getStepStatusForStep('ResourceLock')).toBe(
        'inactive'
      );
      expect(relayBuyResult.current.getStepStatusForStep('Completed')).toBe(
        'failed'
      );
    });
  });

  describe('Relay Buy matches Sell behavior', () => {
    it('should have same step status as Sell for all transaction states', () => {
      const testCases: TransactionStatusState[] = [
        'Starting Transaction',
        'Transaction Pending',
        'Transaction Complete',
        'Transaction Failed',
      ];

      testCases.forEach((status) => {
        // Sell
        const sellResult = renderHook(() =>
          useTransactionStatus({
            status,
            isBuy: false,
          })
        ).result;

        // Relay Buy
        const relayBuyResult = renderHook(() =>
          useTransactionStatus({
            status,
            isBuy: true,
            useRelayBuy: true,
          })
        ).result;

        // Compare step statuses
        expect(relayBuyResult.current.getStepStatusForStep('Submitted')).toBe(
          sellResult.current.getStepStatusForStep('Submitted')
        );
        expect(relayBuyResult.current.getStepStatusForStep('Pending')).toBe(
          sellResult.current.getStepStatusForStep('Pending')
        );
        expect(relayBuyResult.current.getStepStatusForStep('Completed')).toBe(
          sellResult.current.getStepStatusForStep('Completed')
        );
        expect(relayBuyResult.current.canClose).toBe(
          sellResult.current.canClose
        );
      });
    });
  });
});

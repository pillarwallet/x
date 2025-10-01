import { useMemo } from 'react';

// types
import {
  BuyModeDetails,
  PayingToken,
  SellOffer,
  TechnicalDetails,
  TokenDetails,
  TokenInfo,
  TransactionStatusState,
} from '../types/types';

// utils
import {
  determineFailureStep,
  getStepStatus,
  sanitizeErrorDetails,
} from '../utils/utils';

interface UseTechnicalDetailsOptions {
  isBuy: boolean;
  userOpHash: string;
  chainId: number;
  status: TransactionStatusState;
  accountAddress?: string;
  sellToken?: TokenInfo | null;
  buyToken?: TokenInfo | null;
  tokenAmount?: string;
  sellOffer?: SellOffer | null;
  payingTokens?: PayingToken[];
  usdAmount?: string;
  txHash?: string;
  resourceLockTxHash?: string;
  completedTxHash?: string;
  resourceLockChainId?: number;
  completedChainId?: number;
  submittedAt?: Date;
  pendingCompletedAt?: Date;
  resourceLockCompletedAt?: Date;
  gasFee?: string;
  errorDetails?: string;
  isResourceLockFailed?: boolean;
}

/**
 * Custom hook for generating technical details with memoization
 */
export const useTechnicalDetails = ({
  isBuy,
  userOpHash,
  chainId,
  status,
  accountAddress,
  sellToken,
  buyToken,
  tokenAmount,
  sellOffer,
  payingTokens,
  usdAmount,
  txHash,
  resourceLockTxHash,
  completedTxHash,
  resourceLockChainId,
  completedChainId,
  submittedAt,
  pendingCompletedAt,
  resourceLockCompletedAt,
  gasFee,
  errorDetails,
  isResourceLockFailed = false,
}: UseTechnicalDetailsOptions) => {
  const technicalDetails = useMemo((): string => {
    const getStepStatusForStep = (
      step: 'Submitted' | 'Pending' | 'ResourceLock' | 'Completed'
    ) =>
      getStepStatus(
        step,
        status,
        isBuy,
        resourceLockTxHash,
        completedTxHash,
        isResourceLockFailed
      );

    const details: TechnicalDetails = {
      transactionType: isBuy ? 'BUY' : 'SELL',
      transactionHash: userOpHash, // For Buy: bidHash, For Sell: userOpHash
      hashType: isBuy ? 'bidHash' : 'userOpHash',
      chainId,
      status,
      timestamp: new Date().toISOString(),

      // User account info
      accountAddress: accountAddress || 'N/A',

      // Token information
      // eslint-disable-next-line no-nested-ternary
      token: isBuy
        ? buyToken
          ? ({
              symbol: buyToken.symbol,
              name: buyToken.name,
              address: buyToken.address || 'N/A',
              chainId,
              amount: tokenAmount || 'N/A',
              logo: buyToken.logo || 'N/A',
              type: 'BUY_TOKEN' as const,
            } satisfies TokenDetails)
          : null
        : sellToken
          ? ({
              symbol: sellToken.symbol,
              name: sellToken.name,
              address: sellToken.address || 'N/A',
              chainId,
              amount: tokenAmount || 'N/A',
              logo: sellToken.logo || 'N/A',
              type: 'SELL_TOKEN' as const,
            } satisfies TokenDetails)
          : null,

      // Sell offer details
      sellOffer: sellOffer
        ? {
            tokenAmountToReceive: sellOffer.tokenAmountToReceive,
            minimumReceive: sellOffer.minimumReceive,
          }
        : null,

      // Buy mode specific data
      buyMode: isBuy
        ? ({
            usdAmount: usdAmount || 'N/A',
            payingTokens: payingTokens || [],
            totalPayingUsd:
              payingTokens?.reduce((sum, token) => sum + token.totalUsd, 0) ||
              0,
          } satisfies BuyModeDetails)
        : null,

      // Transaction hashes and status
      transactionHashes: {
        [isBuy ? 'bidHash' : 'userOpHash']: userOpHash,
        blockchainTxHash: txHash || 'N/A',
        resourceLockTxHash: resourceLockTxHash || 'N/A',
        completedTxHash: completedTxHash || 'N/A',
      },

      // Chain information
      chains: {
        mainChainId: chainId,
        resourceLockChainId: resourceLockChainId || 'N/A',
        completedChainId: completedChainId || 'N/A',
      },

      // Timestamps
      timestamps: {
        submittedAt: submittedAt?.toISOString() || 'N/A',
        pendingCompletedAt: pendingCompletedAt?.toISOString() || 'N/A',
        resourceLockCompletedAt:
          resourceLockCompletedAt?.toISOString() || 'N/A',
        currentTime: new Date().toISOString(),
      },

      // Error information
      error: {
        details: sanitizeErrorDetails(
          errorDetails || 'No specific error details available'
        ),
        isResourceLockFailed: isResourceLockFailed || false,
        failureStep: determineFailureStep(
          isResourceLockFailed,
          getStepStatusForStep
        ),
      },

      // Gas information
      gas: {
        fee: gasFee || 'N/A',
      },

      // Step status information
      stepStatus: {
        submitted: getStepStatusForStep('Submitted'),
        pending: getStepStatusForStep('Pending'),
        resourceLock: getStepStatusForStep('ResourceLock'),
        completed: getStepStatusForStep('Completed'),
      },
    };

    return JSON.stringify(details, null, 2);
  }, [
    isBuy,
    userOpHash,
    chainId,
    status,
    accountAddress,
    sellToken,
    buyToken,
    tokenAmount,
    sellOffer,
    payingTokens,
    usdAmount,
    txHash,
    resourceLockTxHash,
    completedTxHash,
    resourceLockChainId,
    completedChainId,
    submittedAt,
    pendingCompletedAt,
    resourceLockCompletedAt,
    gasFee,
    errorDetails,
    isResourceLockFailed,
  ]);

  return technicalDetails;
};

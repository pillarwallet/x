import { format } from 'date-fns';
import { useEffect, useRef } from 'react';
import ProgressStep from './ProgressStep';
import TransactionErrorBox from './TransactionErrorBox';
import TransactionInfo from './TransactionInfo';

// components
import CloseButton from '../Misc/CloseButton';
import Esc from '../Misc/Esc';

// hooks
import useTransactionKit from '../../../../hooks/useTransactionKit';
import {
  formatExponentialSmallNumber,
  limitDigitsNumber,
} from '../../../../utils/number';

interface TransactionDetailsProps {
  onDone: () => void;
  userOpHash: string;
  chainId: number;
  status:
    | 'Starting Transaction'
    | 'Transaction Pending'
    | 'Transaction Complete'
    | 'Transaction Failed';
  // Transaction data from PreviewSell/PreviewBuy
  isBuy?: boolean;
  sellToken?: {
    symbol: string;
    name: string;
    logo: string;
    address?: string;
  } | null;
  buyToken?: {
    symbol: string;
    name: string;
    logo: string;
    address?: string;
  } | null;
  tokenAmount?: string;
  sellOffer?: {
    tokenAmountToReceive: number;
    minimumReceive: number;
  } | null;
  payingTokens?: Array<{
    totalUsd: number;
    name: string;
    symbol: string;
    logo: string;
    actualBal: string;
    totalRaw: string;
    chainId: number;
    address: string;
  }>;
  usdAmount?: string;
  // Timestamps for when each step completed
  submittedAt?: Date;
  pendingCompletedAt?: Date;
  // Buy-specific timestamps
  resourceLockCompletedAt?: Date;
  // Transaction details from getUserOperationStatus
  txHash?: string;
  gasFee?: string;
  errorDetails?: string;
  // Buy-specific hashes
  resourceLockTxHash?: string;
  completedTxHash?: string;
  resourceLockChainId?: number;
  completedChainId?: number;
  // Failure indicators
  isResourceLockFailed?: boolean;
}

const TransactionDetails = ({
  onDone,
  userOpHash,
  chainId,
  status,
  isBuy = false,
  sellToken,
  buyToken,
  tokenAmount,
  sellOffer,
  payingTokens,
  usdAmount,
  submittedAt,
  pendingCompletedAt,
  resourceLockCompletedAt,
  txHash,
  gasFee,
  errorDetails,
  resourceLockTxHash,
  completedTxHash,
  resourceLockChainId,
  completedChainId,
  isResourceLockFailed = false,
}: TransactionDetailsProps) => {
  const { walletAddress: accountAddress } = useTransactionKit();
  const detailsRef = useRef<HTMLDivElement>(null);

  // Click outside to close functionality - only allow when Completed or Failed
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        detailsRef.current &&
        !detailsRef.current.contains(event.target as Node) &&
        (status === 'Transaction Complete' || status === 'Transaction Failed')
      ) {
        onDone();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onDone, status]);

  // ESC key functionality - close when Completed/Failed, call onDone for Pending (which will return to main view)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (
          status === 'Transaction Complete' ||
          status === 'Transaction Failed'
        ) {
          onDone();
        } else if (status === 'Transaction Pending') {
          onDone(); // This will return to main view for Pending status
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onDone, status]);

  // Function to determine step status based on current transaction status
  const getStepStatus = (
    step: 'Submitted' | 'Pending' | 'ResourceLock' | 'Completed'
  ) => {
    if (status === 'Starting Transaction') {
      // All steps pending
      return 'pending';
    }

    if (status === 'Transaction Pending') {
      if (step === 'Submitted') return 'completed';
      if (step === 'Pending') {
        return 'pending';
      }
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
        // For Sell, completed step should be inactive when pending is active
        return 'inactive';
      }
    }

    if (status === 'Transaction Complete') {
      if (step === 'Submitted') return 'completed';
      if (step === 'Pending') return 'completed';
      if (step === 'ResourceLock') return 'completed';
      if (step === 'Completed') return 'completed';
    }

    if (status === 'Transaction Failed') {
      if (step === 'Submitted') return 'completed';
      if (step === 'Pending') {
        return 'completed';
      }
      if (step === 'ResourceLock') {
        if (isBuy && isResourceLockFailed) return 'failed';
        return 'completed';
      }
      if (step === 'Completed') {
        if (isBuy && isResourceLockFailed) return 'inactive';
        return 'failed'; // For Sell, Completed should be failed when transaction fails
      }
    }

    return 'pending';
  };

  // Function to format timestamps for completed steps
  const getStepTimestamp = (
    step: 'Submitted' | 'Pending' | 'ResourceLock' | 'Completed'
  ) => {
    const stepStatus = getStepStatus(step);

    // Only show timestamps for completed steps, not the last step
    if (stepStatus !== 'completed' || step === 'Completed') return undefined;

    if (step === 'Submitted' && submittedAt) {
      // For submitted step, show full date and time with different colors
      return (
        <>
          <span className="text-white">
            {format(submittedAt, 'MMM d, yyyy')}
          </span>
          <span className="text-white"> • </span>
          <span className="text-white/50">{format(submittedAt, 'HH:mm')}</span>
        </>
      );
    }

    if (step === 'Pending' && pendingCompletedAt) {
      // For Sell pending step, show pendingCompletedAt timestamp
      return (
        <span className="text-white/50">
          {format(pendingCompletedAt, 'HH:mm')}
        </span>
      );
    }

    if (step === 'ResourceLock') {
      // For Buy show resource lock timestamp if present, else pendingCompletedAt fallback
      const ts = isBuy
        ? resourceLockCompletedAt || pendingCompletedAt
        : pendingCompletedAt;
      if (ts)
        return <span className="text-white/50">{format(ts, 'HH:mm')}</span>;
    }

    return undefined;
  };

  // Function to determine at which step the transaction failed
  const determineFailureStep = () => {
    if (isResourceLockFailed) {
      return 'Resource Lock Creation';
    }

    const submittedStatus = getStepStatus('Submitted');
    const pendingStatus = getStepStatus('Pending');
    const resourceLockStatus = getStepStatus('ResourceLock');
    const completedStatus = getStepStatus('Completed');

    if (submittedStatus === 'failed') {
      return 'Transaction Submission';
    }
    if (pendingStatus === 'failed') {
      return 'Transaction Pending';
    }
    if (resourceLockStatus === 'failed') {
      return 'Resource Lock Creation';
    }
    if (completedStatus === 'failed') {
      return 'Transaction Completion';
    }

    return 'Unknown Step';
  };

  // Function to sanitize API key from error details
  const sanitizeErrorDetails = (errorThrown: string) => {
    if (!errorThrown) return errorThrown;

    return errorThrown.replace(
      /api-key=[A-Za-z0-9+/=]+/g,
      'api-key=***REDACTED***'
    );
  };

  // Function to generate comprehensive technical details for debugging
  const generateTechnicalDetails = () => {
    const details = {
      // Basic transaction info
      transactionType: isBuy ? 'BUY' : 'SELL',
      transactionHash: isBuy ? userOpHash : userOpHash, // For Buy: bidHash, For Sell: userOpHash
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
          ? {
              symbol: buyToken.symbol,
              name: buyToken.name,
              address: buyToken.address || 'N/A',
              chainId,
              amount: tokenAmount || 'N/A',
              logo: buyToken.logo || 'N/A',
              type: 'BUY_TOKEN',
            }
          : null
        : sellToken
          ? {
              symbol: sellToken.symbol,
              name: sellToken.name,
              address: sellToken.address || 'N/A',
              chainId,
              amount: tokenAmount || 'N/A',
              logo: sellToken.logo || 'N/A',
              type: 'SELL_TOKEN',
            }
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
        ? {
            usdAmount: usdAmount || 'N/A',
            payingTokens: payingTokens || [],
            totalPayingUsd:
              payingTokens?.reduce((sum, token) => sum + token.totalUsd, 0) ||
              0,
          }
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
        failureStep: determineFailureStep(),
      },

      // Gas information
      gas: {
        fee: gasFee || 'N/A',
      },

      // Step status information
      stepStatus: {
        submitted: getStepStatus('Submitted'),
        pending: getStepStatus('Pending'),
        resourceLock: getStepStatus('ResourceLock'),
        completed: getStepStatus('Completed'),
      },
    };

    return JSON.stringify(details, null, 2);
  };

  return (
    <div ref={detailsRef} className="flex flex-col gap-4 h-full w-full">
      <div className="flex justify-between items-center">
        <p className="text-xl text-white font-normal">Transaction Details</p>
        <div className="bg-[#121116] rounded-[10px] w-10 h-10 p-[2px_2px_4px_2px]">
          {status === 'Transaction Pending' ? (
            <Esc onClose={onDone} />
          ) : (
            <CloseButton onClose={onDone} />
          )}
        </div>
      </div>
      <div className="flex flex-col h-full w-full rounded-[10px] border border-dashed border-[#25232D] p-6 items-center justify-center">
        <div className="text-5xl text-white font-medium">
          <span className="text-white/30">$</span>{' '}
          {isBuy
            ? formatExponentialSmallNumber(
                limitDigitsNumber(Number(usdAmount) || 0)
              )
            : formatExponentialSmallNumber(
                limitDigitsNumber(sellOffer?.tokenAmountToReceive || 0)
              )}
        </div>
        <div className="flex gap-1.5">
          <img
            className="w-4 h-4 rounded"
            src={isBuy ? buyToken?.logo || '' : sellToken?.logo || ''}
            alt={
              isBuy ? buyToken?.symbol || 'Token' : sellToken?.symbol || 'Token'
            }
          />
          <p className="text-white font-normal text-[13px]">
            {tokenAmount || '0'}{' '}
            <span className="text-white/30">
              {isBuy
                ? buyToken?.symbol || 'Token'
                : sellToken?.symbol || 'Token'}
            </span>
          </p>
        </div>
      </div>

      {status !== 'Transaction Complete' && (
        <div className="flex h-full w-full rounded-[10px] border border-dashed border-[#25232D] p-3">
          <div className="flex flex-col items-center justify-center w-full">
            {/* Progress Bar */}
            <div className="flex flex-col w-full">
              <ProgressStep
                step="Submitted"
                status={getStepStatus('Submitted')}
                label="Submitted"
                lineStatus={
                  isBuy
                    ? getStepStatus('ResourceLock')
                    : getStepStatus('Pending')
                }
                timestamp={getStepTimestamp('Submitted')}
              />

              {isBuy ? (
                <>
                  <ProgressStep
                    step="ResourceLock"
                    status={getStepStatus('ResourceLock')}
                    label="Resource Lock"
                    lineStatus={getStepStatus('Completed')}
                    timestamp={getStepTimestamp('ResourceLock')}
                  />

                  <ProgressStep
                    step="Completed"
                    status={getStepStatus('Completed')}
                    label={
                      getStepStatus('Completed') === 'failed'
                        ? 'Transaction Failed'
                        : 'Completed'
                    }
                    isLast
                    timestamp={getStepTimestamp('Completed')}
                  />
                </>
              ) : (
                <>
                  <ProgressStep
                    step="Pending"
                    status={getStepStatus('Pending')}
                    label="Pending"
                    lineStatus={getStepStatus('Completed')}
                    timestamp={getStepTimestamp('Pending')}
                  />

                  <ProgressStep
                    step="Completed"
                    status={getStepStatus('Completed')}
                    label={
                      getStepStatus('Completed') === 'failed'
                        ? 'Transaction Failed'
                        : 'Completed'
                    }
                    isLast
                    timestamp={getStepTimestamp('Completed')}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col h-full w-full rounded-[10px] border border-dashed border-[#25232D] p-3">
        <TransactionInfo
          status={status}
          userOpHash={userOpHash}
          txHash={txHash}
          chainId={chainId}
          gasFee={gasFee}
          completedAt={pendingCompletedAt}
          isBuy={isBuy}
          resourceLockTxHash={resourceLockTxHash}
          completedTxHash={completedTxHash}
          resourceLockChainId={resourceLockChainId}
          completedChainId={completedChainId}
        />
      </div>

      {status === 'Transaction Failed' && (
        <TransactionErrorBox technicalDetails={generateTechnicalDetails()} />
      )}

      <div className="w-full rounded-[10px] bg-[#121116] p-[2px_2px_6px_2px]">
        <button
          className="flex items-center justify-center w-full rounded-[8px] h-[42px] p-[1px_6px_1px_6px] bg-[#8A77FF] text-white font-normal text-[14px]"
          type="button"
          onClick={onDone}
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default TransactionDetails;

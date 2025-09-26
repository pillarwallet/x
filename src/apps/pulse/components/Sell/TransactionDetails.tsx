import { format } from 'date-fns';
import { useEffect, useRef, useState } from 'react';
import ProgressStep from './ProgressStep';
import TransactionErrorBox from './TransactionErrorBox';
import TransactionInfo from './TransactionInfo';

// assets
import UsdcLogo from '../../assets/usd-coin-usdc-logo.png';

// components
import CloseButton from '../Misc/CloseButton';
import Esc from '../Misc/Esc';

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
  } | null;
  tokenAmount?: string;
  sellOffer?: {
    tokenAmountToReceive: number;
    minimumReceive: number;
  } | null;
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
  tokenAmount,
  sellOffer,
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
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const detailsRef = useRef<HTMLDivElement>(null);

  // Click outside to close functionality
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        detailsRef.current &&
        !detailsRef.current.contains(event.target as Node)
      ) {
        onDone();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onDone]);

  // ESC key to close functionality
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onDone();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onDone]);

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
          {isBuy ? (
            <span className="text-white/30">$</span>
          ) : (
            <div className="relative inline-block">
              <span
                className="text-white/30 cursor-help"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                {(() => {
                  const symbol = sellToken?.symbol || 'Token';
                  return symbol.length > 3
                    ? `${symbol.slice(0, 3)}...`
                    : symbol;
                })()}
              </span>
              {showTooltip &&
                sellToken?.symbol &&
                sellToken.symbol.length > 3 && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded shadow-lg z-10 whitespace-nowrap">
                    {sellToken.symbol}
                  </div>
                )}
            </div>
          )}{' '}
          {tokenAmount || '0'}
        </div>
        <div className="flex gap-1.5">
          <img className="w-4 h-4 rounded" src={UsdcLogo} alt="USDC" />
          <p className="text-white font-normal text-[13px]">
            {sellOffer?.tokenAmountToReceive?.toFixed(6) || '0'}{' '}
            <span className="text-white/30">USDC</span>
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
        <TransactionErrorBox technicalDetails={errorDetails} />
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

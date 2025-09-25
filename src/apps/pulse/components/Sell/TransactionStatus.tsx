import { useEffect, useRef, useState } from 'react';
import { TailSpin } from 'react-loader-spinner';

// services
import { getUserOperationStatus } from '../../../../services/userOpStatus';

// hooks
import useIntentSdk from '../../hooks/useIntentSdk';

// components
import TransactionDetails from './TransactionDetails';

interface TransactionStatusProps {
  closeTransactionStatus: () => void;
  userOpHash: string; // UserOperation hash (submitted to bundler) OR bidHash for Buy
  chainId: number;
  gasFee?: string;
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
}

type TransactionStatusState =
  | 'Starting Transaction'
  | 'Transaction Pending'
  | 'Transaction Complete'
  | 'Transaction Failed';

type UserOpStatus =
  | 'New'
  | 'Pending'
  | 'Submitted'
  | 'OnChain'
  | 'Finalized'
  | 'Cancelled'
  | 'Reverted';

type BidStatus =
  | 'PENDING'
  | 'SHORTLISTING_INITIATED'
  | 'SHORTLISTED'
  | 'EXECUTED'
  | 'CLAIMED'
  | 'RESOURCE_LOCK_RELEASED'
  | 'FAILED_EXECUTION'
  | 'SHORTLISTING_FAILED';

type ResourceLockStatus =
  | 'PENDING_USER_OPS_CREATION'
  | 'USER_OPS_CREATION_INITIATED'
  | 'USER_OPS_EXECUTION_SUCCESSFUL'
  | 'USER_OPS_EXECUTION_FAILED';

const TransactionStatus = (props: TransactionStatusProps) => {
  const {
    closeTransactionStatus,
    userOpHash, // UserOperation hash (submitted to bundler) OR bidHash for Buy
    chainId,
    gasFee,
    isBuy,
    sellToken,
    tokenAmount,
    sellOffer,
  } = props;
  const { intentSdk } = useIntentSdk();
  const [currentStatus, setCurrentStatus] = useState<TransactionStatusState>(
    'Starting Transaction'
  );
  const [showDetails, setShowDetails] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string>('');
  const [statusStartTime, setStatusStartTime] = useState<number>(Date.now());
  const [isPollingActive, setIsPollingActive] = useState<boolean>(true);
  const [hasSeenSuccess, setHasSeenSuccess] = useState<boolean>(false);
  const [failureTimeoutId, setFailureTimeoutId] =
    useState<NodeJS.Timeout | null>(null);
  const transactionStatusRef = useRef<HTMLDivElement>(null);

  // Track real timestamps when each step completes
  const [submittedAt, setSubmittedAt] = useState<Date | undefined>(undefined);
  const [pendingCompletedAt, setPendingCompletedAt] = useState<
    Date | undefined
  >(undefined);

  // Track transaction details from getUserOperationStatus
  const [blockchainTxHash, setBlockchainTxHash] = useState<string | undefined>(
    undefined
  );
  const [resourceLockTxHash, setResourceLockTxHash] = useState<
    string | undefined
  >(undefined);
  const [completedTxHash, setCompletedTxHash] = useState<string | undefined>(
    undefined
  );
  const [completedChainId, setCompletedChainId] = useState<number | undefined>(
    undefined
  );
  const [resourceLockChainId, setResourceLockChainId] = useState<
    number | undefined
  >(undefined);
  const [resourceLockCompletedAt, setResourceLockCompletedAt] = useState<
    Date | undefined
  >(undefined);
  const [isResourceLockFailed, setIsResourceLockFailed] =
    useState<boolean>(false);

  // Track when each step actually completes
  useEffect(() => {
    const now = new Date();

    // Submitted step completes when status moves to Transaction Pending, Complete, or Failed
    if (
      currentStatus === 'Transaction Pending' ||
      currentStatus === 'Transaction Complete' ||
      currentStatus === 'Transaction Failed'
    ) {
      setSubmittedAt((prev) => prev || now);
    }

    // For Buy: Resource lock step completes when we get resource lock hash
    if (isBuy && resourceLockTxHash && !resourceLockCompletedAt) {
      setResourceLockCompletedAt(now);
    }

    // Pending step completes when status moves to Transaction Complete or Failed
    if (
      currentStatus === 'Transaction Complete' ||
      currentStatus === 'Transaction Failed'
    ) {
      setPendingCompletedAt((prev) => prev || now);
    }
  }, [currentStatus, isBuy, resourceLockTxHash, resourceLockCompletedAt]);

  // Function to map UserOp status to TransactionStatus state
  const mapUserOpStatusToTransactionStatus = (
    status: UserOpStatus
  ): TransactionStatusState => {
    if (status === 'New') {
      return 'Starting Transaction';
    }
    if (status === 'Submitted' || status === 'Pending') {
      return 'Transaction Pending';
    }
    if (status === 'OnChain' || status === 'Finalized') {
      return 'Transaction Complete';
    }
    if (status === 'Cancelled' || status === 'Reverted') {
      return 'Transaction Failed';
    }
    return 'Starting Transaction'; // fallback
  };

  // Function to map BidStatus to TransactionStatus state (for Buy flow)
  const mapBidStatusToTransactionStatus = (
    status: BidStatus
  ): TransactionStatusState => {
    if (status === 'FAILED_EXECUTION' || status === 'SHORTLISTING_FAILED') {
      return 'Transaction Failed';
    }
    if (
      status === 'EXECUTED' ||
      status === 'CLAIMED' ||
      status === 'RESOURCE_LOCK_RELEASED'
    ) {
      return 'Transaction Complete';
    }
    if (
      status === 'SHORTLISTING_INITIATED' ||
      status === 'SHORTLISTED' ||
      status === 'PENDING'
    ) {
      return 'Transaction Pending';
    }
    return 'Starting Transaction';
  };

  // Function to update status with minimum display duration
  const updateStatusWithDelay = (newStatus: TransactionStatusState) => {
    const now = Date.now();
    const timeSinceLastStatus = now - statusStartTime;
    const minDisplayTime = 2000; // 2 seconds
    const failureConfirmationTime = 10000; // 10 seconds for failed status

    // If we're already on a final status, stop polling
    const isFinalStatus =
      currentStatus === 'Transaction Complete' ||
      currentStatus === 'Transaction Failed';
    if (isFinalStatus) {
      setIsPollingActive(false);
      return;
    }

    // If we get a success status, cancel any pending failure timeout
    if (newStatus === 'Transaction Complete') {
      if (failureTimeoutId) {
        clearTimeout(failureTimeoutId);
        setFailureTimeoutId(null);
      }
      setHasSeenSuccess(true);
    }

    // Special handling for failed status - wait 10 seconds before confirming
    if (newStatus === ('Transaction Failed' as TransactionStatusState)) {
      // If we've already seen success, ignore failure statuses
      if (hasSeenSuccess) {
        return;
      }

      // Start the confirmation timer for failed status
      setCurrentStatus('Transaction Pending'); // Keep showing pending while we wait
      setStatusStartTime(now);

      // After 10 seconds, confirm the failure
      const timeoutId = setTimeout(() => {
        setCurrentStatus('Transaction Failed');
        setStatusStartTime(Date.now());
        setIsPollingActive(false); // Stop polling after confirming failure
        setFailureTimeoutId(null);
      }, failureConfirmationTime);
      setFailureTimeoutId(timeoutId);
      return;
    }

    // If this is a final status and we haven't shown intermediate states yet,
    // we need to show them first
    if (
      (newStatus === 'Transaction Complete' ||
        newStatus === 'Transaction Failed') &&
      (currentStatus === 'Starting Transaction' ||
        currentStatus === 'Transaction Pending')
    ) {
      // Show intermediate states first
      if (currentStatus === 'Starting Transaction') {
        setCurrentStatus('Transaction Pending');
        setStatusStartTime(now);

        // After 2 seconds, show the final status
        setTimeout(() => {
          setCurrentStatus(newStatus);
          setStatusStartTime(Date.now());
          setIsPollingActive(false); // Stop polling after showing final status
        }, minDisplayTime);
        return;
      }
    }

    if (timeSinceLastStatus < minDisplayTime) {
      // If not enough time has passed, delay the status update
      const remainingTime = minDisplayTime - timeSinceLastStatus;
      setTimeout(() => {
        setCurrentStatus(newStatus);
        setStatusStartTime(Date.now());
      }, remainingTime);
    } else {
      // Enough time has passed, update immediately
      setCurrentStatus(newStatus);
      setStatusStartTime(now);

      // Stop polling for final statuses
      if (
        newStatus === 'Transaction Complete' ||
        newStatus === ('Transaction Failed' as TransactionStatusState)
      ) {
        setIsPollingActive(false);
      }
    }
  };

  // Polling effect for both Sell (UserOp) and Buy (Bid) flows
  useEffect(() => {
    if (!userOpHash || !chainId || !isPollingActive) {
      return undefined;
    }

    const pollStatus = async () => {
      // Check if polling is still active before making the API call
      if (!isPollingActive) {
        return;
      }

      try {
        if (isBuy) {
          if (!intentSdk) return;

          // Get bid status
          const bids = await intentSdk.searchBidByBidHash(
            userOpHash as `0x${string}`
          );
          const bid = bids?.[0];
          const bidStatus: BidStatus | undefined = bid?.bidStatus;
          const execTxHash: string | undefined =
            bid?.executionResult?.executedTransactions?.[0]?.transactionHash;

          if (execTxHash) {
            setCompletedTxHash(execTxHash);
            setCompletedChainId(chainId);
          }

          // Get resource lock info
          const resourceLock = await intentSdk.getResourceLockInfoByBidHash(
            userOpHash as `0x${string}`
          );
          const lock = resourceLock?.resourceLockInfo?.resourceLocks?.[0];
          const lockHash: string | undefined = lock?.transactionHash;
          const lockChainId: number | undefined = lock?.chainId
            ? Number(lock.chainId)
            : undefined;
          const resourceLockStatus: ResourceLockStatus | undefined =
            resourceLock?.resourceLockInfo?.status as ResourceLockStatus;

          if (lockHash) {
            setResourceLockTxHash(lockHash);
            if (lockChainId) setResourceLockChainId(lockChainId);
          }

          // Check for Resource Lock failure first
          if (resourceLockStatus === 'USER_OPS_EXECUTION_FAILED') {
            setIsResourceLockFailed(true);
            updateStatusWithDelay('Transaction Failed');
            setErrorDetails('Resource lock failed');
            return;
          }

          // Check if Resource Lock is completed
          if (
            resourceLockStatus === 'USER_OPS_EXECUTION_SUCCESSFUL' &&
            lockHash
          ) {
            setResourceLockTxHash(lockHash);
            if (lockChainId) setResourceLockChainId(lockChainId);
            setResourceLockCompletedAt(new Date());
          }

          if (bidStatus) {
            const newTransactionStatus =
              mapBidStatusToTransactionStatus(bidStatus);

            if (newTransactionStatus === 'Transaction Complete') {
              setHasSeenSuccess(true);
            }

            // If we've already seen success, ignore any failure statuses
            if (
              hasSeenSuccess &&
              newTransactionStatus === 'Transaction Failed'
            ) {
              return;
            }

            updateStatusWithDelay(newTransactionStatus);

            if (newTransactionStatus === 'Transaction Failed') {
              setErrorDetails('Transaction failed');
            }
          }
        } else {
          const response = await getUserOperationStatus(chainId, userOpHash);
          if (response?.status) {
            const newUserOpStatus = response.status as UserOpStatus;
            const newTransactionStatus =
              mapUserOpStatusToTransactionStatus(newUserOpStatus);

            // Track if we've seen success - once we have, ignore any failure statuses
            if (newTransactionStatus === 'Transaction Complete') {
              setHasSeenSuccess(true);
            }

            // If we've already seen success, ignore any failure statuses
            if (
              hasSeenSuccess &&
              newTransactionStatus === 'Transaction Failed'
            ) {
              return;
            }

            // Always use delayed update to ensure all states are shown
            updateStatusWithDelay(newTransactionStatus);

            // Extract actual transaction hash if available
            if (response.transaction) {
              setBlockchainTxHash(response.transaction);
            }

            // Capture error details if transaction failed
            if (newTransactionStatus === 'Transaction Failed') {
              const errorMessage =
                response.reason ||
                response.error ||
                'Transaction failed. Please try again.';
              setErrorDetails(errorMessage);
            }
          }
        }
      } catch (error) {
        console.error('Failed to get transaction status:', error);
        setCurrentStatus('Transaction Failed');
        setErrorDetails(
          error instanceof Error
            ? error.message
            : 'Failed to get transaction status'
        );
      }
    };

    // Poll immediately
    pollStatus();

    // Set up polling every 2 seconds
    const interval = setInterval(pollStatus, 2000);

    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userOpHash, chainId, isPollingActive, hasSeenSuccess, isBuy, intentSdk]);

  // Click outside to close functionality
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        transactionStatusRef.current &&
        !transactionStatusRef.current.contains(event.target as Node)
      ) {
        closeTransactionStatus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeTransactionStatus]);

  // Function to get icon and styling based on status
  const getStatusIcon = () => {
    if (
      currentStatus === 'Starting Transaction' ||
      currentStatus === 'Transaction Pending'
    ) {
      return {
        icon: '/src/apps/pulse/assets/pending.svg',
        containerClasses:
          'w-[90px] h-[90px] rounded-full border-[3px] border-white/10 bg-[#8A77FF] flex items-center justify-center flex-shrink-0',
        iconClasses: 'w-[60px] h-[60px]',
      };
    }

    if (currentStatus === 'Transaction Complete') {
      return {
        icon: '/src/apps/pulse/assets/confirmed-icon.svg',
        containerClasses:
          'w-[90px] h-[90px] rounded-full border-[4.5px] border-[#5CFF93] bg-[#5CFF93]/30 flex items-center justify-center flex-shrink-0',
        iconClasses: 'w-[33px] h-[21px]',
      };
    }

    if (currentStatus === 'Transaction Failed') {
      return {
        icon: '/src/apps/pulse/assets/failed-icon.svg',
        containerClasses:
          'w-[90px] h-[90px] rounded-full border-[4.5px] border-[#FF366C] bg-[#FF366C]/30 flex items-center justify-center flex-shrink-0',
        iconClasses: 'w-[8px] h-[38px]',
      };
    }

    return null;
  };

  const statusIcon = getStatusIcon();

  // Function to get the third element content
  const getThirdElement = () => {
    if (currentStatus === 'Starting Transaction') {
      return (
        <div className="text-white/50 font-normal text-[16px] mt-[10px]">
          Just a moment...
        </div>
      );
    }

    if (currentStatus === 'Transaction Pending') {
      return (
        <button
          className="flex items-center justify-between rounded-[30px] px-2 py-2 bg-[#FFAB36]/10 mt-[10px] w-[154px]"
          type="button"
          onClick={() => setShowDetails(true)}
        >
          <div className="w-[14px] h-[14px] rounded-full border-[2px] border-[#FFAB36]/[.23] bg-[#FFAB36]/30 flex items-center justify-center flex-shrink-0">
            <TailSpin color="#FFAB36" height={14} width={14} strokeWidth={6} />
          </div>
          <span className="text-[#FFAB36] font-normal text-[13px]">
            View Status
          </span>
          <div className="w-[14px] h-[14px] rounded-full border border-[#FFAB36] bg-[#FFAB36]/30 flex items-center justify-center flex-shrink-0">
            <span className="text-[#FFAB36] text-[10px] font-bold">i</span>
          </div>
        </button>
      );
    }

    if (currentStatus === 'Transaction Complete') {
      return (
        <button
          className="flex items-center justify-between rounded-[30px] px-2 py-2 bg-[#5CFF93]/10 mt-[10px] w-[154px]"
          type="button"
          onClick={() => setShowDetails(true)}
        >
          <div className="w-[14px] h-[14px] rounded-full border border-[#5CFF93] bg-[#5CFF93]/30 flex items-center justify-center flex-shrink-0">
            <img
              src="/src/apps/pulse/assets/confirmed-icon.svg"
              alt="confirmed"
              className="w-[8px] h-[5px]"
            />
          </div>
          <span className="text-[#5CFF93] font-normal text-[13px]">
            Success
          </span>
          <div className="w-[14px] h-[14px] rounded-full border border-[#5CFF93] bg-[#5CFF93]/30 flex items-center justify-center flex-shrink-0">
            <span className="text-[#5CFF93] text-[10px] font-bold">i</span>
          </div>
        </button>
      );
    }

    if (currentStatus === 'Transaction Failed') {
      return (
        <button
          className="flex items-center justify-between rounded-[30px] px-2 py-2 bg-[#FF366C]/10 mt-[10px] w-[154px]"
          type="button"
          onClick={() => setShowDetails(true)}
        >
          <div className="w-[14px] h-[14px] rounded-full border border-[#FF366C] bg-[#FF366C]/30 flex items-center justify-center flex-shrink-0">
            <img
              src="/src/apps/pulse/assets/failed-icon.svg"
              alt="failed"
              className="w-[2px] h-[10px]"
            />
          </div>
          <span className="text-[#FF366C] font-normal text-[13px]">
            View Status
          </span>
          <div className="w-[14px] h-[14px] rounded-full border border-[#FF366C] bg-[#FF366C]/30 flex items-center justify-center flex-shrink-0">
            <span className="text-[#FF366C] text-[10px] font-bold">i</span>
          </div>
        </button>
      );
    }

    return null;
  };

  return (
    <div
      ref={transactionStatusRef}
      className={`flex flex-col w-full max-w-[446px] ${!showDetails ? 'h-[calc(100vh-94px)]' : 'h-min'} bg-[#1E1D24] border border-white/5 rounded-[10px] p-6`}
    >
      {showDetails ? (
        <TransactionDetails
          onDone={() => setShowDetails(false)}
          userOpHash={userOpHash}
          chainId={chainId}
          status={currentStatus}
          isBuy={isBuy}
          sellToken={sellToken}
          tokenAmount={tokenAmount}
          sellOffer={sellOffer}
          submittedAt={submittedAt}
          pendingCompletedAt={pendingCompletedAt}
          txHash={isBuy ? undefined : blockchainTxHash}
          gasFee={gasFee}
          errorDetails={errorDetails}
          resourceLockTxHash={resourceLockTxHash}
          completedTxHash={isBuy ? completedTxHash : undefined}
          resourceLockChainId={resourceLockChainId}
          completedChainId={completedChainId}
          resourceLockCompletedAt={resourceLockCompletedAt}
          isResourceLockFailed={isResourceLockFailed}
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          {statusIcon && (
            <div className={statusIcon.containerClasses}>
              <img
                src={statusIcon.icon}
                alt={currentStatus}
                className={statusIcon.iconClasses}
              />
            </div>
          )}
          <div
            className={`text-white font-normal text-[20px] ${statusIcon ? 'mt-3' : ''}`}
          >
            {currentStatus}
          </div>
          {getThirdElement()}
        </div>
      )}
    </div>
  );
};

export default TransactionStatus;

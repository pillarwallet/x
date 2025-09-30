import { useEffect, useRef, useState } from 'react';

// components
import TransactionDetails from './TransactionDetails';
import TransactionStatusContainer from './TransactionStatusContainer';

// hooks
import { useClickOutside } from '../../hooks/useClickOutside';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';

// types
import { TransactionStatusProps } from '../../types/types';

const TransactionStatus = (props: TransactionStatusProps) => {
  const {
    closeTransactionStatus,
    userOpHash,
    chainId,
    gasFee,
    isBuy,
    sellToken,
    buyToken,
    tokenAmount,
    sellOffer,
    payingTokens,
    usdAmount,
    // Externalized polling state
    currentStatus,
    errorDetails,
    submittedAt,
    pendingCompletedAt,
    blockchainTxHash,
    resourceLockTxHash,
    completedTxHash,
    completedChainId,
    resourceLockChainId,
    resourceLockCompletedAt,
    isResourceLockFailed,
  } = props;

  const [showDetails, setShowDetails] = useState(false);
  const transactionStatusRef = useRef<HTMLDivElement>(null);

  // Auto-show details when transaction completes or fails (with 1 second delay)
  useEffect(() => {
    if (
      (currentStatus === 'Transaction Complete' ||
        currentStatus === 'Transaction Failed') &&
      !showDetails
    ) {
      const timer = setTimeout(() => {
        setShowDetails(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [currentStatus, showDetails]);

  useClickOutside({
    ref: transactionStatusRef,
    callback: closeTransactionStatus,
    condition:
      currentStatus === 'Transaction Complete' ||
      currentStatus === 'Transaction Failed',
  });

  useKeyboardNavigation({
    onEscape: () => {
      if (
        currentStatus === 'Transaction Complete' ||
        currentStatus === 'Transaction Failed'
      ) {
        closeTransactionStatus();
      } else if (currentStatus === 'Transaction Pending' && showDetails) {
        setShowDetails(false);
      }
    },
  });

  return (
    <div
      ref={transactionStatusRef}
      className={`flex flex-col w-full max-w-[446px] ${!showDetails ? 'h-[calc(100vh-94px)] max-h-[600px]' : 'h-min'} bg-[#1E1D24] border border-white/5 rounded-[10px] p-6`}
    >
      {showDetails ? (
        <TransactionDetails
          onDone={
            currentStatus === 'Transaction Pending'
              ? () => setShowDetails(false)
              : closeTransactionStatus
          }
          userOpHash={userOpHash}
          chainId={chainId}
          status={currentStatus}
          isBuy={isBuy}
          sellToken={sellToken}
          buyToken={buyToken}
          tokenAmount={tokenAmount}
          sellOffer={sellOffer}
          payingTokens={payingTokens}
          usdAmount={usdAmount}
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
        <TransactionStatusContainer
          status={currentStatus}
          onViewDetails={() => setShowDetails(true)}
        />
      )}
    </div>
  );
};

export default TransactionStatus;

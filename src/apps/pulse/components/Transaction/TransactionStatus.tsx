import { animated, useSpring } from '@react-spring/web';
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

  // Bouncing animation spring
  const [springs, api] = useSpring(() => ({
    from: {
      scale: 1,
      opacity: 1,
      transformOrigin: 'center center',
    },
    to: {
      scale: 1,
      opacity: 1,
      transformOrigin: 'center center',
    },
  }));

  // Trigger bouncing animation when showDetails changes
  useEffect(() => {
    // Quick bounce effect when size changes
    api.start({
      to: {
        scale: 1.04,
        opacity: 1,
        transformOrigin: 'center center',
      },
      config: {
        duration: 100,
        tension: 400,
        friction: 10,
      },
      onRest: () => {
        // Bounce back to normal size
        api.start({
          to: {
            scale: 1,
            opacity: 1,
            transformOrigin: 'center center',
          },
          config: {
            duration: 120,
            tension: 300,
            friction: 25,
          },
        });
      },
    });
  }, [showDetails, api]);

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
    <animated.div
      ref={transactionStatusRef}
      className={`flex flex-col w-full max-w-[446px] ${!showDetails ? 'h-[calc(100vh-94px)] max-h-[600px]' : 'h-min'} bg-[#1E1D24] border border-white/5 rounded-[10px] p-6`}
      style={springs}
      data-testid="pulse-transaction-status"
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
    </animated.div>
  );
};

export default TransactionStatus;

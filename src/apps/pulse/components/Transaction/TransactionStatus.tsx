import { useEffect, useRef, useState } from 'react';
import { TailSpin } from 'react-loader-spinner';

// assets
import ConfirmedIcon from '../../assets/confirmed-icon.svg';
import FailedIcon from '../../assets/failed-icon.svg';
import PendingIcon from '../../assets/pending.svg';

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
  // Externalized polling state
  currentStatus: TransactionStatusState;
  errorDetails: string;
  submittedAt?: Date;
  pendingCompletedAt?: Date;
  blockchainTxHash?: string;
  resourceLockTxHash?: string;
  completedTxHash?: string;
  completedChainId?: number;
  resourceLockChainId?: number;
  resourceLockCompletedAt?: Date;
  isResourceLockFailed?: boolean;
}

type TransactionStatusState =
  | 'Starting Transaction'
  | 'Transaction Pending'
  | 'Transaction Complete'
  | 'Transaction Failed';

const TransactionStatus = (props: TransactionStatusProps) => {
  const {
    closeTransactionStatus,
    userOpHash, // UserOperation hash (submitted to bundler) OR bidHash for Buy
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

  // Click outside to close functionality - only allow when Completed or Failed
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        transactionStatusRef.current &&
        !transactionStatusRef.current.contains(event.target as Node) &&
        (currentStatus === 'Transaction Complete' ||
          currentStatus === 'Transaction Failed')
      ) {
        closeTransactionStatus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeTransactionStatus, currentStatus]);

  // ESC key functionality - close when Completed/Failed, return to main view when Pending
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (
          currentStatus === 'Transaction Complete' ||
          currentStatus === 'Transaction Failed'
        ) {
          closeTransactionStatus();
        } else if (currentStatus === 'Transaction Pending' && showDetails) {
          setShowDetails(false);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeTransactionStatus, currentStatus, showDetails]);

  // Function to get icon and styling based on status
  const getStatusIcon = () => {
    if (
      currentStatus === 'Starting Transaction' ||
      currentStatus === 'Transaction Pending'
    ) {
      return {
        icon: PendingIcon,
        containerClasses:
          'w-[90px] h-[90px] rounded-full border-[3px] border-white/10 bg-[#8A77FF] flex items-center justify-center flex-shrink-0',
        iconClasses: 'w-[60px] h-[60px]',
      };
    }

    if (currentStatus === 'Transaction Complete') {
      return {
        icon: ConfirmedIcon,
        containerClasses:
          'w-[90px] h-[90px] rounded-full border-[4.5px] border-[#5CFF93] bg-[#5CFF93]/30 flex items-center justify-center flex-shrink-0',
        iconClasses: 'w-[33px] h-[21px]',
      };
    }

    if (currentStatus === 'Transaction Failed') {
      return {
        icon: FailedIcon,
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
              src={ConfirmedIcon}
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
            <img src={FailedIcon} alt="failed" className="w-[2px] h-[10px]" />
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

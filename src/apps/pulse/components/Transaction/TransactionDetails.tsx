import { useRef } from 'react';
import ProgressStep from './ProgressStep';
import TransactionErrorBox from './TransactionErrorBox';
import TransactionInfo from './TransactionInfo';

// components
import CloseButton from '../Misc/CloseButton';
import Esc from '../Misc/Esc';

// hooks
import useTransactionKit from '../../../../hooks/useTransactionKit';
import { useClickOutside } from '../../hooks/useClickOutside';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';
import { useTechnicalDetails } from '../../hooks/useTechnicalDetails';
import { useTransactionStatus } from '../../hooks/useTransactionStatus';

// types
import { TransactionDetailsProps } from '../../types/types';

// utils
import {
  formatExponentialSmallNumber,
  limitDigitsNumber,
} from '../../../../utils/number';
import { formatStepTimestamp } from '../../utils/utils';

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

  const { getStepStatusForStep, canClose } = useTransactionStatus({
    status,
    isBuy,
    resourceLockTxHash,
    completedTxHash,
    isResourceLockFailed,
  });

  const technicalDetails = useTechnicalDetails({
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
  });

  useClickOutside({
    ref: detailsRef,
    callback: onDone,
    condition: canClose,
  });

  useKeyboardNavigation({
    onEscape: () => {
      if (
        status === 'Transaction Complete' ||
        status === 'Transaction Failed'
      ) {
        onDone(); // Closes the entire transaction status modal
      } else if (status === 'Transaction Pending') {
        onDone(); // Returns to main view (but doesn't close the modal)
      }
    },
  });

  // Function to format timestamps for completed steps
  const getStepTimestamp = (
    step: 'Submitted' | 'Pending' | 'ResourceLock' | 'Completed'
  ) => {
    const stepStatus = getStepStatusForStep(step);

    // Only show timestamps for completed steps, not the last step
    if (stepStatus !== 'completed' || step === 'Completed') return undefined;

    if (step === 'Submitted' && submittedAt) {
      return formatStepTimestamp(submittedAt, step);
    }

    if (step === 'Pending' && pendingCompletedAt) {
      return formatStepTimestamp(pendingCompletedAt, step);
    }

    if (step === 'ResourceLock') {
      const ts = isBuy
        ? resourceLockCompletedAt || pendingCompletedAt
        : pendingCompletedAt;
      if (ts) {
        return formatStepTimestamp(ts, step);
      }
    }

    return undefined;
  };

  return (
    <div
      ref={detailsRef}
      className="flex flex-col gap-4 h-full w-full"
      data-testid="pulse-transaction-details-container"
    >
      <div className="flex justify-between items-center">
        <p
          className="text-xl text-white font-normal"
          data-testid="pulse-transaction-details-title"
        >
          Transaction Details
        </p>
        <div
          className="justify-center items-center bg-[#121116] rounded-[10px] p-[2px_2px_4px_2px] flex w-10 h-10 ml-3"
          data-testid="pulse-transaction-details-close-button"
        >
          {status === 'Transaction Pending' ? (
            <div className="py-2 px-px w-9 h-[34px] bg-[#1E1D24] rounded-lg flex justify-center">
              <Esc onClose={onDone} />
            </div>
          ) : (
            <CloseButton onClose={onDone} />
          )}
        </div>
      </div>
      <div
        className="flex flex-col h-full w-full rounded-[10px] border border-dashed border-[#25232D] p-6 items-center justify-center"
        data-testid={`pulse-transaction-details-summary-${isBuy ? 'buy' : 'sell'}-${isBuy ? buyToken?.name : sellToken?.name}`}
      >
        <div
          className="text-5xl text-white font-medium"
          data-testid="pulse-transaction-details-amount-usd"
        >
          <span className="text-white/30">$</span>
          {isBuy
            ? formatExponentialSmallNumber(
                limitDigitsNumber(Number(usdAmount) || 0)
              )
            : formatExponentialSmallNumber(
                limitDigitsNumber(sellOffer?.tokenAmountToReceive || 0)
              )}
        </div>
        <div
          className="flex gap-1.5 items-center"
          data-testid="pulse-transaction-details-token-info"
        >
          <img
            className="w-4 h-4 rounded"
            src={isBuy ? buyToken?.logo || '' : sellToken?.logo || ''}
            alt={
              isBuy ? buyToken?.symbol || 'Token' : sellToken?.symbol || 'Token'
            }
            data-testid={`pulse-transaction-details-token-logo-${isBuy ? buyToken?.name : sellToken?.name}`}
          />
          <p
            className="text-white font-normal text-[13px]"
            data-testid="pulse-transaction-details-token-amount"
          >
            {tokenAmount || '0'}{' '}
            <span
              className="text-white/30"
              data-testid="pulse-transaction-details-token-symbol"
            >
              {isBuy
                ? buyToken?.symbol || 'Token'
                : sellToken?.symbol || 'Token'}
            </span>
          </p>
        </div>
      </div>

      {status !== 'Transaction Complete' && (
        <div
          className="flex h-full w-full rounded-[10px] border border-dashed border-[#25232D] p-3"
          data-testid="pulse-transaction-details-progress-container"
        >
          <div className="flex flex-col items-center justify-center w-full">
            {/* Progress Bar */}
            <div
              className="flex flex-col w-full"
              data-testid="pulse-transaction-details-progress-steps"
            >
              <ProgressStep
                step="Submitted"
                status={getStepStatusForStep('Submitted')}
                label="Submitted"
                lineStatus={
                  isBuy
                    ? getStepStatusForStep('ResourceLock')
                    : getStepStatusForStep('Pending')
                }
                timestamp={getStepTimestamp('Submitted')}
                data-testid="pulse-transaction-details-step-submitted"
              />

              {isBuy ? (
                <>
                  <ProgressStep
                    step="ResourceLock"
                    status={getStepStatusForStep('ResourceLock')}
                    label="Resource Lock"
                    lineStatus={getStepStatusForStep('Completed')}
                    timestamp={getStepTimestamp('ResourceLock')}
                    data-testid="pulse-transaction-details-step-resource-lock"
                  />

                  <ProgressStep
                    step="Completed"
                    status={getStepStatusForStep('Completed')}
                    label={
                      getStepStatusForStep('Completed') === 'failed'
                        ? 'Transaction Failed'
                        : 'Completed'
                    }
                    isLast
                    timestamp={getStepTimestamp('Completed')}
                    data-testid="pulse-transaction-details-step-completed-buy"
                  />
                </>
              ) : (
                <>
                  <ProgressStep
                    step="Pending"
                    status={getStepStatusForStep('Pending')}
                    label="Pending"
                    lineStatus={getStepStatusForStep('Completed')}
                    timestamp={getStepTimestamp('Pending')}
                    data-testid="pulse-transaction-details-step-pending"
                  />

                  <ProgressStep
                    step="Completed"
                    status={getStepStatusForStep('Completed')}
                    label={
                      getStepStatusForStep('Completed') === 'failed'
                        ? 'Transaction Failed'
                        : 'Completed'
                    }
                    isLast
                    timestamp={getStepTimestamp('Completed')}
                    data-testid="pulse-transaction-details-step-completed-sell"
                  />
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <div
        className="flex flex-col h-full w-full rounded-[10px] border border-dashed border-[#25232D] p-3"
        data-testid="pulse-transaction-details-info-container"
      >
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
        <TransactionErrorBox technicalDetails={technicalDetails} />
      )}

      <div
        className="w-full rounded-[10px] bg-[#121116] p-[2px_2px_6px_2px]"
        data-testid="pulse-transaction-details-done-button-container"
      >
        <button
          className="flex items-center justify-center w-full rounded-[8px] h-[42px] p-[1px_6px_1px_6px] bg-[#8A77FF] text-white font-normal text-[14px]"
          type="button"
          onClick={onDone}
          data-testid="pulse-transaction-details-done-button"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default TransactionDetails;

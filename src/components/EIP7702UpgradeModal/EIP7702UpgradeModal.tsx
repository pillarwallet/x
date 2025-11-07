import React, { useCallback, useEffect, useRef, useState } from 'react';

// hooks
import { useAppDispatch } from '../../apps/pillarx-app/hooks/useReducerHooks';
import {
  getEIP7702DismissedKey,
  useEIP7702Upgrade,
} from '../../hooks/useEIP7702Upgrade';
import { useTransactionDebugLogger } from '../../hooks/useTransactionDebugLogger';
import useTransactionKit from '../../hooks/useTransactionKit';

// reducer
import {
  setHasCompletedEIP7702Upgrade,
  setIsEIP7702Eligible,
} from '../../apps/pillarx-app/reducer/WalletPortfolioSlice';

// services
import { getUserOperationStatus } from '../../services/userOpStatus';

// types
import { UpgradeStatus, UserOpUpgradeStatus } from './types';

// components
import EIP7702UpgradeAction from './EIP7702UpgradeAction';
import EIP7702UpgradeCloseButton from './EIP7702UpgradeCloseButton';
import EIP7702UpgradeDetails from './EIP7702UpgradeDetails';
import EIP7702UpgradeStatus from './EIP7702UpgradeStatus';

interface EIP7702UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EIP7702UpgradeModal: React.FC<EIP7702UpgradeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const { kit, walletAddress } = useTransactionKit();
  const { transactionDebugLog } = useTransactionDebugLogger();
  const [upgradeStatus, setUpgradeStatus] = useState<UpgradeStatus>('ready');
  const { calculateGasFees, setGasUpgradeInfo, gasUpgradeInfo, isCheckingGas } =
    useEIP7702Upgrade();
  const [userOpHash, setUserOpHash] = useState<string>('');
  const [isPolling, setIsPolling] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [statusStartTime, setStatusStartTime] = useState<number>(Date.now());
  const [hasSeenSuccess, setHasSeenSuccess] = useState<boolean>(false);
  const [failureTimeoutId, setFailureTimeoutId] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [submittedAt, setSubmittedAt] = useState<Date | undefined>(undefined);
  const [pendingCompletedAt, setPendingCompletedAt] = useState<
    Date | undefined
  >(undefined);
  const hasSeenSuccessRef = useRef<boolean>(false);
  const blockchainTxHashRef = useRef<string | undefined>(undefined);
  const failureGraceExpiryRef = useRef<number | null>(null);
  const hasCalculatedGasThisSessionRef = useRef<boolean>(false);

  // Handle close with localStorage persistence
  const handleClose = useCallback(() => {
    // Mark that user dismissed the upgrade modal for this wallet address
    const dismissedKey = getEIP7702DismissedKey(walletAddress);
    localStorage.setItem(dismissedKey, 'true');
    onClose();
  }, [onClose, walletAddress]);

  // Map UserOp status to UpgradeStatus
  const mapUserOpStatusToUpgradeStatus = (
    status: UserOpUpgradeStatus
  ): UpgradeStatus => {
    if (status === 'New') {
      return 'submitted';
    }
    if (status === 'Pending' || status === 'Submitted') {
      return 'upgrading';
    }
    if (status === 'OnChain' || status === 'Finalized') {
      return 'completed';
    }
    if (status === 'Cancelled' || status === 'Reverted') {
      return 'failed';
    }
    return 'submitted';
  };

  // Function to update status with minimum display duration
  const updateStatusWithDelay = useCallback(
    (newStatus: UpgradeStatus) => {
      const now = Date.now();
      const timeSinceLastStatus = now - statusStartTime;
      const minDisplayTime = 2000; // 2 seconds
      const failureConfirmationTime = 10000; // 10 seconds for failed status

      // If we're already on a final status, stop polling
      const isFinalStatus =
        upgradeStatus === 'completed' || upgradeStatus === 'failed';
      if (isFinalStatus) {
        setIsPolling(false);
        return;
      }

      // If we get a success status, cancel any pending failure timeout
      if (newStatus === 'completed') {
        if (failureTimeoutId) {
          clearTimeout(failureTimeoutId);
          setFailureTimeoutId(null);
        }
        setHasSeenSuccess(true);
        hasSeenSuccessRef.current = true;
        // If we're currently showing pending due to a failure confirmation,
        // immediately show the success status
        if (upgradeStatus === 'upgrading') {
          setUpgradeStatus('completed');
          setStatusStartTime(now);
          setIsPolling(false);
          return;
        }
      }

      // Special handling for failed status - wait 10 seconds before confirming
      if (newStatus === ('failed' as UpgradeStatus)) {
        // If we've already seen success, ignore failure statuses
        if (hasSeenSuccess || hasSeenSuccessRef.current) {
          return;
        }

        // Start the confirmation timer for failed status
        setUpgradeStatus('upgrading'); // Keep showing upgrading while we wait
        setStatusStartTime(now);

        // After 10 seconds, confirm the failure
        const timeoutId = setTimeout(() => {
          // Double-check that we haven't seen success in the meantime
          if (hasSeenSuccessRef.current) {
            setFailureTimeoutId(null);
            return;
          }
          setUpgradeStatus('failed');
          setStatusStartTime(Date.now());
          setIsPolling(false); // Stop polling after confirming failure
          setFailureTimeoutId(null);
        }, failureConfirmationTime);
        setFailureTimeoutId(timeoutId);
        return;
      }

      // If this is a final status and we haven't shown intermediate states yet,
      // we need to show them first
      if (
        (newStatus === 'completed' || newStatus === 'failed') &&
        (upgradeStatus === 'submitted' || upgradeStatus === 'upgrading')
      ) {
        // Show intermediate states first
        if (upgradeStatus === 'submitted') {
          setUpgradeStatus('upgrading');
          setStatusStartTime(now);

          // After 2 seconds, show the final status
          setTimeout(() => {
            setUpgradeStatus(newStatus);
            setStatusStartTime(Date.now());
            setIsPolling(false); // Stop polling after showing final status
          }, minDisplayTime);
          return;
        }
      }

      if (timeSinceLastStatus < minDisplayTime) {
        // If not enough time has passed, delay the status update
        const remainingTime = minDisplayTime - timeSinceLastStatus;
        setTimeout(() => {
          setUpgradeStatus(newStatus);
          setStatusStartTime(Date.now());
        }, remainingTime);
      } else {
        // Enough time has passed, update immediately
        setUpgradeStatus(newStatus);
        setStatusStartTime(now);

        // Stop polling for final statuses
        if (
          newStatus === 'completed' ||
          newStatus === ('failed' as UpgradeStatus)
        ) {
          setIsPolling(false);
        }
      }
    },
    [upgradeStatus, statusStartTime, failureTimeoutId, hasSeenSuccess]
  );

  const handleUpgrade = async () => {
    // Reset state
    setUserOpHash('');
    setErrorMessage('');
    setHasSeenSuccess(false);
    hasSeenSuccessRef.current = false;
    blockchainTxHashRef.current = undefined;
    failureGraceExpiryRef.current = null;
    setStatusStartTime(Date.now());
    setUpgradeStatus('submitted');

    transactionDebugLog('Initiating EIP-7702 upgrade on chain 1 (Mainnet)');

    try {
      if (!kit) {
        console.error('Transaction kit not available');
        transactionDebugLog('Upgrade failed - transaction kit not available');
        setUpgradeStatus('failed');
        setErrorMessage(
          'Oops something went wrong. Please refresh the page and try again.'
        );
        return;
      }

      // Call delegateSmartAccountToEoa to initiate upgrade
      const result = await kit.delegateSmartAccountToEoa({
        chainId: 1,
        delegateImmediately: true,
      });

      transactionDebugLog(
        'EIP-7702 upgrade delegateSmartAccountToEoa result:',
        {
          userOpHash: result.userOpHash,
          isAlreadyInstalled: result.isAlreadyInstalled,
        }
      );

      if (result.userOpHash && result.userOpHash.trim() !== '') {
        transactionDebugLog(
          'EIP-7702 upgrade initiated successfully with userOpHash:',
          result.userOpHash
        );
        setUserOpHash(result.userOpHash);
        setIsPolling(true);
      } else if (result.isAlreadyInstalled) {
        transactionDebugLog('EIP-7702 already installed');
        updateStatusWithDelay('completed');
      } else {
        transactionDebugLog('EIP-7702 authorization signed but not executed');
        updateStatusWithDelay('completed');
      }
    } catch (error) {
      console.error('EIP-7702 upgrade failed:', error);
      transactionDebugLog('EIP-7702 upgrade failed with error:', error);
      setUpgradeStatus('failed');
      setErrorMessage(
        'The upgrade failed. Please try again later or contact support.'
      );
    }
  };

  // Polling effect for status updates
  useEffect(() => {
    const chainId = 1;
    if (!userOpHash || !chainId || !isPolling) {
      return;
    }

    let pollAttempt = 0;
    const pollStatus = async () => {
      // Check if polling is still active before making the API call
      if (!isPolling) {
        return;
      }

      pollAttempt += 1;
      transactionDebugLog(
        `Polling EIP-7702 upgrade status (attempt ${pollAttempt}) for userOpHash:`,
        userOpHash
      );

      try {
        const response = await getUserOperationStatus(chainId, userOpHash);
        transactionDebugLog(
          `UserOp status response (attempt ${pollAttempt}):`,
          {
            status: response?.status,
            transaction: response?.transaction,
            reason: response?.reason,
            error: response?.error,
          }
        );

        // Handle case where response is undefined/null (API error)
        if (!response) {
          transactionDebugLog('No response from getUserOperationStatus');
          return;
        }

        if (response.status) {
          const newUserOpStatus = response.status as UserOpUpgradeStatus;
          const newUpgradeStatus =
            mapUserOpStatusToUpgradeStatus(newUserOpStatus);

          // Track if we've seen success - once we have, ignore any failure statuses
          if (newUpgradeStatus === 'completed') {
            transactionDebugLog(
              'EIP-7702 upgrade status changed to completed',
              {
                userOpStatus: newUserOpStatus,
                transactionHash: response.transaction,
              }
            );
            setHasSeenSuccess(true);
            hasSeenSuccessRef.current = true;
          }

          // If we've already seen success, ignore any failure statuses
          // Both state and ref to ensure we catch the success
          if (
            (hasSeenSuccess || hasSeenSuccessRef.current) &&
            newUpgradeStatus === 'failed'
          ) {
            return;
          }

          // Extract actual transaction hash if available and mirror into ref (do this before failure guard)
          if (response.transaction) {
            const firstObservation = !blockchainTxHashRef.current;
            blockchainTxHashRef.current = response.transaction;
            if (firstObservation) {
              transactionDebugLog(
                'Blockchain transaction hash observed for EIP-7702 upgrade:',
                response.transaction
              );
              if (failureGraceExpiryRef.current == null) {
                failureGraceExpiryRef.current = Date.now() + 10000; // start grace on first hash
              }
            }
          }

          // Additional protection using refs and single-use grace window
          // If we have a blockchain transaction hash, it means the transaction was actually
          // submitted and might be successful even if the status shows as 'Reverted' temporarily
          if (newUpgradeStatus === 'failed') {
            const nowTs = Date.now();
            const hasOnChainHash = Boolean(blockchainTxHashRef.current);
            if (hasOnChainHash) {
              // Initialize grace window if not set
              if (failureGraceExpiryRef.current == null) {
                failureGraceExpiryRef.current = nowTs + 10000; // 10s grace
                return; // skip once immediately when hash first observed
              }
              if (nowTs < failureGraceExpiryRef.current) {
                return; // still within grace window
              }
            }
          }

          // Always use delayed update to ensure all states are shown
          transactionDebugLog(
            `EIP-7702 upgrade status update: ${newUpgradeStatus} (from UserOp status: ${newUserOpStatus})`
          );
          updateStatusWithDelay(newUpgradeStatus);

          // Capture error details if transaction failed
          if (newUpgradeStatus === 'failed') {
            transactionDebugLog('EIP-7702 upgrade failed', {
              userOpStatus: newUserOpStatus,
              transactionHash: response.transaction,
              reason: response.reason,
              error: response.error,
            });
            setErrorMessage('Upgrade failed. Please try again.');
          }
        }
      } catch (error) {
        console.error('Failed to get transaction status:', error);
        transactionDebugLog('Error getting EIP-7702 upgrade status:', error);
        updateStatusWithDelay('failed');
        setErrorMessage('Failed to get upgrade status');
      }
    };

    // Poll immediately
    pollStatus();

    // Set up polling every 2 seconds
    const interval = setInterval(pollStatus, 2000);

    // eslint-disable-next-line consistent-return
    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userOpHash, isPolling, hasSeenSuccess, updateStatusWithDelay]);

  // When upgrade completes successfully, mark as completed and not eligible
  useEffect(() => {
    if (upgradeStatus === 'completed') {
      transactionDebugLog('EIP-7702 upgrade completed successfully', {
        userOpHash,
        transactionHash: blockchainTxHashRef.current,
      });
      // Mark that upgrade has been completed successfully
      dispatch(setHasCompletedEIP7702Upgrade(true));
      // Mark as not eligible to hide the upgrade button
      dispatch(setIsEIP7702Eligible(false));
      // Clear dismissal flag since upgrade is now complete
      const dismissedKey = getEIP7702DismissedKey(walletAddress);
      localStorage.removeItem(dismissedKey);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [upgradeStatus, dispatch, userOpHash, walletAddress]);

  // Track when steps complete - this runs every time status changes
  useEffect(() => {
    const now = new Date();

    // Submitted step is completed when we move from 'submitted' to 'upgrading' or beyond
    // Set the timestamp when we first see the step as completed
    if (
      upgradeStatus === 'upgrading' ||
      upgradeStatus === 'completed' ||
      upgradeStatus === 'failed'
    ) {
      // Only set if not already set (first time this status is reached)
      setSubmittedAt((prev) => prev || now);
    }

    // Upgrading step is completed when status is 'completed' or 'failed'
    if (upgradeStatus === 'completed' || upgradeStatus === 'failed') {
      // Only set if not already set (first time this status is reached)
      setPendingCompletedAt((prev) => prev || now);
    }
  }, [upgradeStatus]);

  // Calculate gas when modal opens (once per open session)
  useEffect(() => {
    if (!isOpen) {
      hasCalculatedGasThisSessionRef.current = false;
      return;
    }

    if (!calculateGasFees || !setGasUpgradeInfo) {
      return;
    }

    if (hasCalculatedGasThisSessionRef.current) {
      return;
    }

    hasCalculatedGasThisSessionRef.current = true;

    const fetchGas = async () => {
      try {
        transactionDebugLog('Starting gas calculation for EIP-7702 upgrade');
        const result = await calculateGasFees();
        if (result && setGasUpgradeInfo) {
          transactionDebugLog('Gas calculation completed:', {
            balanceInEth: result.balanceInEth,
            gasCostInEth: result.gasCostInEth,
            requiredEth: result.requiredEth,
            hasEnoughEth: result.hasEnoughEth,
          });
          setGasUpgradeInfo(result);
        } else {
          transactionDebugLog('Gas calculation returned null');
        }
      } catch (error) {
        console.error('Failed to calculate gas for EIP-7702 upgrade:', error);
        transactionDebugLog('Gas calculation failed:', error);
        // Set a default state so user can still see the modal
        if (setGasUpgradeInfo) {
          setGasUpgradeInfo({
            balanceInEth: 0,
            gasCostInEth: 0,
            requiredEth: 0,
            hasEnoughEth: false,
          });
        }
      }
    };

    fetchGas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, calculateGasFees, setGasUpgradeInfo]);

  // Render different components based on status
  const renderContent = () => {
    // If user is viewing details
    if (showDetails) {
      return (
        <EIP7702UpgradeDetails
          onClose={() => setShowDetails(false)}
          onCloseModal={onClose}
          status={upgradeStatus}
          submittedAt={submittedAt}
          pendingCompletedAt={pendingCompletedAt}
          errorDetails={errorMessage}
        />
      );
    }

    // Initial state - show action/benefits
    if (upgradeStatus === 'ready') {
      return (
        <EIP7702UpgradeAction
          onClose={handleClose}
          gasFeeEstimates={gasUpgradeInfo?.requiredEth.toString()}
          handleUpgrade={handleUpgrade}
          isCheckingGas={isCheckingGas}
          hasEnoughGas={gasUpgradeInfo?.hasEnoughEth ?? false}
        />
      );
    }

    // Status view (submitted, upgrading, completed, failed)
    return (
      <EIP7702UpgradeStatus
        status={upgradeStatus}
        onViewDetails={() => setShowDetails(true)}
      />
    );
  };

  const handleBackdropClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target !== event.currentTarget) {
        return;
      }

      if (upgradeStatus === 'completed' || upgradeStatus === 'failed') {
        onClose();
      }
    },
    [onClose, upgradeStatus]
  );

  // Early return after all hooks have been called
  if (!isOpen) return null;

  // Determine padding based on what's being shown
  const shouldShowLargePadding = !showDetails && upgradeStatus !== 'ready';
  const shouldShowCloseButton =
    upgradeStatus === 'completed' || upgradeStatus === 'failed';

  return (
    <div
      className="fixed inset-0 flex items-center justify-center pt-4 pb-20 z-50"
      style={{
        backgroundColor: 'rgba(18, 17, 22, 0.8)',
        backdropFilter: 'blur(10px)',
      }}
      onClick={handleBackdropClick}
    >
      <div
        className={`relative flex flex-col bg-[#1E1D24] rounded-2xl px-3 max-w-md mx-4 w-full items-center gap-9 max-h-[calc(100vh-6rem)] overflow-y-auto ${shouldShowLargePadding ? 'py-20' : 'py-6'}`}
      >
        {shouldShowCloseButton && (
          <div
            className="absolute top-4 right-4 justify-center items-center bg-[#121116] rounded-[10px] p-[2px_2px_4px_2px] flex w-10 h-10 ml-3"
            data-testid="pulse-transaction-details-close-button"
          >
            <EIP7702UpgradeCloseButton onClose={onClose} />
          </div>
        )}
        {renderContent()}
      </div>
    </div>
  );
};

export default EIP7702UpgradeModal;

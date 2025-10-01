import {
  DispensableAsset,
  ExpressIntentResponse,
} from '@etherspot/intent-sdk/dist/cjs/sdk/types/user-intent-types';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

// services
import { useGetWalletPortfolioQuery } from '../../../../services/pillarXApiWalletPortfolio';
import { getUserOperationStatus } from '../../../../services/userOpStatus';

// types
import { PayingToken, SelectedToken } from '../../types/tokens';
import { MobulaChainNames } from '../../utils/constants';

// components
import SearchIcon from '../../assets/seach-icon.svg';
import Buy from '../Buy/Buy';
import PreviewBuy from '../Buy/PreviewBuy';
import Refresh from '../Misc/Refresh';
import Settings from '../Misc/Settings';
import PreviewSell from '../Sell/PreviewSell';
import Sell from '../Sell/Sell';
import TransactionStatus from '../Transaction/TransactionStatus';

// hooks
import useTransactionKit from '../../../../hooks/useTransactionKit';
import useIntentSdk from '../../hooks/useIntentSdk';
import useRelaySell, { SellOffer } from '../../hooks/useRelaySell';

// types
type TransactionStatusState =
  | 'Starting Transaction'
  | 'Transaction Pending'
  | 'Transaction Complete'
  | 'Transaction Failed';

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

type UserOpStatus =
  | 'New'
  | 'Pending'
  | 'Submitted'
  | 'OnChain'
  | 'Finalized'
  | 'Cancelled'
  | 'Reverted';

interface HomeScreenProps {
  setSearching: Dispatch<SetStateAction<boolean>>;
  buyToken: SelectedToken | null;
  sellToken: SelectedToken | null;
  isBuy: boolean;
  setIsBuy: Dispatch<SetStateAction<boolean>>;
  refetchWalletPortfolio: () => void;
  setBuyToken: Dispatch<SetStateAction<SelectedToken | null>>;
  setChains: Dispatch<SetStateAction<MobulaChainNames>>;
}

export default function HomeScreen(props: HomeScreenProps) {
  const {
    buyToken,
    sellToken,
    isBuy,
    setIsBuy,
    setSearching,
    refetchWalletPortfolio,
    setBuyToken,
    setChains,
  } = props;
  const { walletAddress: accountAddress } = useTransactionKit();
  const { getBestSellOffer, isInitialized } = useRelaySell();
  const { intentSdk } = useIntentSdk();
  const [previewBuy, setPreviewBuy] = useState(false);
  const [previewSell, setPreviewSell] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState(false);
  const [userOpHash, setUserOpHash] = useState<string>('');
  const [transactionGasFee, setTransactionGasFee] = useState<string>('≈ $0.00');
  const [transactionData, setTransactionData] = useState<{
    sellToken: SelectedToken | null;
    buyToken: SelectedToken | null;
    tokenAmount: string;
    sellOffer: SellOffer | null;
    payingTokens: PayingToken[];
    usdAmount: string;
    isBuy: boolean;
  } | null>(null);
  const [payingTokens, setPayingTokens] = useState<PayingToken[]>([]);
  const [expressIntentResponse, setExpressIntentResponse] =
    useState<ExpressIntentResponse | null>(null);
  const [sellOffer, setSellOffer] = useState<SellOffer | null>(null);
  const [tokenAmount, setTokenAmount] = useState<string>('');
  const [isRefreshingHome, setIsRefreshingHome] = useState(false);
  const [usdAmount, setUsdAmount] = useState<string>('');
  const [dispensableAssets, setDispensableAssets] = useState<
    DispensableAsset[]
  >([]);
  const [buyRefreshCallback, setBuyRefreshCallback] = useState<
    (() => Promise<void>) | null
  >(null);

  // Transaction status polling state
  const [currentTransactionStatus, setCurrentTransactionStatus] =
    useState<TransactionStatusState>('Starting Transaction');
  const [errorDetails, setErrorDetails] = useState<string>('');
  const [submittedAt, setSubmittedAt] = useState<Date | undefined>(undefined);
  const [pendingCompletedAt, setPendingCompletedAt] = useState<
    Date | undefined
  >(undefined);
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
  const [isPollingActive, setIsPollingActive] = useState<boolean>(false);
  const [statusStartTime, setStatusStartTime] = useState<number>(Date.now());
  const [hasSeenSuccess, setHasSeenSuccess] = useState<boolean>(false);
  const [failureTimeoutId, setFailureTimeoutId] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);
  const [isBackgroundPolling, setIsBackgroundPolling] =
    useState<boolean>(false);
  const [shouldAutoReopen, setShouldAutoReopen] = useState<boolean>(false);
  const hasSeenSuccessRef = useRef<boolean>(false);

  // Calculate token amount for Buy mode when usdAmount, buyToken, or payingTokens changes
  // Using the same calculation as PreviewBuy: totalPay / tokenUsdValue
  useEffect(() => {
    if (isBuy && buyToken && payingTokens.length > 0) {
      const tokenUsdValue = parseFloat(buyToken.usdValue || '0');
      if (tokenUsdValue > 0) {
        const totalPay = payingTokens.reduce(
          (acc, curr) => acc + curr.totalUsd,
          0
        );
        const calculatedAmount = totalPay / tokenUsdValue;
        setTokenAmount(calculatedAmount.toFixed(6));
      }
    } else if (isBuy) {
      setTokenAmount('');
    }
  }, [isBuy, buyToken, payingTokens]);

  const handleRefresh = useCallback(async () => {
    // Prevent multiple simultaneous refresh calls
    if (isRefreshingHome) {
      return;
    }

    setIsRefreshingHome(true);

    try {
      // Always refresh wallet portfolio
      await refetchWalletPortfolio();

      // If we have the required data, refresh the sell offer
      if (!isBuy && sellToken && tokenAmount && isInitialized) {
        try {
          const newOffer = await getBestSellOffer({
            fromAmount: tokenAmount,
            fromTokenAddress: sellToken.address,
            fromChainId: sellToken.chainId,
            fromTokenDecimals: sellToken.decimals,
          });
          setSellOffer(newOffer);
        } catch (error) {
          console.error('Failed to refresh sell offer:', error);
          setSellOffer(null);
        }
      }

      // If we have the required data, refresh the buy intent
      // Only refresh if PreviewBuy is not open (to avoid duplicate calls)
      if (isBuy && buyRefreshCallback && !previewBuy) {
        await buyRefreshCallback();
      }
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setIsRefreshingHome(false);
    }
  }, [
    refetchWalletPortfolio,
    isBuy,
    sellToken,
    tokenAmount,
    isInitialized,
    getBestSellOffer,
    buyRefreshCallback,
    previewBuy,
    isRefreshingHome,
  ]);

  // Stop transaction status polling
  const stopTransactionPolling = useCallback(() => {
    setIsPollingActive(false);
    setIsBackgroundPolling(false);
    setShouldAutoReopen(false);
    setTransactionData(null);
  }, []);

  const closePreviewBuy = () => {
    setPreviewBuy(false);
    stopTransactionPolling();
  };

  const closePreviewSell = () => {
    setPreviewSell(false);
    setSellOffer(null);
    setTokenAmount('');
    stopTransactionPolling();
  };

  const showTransactionStatus = useCallback(
    (userOperationHash: string, gasFee?: string) => {
      stopTransactionPolling();

      // Store transaction data before clearing preview
      setTransactionData({
        sellToken,
        buyToken,
        tokenAmount,
        sellOffer,
        payingTokens,
        usdAmount,
        isBuy,
      });
      setPreviewSell(false);
      setPreviewBuy(false);
      setTransactionStatus(true);
      setUserOpHash(userOperationHash);
      if (gasFee) {
        setTransactionGasFee(gasFee);
      }
      // Start polling for transaction status
      setCurrentTransactionStatus('Starting Transaction');
      setErrorDetails('');
      setSubmittedAt(undefined);
      setPendingCompletedAt(undefined);
      setBlockchainTxHash(undefined);
      setResourceLockTxHash(undefined);
      setCompletedTxHash(undefined);
      setCompletedChainId(undefined);
      setResourceLockChainId(undefined);
      setResourceLockCompletedAt(undefined);
      setIsResourceLockFailed(false);
      setStatusStartTime(Date.now());
      setHasSeenSuccess(false);
      hasSeenSuccessRef.current = false;
      setFailureTimeoutId(null);
      setIsPollingActive(true);
      setIsBackgroundPolling(false);
      setShouldAutoReopen(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sellToken, tokenAmount, sellOffer, isBuy]
  );

  const closeTransactionStatus = () => {
    setTransactionStatus(false);

    const isFinalStatus =
      currentTransactionStatus === 'Transaction Complete' ||
      currentTransactionStatus === 'Transaction Failed';

    if (isFinalStatus) {
      stopTransactionPolling();
    } else {
      setIsBackgroundPolling(true);
      setShouldAutoReopen(true);
    }
  };

  // Helper function to map BidStatus to TransactionStatusState
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
      status === 'SHORTLISTED' ||
      status === 'SHORTLISTING_INITIATED' ||
      status === 'PENDING'
    ) {
      return 'Transaction Pending';
    }
    return 'Starting Transaction';
  };

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

  // Function to update status with minimum display duration (EXACT COPY FROM ORIGINAL)
  const updateStatusWithDelay = (newStatus: TransactionStatusState) => {
    const now = Date.now();
    const timeSinceLastStatus = now - statusStartTime;
    const minDisplayTime = 2000; // 2 seconds
    const failureConfirmationTime = 10000; // 10 seconds for failed status

    // If we're already on a final status, stop polling
    const isFinalStatus =
      currentTransactionStatus === 'Transaction Complete' ||
      currentTransactionStatus === 'Transaction Failed';
    if (isFinalStatus) {
      setIsPollingActive(false);
      // If we're in background polling and should auto-reopen, reopen the modal
      if (isBackgroundPolling && shouldAutoReopen) {
        setTransactionStatus(true);
        setIsBackgroundPolling(false);
        setShouldAutoReopen(false);
      }
      return;
    }

    // If we get a success status, cancel any pending failure timeout
    if (newStatus === 'Transaction Complete') {
      if (failureTimeoutId) {
        clearTimeout(failureTimeoutId);
        setFailureTimeoutId(null);
      }
      setHasSeenSuccess(true);
      hasSeenSuccessRef.current = true;
      // If we're currently showing pending due to a failure confirmation,
      // immediately show the success status
      if (currentTransactionStatus === 'Transaction Pending') {
        setCurrentTransactionStatus('Transaction Complete');
        setStatusStartTime(now);
        setIsPollingActive(false);
        // If we're in background polling and should auto-reopen, reopen the modal
        if (isBackgroundPolling && shouldAutoReopen) {
          setTransactionStatus(true);
          setIsBackgroundPolling(false);
          setShouldAutoReopen(false);
        }
        return;
      }
    }

    // Special handling for failed status - wait 10 seconds before confirming
    if (newStatus === ('Transaction Failed' as TransactionStatusState)) {
      // If we've already seen success, ignore failure statuses
      if (hasSeenSuccess || hasSeenSuccessRef.current) {
        return;
      }

      // Start the confirmation timer for failed status
      setCurrentTransactionStatus('Transaction Pending'); // Keep showing pending while we wait
      setStatusStartTime(now);

      // After 10 seconds, confirm the failure
      const timeoutId = setTimeout(() => {
        // Double-check that we haven't seen success in the meantime
        if (hasSeenSuccessRef.current) {
          setFailureTimeoutId(null);
          return;
        }
        setCurrentTransactionStatus('Transaction Failed');
        setStatusStartTime(Date.now());
        setIsPollingActive(false); // Stop polling after confirming failure
        setFailureTimeoutId(null);
        // If we're in background polling and should auto-reopen, reopen the modal
        if (isBackgroundPolling && shouldAutoReopen) {
          setTransactionStatus(true);
          setIsBackgroundPolling(false);
          setShouldAutoReopen(false);
        }
      }, failureConfirmationTime);
      setFailureTimeoutId(timeoutId);
      return;
    }

    // If this is a final status and we haven't shown intermediate states yet,
    // we need to show them first
    if (
      (newStatus === 'Transaction Complete' ||
        newStatus === 'Transaction Failed') &&
      (currentTransactionStatus === 'Starting Transaction' ||
        currentTransactionStatus === 'Transaction Pending')
    ) {
      // Show intermediate states first
      if (currentTransactionStatus === 'Starting Transaction') {
        setCurrentTransactionStatus('Transaction Pending');
        setStatusStartTime(now);

        // After 2 seconds, show the final status
        setTimeout(() => {
          setCurrentTransactionStatus(newStatus);
          setStatusStartTime(Date.now());
          setIsPollingActive(false); // Stop polling after showing final status
          // If we're in background polling and should auto-reopen, reopen the modal
          if (isBackgroundPolling && shouldAutoReopen) {
            setTransactionStatus(true);
            setIsBackgroundPolling(false);
            setShouldAutoReopen(false);
          }
        }, minDisplayTime);
        return;
      }
    }

    if (timeSinceLastStatus < minDisplayTime) {
      // If not enough time has passed, delay the status update
      const remainingTime = minDisplayTime - timeSinceLastStatus;
      setTimeout(() => {
        setCurrentTransactionStatus(newStatus);
        setStatusStartTime(Date.now());
      }, remainingTime);
    } else {
      // Enough time has passed, update immediately
      setCurrentTransactionStatus(newStatus);
      setStatusStartTime(now);

      // Stop polling for final statuses
      if (
        newStatus === 'Transaction Complete' ||
        newStatus === ('Transaction Failed' as TransactionStatusState)
      ) {
        setIsPollingActive(false);
        // If we're in background polling and should auto-reopen, reopen the modal
        if (isBackgroundPolling && shouldAutoReopen) {
          setTransactionStatus(true);
          setIsBackgroundPolling(false);
          setShouldAutoReopen(false);
        }
      }
    }
  };

  // Track when each step actually completes (EXACT COPY FROM ORIGINAL)
  useEffect(() => {
    const now = new Date();

    // Submitted step completes when status moves to Transaction Pending, Complete, or Failed
    if (
      currentTransactionStatus === 'Transaction Pending' ||
      currentTransactionStatus === 'Transaction Complete' ||
      currentTransactionStatus === 'Transaction Failed'
    ) {
      setSubmittedAt((prev) => prev || now);
    }

    // For Buy: Resource lock step completes when we get resource lock hash
    if (
      transactionData?.isBuy &&
      resourceLockTxHash &&
      !resourceLockCompletedAt
    ) {
      setResourceLockCompletedAt(now);
    }

    // Pending step completes when status moves to Transaction Complete or Failed
    if (
      currentTransactionStatus === 'Transaction Complete' ||
      currentTransactionStatus === 'Transaction Failed'
    ) {
      setPendingCompletedAt((prev) => prev || now);
    }
  }, [
    currentTransactionStatus,
    transactionData?.isBuy,
    resourceLockTxHash,
    resourceLockCompletedAt,
  ]);

  // Polling effect for both Sell (UserOp) and Buy (Bid) flows (EXACT COPY FROM ORIGINAL)
  useEffect(() => {
    const chainId = transactionData?.isBuy
      ? transactionData?.buyToken?.chainId || 1
      : transactionData?.sellToken?.chainId || 1;
    const isBuyTransaction = transactionData?.isBuy || false;
    if (!userOpHash || !chainId || (!isPollingActive && !isBackgroundPolling)) {
      return undefined;
    }

    const pollStatus = async () => {
      // Check if polling is still active before making the API call
      if (!isPollingActive && !isBackgroundPolling) {
        return;
      }

      try {
        if (isBuyTransaction) {
          if (!intentSdk) {
            return;
          }

          // Get bid status
          const bids = await intentSdk.searchBidByBidHash(
            userOpHash as `0x${string}`
          );
          const bid = bids?.[0];
          const bidStatus: BidStatus | undefined = bid?.bidStatus;

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

          // Process resource lock status first (this determines the final outcome)
          if (resourceLockStatus) {
            if (resourceLockStatus === 'USER_OPS_EXECUTION_FAILED') {
              // Resource lock failed → Transaction failed
              setIsResourceLockFailed(true);
              updateStatusWithDelay('Transaction Failed');
              setErrorDetails('Resource lock failed');
              return;
            }

            if (resourceLockStatus === 'USER_OPS_EXECUTION_SUCCESSFUL') {
              // Resource lock succeeded → Set hash and completion time
              if (lockHash) {
                setResourceLockTxHash(lockHash);
                if (lockChainId) setResourceLockChainId(lockChainId);
                setResourceLockCompletedAt(new Date());
              }
            }
          }

          // If resource lock is still pending, check bid status for intermediate states
          if (bidStatus) {
            const newTransactionStatus =
              mapBidStatusToTransactionStatus(bidStatus);

            // For Buy transactions, set completed transaction hash from execution result
            if (newTransactionStatus === 'Transaction Complete') {
              const execTxHash: string | undefined =
                bid?.executionResult?.executedTransactions?.[0]
                  ?.transactionHash;
              if (execTxHash) {
                setCompletedTxHash(execTxHash);
                setCompletedChainId(chainId);
              }
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
        setCurrentTransactionStatus('Transaction Failed');
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
  }, [
    userOpHash,
    transactionData?.sellToken?.chainId,
    transactionData?.buyToken?.chainId,
    isPollingActive,
    isBackgroundPolling,
    hasSeenSuccess,
    transactionData?.isBuy,
    intentSdk,
  ]);

  const { data: walletPortfolioData } = useGetWalletPortfolioQuery(
    { wallet: accountAddress || '', isPnl: false },
    {
      skip: !accountAddress,
      refetchOnFocus: false,
    }
  );

  // Auto-refresh when in sell mode every 15 seconds
  useEffect(() => {
    if (!isBuy && sellToken && tokenAmount && isInitialized) {
      const interval = setInterval(() => {
        handleRefresh();
      }, 15000); // 15 seconds

      return () => clearInterval(interval);
    }
    return undefined;
  }, [isBuy, sellToken, tokenAmount, isInitialized, handleRefresh]);

  // Auto-refresh when in buy mode every 15 seconds
  useEffect(() => {
    if (isBuy && buyRefreshCallback && !previewBuy) {
      const interval = setInterval(() => {
        handleRefresh();
      }, 15000); // 15 seconds

      return () => clearInterval(interval);
    }
    return undefined;
  }, [isBuy, buyRefreshCallback, previewBuy, handleRefresh]);

  const renderPreview = () => {
    if (previewBuy) {
      return (
        <div className="w-full flex justify-center p-3 mb-[70px]">
          <PreviewBuy
            closePreview={closePreviewBuy}
            buyToken={buyToken}
            payingTokens={payingTokens}
            expressIntentResponse={expressIntentResponse}
            setExpressIntentResponse={setExpressIntentResponse}
            usdAmount={usdAmount}
            dispensableAssets={dispensableAssets}
            showTransactionStatus={showTransactionStatus}
          />
        </div>
      );
    }

    if (previewSell) {
      return (
        <div className="w-full flex justify-center p-3 mb-[70px]">
          <PreviewSell
            closePreview={closePreviewSell}
            showTransactionStatus={showTransactionStatus}
            sellToken={sellToken}
            sellOffer={sellOffer}
            tokenAmount={tokenAmount}
            onSellOfferUpdate={setSellOffer}
          />
        </div>
      );
    }

    if (transactionStatus) {
      return (
        <div className="w-full h-full flex justify-center p-3 mb-[70px]">
          <TransactionStatus
            closeTransactionStatus={closeTransactionStatus}
            userOpHash={userOpHash}
            chainId={
              transactionData?.isBuy
                ? transactionData?.buyToken?.chainId || 1
                : transactionData?.sellToken?.chainId || 1
            }
            gasFee={transactionGasFee}
            isBuy={transactionData?.isBuy || false}
            sellToken={transactionData?.sellToken}
            buyToken={transactionData?.buyToken}
            tokenAmount={transactionData?.tokenAmount}
            sellOffer={transactionData?.sellOffer}
            payingTokens={transactionData?.payingTokens}
            usdAmount={transactionData?.usdAmount}
            // Externalized polling state
            currentStatus={currentTransactionStatus}
            errorDetails={errorDetails}
            submittedAt={submittedAt}
            pendingCompletedAt={pendingCompletedAt}
            blockchainTxHash={blockchainTxHash}
            resourceLockTxHash={resourceLockTxHash}
            completedTxHash={completedTxHash}
            completedChainId={completedChainId}
            resourceLockChainId={resourceLockChainId}
            resourceLockCompletedAt={resourceLockCompletedAt}
            isResourceLockFailed={isResourceLockFailed}
          />
        </div>
      );
    }

    return (
      <>
        <button
          className="flex items-center justify-center"
          style={{
            border: '2px solid #1E1D24',
            width: 446,
            height: 40,
            backgroundColor: '#121116',
            borderRadius: 10,
          }}
          onClick={() => {
            setSearching(true);
          }}
          type="button"
        >
          <span style={{ marginLeft: 10 }}>
            <img src={SearchIcon} alt="search-icon" />
          </span>
          <div className="flex-1 w-fit" style={{ color: 'grey' }}>
            Search by token or paste address
          </div>
        </button>
        <div
          className="flex flex-col"
          style={{
            border: '2px solid #1E1D24',
            width: 446,
            height: 264,
            backgroundColor: '#121116',
            borderRadius: 10,
            marginTop: 40,
          }}
        >
          {/* buy/sell, refresh, settings */}
          <div className="flex">
            <div
              className="flex"
              style={{
                width: 318,
                height: 40,
                backgroundColor: 'black',
                borderRadius: 10,
                marginTop: 10,
                marginLeft: 10,
              }}
            >
              <button
                className="flex-1"
                data-testid="pulse-buy-toggle-button"
                style={
                  isBuy
                    ? {
                        backgroundColor: '#121116',
                        borderRadius: 10,
                        margin: 4,
                      }
                    : {
                        backgroundColor: 'black',
                        borderRadius: 10,
                        margin: 4,
                        color: 'grey',
                      }
                }
                onClick={() => setIsBuy(true)}
                type="button"
              >
                <p className="text-center">Buy</p>
              </button>
              <button
                className="flex-1 items-center justify-center"
                data-testid="pulse-sell-toggle-button"
                style={
                  !isBuy
                    ? {
                        backgroundColor: '#121116',
                        borderRadius: 10,
                        margin: 4,
                      }
                    : {
                        backgroundColor: 'black',
                        borderRadius: 10,
                        margin: 4,
                        color: 'grey',
                      }
                }
                onClick={() => setIsBuy(false)}
                type="button"
              >
                <p className="text-center">Sell</p>
              </button>
            </div>
            <div className="flex" style={{ marginTop: 10 }}>
              <div
                style={{
                  marginLeft: 12,
                  backgroundColor: 'black',
                  borderRadius: 10,
                  width: 40,
                  height: 40,
                  padding: '2px 2px 4px 2px',
                }}
              >
                <Refresh
                  onClick={handleRefresh}
                  isLoading={isRefreshingHome}
                  disabled={isRefreshingHome || (!buyToken && !sellToken)}
                />
              </div>

              <div
                style={{
                  marginLeft: 12,
                  backgroundColor: 'black',
                  borderRadius: 10,
                  width: 40,
                  height: 40,
                  padding: '2px 2px 4px 2px',
                }}
              >
                <Settings />
              </div>
            </div>
          </div>
          {isBuy ? (
            <Buy
              setSearching={setSearching}
              token={buyToken}
              walletPortfolioData={walletPortfolioData}
              payingTokens={payingTokens}
              setPreviewBuy={setPreviewBuy}
              setPayingTokens={setPayingTokens}
              setExpressIntentResponse={setExpressIntentResponse}
              setUsdAmount={setUsdAmount}
              setDispensableAssets={setDispensableAssets}
              setBuyRefreshCallback={setBuyRefreshCallback}
              setBuyToken={setBuyToken}
              setChains={setChains}
            />
          ) : (
            <Sell
              setSearching={setSearching}
              token={sellToken}
              walletPortfolioData={walletPortfolioData}
              setPreviewSell={setPreviewSell}
              setSellOffer={setSellOffer}
              setTokenAmount={setTokenAmount}
              isRefreshing={isRefreshingHome}
            />
          )}
        </div>
      </>
    );
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen"
      style={{ backgroundColor: 'black' }}
      data-testid="pulse-home-view"
    >
      {renderPreview()}
    </div>
  );
}

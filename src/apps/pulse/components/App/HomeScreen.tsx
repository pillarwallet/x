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
import {
  convertPortfolioAPIResponseToToken,
  PortfolioToken,
} from '../../../../services/tokensData';

// types
import { PayingToken, SelectedToken } from '../../types/tokens';
import { MobulaChainNames } from '../../utils/constants';

// components
import SearchIcon from '../../assets/search-icon.png';
import Buy from '../Buy/Buy';
import PreviewBuy from '../Buy/PreviewBuy';
import Refresh from '../Misc/Refresh';
import Settings from '../Misc/Settings';
import PreviewSell from '../Sell/PreviewSell';
import Sell from '../Sell/Sell';
import TransactionStatus from '../Transaction/TransactionStatus';
import SettingsMenu from '../Settings/SettingsMenu';

// hooks
import useTransactionKit from '../../../../hooks/useTransactionKit';
import useIntentSdk from '../../hooks/useIntentSdk';
import useRelaySell, { SellOffer } from '../../hooks/useRelaySell';

// utils
import { getStableCurrencyBalanceOnEachChain } from '../../utils/utils';

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
  const [maxStableCoinBalance, setMaxStableCoinBalance] = useState<{
    chainId: number;
    balance: number;
  }>();
  const [transactionData, setTransactionData] = useState<{
    sellToken: SelectedToken | null;
    buyToken: SelectedToken | null;
    tokenAmount: string;
    sellOffer: SellOffer | null;
    payingTokens: PayingToken[];
    usdAmount: string;
    isBuy: boolean;
  } | null>(null);
  // Load settings from localStorage or use defaults
  const [customBuyAmounts, setCustomBuyAmounts] = useState<string[]>(() => {
    const stored = localStorage.getItem('pulse_customBuyAmounts');
    return stored ? JSON.parse(stored) : ['10', '20', '50', '100'];
  });
  const [customSellAmounts, setCustomSellAmounts] = useState<string[]>(() => {
    const stored = localStorage.getItem('pulse_customSellAmounts');
    return stored ? JSON.parse(stored) : ['10%', '25%', '50%', '75%'];
  });
  const [displaySettingsMenu, setDisplaySettingsMenu] =
    useState<boolean>(false);
  const [selectedChainIdForSettlement, setSelectedChainIdForSettlement] =
    useState<number>(() => {
      const stored = localStorage.getItem('pulse_selectedChainIdForSettlement');
      return stored ? parseInt(stored, 10) : 1; // Will be updated by useEffect once maxStableCoinBalance is calculated
    });
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
  const [isSellFlowPaused, setIsSellFlowPaused] = useState<boolean>(false);

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
  const [portfolioTokens, setPortfolioTokens] = useState<PortfolioToken[]>([]);
  const [shouldAutoReopen, setShouldAutoReopen] = useState<boolean>(false);
  const hasSeenSuccessRef = useRef<boolean>(false);
  const blockchainTxHashRef = useRef<string | undefined>(undefined);
  const failureGraceExpiryRef = useRef<number | null>(null);
  const hasInitializedChainIdRef = useRef<boolean>(false);

  const { data: walletPortfolioData } = useGetWalletPortfolioQuery(
    { wallet: accountAddress || '', isPnl: false },
    {
      skip: !accountAddress,
      refetchOnFocus: false,
    }
  );

  useEffect(() => {
    if (
      !walletPortfolioData ||
      !portfolioTokens ||
      portfolioTokens.length === 0
    ) {
      return;
    }
    const stableBalance =
      getStableCurrencyBalanceOnEachChain(walletPortfolioData);
    const maxStableBalance = Math.max(...Object.values(stableBalance));
    const chainIdOfMaxStableBalance = Number(
      Object.keys(stableBalance).find(
        (key) => stableBalance[Number(key)] === maxStableBalance
      ) || '1'
    );
    setMaxStableCoinBalance({
      chainId: chainIdOfMaxStableBalance,
      balance: maxStableBalance,
    });
  }, [portfolioTokens, walletPortfolioData]);

  // Sync selectedChainId with maxStableCoinBalance.chainId on first load or when no preference is stored
  useEffect(() => {
    const storedChainId = localStorage.getItem(
      'pulse_selectedChainIdForSettlement'
    );
    // If no stored preference and haven't initialized yet, use the chain with max stable balance
    if (
      !storedChainId &&
      !hasInitializedChainIdRef.current &&
      maxStableCoinBalance?.chainId
    ) {
      setSelectedChainIdForSettlement(maxStableCoinBalance.chainId);
      // Save it to localStorage so we know user hasn't manually changed it yet
      localStorage.setItem(
        'pulse_selectedChainIdForSettlement',
        maxStableCoinBalance.chainId.toString()
      );
      hasInitializedChainIdRef.current = true;
    }
  }, [maxStableCoinBalance]);

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

  // Save customBuyAmounts to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      'pulse_customBuyAmounts',
      JSON.stringify(customBuyAmounts)
    );
  }, [customBuyAmounts]);

  // Save customSellAmounts to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      'pulse_customSellAmounts',
      JSON.stringify(customSellAmounts)
    );
  }, [customSellAmounts]);

  // Save selectedChainIdForSettlement to localStorage whenever it changes
  useEffect(() => {
    if (maxStableCoinBalance?.chainId)
      localStorage.setItem(
        'pulse_selectedChainIdForSettlement',
        selectedChainIdForSettlement.toString()
      );
  }, [selectedChainIdForSettlement, maxStableCoinBalance]);

  const handleRefresh = useCallback(async () => {
    // Prevent multiple simultaneous refresh calls
    if (isRefreshingHome || isSellFlowPaused) {
      return;
    }

    setIsRefreshingHome(true);

    try {
      // Always refresh wallet portfolio
      await refetchWalletPortfolio();

      // If we have the required data, refresh the sell offer
      if (
        !isBuy &&
        sellToken &&
        tokenAmount &&
        isInitialized &&
        !isSellFlowPaused
      ) {
        try {
          const newOffer = await getBestSellOffer({
            fromAmount: tokenAmount,
            fromTokenAddress: sellToken.address,
            fromChainId: sellToken.chainId,
            fromTokenDecimals: sellToken.decimals,
            toChainId: selectedChainIdForSettlement,
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
    isSellFlowPaused,
    selectedChainIdForSettlement,
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
      blockchainTxHashRef.current = undefined;
      failureGraceExpiryRef.current = null;
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
              hasSeenSuccessRef.current = true;
            }

            // If we've already seen success, ignore any failure statuses
            // Both state and ref to ensure we catch the success
            if (
              (hasSeenSuccess || hasSeenSuccessRef.current) &&
              newTransactionStatus === 'Transaction Failed'
            ) {
              return;
            }

            // Extract actual transaction hash if available and mirror into ref (do this before failure guard)
            if (response.transaction) {
              const firstObservation = !blockchainTxHashRef.current;
              setBlockchainTxHash(response.transaction);
              blockchainTxHashRef.current = response.transaction;
              if (firstObservation && failureGraceExpiryRef.current == null) {
                failureGraceExpiryRef.current = Date.now() + 10000; // start grace on first hash
              }
            }

            // Additional protection using refs and single-use grace window
            // If we have a blockchain transaction hash, it means the transaction was actually
            // submitted and might be successful even if the status shows as 'Reverted' temporarily
            if (newTransactionStatus === 'Transaction Failed') {
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
            updateStatusWithDelay(newTransactionStatus);

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

  useEffect(() => {
    if (!walletPortfolioData) return;

    const tokens = convertPortfolioAPIResponseToToken(
      walletPortfolioData.result.data
    );

    setPortfolioTokens(tokens);
  }, [walletPortfolioData]);

  // Auto-refresh when in sell mode every 15 seconds
  useEffect(() => {
    if (
      !isBuy &&
      sellToken &&
      tokenAmount &&
      isInitialized &&
      !isSellFlowPaused
    ) {
      const interval = setInterval(() => {
        handleRefresh();
      }, 15000); // 15 seconds

      return () => clearInterval(interval);
    }
    return undefined;
  }, [
    isBuy,
    sellToken,
    tokenAmount,
    isInitialized,
    handleRefresh,
    isSellFlowPaused,
  ]);

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
        <div className="w-full flex justify-center px-3 md:p-3 mb-[70px]">
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
        <div className="w-full flex justify-center px-3 md:p-3 mb-[70px]">
          <PreviewSell
            closePreview={closePreviewSell}
            showTransactionStatus={showTransactionStatus}
            sellToken={sellToken}
            sellOffer={sellOffer}
            tokenAmount={tokenAmount}
            selectedChainIdForSettlement={selectedChainIdForSettlement}
            onSellOfferUpdate={setSellOffer}
            setSellFlowPaused={setIsSellFlowPaused}
          />
        </div>
      );
    }

    if (transactionStatus) {
      return (
        <div className="w-full h-full flex justify-center px-3 md:p-3 mb-[70px]">
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
      <div className="w-full max-w-[446px]">
        {displaySettingsMenu ? (
          <SettingsMenu
            closeSettingsMenu={() => setDisplaySettingsMenu(false)}
            setCustomBuyAmounts={setCustomBuyAmounts}
            customBuyAmounts={customBuyAmounts}
            setCustomSellAmounts={setCustomSellAmounts}
            customSellAmounts={customSellAmounts}
            selectedChainId={selectedChainIdForSettlement}
            setSelectedChainId={setSelectedChainIdForSettlement}
          />
        ) : (
          <>
            <p className="flex text-base font-normal text-white/[.5] w-full text-center mb-6">
              You&apos;re trying out the beta version of Pulse: expect
              improvements ahead. Thank you.
            </p>
            <button
              className="flex items-center justify-center w-full border-2 border-[#1E1D24] h-10 bg-[#121116] rounded-[10px]"
              onClick={() => {
                setSearching(true);
              }}
              type="button"
              data-testid="pulse-search-button-homescreen"
            >
              <span className="ml-3.5 mr-2.5">
                <img
                  src={SearchIcon}
                  alt="search-icon"
                  width={12}
                  height={12}
                />
              </span>
              <div className="flex-1 text-grey text-left opacity-50 h-5 text-[13px]">
                Search by token or paste address
              </div>
            </button>
            <div className="flex flex-col w-full border-2 border-[#1E1D24] min-h-[264px] bg-[#1E1D24] rounded-2xl mt-10">
              {/* buy/sell, refresh, settings */}
              <div className="flex justify-between">
                <div className="flex flex-1 max-w-[318px] h-10 bg-black rounded-[10px] mt-2.5 ml-2.5">
                  <button
                    className={`flex-1 rounded-[10px] m-1 ${
                      isBuy ? 'bg-[#1E1D24]' : 'bg-black text-grey'
                    }`}
                    data-testid="pulse-buy-toggle-button"
                    onClick={() => setIsBuy(true)}
                    type="button"
                  >
                    <span className="text-center font-medium text-sm">Buy</span>
                  </button>
                  <button
                    className={`flex-1 items-center justify-center rounded-[10px] m-1 ${
                      !isBuy ? 'bg-[#1E1D24]' : 'bg-black text-grey'
                    }`}
                    data-testid="pulse-sell-toggle-button"
                    onClick={() => setIsBuy(false)}
                    type="button"
                  >
                    <span className="text-center font-medium text-sm">
                      Sell
                    </span>
                  </button>
                </div>
                <div className="flex mt-2.5 mr-2.5">
                  <div className="ml-3 bg-black rounded-[10px] w-10 h-10 flex justify-center items-center p-[2px_2px_4px_2px]">
                    <div
                      className="w-9 h-[34px] bg-[#1E1D24] rounded-lg flex justify-center"
                      data-testid="pulse-refresh-button-homescreen"
                    >
                      <Refresh
                        onClick={handleRefresh}
                        isLoading={isRefreshingHome}
                        disabled={isRefreshingHome || (!buyToken && !sellToken)}
                      />
                    </div>
                  </div>

                  <div className="ml-3 bg-black rounded-[10px] w-10 h-10 flex justify-center items-center p-[2px_2px_4px_2px]">
                    <Settings onClick={() => setDisplaySettingsMenu(true)} />
                  </div>
                </div>
              </div>
              {isBuy ? (
                <Buy
                  setSearching={setSearching}
                  token={buyToken}
                  walletPortfolioData={walletPortfolioData}
                  payingTokens={payingTokens}
                  portfolioTokens={portfolioTokens}
                  maxStableCoinBalance={
                    maxStableCoinBalance ?? { chainId: 1, balance: 2 }
                  }
                  customBuyAmounts={[...customBuyAmounts, 'MAX']}
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
                  portfolioTokens={portfolioTokens}
                  customSellAmounts={[...customSellAmounts, 'MAX']}
                  selectedChainIdForSettlement={selectedChainIdForSettlement}
                  setPreviewSell={setPreviewSell}
                  setSellOffer={setSellOffer}
                  setTokenAmount={setTokenAmount}
                  isRefreshing={isRefreshingHome}
                />
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-black"
      data-testid="pulse-home-view"
    >
      {renderPreview()}
    </div>
  );
}

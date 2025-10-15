import { useCallback, useEffect, useRef, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { MdCheck } from 'react-icons/md';
import { TailSpin } from 'react-loader-spinner';

// utils
import { getLogoForChainId } from '../../../../utils/blockchain';
import {
  formatExponentialSmallNumber,
  limitDigitsNumber,
} from '../../../../utils/number';
import { formatNativeTokenAddress } from '../../utils/blockchain';

// icons
import RandomAvatar from '../../../pillarx-app/components/RandomAvatar/RandomAvatar';
import CopyIcon from '../../assets/copy-icon.svg';
import MoreInfo from '../../assets/moreinfo-icon.svg';
import UsdcLogo from '../../assets/usd-coin-usdc-logo.png';

// hooks
import useTransactionKit from '../../../../hooks/useTransactionKit';
import useGasEstimation from '../../hooks/useGasEstimation';
import useRelaySell, { SellOffer } from '../../hooks/useRelaySell';

// types
import { SelectedToken } from '../../types/tokens';

// components
import Esc from '../Misc/Esc';
import Refresh from '../Misc/Refresh';
import Tooltip from '../Misc/Tooltip';

interface PreviewSellProps {
  closePreview: () => void;
  showTransactionStatus: (txHash: string, gasFee?: string) => void;
  sellToken: SelectedToken | null;
  sellOffer: SellOffer | null;
  tokenAmount: string;
  onSellOfferUpdate?: (offer: SellOffer | null) => void;
  setSellFlowPaused?: (paused: boolean) => void;
}

const PreviewSell = (props: PreviewSellProps) => {
  const {
    closePreview,
    showTransactionStatus,
    sellToken,
    sellOffer,
    tokenAmount,
    onSellOfferUpdate,
    setSellFlowPaused,
  } = props;
  const [isExecuting, setIsExecuting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isSellTokenAddressCopied, setIsSellTokenAddressCopied] =
    useState(false);
  const [isRefreshingPreview, setIsRefreshingPreview] = useState(false);
  const [isWaitingForSignature, setIsWaitingForSignature] = useState(false);
  const [isTransactionRejected, setIsTransactionRejected] = useState(false);
  const [isTransactionSuccess, setIsTransactionSuccess] = useState(false);
  const previewModalRef = useRef<HTMLDivElement>(null);
  const {
    getUSDCAddress,
    executeSell,
    error,
    clearError,
    getBestSellOffer,
    isInitialized,
  } = useRelaySell();
  const { kit } = useTransactionKit();
  const {
    isEstimatingGas,
    gasEstimationError,
    gasCostNative,
    nativeTokenSymbol,
    estimateGasFees,
  } = useGasEstimation({
    sellToken,
    sellOffer,
    tokenAmount,
    isPaused: isWaitingForSignature || isExecuting,
  });

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 3000);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [isCopied]);

  useEffect(() => {
    if (isSellTokenAddressCopied) {
      const timer = setTimeout(() => {
        setIsSellTokenAddressCopied(false);
      }, 3000);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [isSellTokenAddressCopied]);

  // Reset transaction states when new data comes in
  useEffect(() => {
    if (!isExecuting && !isTransactionSuccess && !isTransactionRejected) {
      setIsTransactionRejected(false);
      setIsWaitingForSignature(false);
      setIsTransactionSuccess(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sellToken, tokenAmount, sellOffer]);

  // Bridge pause state to HomeScreen to stop its quote refresh while confirming
  useEffect(() => {
    if (setSellFlowPaused) {
      setSellFlowPaused(isWaitingForSignature || isExecuting);
    }
  }, [isWaitingForSignature, isExecuting, setSellFlowPaused]);

  // Ensure pause resets on unmount
  useEffect(() => {
    return () => {
      if (setSellFlowPaused) setSellFlowPaused(false);
    };
  }, [setSellFlowPaused]);

  // Utility function to clean up batch with consistent error handling
  const cleanupBatch = useCallback(
    (chainId: number, context: string) => {
      if (!kit) return;

      const batchName = `pulse-sell-batch-${chainId}`;
      try {
        kit.batch({ batchName }).remove();
      } catch (cleanupErr) {
        if (
          !(
            cleanupErr instanceof Error &&
            cleanupErr.message.includes('does not exist')
          )
        ) {
          console.error(`Failed to clean up batch (${context}):`, cleanupErr);
        }
      }
    },
    [kit]
  );

  // Clean up pulse-sell batch when component unmounts or preview closes
  useEffect(() => {
    return () => {
      if (sellToken) {
        cleanupBatch(sellToken.chainId, 'unmount');
      }
    };
  }, [sellToken, cleanupBatch]);

  // Clear errors when amount, token, or quote props change
  useEffect(() => {
    if (error) {
      clearError();
    }
    return undefined;
  }, [tokenAmount, sellToken, sellOffer, clearError, error]);

  // Click outside to close functionality
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        previewModalRef.current &&
        !previewModalRef.current.contains(event.target as Node)
      ) {
        closePreview();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closePreview]);

  // TO DO - check if needed in the future
  // // Get the user's balance for the selected token
  // const getTokenBalance = () => {
  //   try {
  //     if (!sellToken || !walletPortfolioData?.result?.data?.assets) return 0;
  //     // Find the asset in the portfolio
  //     const assetData = walletPortfolioData.result.data.assets.find(
  //       (asset) => asset.asset.symbol === sellToken.symbol
  //     );

  //     if (!assetData) return 0;

  //     // Find the contract balance for the specific token address and chain
  //     const contractBalance = assetData.contracts_balances.find(
  //       (contract) =>
  //         contract.address.toLowerCase() === sellToken.address.toLowerCase() &&
  //         contract.chainId === `evm:${sellToken.chainId}`
  //     );
  //     return contractBalance?.balance || 0;
  //   } catch (e) {
  //     console.error('Error getting token balance in preview:', e);
  //     return 0;
  //   }
  // };

  const usdcAddress = getUSDCAddress(sellToken?.chainId || 0);

  // Clean up pulse-sell batch when component unmounts or preview closes
  useEffect(() => {
    return () => {
      if (sellToken) {
        cleanupBatch(sellToken.chainId, 'unmount');
      }
    };
  }, [sellToken, cleanupBatch]);

  // Refresh function for PreviewSell component - only refreshes sell offer
  const refreshPreviewSellData = useCallback(async () => {
    // Pause both quote refresh and gas estimation while awaiting signature or executing
    if (isWaitingForSignature || isExecuting) {
      return;
    }
    setIsRefreshingPreview(true);
    // Reset transaction states to allow retry
    setIsTransactionRejected(false);
    setIsWaitingForSignature(false);
    setIsTransactionSuccess(false);

    // Clean up any existing pulse-sell batch before refreshing
    if (sellToken) {
      cleanupBatch(sellToken.chainId, 'refresh');
    }

    try {
      // Only fetch new sell offer - wallet portfolio is already fresh from HomeScreen
      if (sellToken && tokenAmount && isInitialized && onSellOfferUpdate) {
        const newOffer = await getBestSellOffer({
          fromAmount: tokenAmount,
          fromTokenAddress: sellToken.address,
          fromChainId: sellToken.chainId,
          fromTokenDecimals: sellToken.decimals,
        });
        onSellOfferUpdate(newOffer);
      }

      // Also estimate gas fees after refreshing the offer
      await estimateGasFees();
    } catch (e) {
      console.error('Failed to refresh sell offer:', e);
      if (onSellOfferUpdate) {
        onSellOfferUpdate(null);
      }
    } finally {
      setIsRefreshingPreview(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    sellToken,
    tokenAmount,
    isInitialized,
    onSellOfferUpdate,
    getBestSellOffer,
    isWaitingForSignature,
    isExecuting,
  ]);

  // Auto-refresh sell offer every 15 seconds (disabled when waiting for signature)
  useEffect(() => {
    if (!sellToken || !tokenAmount || !isInitialized || !onSellOfferUpdate) {
      return undefined;
    }

    // Don't auto-refresh when waiting for signature or executing transaction
    if (isWaitingForSignature || isExecuting) {
      return undefined;
    }

    const interval = setInterval(() => {
      refreshPreviewSellData();
    }, 15000); // 15 seconds

    return () => clearInterval(interval);
  }, [
    sellToken,
    tokenAmount,
    isInitialized,
    onSellOfferUpdate,
    refreshPreviewSellData,
    isWaitingForSignature,
    isExecuting,
  ]);

  const detailsEntry = (
    lhs: string,
    rhs: string,
    moreInfo = false,
    tokenName = '',
    isLoading = false,
    tooltipContent = ''
  ) => {
    return (
      <div className="flex justify-between mb-3">
        <div className="flex items-center text-white/50 text-[13px] font-normal">
          <div>{lhs}</div>
          {tooltipContent && (
            <div className="ml-1.5">
              <Tooltip content={tooltipContent}>
                <div className="w-3 h-3 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="text-white/50 text-[10px] font-normal">
                    ?
                  </span>
                </div>
              </Tooltip>
            </div>
          )}
          {moreInfo && (
            <div className="mt-1 ml-1">
              <img src={MoreInfo} alt="more-info-icon" />
            </div>
          )}
        </div>
        <div>
          <div className="flex items-center text-[13px] font-normal text-white">
            {isLoading ? (
              <div className="flex items-center">
                <TailSpin color="#FFFFFF" height={12} width={12} />
              </div>
            ) : (
              <>
                <div>{rhs}</div>
                {tokenName && (
                  <div className="ml-1 text-white/50">{tokenName}</div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Execute sell transaction directly without opening batch modal
  const executeSellDirectly = async () => {
    if (!sellToken || !sellOffer || !kit) return;

    // Clear any existing errors and states
    if (error) {
      clearError();
    }
    setIsTransactionRejected(false);
    setIsTransactionSuccess(false);
    setIsWaitingForSignature(true);
    setIsExecuting(true);
    if (setSellFlowPaused) setSellFlowPaused(true);

    try {
      // First, prepare the batch using the existing executeSell logic (without showing batch modal)
      const result = await executeSell(sellToken, tokenAmount, undefined);

      if (result) {
        // If executeSell succeeded, it means the batch was prepared
        // Now execute the batch directly
        const batchName = `pulse-sell-batch-${sellToken.chainId}`;

        const batchSend = await kit.sendBatches({
          onlyBatchNames: [batchName],
        });
        const sentBatch = batchSend.batches[batchName];

        if (batchSend.isSentSuccessfully && !sentBatch?.errorMessage) {
          const userOpHash = sentBatch?.userOpHash;
          if (userOpHash) {
            setIsTransactionSuccess(true);
            setIsWaitingForSignature(false);
            setIsExecuting(false);
            if (setSellFlowPaused) setSellFlowPaused(false);

            // Clean up the batch from kit after successful execution
            cleanupBatch(sellToken.chainId, 'success');

            // Ensure we have a valid gas fee string for the transaction status
            const gasFeeString =
              gasCostNative && nativeTokenSymbol
                ? `≈ ${formatExponentialSmallNumber(limitDigitsNumber(parseFloat(gasCostNative)))} ${nativeTokenSymbol}`
                : '≈ 0.00';

            showTransactionStatus(userOpHash, gasFeeString);
            return;
          }

          throw new Error('No userOpHash returned after batch send');
        }

        throw new Error(sentBatch?.errorMessage || 'Batch send failed');
      }

      throw new Error('Failed to prepare sell transaction');
    } catch (err) {
      console.error('Failed to execute sell:', err);

      // Clean up the batch from kit on any error
      cleanupBatch(sellToken.chainId, 'error');

      // Check if the error is a user rejection
      if (
        err instanceof Error &&
        err.message.includes('User rejected the request')
      ) {
        setIsTransactionRejected(true);
        setIsWaitingForSignature(false);
      } else {
        // Other errors will be handled by the useRelaySell hook's error state
        setIsWaitingForSignature(false);
      }
      setIsExecuting(false);
      if (setSellFlowPaused) setSellFlowPaused(false);
    }
  };

  const handleConfirmSell = async () => {
    if (!sellToken || !sellOffer) return;
    await executeSellDirectly();
  };

  if (!sellToken || !sellOffer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black">
        <div className="text-white text-lg">
          No offer was found. Please check the token and the input amount and
          try again.
        </div>
        <button
          type="button"
          onClick={closePreview}
          className="mt-4 px-4 py-2 bg-gray-600 text-white rounded"
        >
          Close
        </button>
      </div>
    );
  }

  const usdcAmount = sellOffer.tokenAmountToReceive;
  const tokenAmountFormatted = parseFloat(tokenAmount).toFixed(6);
  const usdcAmountFormatted = usdcAmount.toFixed(6);

  return (
    <div
      ref={previewModalRef}
      className="flex flex-col w-full max-w-[446px] bg-[#1E1D24] border border-white/5 rounded-[10px] p-6"
      data-testid="pulse-preview-sell-container"
    >
      <div className="flex justify-between mb-6">
        <div className="text-xl font-normal">Confirm Transaction</div>
        <div className="flex">
          <div
            className="justify-center items-center bg-[#121116] rounded-[10px] p-[2px_2px_4px_2px] flex w-10 h-10 ml-3"
            data-testid="pulse-preview-sell-refresh-button"
          >
            <div className="py-2 px-px w-9 h-[34px] bg-[#1E1D24] rounded-lg flex justify-center">
              <Refresh
                onClick={refreshPreviewSellData}
                isLoading={isRefreshingPreview}
                disabled={
                  !sellToken ||
                  !tokenAmount ||
                  isRefreshingPreview ||
                  isWaitingForSignature ||
                  isExecuting
                }
              />
            </div>
          </div>

          <div
            className="justify-center items-center bg-[#121116] rounded-[10px] p-[2px_2px_4px_2px] flex w-10 h-10 ml-3"
            data-testid="pulse-preview-sell-esc-button"
          >
            <div className="py-2 px-px w-9 h-[34px] bg-[#1E1D24] rounded-lg flex justify-center">
              <Esc onClose={closePreview} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between mb-3 text-[13px] font-normal text-white/50">
        <div>You&apos;re selling</div>
        <div className="flex">
          Total: {tokenAmountFormatted} {sellToken.symbol}
        </div>
      </div>

      <div
        className="flex justify-between w-full border border-[#25232D] rounded-[10px] p-3 mb-6"
        data-testid="pulse-preview-sell-selling-token"
      >
        <div className="flex items-center">
          <div
            className="relative inline-block mr-2"
            data-testid={`pulse-preview-sell-selling-token-${sellToken.chainId}-${sellToken.name}`}
          >
            {sellToken?.logo ? (
              <img
                src={sellToken?.logo}
                alt="Main"
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 overflow-hidden rounded-full">
                <RandomAvatar name={sellToken?.name || ''} />
                <span className="absolute inset-0 flex items-center justify-center text-white text-sm font-bold">
                  {sellToken?.name?.slice(0, 2)}
                </span>
              </div>
            )}
            <img
              src={getLogoForChainId(sellToken?.chainId)}
              className="absolute -bottom-px right-0.5 w-3 h-3 rounded-full border border-[#1E1D24]"
              alt="Chain logo"
            />
          </div>
          <div>
            <div className="text-[13px] font-normal text-white">
              {sellToken?.name}{' '}
              <span className="text-white/[.5]">{sellToken?.symbol}</span>
            </div>
            <div className="flex items-center text-[13px] font-normal text-white/50">
              <span>
                {sellToken?.address
                  ? `${formatNativeTokenAddress(sellToken.address).slice(0, 6)}...${formatNativeTokenAddress(sellToken.address).slice(-4)}`
                  : 'Address not available'}
              </span>
              {sellToken?.address && (
                <CopyToClipboard
                  text={sellToken.address}
                  onCopy={() => setIsSellTokenAddressCopied(true)}
                >
                  <div className="flex items-center ml-1 cursor-pointer">
                    {isSellTokenAddressCopied ? (
                      <MdCheck className="w-[10px] h-3 text-white" />
                    ) : (
                      <img
                        src={CopyIcon}
                        alt="copy-address-icon"
                        className="w-[10px] h-3"
                      />
                    )}
                  </div>
                </CopyToClipboard>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center text-right">
          <div
            className="text-[13px] font-normal text-white"
            data-testid="pulse-preview-sell-token-amount-value"
          >
            {tokenAmountFormatted}
          </div>
          <div
            className="text-xs font-normal text-white/50"
            data-testid="pulse-preview-sell-token-amount-usd"
          >
            $
            {(parseFloat(tokenAmount) * parseFloat(sellToken.usdValue)).toFixed(
              2
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between mb-3 text-[13px] font-normal text-white/50">
        <div>You&apos;re receiving</div>
      </div>

      <div
        className="flex justify-between w-full border border-[#25232D] rounded-[10px] p-3 mb-6"
        data-testid={`pulse-preview-sell-receiving-token-${sellToken?.chainId}-usdc`}
      >
        <div className="flex items-center">
          <div
            className="relative inline-block mr-2"
            data-testid="pulse-preview-sell-usdc-token"
          >
            <img src={UsdcLogo} alt="USDC" className="w-8 h-8 rounded-full" />
            <img
              src={getLogoForChainId(sellToken?.chainId)}
              className="absolute -bottom-px right-0.5 w-3 h-3 rounded-full border border-[#1E1D24]"
              alt="Chain logo"
            />
          </div>
          <div>
            <div className="flex items-center text-[13px] font-normal text-white">
              <span>USD Coin</span>
              <span className="ml-1 text-white/50">USDC</span>
            </div>
            <div className="flex items-center text-[13px] font-normal text-white/50">
              <span>
                {usdcAddress
                  ? `${usdcAddress.slice(0, 6)}...${usdcAddress.slice(-4)}`
                  : 'USDC'}
              </span>
              {usdcAddress && (
                <CopyToClipboard
                  text={usdcAddress}
                  onCopy={() => setIsCopied(true)}
                >
                  <div className="flex items-center ml-1 cursor-pointer">
                    {isCopied ? (
                      <MdCheck className="w-[10px] h-3 text-white" />
                    ) : (
                      <img
                        src={CopyIcon}
                        alt="copy-address-icon"
                        className="w-[10px] h-3"
                      />
                    )}
                  </div>
                </CopyToClipboard>
              )}
            </div>
          </div>
        </div>
        <div
          className="flex flex-col justify-center text-right"
          data-testid="pulse-preview-sell-usdc-amount"
        >
          {isRefreshingPreview ? (
            <div className="flex items-center justify-end">
              <TailSpin color="#FFFFFF" height={15} width={15} />
            </div>
          ) : (
            <>
              <div
                className="text-[13px] font-normal text-white"
                data-testid="pulse-preview-sell-usdc-amount-value"
              >
                {usdcAmountFormatted}
              </div>
              <div
                className="text-xs font-normal text-white/50"
                data-testid="pulse-preview-sell-usdc-amount-usd"
              >
                ${usdcAmount.toFixed(2)}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex justify-between mb-3 text-[13px] font-normal text-white/50">
        <div>Details</div>
      </div>

      <div className="flex flex-col w-full border border-[#25232D] rounded-[10px] p-3 mb-3">
        {detailsEntry(
          'Rate',
          `1 ${sellToken?.symbol} ≈ ${sellToken?.usdValue ? Number(sellToken.usdValue).toFixed(3) : '-'}`,
          false,
          'USDC',
          false
        )}
        {detailsEntry(
          'Minimum receive',
          `${sellOffer.minimumReceive.toFixed(6)} USDC`,
          false,
          '',
          isRefreshingPreview,
          'Minimum to receive = Est. to amount × (1 - max.slippage). The minimum amount you will receive from this transaction.'
        )}
        {detailsEntry(
          'Price impact',
          sellOffer.priceImpact !== undefined
            ? `${sellOffer.priceImpact.toFixed(2)}%`
            : '0.00%',
          false,
          '',
          isRefreshingPreview,
          'Price impact = (Total Received Value - Total Paid Value) / Total Paid Value. Certain trades may affect the liquidity pool’s depth. This will have an impact on the overall availability and price of the pool’s tokens, leading to price differences.'
        )}
        {detailsEntry(
          'Max slippage',
          `${(sellOffer.slippageTolerance * 100).toFixed(1)}%`,
          false,
          '',
          false,
          'Your transaction will be cancelled if the price changes unfavorably by more than this percentage.'
        )}
        {detailsEntry(
          'Gas fee',
          (() => {
            const gasFeeDisplay = gasCostNative
              ? `≈ ${formatExponentialSmallNumber(limitDigitsNumber(parseFloat(gasCostNative)))} ${nativeTokenSymbol}`
              : '≈ 0.00';
            return gasFeeDisplay;
          })(),
          false,
          '',
          isEstimatingGas,
          'Fee that will be deducted from your universal gas tank.'
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div
          className="m-2.5 p-2.5 bg-red-500/10 border border-red-500 rounded-[10px]"
          data-testid="pulse-preview-sell-error"
        >
          <div className="text-red-300 text-xs">{error}</div>
        </div>
      )}

      {/* Gas Estimation Error Display */}
      {gasEstimationError && (
        <div
          className="m-2.5 p-2.5 bg-yellow-500/10 border border-yellow-500 rounded-[10px]"
          data-testid="pulse-preview-sell-gas-error"
        >
          <div className="text-yellow-300 text-xs">{gasEstimationError}</div>
        </div>
      )}

      {!isTransactionRejected && !isTransactionSuccess && (
        <div className="w-full rounded-[10px] bg-[#121116] p-[2px_2px_6px_2px]">
          <button
            className={`flex items-center justify-center w-full rounded-[8px] h-[42px] p-[1px_6px_1px_6px] ${isEstimatingGas ? 'bg-[#29292F]' : 'bg-[#8A77FF]'}`}
            onClick={handleConfirmSell}
            disabled={isExecuting || isEstimatingGas}
            type="submit"
            data-testid="pulse-preview-sell-confirm-button"
          >
            {isExecuting || isEstimatingGas ? (
              <div className="flex items-center justify-center gap-2">
                <TailSpin color="#FFFFFF" height={20} width={20} />
                <span>{isEstimatingGas ? 'Estimating Gas...' : 'Confirm'}</span>
              </div>
            ) : (
              <>Confirm</>
            )}
          </button>
        </div>
      )}

      {isWaitingForSignature &&
        !isTransactionRejected &&
        !isTransactionSuccess && (
          <div
            className="text-[#FFAB36] text-[13px] font-normal text-left mt-4"
            data-testid="pulse-preview-sell-waiting-signature"
          >
            Please open your wallet and confirm the transaction.
          </div>
        )}

      {isTransactionRejected && (
        <div
          className="text-[#FF366C] text-[13px] font-normal text-center mt-4"
          data-testid="pulse-preview-sell-transaction-rejected"
        >
          Transaction was cancelled. No funds were moved
        </div>
      )}
    </div>
  );
};

export default PreviewSell;

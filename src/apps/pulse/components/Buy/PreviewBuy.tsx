/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { useCallback, useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { MdCheck } from 'react-icons/md';
import { TailSpin } from 'react-loader-spinner';
import { Hex, getAddress } from 'viem';

import {
  DispensableAsset,
  ExpressIntentResponse,
  UserIntent,
} from '@etherspot/intent-sdk/dist/cjs/sdk/types/user-intent-types';

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

// hooks
import useTransactionKit from '../../../../hooks/useTransactionKit';
import { useRemoteConfig } from '../../../../hooks/useRemoteConfig';
import useGasEstimation from '../../hooks/useGasEstimation';
import useIntentSdk from '../../hooks/useIntentSdk';
import useRelayBuy, { BuyOffer } from '../../hooks/useRelayBuy';

// types
import {
  PayingToken as PayingTokenType,
  SelectedToken,
} from '../../types/tokens';

// utils
import { getDesiredAssetValue } from '../../utils/intent';

// components
import Esc from '../Misc/Esc';
import Refresh from '../Misc/Refresh';
import Tooltip from '../Misc/Tooltip';
import PayingToken from './PayingToken';

interface PreviewBuyProps {
  closePreview: () => void;
  buyToken?: SelectedToken | null;
  payingTokens: PayingTokenType[];
  expressIntentResponse: ExpressIntentResponse | BuyOffer | null;
  setExpressIntentResponse: (
    response: ExpressIntentResponse | BuyOffer | null
  ) => void;
  usdAmount: string;
  dispensableAssets: DispensableAsset[];
  showTransactionStatus: (userOperationHash: string, gasFee?: string) => void;
  fromChainId?: number; // For Relay Buy: chainId where USDC is taken from
  onBuyOfferUpdate?: (offer: BuyOffer | null) => void; // For Relay Buy: callback to update offer
  setBuyFlowPaused?: (paused: boolean) => void; // For Relay Buy: pause background refresh
}

export default function PreviewBuy(props: PreviewBuyProps) {
  const {
    closePreview,
    buyToken,
    payingTokens,
    expressIntentResponse,
    setExpressIntentResponse,
    usdAmount,
    dispensableAssets,
    showTransactionStatus,
    fromChainId,
    onBuyOfferUpdate,
    setBuyFlowPaused,
  } = props;
  const totalPay = payingTokens
    .reduce((acc, curr) => acc + curr.totalUsd, 0)
    .toFixed(2);

  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isBuyTokenAddressCopied, setIsBuyTokenAddressCopied] = useState(false);
  const [isRefreshingPreview, setIsRefreshingPreview] = useState(false);
  const [isTransactionRejected, setIsTransactionRejected] = useState(false);
  const [isWaitingForSignature, setIsWaitingForSignature] = useState(false);
  const [isTransactionSuccess, setIsTransactionSuccess] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  const {
    intentSdk,
    error: intentError,
    clearError: clearIntentError,
  } = useIntentSdk();
  const { walletAddress: accountAddress, kit } = useTransactionKit();

  // Get feature flag from Firebase Remote Config
  const { useRelayBuy: USE_RELAY_BUY } = useRemoteConfig();

  // Relay Buy hooks
  const {
    executeBuy,
    error: relayError,
    clearError: clearRelayError,
    getBestOffer,
    isInitialized: isRelayInitialized,
  } = useRelayBuy();

  // Get the appropriate offer based on feature flag
  const buyOffer = USE_RELAY_BUY ? (expressIntentResponse as BuyOffer) : null;

  // Unified error handling
  const error = USE_RELAY_BUY ? relayError : intentError;
  const clearError = USE_RELAY_BUY ? clearRelayError : clearIntentError;

  // Gas estimation for Relay Buy (similar to PreviewSell)
  const {
    isEstimatingGas,
    gasEstimationError,
    gasCostNative,
    nativeTokenSymbol,
    estimateGasFees,
  } = useGasEstimation({
    sellToken: buyToken || null,
    sellOffer: buyOffer
      ? {
          ...buyOffer,
          offer: buyOffer.offer,
        }
      : null,
    tokenAmount: usdAmount,
    isPaused: isWaitingForSignature || isExecuting,
    toChainId: fromChainId || 1,
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
    if (isBuyTokenAddressCopied) {
      const timer = setTimeout(() => {
        setIsBuyTokenAddressCopied(false);
      }, 3000);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [isBuyTokenAddressCopied]);

  // Clear errors and reset transaction states when amount, token, or quote props change
  useEffect(() => {
    if (error) {
      clearError();
    }
    // Reset transaction states when new data comes in
    if (!isExecuting && !isTransactionSuccess && !isTransactionRejected) {
      setIsTransactionRejected(false);
      setIsWaitingForSignature(false);
      setIsTransactionSuccess(false);
    }
    return undefined;
  }, [
    usdAmount,
    buyToken,
    expressIntentResponse,
    clearError,
    error,
    isExecuting,
    isTransactionSuccess,
    isTransactionRejected,
  ]);

  // Bridge pause state to HomeScreen to stop its quote refresh while confirming (Relay Buy only)
  useEffect(() => {
    if (USE_RELAY_BUY && setBuyFlowPaused) {
      setBuyFlowPaused(isWaitingForSignature || isExecuting);
    }
  }, [isWaitingForSignature, isExecuting, setBuyFlowPaused]);

  // Ensure pause resets on unmount (Relay Buy only)
  useEffect(() => {
    return () => {
      if (USE_RELAY_BUY && setBuyFlowPaused) setBuyFlowPaused(false);
    };
  }, [setBuyFlowPaused]);

  // Utility function to clean up batch (Relay Buy only)
  const cleanupBatch = useCallback(
    (chainId: number, context: string) => {
      if (!kit || !buyToken) return;

      const batchName = `pulse-buy-batch-${chainId}`;
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
    [kit, buyToken]
  );

  // Clean up pulse-buy batch when component unmounts or preview closes (Relay Buy only)
  useEffect(() => {
    return () => {
      if (USE_RELAY_BUY && buyToken) {
        cleanupBatch(buyToken.chainId, 'unmount');
      }
    };
  }, [buyToken, cleanupBatch]);

  const detailsEntry = (
    lhs: string,
    rhs: string,
    moreInfo = false,
    tokenName = '',
    isInfoLoading = false,
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
            {isInfoLoading ? (
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

  // Intent SDK: shortlist bid
  const shortlistBid = async () => {
    const intentResponse = expressIntentResponse as ExpressIntentResponse;
    if (!buyToken || !intentResponse) return;

    // Clear any existing errors and states before attempting to execute
    if (error) {
      clearError();
    }
    setIsTransactionRejected(false);
    setIsWaitingForSignature(true);
    setIsLoading(true);

    try {
      await intentSdk?.shortlistBid(
        intentResponse?.intentHash!,
        intentResponse?.bids[0].bidHash!
      );
      showTransactionStatus(intentResponse?.bids[0].bidHash!);
    } catch (err) {
      console.error('shortlisting bid failed:', err);

      // Check if the error is a user rejection
      if (
        err instanceof Error &&
        err.message.includes('User rejected the request')
      ) {
        setIsTransactionRejected(true);
        setIsWaitingForSignature(false);
      } else {
        // Other errors will be handled by the useIntentSdk hook
        setIsWaitingForSignature(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Relay Buy: execute buy directly
  const executeBuyDirectly = async () => {
    if (!buyToken || !buyOffer || !kit || !fromChainId) return;

    // Clear any existing errors and states
    if (error) {
      clearError();
    }
    setIsTransactionRejected(false);
    setIsTransactionSuccess(false);
    setIsWaitingForSignature(true);
    setIsExecuting(true);
    if (setBuyFlowPaused) setBuyFlowPaused(true);

    try {
      // Calculate token amount from USD amount
      const tokenPrice = parseFloat(buyToken.usdValue) || 0;
      if (tokenPrice <= 0) {
        throw new Error('Invalid token price');
      }
      const tokenAmount = (parseFloat(usdAmount) / tokenPrice).toString();

      // First, prepare the batch using the existing executeBuy logic
      const result = await executeBuy(
        buyToken,
        tokenAmount,
        fromChainId,
        undefined
      );

      if (result) {
        // If executeBuy succeeded, execute the batch directly
        const batchName = `pulse-buy-batch-${buyToken.chainId}`;

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
            if (setBuyFlowPaused) setBuyFlowPaused(false);

            // Clean up the batch from kit after successful execution
            cleanupBatch(buyToken.chainId, 'success');

            // Ensure we have a valid gas fee string
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

      throw new Error('Failed to prepare buy transaction');
    } catch (err) {
      console.error('Failed to execute buy:', err);

      // Clean up the batch from kit on any error
      cleanupBatch(buyToken.chainId, 'error');

      // Check if the error is a user rejection
      if (
        err instanceof Error &&
        err.message.includes('User rejected the request')
      ) {
        setIsTransactionRejected(true);
        setIsWaitingForSignature(false);
        setIsExecuting(false);
      } else {
        // Other errors will be handled by the useRelayBuy hook
        setIsWaitingForSignature(false);
        setIsExecuting(false);
      }

      if (setBuyFlowPaused) setBuyFlowPaused(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Unified confirm handler
  const handleConfirmBuy = async () => {
    if (!buyToken || !expressIntentResponse) return;

    if (USE_RELAY_BUY) {
      await executeBuyDirectly();
    } else {
      await shortlistBid();
    }
  };

  // Refresh function for PreviewBuy component
  const refreshPreviewBuyData = useCallback(async () => {
    // Pause both quote refresh and gas estimation while awaiting signature or executing
    if (isWaitingForSignature || isExecuting) {
      return;
    }

    setIsRefreshingPreview(true);
    // Reset transaction states to allow retry
    setIsTransactionRejected(false);
    setIsWaitingForSignature(false);
    setIsTransactionSuccess(false);

    if (USE_RELAY_BUY) {
      // Relay Buy flow
      if (
        !buyToken ||
        !usdAmount ||
        !isRelayInitialized ||
        !onBuyOfferUpdate ||
        !fromChainId
      ) {
        setIsRefreshingPreview(false);
        return;
      }

      // Clean up any existing pulse-buy batch before refreshing
      if (buyToken) {
        cleanupBatch(buyToken.chainId, 'refresh');
      }

      try {
        // Calculate token amount from USD amount
        const tokenPrice = parseFloat(buyToken.usdValue) || 0;
        if (tokenPrice <= 0) {
          throw new Error('Invalid token price');
        }
        const tokenAmount = (parseFloat(usdAmount) / tokenPrice).toString();

        // Fetch new buy offer
        const newOffer = await getBestOffer({
          toAmount: tokenAmount,
          toTokenAddress: buyToken.address,
          toChainId: buyToken.chainId,
          toTokenDecimals: buyToken.decimals,
          fromChainId,
        });
        onBuyOfferUpdate(newOffer);

        // Also estimate gas fees after refreshing the offer
        await estimateGasFees();
      } catch (e) {
        console.error('Failed to refresh buy offer:', e);
        onBuyOfferUpdate(null);
      } finally {
        setIsRefreshingPreview(false);
      }
    } else {
      // Intent SDK flow
      if (
        !buyToken ||
        !usdAmount ||
        !intentSdk ||
        !accountAddress ||
        dispensableAssets.length === 0
      ) {
        setIsRefreshingPreview(false);
        return;
      }

      clearError();

      try {
        // Create a new intent with updated deadline
        const intent: UserIntent = {
          constraints: {
            deadline: BigInt(Math.floor(Date.now() / 1000)) + BigInt(60),
            desiredAssets: [
              {
                asset: getAddress(buyToken.address) as Hex,
                chainId: BigInt(buyToken.chainId),
                value: getDesiredAssetValue(
                  usdAmount,
                  buyToken.decimals,
                  buyToken.usdValue
                ),
              },
            ],
            dispensableAssets,
            slippagePercentage: 3,
          },
          intentHash:
            '0x000000000000000000000000000000000000000000000000000000000000000',
          account: accountAddress as Hex,
        };

        const response = await intentSdk.expressIntent(intent);

        // Update the parent component with new response
        setExpressIntentResponse(response);
      } catch (err) {
        console.error('Failed to refresh buy offer:', err);
        // Error will be handled by the useIntentSdk hook
      } finally {
        setIsRefreshingPreview(false);
      }
    }
  }, [
    buyToken,
    usdAmount,
    intentSdk,
    accountAddress,
    dispensableAssets,
    setExpressIntentResponse,
    clearError,
    isRelayInitialized,
    onBuyOfferUpdate,
    getBestOffer,
    fromChainId,
    isWaitingForSignature,
    isExecuting,
    estimateGasFees,
    cleanupBatch,
  ]);

  // Auto-refresh buy offer every 15 seconds (disabled when waiting for signature or executing)
  useEffect(() => {
    if (USE_RELAY_BUY) {
      // Relay Buy: check required dependencies
      if (
        !buyToken ||
        !usdAmount ||
        !isRelayInitialized ||
        !onBuyOfferUpdate ||
        !fromChainId
      ) {
        return undefined;
      }
    } else {
      // Intent SDK: check required dependencies
      if (
        !buyToken ||
        !usdAmount ||
        !intentSdk ||
        !accountAddress ||
        dispensableAssets.length === 0
      ) {
        return undefined;
      }
    }

    // Don't auto-refresh when waiting for signature or executing transaction
    if (isWaitingForSignature || isExecuting) {
      return undefined;
    }

    const interval = setInterval(() => {
      refreshPreviewBuyData();
    }, 15000); // 15 seconds

    return () => clearInterval(interval);
  }, [
    buyToken,
    usdAmount,
    intentSdk,
    accountAddress,
    dispensableAssets,
    refreshPreviewBuyData,
    isWaitingForSignature,
    isExecuting,
    isRelayInitialized,
    onBuyOfferUpdate,
    fromChainId,
  ]);

  if (!buyToken || !expressIntentResponse) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black">
        <div className="text-white text-lg">
          No buy offer was found. Please check the token and the input amount
          and try again.
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

  const buyTokenAmount = buyToken?.usdValue
    ? (Number(totalPay) / Number(buyToken.usdValue)).toFixed(6)
    : '0.000000';

  // Calculate minimum receive using the formula: Est. to amount × (1 - max.slippage)
  const estimatedTokenAmount = Number(buyTokenAmount);
  const maxSlippagePercentage = 3; // 3% slippage
  const maxSlippageDecimal = maxSlippagePercentage / 100; // Convert to decimal (0.03)
  const minimumReceiveAmount = estimatedTokenAmount * (1 - maxSlippageDecimal);

  // Example: If estimated to receive 100 tokens with 3% slippage:
  // Minimum receive = 100 × (1 - 0.03) = 100 × 0.97 = 97 tokens

  // Calculate price impact using the formula: (Total Received Value - Total Paid Value) / Total Paid Value × 100
  // For buy operations:
  // - Total Paid Value = USD amount being spent
  // - Total Received Value = USD value of tokens actually received (estimated based on current market price)

  const totalPaidValue = Number(totalPay); // USD amount being spent
  const totalReceivedValue =
    estimatedTokenAmount * Number(buyToken?.usdValue || 0); // USD value of tokens received

  // Price impact calculation: (Total Received Value - Total Paid Value) / Total Paid Value × 100
  // Negative % means you're paying more than market rate (common due to slippage)
  // Positive % means you're getting more value than you paid (rare, usually arbitrage)
  const priceImpact =
    totalPaidValue > 0
      ? ((totalReceivedValue - totalPaidValue) / totalPaidValue) * 100
      : 0;

  return (
    <div className="flex flex-col w-full max-w-[446px] bg-[#1E1D24] border border-white/5 rounded-[10px] p-6">
      <div className="flex justify-between mb-6">
        <div className="text-xl font-normal">Confirm Transaction</div>
        <div className="flex">
          <div
            className="justify-center items-center bg-[#121116] rounded-[10px] p-[2px_2px_4px_2px] flex w-10 h-10 ml-3"
            data-testid="pulse-preview-buy-refresh-button"
          >
            <div className="w-9 h-[34px] bg-[#1E1D24] rounded-lg flex justify-center">
              <Refresh
                onClick={refreshPreviewBuyData}
                isLoading={isRefreshingPreview}
                disabled={
                  !buyToken ||
                  !totalPay ||
                  isRefreshingPreview ||
                  isWaitingForSignature
                }
              />
            </div>
          </div>

          <div
            className="justify-center items-center bg-[#121116] rounded-[10px] p-[2px_2px_4px_2px] flex w-10 h-10 ml-3"
            data-testid="pulse-preview-buy-esc-button"
          >
            <div className="py-2 px-px w-9 h-[34px] bg-[#1E1D24] rounded-lg flex justify-center">
              <Esc onClose={closePreview} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between mb-3 text-[13px] font-normal text-white/50">
        <div>You&apos;re paying</div>
        <div className="flex">Total: ${totalPay}</div>
      </div>

      <div className="flex flex-col w-full border border-[#25232D] rounded-[10px] p-3 mb-6">
        {payingTokens.map((item) => (
          <PayingToken payingToken={item} key={item.name} />
        ))}
      </div>

      <div className="flex justify-between mb-3 text-[13px] font-normal text-white/50">
        <div>You&apos;re buying</div>
      </div>

      <div className="flex justify-between w-full border border-[#25232D] rounded-[10px] p-3 mb-6">
        <div className="flex items-center">
          <div
            className="relative inline-block mr-2"
            data-testid={`pulse-preview-buy-buying-token-${buyToken.chainId}-${buyToken.name}`}
          >
            {buyToken?.logo ? (
              <img
                src={buyToken?.logo}
                alt="Main"
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 overflow-hidden rounded-full">
                <RandomAvatar name={buyToken?.name || ''} />
                <span className="absolute inset-0 flex items-center justify-center text-white text-sm font-bold">
                  {buyToken?.name?.slice(0, 2)}
                </span>
              </div>
            )}
            <img
              src={getLogoForChainId(buyToken?.chainId)}
              className="absolute -bottom-px right-0.5 w-3 h-3 rounded-full border border-[#1E1D24]"
              alt="Chain logo"
            />
          </div>
          <div>
            <div className="flex items-center text-[13px] font-normal text-white">
              <span>{buyToken.name}</span>
              <span className="ml-1 text-white/50">{buyToken?.symbol}</span>
            </div>
            <div className="flex items-center text-[13px] font-normal text-white/50">
              <span>
                {buyToken?.address
                  ? `${formatNativeTokenAddress(buyToken.address).slice(0, 6)}...${formatNativeTokenAddress(buyToken.address).slice(-4)}`
                  : 'Address not available'}
              </span>
              {buyToken?.address && (
                <CopyToClipboard
                  text={buyToken.address}
                  onCopy={() => setIsBuyTokenAddressCopied(true)}
                >
                  <div className="flex items-center ml-1 cursor-pointer">
                    {isBuyTokenAddressCopied ? (
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
          {isRefreshingPreview ? (
            <div className="flex items-center justify-end">
              <TailSpin color="#FFFFFF" height={15} width={15} />
            </div>
          ) : (
            <>
              <div className="text-[13px] font-normal text-white">
                {buyTokenAmount}
              </div>
              <div className="text-xs font-normal text-white/50">
                ${totalPay}
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
          `1 USD ≈ ${buyToken?.usdValue ? Number(1 / Number(buyToken.usdValue)).toFixed(3) : 1.0}`,
          false,
          buyToken?.symbol ?? '',
          false,
          'Current exchange rate between USD and the token you are buying.'
        )}
        {detailsEntry(
          'Minimum receive',
          `${minimumReceiveAmount.toFixed(6)} ${buyToken?.symbol}`,
          false,
          '',
          isRefreshingPreview,
          'Minimum to receive = Est. to amount × (1 - max.slippage). The minimum amount you will receive from this transaction.'
        )}
        {detailsEntry(
          'Price impact',
          `${priceImpact.toFixed(2)}%`,
          false,
          '',
          isRefreshingPreview,
          // eslint-disable-next-line quotes
          "Price impact = (Total Received Value - Total Paid Value) / Total Paid Value. Certain trades may affect the liquidity pool's depth. This will have an impact on the overall availability and price of the pool's tokens, leading to price differences."
        )}
        {detailsEntry(
          'Max slippage',
          `${maxSlippagePercentage.toFixed(1)}%`,
          false,
          '',
          false,
          'Your transaction will be cancelled if the price changes unfavorably by more than this percentage.'
        )}
        {detailsEntry(
          'Gas fee',
          USE_RELAY_BUY && gasCostNative && nativeTokenSymbol
            ? `≈ ${formatExponentialSmallNumber(limitDigitsNumber(parseFloat(gasCostNative)))} ${nativeTokenSymbol}`
            : '≈ $0.00',
          false,
          '',
          USE_RELAY_BUY ? isEstimatingGas : false,
          'Fee that will be deducted from your universal gas tank.'
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="m-2.5 p-2.5 bg-red-500/10 border border-red-500 rounded-[10px]">
          <div className="text-red-300 text-xs">{error}</div>
        </div>
      )}

      {!isTransactionRejected && (
        <div className="w-full rounded-[10px] bg-[#121116] p-[2px_2px_6px_2px]">
          <button
            className="flex items-center justify-center w-full rounded-[8px] h-[42px] p-[1px_6px_1px_6px] bg-[#8A77FF]"
            onClick={handleConfirmBuy}
            disabled={isLoading}
            type="submit"
            data-testid="pulse-preview-buy-confirm-button"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <TailSpin color="#FFFFFF" height={20} width={20} />
                <span>Confirm</span>
              </div>
            ) : (
              <>Confirm</>
            )}
          </button>
        </div>
      )}

      {isWaitingForSignature && !isTransactionRejected && (
        <div className="text-[#FFAB36] text-[13px] font-normal text-left mt-4">
          Please open your wallet and confirm the transaction.
        </div>
      )}

      {isTransactionRejected && (
        <div className="text-[#FF366C] text-[13px] font-normal text-center mt-4">
          Transaction was cancelled. No funds were moved
        </div>
      )}
    </div>
  );
}

import { useCallback, useEffect, useRef, useState } from 'react';
import { formatUnits } from 'viem';

// utils
import { getNativeAssetForChainId } from '../../../utils/blockchain';
import { getEIP7702AuthorizationIfNeeded } from '../../../utils/eip7702Authorization';

// hooks
import useTransactionKit from '../../../hooks/useTransactionKit';
import useRelayBuy, { BuyOffer } from './useRelayBuy';

// types
import { SelectedToken } from '../types/tokens';
import { Token } from '../../../services/tokensData';

interface UseGasEstimationBuyProps {
  buyToken: SelectedToken | null;
  buyOffer: BuyOffer | null;
  tokenAmount: string;
  fromChainId: number;
  isPaused?: boolean;
  userPortfolio?: Token[];
}

export default function useGasEstimationBuy({
  buyToken,
  buyOffer,
  tokenAmount,
  fromChainId,
  isPaused = false,
  userPortfolio,
}: UseGasEstimationBuyProps) {
  const [isEstimatingGas, setIsEstimatingGas] = useState(false);
  const [gasEstimationError, setGasEstimationError] = useState<string | null>(
    null
  );
  const [gasCostNative, setGasCostNative] = useState<string | null>(null);
  const [nativeTokenSymbol, setNativeTokenSymbol] = useState<string>('');

  const isEstimatingRef = useRef(false);
  const estimateGasFeesRef = useRef<() => Promise<void>>();

  const { kit } = useTransactionKit();
  const {
    buildBuyTransactionsForEstimation,
    isInitialized,
  } = useRelayBuy();

  const estimateGasFees = useCallback(async () => {
    if (!buyToken || !kit || !buyOffer || !tokenAmount) {
      return;
    }

    // Wait for Relay SDK to be initialized
    if (!isInitialized) {
      return;
    }

    // Prevent multiple simultaneous estimations
    if (isEstimatingRef.current || isPaused) {
      return;
    }

    isEstimatingRef.current = true;
    setIsEstimatingGas(true);
    setGasEstimationError(null);

    try {
      // Calculate token amount from USD amount
      const tokenPrice = parseFloat(buyToken.usdValue) || 0;
      if (tokenPrice <= 0) {
        setGasCostNative('0');
        setNativeTokenSymbol('');
        return;
      }
      const calculatedTokenAmount = (parseFloat(tokenAmount) / tokenPrice).toString();

      // Build the transactions without executing them
      const transactions = await buildBuyTransactionsForEstimation(
        buyOffer,
        buyToken,
        calculatedTokenAmount,
        fromChainId,
        userPortfolio
      );

      if (transactions.length === 0) {
        setGasCostNative('0');
        setNativeTokenSymbol('');
        return;
      }

      // Clean up any existing batch first
      const batchName = `pulse-buy-batch-${buyToken.chainId}`;
      try {
        kit.batch({ batchName }).remove();
      } catch (cleanupErr) {
        // Batch may not exist, which is fine
      }

      // Add each transaction to the batch
      for (let i = 0; i < transactions.length; i += 1) {
        const tx = transactions[i];
        const transactionName = `pulse-buy-${buyToken.chainId}-${tx.data.slice(0, 10)}-${i}`;

        kit
          .transaction({
            chainId: tx.chainId,
            to: tx.to,
            value: tx.value,
            data: tx.data,
          })
          .name({ transactionName })
          .addToBatch({ batchName });
      }

      const authorization = await getEIP7702AuthorizationIfNeeded(
        kit,
        buyToken.chainId
      );
      const estimation = await kit.estimateBatches({
        onlyBatchNames: [batchName],
        authorization: authorization || undefined,
      });

      const batchEst = estimation.batches[batchName];
      if (
        estimation.isEstimatedSuccessfully &&
        batchEst &&
        !batchEst.errorMessage
      ) {
        // Use the totalCost from the batch estimation (more accurate)
        const totalCostBN = batchEst.totalCost;
        if (totalCostBN) {
          // Get the native asset for the chain
          const nativeAsset = getNativeAssetForChainId(buyToken.chainId);

          // Convert from wei to native token units using the correct decimals
          const estimatedCostInNativeToken = formatUnits(
            totalCostBN,
            nativeAsset.decimals
          );

          // Store the native token amount and symbol
          setGasCostNative(estimatedCostInNativeToken);
          setNativeTokenSymbol(nativeAsset.symbol);
        } else {
          setGasCostNative('0');
          setNativeTokenSymbol('');
        }
      } else {
        setGasCostNative('0');
        setNativeTokenSymbol('');
      }

      // Clean up the batch after estimation
      try {
        kit.batch({ batchName }).remove();
      } catch (cleanupErr) {
        // Batch may not exist, which is fine
      }
    } catch (err) {
      console.error('Failed to estimate gas fees for buy:', err);
      setGasEstimationError('Failed to estimate gas fees');
      setGasCostNative(null);
    } finally {
      isEstimatingRef.current = false;
      setIsEstimatingGas(false);
    }
  }, [
    buyToken,
    kit,
    buyOffer,
    tokenAmount,
    buildBuyTransactionsForEstimation,
    isPaused,
    fromChainId,
    isInitialized,
    userPortfolio,
  ]);

  // Store the latest function in ref to avoid infinite loops
  estimateGasFeesRef.current = estimateGasFees;

  // Estimate gas fees when dependencies change
  useEffect(() => {
    const isReadyForEstimation =
      buyOffer &&
      buyToken &&
      kit &&
      tokenAmount &&
      estimateGasFeesRef.current &&
      !isPaused &&
      isInitialized;

    if (isReadyForEstimation && estimateGasFeesRef.current) {
      estimateGasFeesRef.current();
    }
  }, [
    buyOffer,
    buyToken,
    kit,
    tokenAmount,
    isPaused,
    isInitialized,
  ]);

  return {
    isEstimatingGas,
    gasEstimationError,
    gasCostNative,
    nativeTokenSymbol,
    estimateGasFees,
  };
}

import { useCallback, useEffect, useRef, useState } from 'react';
import { formatUnits } from 'viem';

// utils
import { getNativeAssetForChainId } from '../../../utils/blockchain';
import { getEIP7702AuthorizationIfNeeded } from '../../../utils/eip7702Authorization';

// hooks
import useTransactionKit from '../../../hooks/useTransactionKit';
import useRelaySell, { SellOffer } from './useRelaySell';

// types
import { SelectedToken } from '../types/tokens';

interface UseGasEstimationProps {
  sellToken: SelectedToken | null;
  sellOffer: SellOffer | null;
  tokenAmount: string;
  toChainId: number;
  isPaused?: boolean;
}

export default function useGasEstimation({
  sellToken,
  sellOffer,
  tokenAmount,
  toChainId,
  isPaused = false,
}: UseGasEstimationProps) {
  const [isEstimatingGas, setIsEstimatingGas] = useState(false);
  const [gasEstimationError, setGasEstimationError] = useState<string | null>(
    null
  );
  const [gasCostNative, setGasCostNative] = useState<string | null>(null);
  const [nativeTokenSymbol, setNativeTokenSymbol] = useState<string>('');

  const isEstimatingRef = useRef(false);
  const estimateGasFeesRef = useRef<() => Promise<void>>();

  const { kit } = useTransactionKit();
  const { buildSellTransactions } = useRelaySell();

  const estimateGasFees = useCallback(async () => {
    if (!sellToken || !kit || !sellOffer || !tokenAmount) {
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
      // Build the transactions without executing them
      const transactions = await buildSellTransactions(
        sellOffer,
        sellToken,
        tokenAmount,
        toChainId,
        undefined
      );

      if (transactions.length === 0) {
        setGasCostNative('0');
        setNativeTokenSymbol('');
        return;
      }

      // Clean up any existing batch first
      const batchName = `pulse-sell-batch-${sellToken.chainId}`;
      try {
        kit.batch({ batchName }).remove();
      } catch (cleanupErr) {
        // Batch may not exist, which is fine
      }

      // Add each transaction to the batch
      for (let i = 0; i < transactions.length; i += 1) {
        const tx = transactions[i];
        const transactionName = `pulse-sell-${sellToken.chainId}-${tx.data.slice(0, 10)}-${i}`;

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
        sellToken.chainId
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
          const nativeAsset = getNativeAssetForChainId(sellToken.chainId);

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
      console.error('Failed to estimate gas fees:', err);
      setGasEstimationError('Failed to estimate gas fees');
      setGasCostNative(null);
    } finally {
      isEstimatingRef.current = false;
      setIsEstimatingGas(false);
    }
  }, [
    sellToken,
    kit,
    sellOffer,
    tokenAmount,
    buildSellTransactions,
    isPaused,
    toChainId,
  ]);

  // Store the latest function in ref to avoid infinite loops
  estimateGasFeesRef.current = estimateGasFees;

  // Estimate gas fees when dependencies change
  useEffect(() => {
    if (
      sellOffer &&
      sellToken &&
      kit &&
      tokenAmount &&
      estimateGasFeesRef.current &&
      !isPaused
    ) {
      estimateGasFeesRef.current();
    }
  }, [sellOffer, sellToken, kit, tokenAmount, isPaused]);

  return {
    isEstimatingGas,
    gasEstimationError,
    gasCostNative,
    nativeTokenSymbol,
    estimateGasFees,
  };
}

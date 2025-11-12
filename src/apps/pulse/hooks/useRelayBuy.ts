import { EtherspotUtils } from '@etherspot/transaction-kit';
import { Execute, getClient } from '@relayprotocol/relay-sdk';
import { useCallback, useEffect, useState } from 'react';
import {
  createPublicClient,
  encodeFunctionData,
  erc20Abi,
  http,
  parseUnits,
} from 'viem';

// hooks
import useGlobalTransactionsBatch from '../../../hooks/useGlobalTransactionsBatch';
import { useTransactionDebugLogger } from '../../../hooks/useTransactionDebugLogger';
import useTransactionKit from '../../../hooks/useTransactionKit';
import useRelaySdk from './useRelaySdk';

// constants
import { STABLE_CURRENCIES } from '../constants/tokens';

// types
import { SelectedToken } from '../types/tokens';

// utils
import { Token } from '../../../services/tokensData';
import { getNetworkViem } from '../../deposit/utils/blockchain';
import { toWei } from '../../the-exchange/utils/blockchain';
import { getWrappedTokenAddressIfNative } from '../../the-exchange/utils/wrappedTokens';

export interface BuyOffer {
  tokenAmountToReceive: number;
  minimumReceive: number;
  slippageTolerance: number;
  priceImpact?: number;
  offer: Execute;
}

interface BuyParams {
  toAmount: string;
  toTokenAddress: string;
  toChainId: number;
  toTokenDecimals: number;
  fromChainId: number;
  slippage?: number;
}

export default function useRelayBuy() {
  const { isInitialized, accountAddress } = useRelaySdk();
  const { kit, walletAddress } = useTransactionKit();
  const { setTransactionMetaForName } = useGlobalTransactionsBatch();
  const { transactionDebugLog } = useTransactionDebugLogger();
  const { isZeroAddress } = EtherspotUtils;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Check if token allowance is set for a specific spender
   * This function verifies if the wallet has approved a contract to spend tokens
   */
  const isAllowanceSet = async ({
    owner,
    spender,
    tokenAddress,
    chainId,
  }: {
    owner: string;
    spender: string;
    tokenAddress: string;
    chainId: number;
  }) => {
    if (isZeroAddress(tokenAddress)) return undefined;

    // Validate inputs
    if (!owner || !spender || !tokenAddress) {
      console.warn('Invalid inputs for allowance check:', {
        owner,
        spender,
        tokenAddress,
      });
      return undefined;
    }

    try {
      const publicClient = createPublicClient({
        chain: getNetworkViem(chainId),
        transport: http(),
      });

      const allowance = await publicClient.readContract({
        address: tokenAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [owner as `0x${string}`, spender as `0x${string}`],
      });

      return allowance === BigInt(0) ? undefined : allowance;
    } catch (e) {
      console.error('Failed to check token allowance:', e);
      return undefined;
    }
  };

  // Clear errors when SDK initializes successfully
  useEffect(() => {
    if (isInitialized) {
      setError(null);
    }
  }, [isInitialized]);

  /**
   * Get the USDC address for a specific chain
   */
  const getUSDCAddress = (chainId: number): string | null => {
    const stableCurrency = STABLE_CURRENCIES.find(
      (currency) => currency.chainId === chainId
    );
    return stableCurrency?.address || null;
  };

  /**
   * Get the best buy offer for swapping USDC to a target token
   * Takes 1% fee from USDC amount before the swap, then swaps 99% USDC for the target token
   */
  const getBestOffer = useCallback(
    async ({
      toAmount,
      toTokenAddress,
      toChainId,
      toTokenDecimals,
      fromChainId,
      slippage = 0.03,
    }: BuyParams): Promise<BuyOffer | null> => {
      if (!isInitialized) {
        setError('Unable to get quote. Please try again.');
        return null;
      }

      const usdcAddress = getUSDCAddress(fromChainId);
      if (!usdcAddress) {
        setError('Unable to get quote. Please try again.');
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        /**
         * Step 1: Handle wrapped token conversion
         * Replace native token addresses with their wrapped equivalents
         */
        const toTokenAddressWithWrappedCheck = getWrappedTokenAddressIfNative(
          toTokenAddress,
          toChainId
        );

        /**
         * Step 2: Convert amount to wei for processing
         * This is the desired output amount the user wants to receive
         */
        const toAmountInWei = parseUnits(toAmount, toTokenDecimals);

        // Create quote request for Relay SDK
        // Handle native ETH - use zero address instead of 0xeeee...
        const normalizedToTokenAddress =
          toTokenAddressWithWrappedCheck ===
          '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
            ? '0x0000000000000000000000000000000000000000'
            : toTokenAddressWithWrappedCheck;

        const quoteRequest = {
          user: accountAddress,
          chainId: fromChainId,
          currency: usdcAddress,
          toChainId,
          toCurrency: normalizedToTokenAddress,
          amount: toAmountInWei.toString(),
          tradeType: 'EXACT_OUTPUT' as const, // We want exact output amount
          slippageTolerance: Math.floor(slippage * 10000), // Convert to basis points
          recipient: accountAddress,
        };

        // Get quote from Relay SDK
        const client = getClient();
        const quote = await client.actions.getQuote(quoteRequest);

        // Check for errors in the quote response
        if (quote?.errors && quote.errors.length > 0) {
          setError('Unable to get quote. Please try again.');
          return null;
        }

        if (quote && quote.details?.currencyIn) {
          // Extract USDC amount needed from the quote response
          const { currencyIn } = quote.details;
          let usdcNeeded = 0;
          let maximumAmount = 0;

          // Get the estimated USDC amount needed (prefer formatted, fallback to raw amount)
          if (currencyIn.amountFormatted) {
            usdcNeeded = parseFloat(currencyIn.amountFormatted);
          } else if (currencyIn.amount) {
            // Convert from raw units to readable format
            usdcNeeded = parseFloat(currencyIn.amount) / 10 ** 6; // USDC has 6 decimals
          }

          // Calculate maximum amount with slippage tolerance
          // For EXACT_OUTPUT trades, we need to consider slippage on the input (USDC)
          maximumAmount = usdcNeeded * (1 + slippage);

          // Validate the quote
          if (usdcNeeded <= 0) {
            setError('Unable to get quote. Please try again.');
            return null;
          }

          // Note: Platform fee (1%) will be deducted from USDC before swap
          // This is handled in buildTransactions function

          // Calculate price impact
          let priceImpact: number | undefined;

          // Try to get price impact from Relay API first
          if (quote.details?.totalImpact?.percent) {
            priceImpact = parseFloat(quote.details.totalImpact.percent);
          } else if (quote.details?.swapImpact?.percent) {
            priceImpact = parseFloat(quote.details.swapImpact.percent);
          } else {
            // Fallback: Calculate price impact manually
            const tokenAmountInUsd =
              parseFloat(toAmount) *
              (quote.details?.currencyOut?.amountUsd
                ? parseFloat(quote.details.currencyOut.amountUsd)
                : 0);
            if (tokenAmountInUsd > 0) {
              priceImpact =
                ((usdcNeeded - tokenAmountInUsd) / usdcNeeded) * 100;
            }
          }

          const buyOffer: BuyOffer = {
            tokenAmountToReceive: parseFloat(toAmount),
            minimumReceive: parseFloat(toAmount) * (1 - slippage),
            slippageTolerance: slippage,
            priceImpact,
            offer: quote,
          };

          return buyOffer;
        }

        // No quote found
        setError('Unable to get quote. Please try again.');
        return null;
      } catch (err) {
        console.error('Failed to get buy offer from Relay:', err);

        setError('Unable to get quote. Please try again.');

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isInitialized, accountAddress]
  );

  /**
   * Build transactions from Relay quote for smart account execution
   * Takes 1% fee from USDC before the swap, then swaps remaining 99% for target token
   * Includes allowance checks and USDC fee capture
   */
  const buildTransactions = useCallback(
    async (
      buyOffer: BuyOffer,
      token: SelectedToken,
      amount: string,
      fromChainId: number,
      userPortfolio?: Token[]
    ) => {
      const transactions = [];

      const { steps } = buyOffer.offer;

      if (!steps || steps.length === 0) {
        throw new Error('No execution steps found in Relay quote');
      }

      /**
       * Step 1: Fee calculation and validation
       * For buy operations: Take 1% fee from USDC, then swap 99% USDC for target token
       */
      const feeReceiver = import.meta.env.VITE_SWAP_FEE_RECEIVER;

      // Validate fee receiver address
      if (!feeReceiver) {
        throw new Error('Fee receiver address is not configured');
      }

      // Get USDC address for the chain
      const usdcAddress = getUSDCAddress(fromChainId);
      if (!usdcAddress) {
        throw new Error('USDC address not found for chain');
      }

      // Calculate fee distribution: 1% fee, 99% for swap
      // Get the USDC amount needed for the swap from the quote
      const usdcNeededForSwap = BigInt(
        buyOffer.offer.details?.currencyIn?.amount || '0'
      );

      // Calculate total USDC needed (including 1% fee)
      // Formula: totalUsdc = usdcForSwap / 0.99
      const totalUsdcNeeded =
        (usdcNeededForSwap * BigInt(100)) / BigInt(99);
      const usdcFeeAmount = totalUsdcNeeded - usdcNeededForSwap; // 1% fee

      // Debug: Log fee calculation for troubleshooting
      transactionDebugLog('Fee calculation:', {
        totalUsdcNeeded: totalUsdcNeeded.toString(),
        usdcFeeAmount: usdcFeeAmount.toString(),
        usdcNeededForSwap: usdcNeededForSwap.toString(),
      });

      // Validate USDC amounts
      if (usdcFeeAmount <= BigInt(0) || usdcNeededForSwap <= BigInt(0)) {
        throw new Error(
          'Invalid USDC fee calculation: amounts must be greater than 0'
        );
      }

      if (usdcFeeAmount + usdcNeededForSwap !== totalUsdcNeeded) {
        throw new Error(
          'USDC fee calculation error: amounts do not add up correctly'
        );
      }

      /**
       * Step 2: Balance checks
       * Verify user has sufficient USDC balance
       */
      let userUsdcBalance = BigInt(0);
      try {
        // Get USDC balance from portfolio
        const usdcToken = userPortfolio?.find(
          (t) => t.contract.toLowerCase() === usdcAddress.toLowerCase() &&
                 t.blockchain === `chain-${fromChainId}`
        );
        if (usdcToken && usdcToken.balance) {
          userUsdcBalance = toWei(usdcToken.balance.toString(), 6); // USDC has 6 decimals
        }

        // Debug: Log balance validation only if there's an issue
        if (userUsdcBalance < totalUsdcNeeded) {
          transactionDebugLog('Insufficient USDC balance:', {
            required: totalUsdcNeeded.toString(),
            available: userUsdcBalance.toString(),
          });
        }
      } catch (e) {
        console.warn(
          'Unable to fetch USDC balance from portfolio, skipping balance validation:',
          e
        );
        // Skip balance validation if portfolio is not available
        userUsdcBalance = BigInt(0);
      }

      // Validate USDC balance
      if (userUsdcBalance > BigInt(0) && userUsdcBalance < totalUsdcNeeded) {
        throw new Error(
          'Insufficient USDC balance to cover swap and fee.'
        );
      }

      /**
       * Step 3: USDC Fee Transfer (before swap)
       * Transfer 1% of USDC to fee receiver before the swap
       */
      if (totalUsdcNeeded > BigInt(0) && usdcFeeAmount > BigInt(0)) {
        const feeTransferCalldata = encodeFunctionData({
          abi: erc20Abi,
          functionName: 'transfer',
          args: [feeReceiver as `0x${string}`, usdcFeeAmount],
        });

        const feeTransferStep = {
          to: usdcAddress,
          value: BigInt(0),
          data: feeTransferCalldata,
          chainId: fromChainId,
        };

        transactions.push({
          ...feeTransferStep,
          stepIndex: -1, // Before all swap steps
          itemIndex: 0,
          stepDescription: 'USDC Fee Transfer',
          transactionType: 'usdc_fee_transfer',
        });

        transactionDebugLog('Pushed USDC fee transfer (1% to fee receiver):', {
          ...feeTransferStep,
          usdcFeeAmount: usdcFeeAmount.toString(),
          recipient: feeReceiver,
        });
      } else {
        transactionDebugLog(
          'Skipping USDC fee transfer - no fee amount to transfer'
        );
      }

      /**
       * Step 4: Check if Relay SDK provides approval step first
       * If Relay SDK has an approval step (id: "approve"), use it instead of adding our own
       */
      const hasRelayApprovalStep = steps.some((step) => step.id === 'approve');

      if (!hasRelayApprovalStep) {
        // Find the spender address from the swap steps (Relay contract)
        let spenderAddress = '';
        for (let i = 0; i < steps.length; i += 1) {
          const step = steps[i];
          if (
            step.kind === 'transaction' &&
            step.items &&
            step.items.length > 0
          ) {
            for (let j = 0; j < step.items.length; j += 1) {
              const item = step.items[j];
              if (item.data?.to && item.data.to !== usdcAddress) {
                spenderAddress = item.data.to;
                break;
              }
            }
            if (spenderAddress) break;
          }
        }

        if (spenderAddress) {
          // Check if approval is needed for USDC
          const isAllowance = await isAllowanceSet({
            owner: walletAddress || '',
            spender: spenderAddress,
            tokenAddress: usdcAddress,
            chainId: fromChainId,
          });

          const isEnoughAllowance = isAllowance
            ? isAllowance >= usdcNeededForSwap
            : undefined;

          if (!isEnoughAllowance) {
            // Add approval for USDC (only for the amount needed for swap, not including fee)
            const calldata = encodeFunctionData({
              abi: [
                {
                  inputs: [
                    {
                      internalType: 'address',
                      name: 'spender',
                      type: 'address',
                    },
                    {
                      internalType: 'uint256',
                      name: 'value',
                      type: 'uint256',
                    },
                  ],
                  name: 'approve',
                  outputs: [
                    {
                      internalType: 'bool',
                      name: '',
                      type: 'bool',
                    },
                  ],
                  stateMutability: 'nonpayable',
                  type: 'function',
                },
              ],
              functionName: 'approve',
              args: [spenderAddress as `0x${string}`, usdcNeededForSwap],
            });

            transactions.push({
              data: calldata,
              value: BigInt(0),
              to: usdcAddress,
              chainId: fromChainId,
              transactionType: 'approval',
              stepDescription: 'Approve USDC',
            });

            transactionDebugLog('Added USDC approval:', {
              tokenAddress: usdcAddress,
              spender: spenderAddress,
              amount: usdcNeededForSwap.toString(),
            });
          }
        }
      }

      /**
       * Step 5: Process route steps (use Relay SDK approval when available)
       * Handle each step in the swap route
       */
      try {
        for (let i = 0; i < steps.length; i += 1) {
          const step = steps[i];

          if (
            step.kind === 'transaction' &&
            step.items &&
            step.items.length > 0
          ) {
            for (let j = 0; j < step.items.length; j += 1) {
              const item = step.items[j];

              if (item.data) {
                const { to, value, data, chainId } = item.data;

                const bigIntValue =
                  typeof value === 'string'
                    ? BigInt(value)
                    : BigInt(value || 0);

                // Handle approval transactions from Relay SDK
                const isApprovalStep = step.id === 'approve';

                if (isApprovalStep) {
                  // This is a Relay SDK approval step - use it with proper metadata
                  const transaction = {
                    chainId,
                    to: to as `0x${string}`,
                    value: bigIntValue,
                    data: data || '0x',
                  };

                  transactions.push({
                    ...transaction,
                    stepIndex: i,
                    itemIndex: j,
                    stepDescription: step.description || 'Approve USDC',
                    transactionType: 'approval',
                  });

                  transactionDebugLog('Added Relay SDK approval transaction:', {
                    stepIndex: i,
                    itemIndex: j,
                    to,
                    value: bigIntValue.toString(),
                    dataLength: data?.length || 0,
                    stepDescription: step.description || 'Approve USDC',
                    stepId: step.id,
                  });
                } else {
                  // Add non-approval transactions (swap, transfer, etc.)
                  const transaction = {
                    chainId,
                    to: to as `0x${string}`,
                    value: bigIntValue,
                    data: data || '0x',
                  };

                  transactions.push({
                    ...transaction,
                    stepIndex: i,
                    itemIndex: j,
                    stepDescription: step.description || `Step ${i + 1}`,
                  });

                  transactionDebugLog('Added transaction:', {
                    stepIndex: i,
                    itemIndex: j,
                    to,
                    value: bigIntValue.toString(),
                    dataLength: data?.length || 0,
                    stepDescription: step.description || `Step ${i + 1}`,
                  });
                }
              }
            }
          }
        }
      } catch (e) {
        console.error('Failed to get step transactions:', e);
        throw e;
      }

      return transactions;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isAllowanceSet, walletAddress]
  );

  /**
   * Execute the buy transaction by building and submitting to batch
   */
  const executeBuy = async (
    token: SelectedToken,
    amount: string,
    fromChainId: number,
    userPortfolio?: Token[]
  ): Promise<boolean | string> => {
    if (!isInitialized || !accountAddress || !walletAddress) {
      setError('Unable to execute transaction. Please try again.');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      transactionDebugLog('Starting buy execution', {
        token: token.symbol,
        amount,
        chainId: token.chainId,
        walletAddress,
      });

      // Get the buy offer
      const buyOffer = await getBestOffer({
        toAmount: amount,
        toTokenAddress: token.address,
        toChainId: token.chainId,
        toTokenDecimals: token.decimals,
        fromChainId,
      });

      if (!buyOffer) {
        setError('Unable to execute transaction. Please try again.');
        return false;
      }

      transactionDebugLog('Buy quote obtained:', buyOffer);

      const transactions = await buildTransactions(
        buyOffer,
        token,
        amount,
        fromChainId,
        userPortfolio
      );

      if (transactions.length === 0) {
        setError('No transactions to execute. Please try again.');
        return false;
      }

      // Add each transaction to the batch in order
      // Fee transfer first, then approvals, then swap transactions
      for (let i = 0; i < transactions.length; i += 1) {
        const tx = transactions[i];

        // Validate transaction before adding to batch
        if (!tx.to || !tx.data) {
          console.error(`Invalid transaction at index ${i}:`, tx);
          throw new Error(
            `Invalid transaction at index ${i}: missing 'to' or 'data'`
          );
        }

        // Create unique transaction name
        const transactionName = `pulse-buy-${token.chainId}-${tx.data.slice(0, 10)}-${i}`;
        const batchName = `pulse-buy-batch-${token.chainId}`;

        transactionDebugLog(
          `Adding transaction ${i + 1}/${transactions.length} to batch:`,
          {
            transactionName,
            batchName,
            to: tx.to,
            value: tx.value?.toString(),
            dataLength: tx.data?.length,
            chainId: tx.chainId,
            stepDescription: tx.stepDescription,
            transactionType: tx.transactionType,
          }
        );

        try {
          // Add transaction to smart account batch
          // Transactions execute in the order they are added to the batch
          kit
            .transaction({
              chainId: tx.chainId,
              to: tx.to,
              value: tx.value,
              data: tx.data,
            })
            .name({ transactionName })
            .addToBatch({ batchName });

          transactionDebugLog(
            `Successfully added transaction ${i + 1} to batch`
          );
        } catch (e) {
          console.error(`Failed to add transaction ${i + 1} to batch:`, e);
          throw new Error(`Failed to add transaction ${i + 1} to batch: ${e}`);
        }

        // Set transaction metadata
        const usdcNeeded = buyOffer.offer.details?.currencyIn?.amountFormatted || '0';
        const title =
          transactions.length === 1
            ? `Buy ${amount} ${token.symbol} with USDC`
            : `Buy ${amount} ${token.symbol} - Step ${i + 1}/${transactions.length}`;

        const stepDescription = tx.stepDescription || `Transaction ${i + 1}`;
        const description = `Buying ${amount} ${token.symbol} with ${usdcNeeded} USDC on ${stepDescription}`;

        setTransactionMetaForName(transactionName, {
          title,
          description,
        });
      }

      transactionDebugLog('All transactions added to batch successfully', {
        totalTransactions: transactions.length,
        batchName: `pulse-buy-batch-${token.chainId}`,
      });

      return true;
    } catch (err) {
      console.error('Failed to execute buy:', err);

      // Provide more specific error messages
      let errorMessage = 'Unable to execute transaction. Please try again.';

      if (err instanceof Error) {
        if (err.message.includes('Invalid transaction')) {
          errorMessage =
            'Transaction validation failed. Please check your inputs.';
        } else if (err.message.includes('Failed to add transaction')) {
          errorMessage =
            'Failed to prepare transaction batch. Please try again.';
        } else if (err.message.includes('Insufficient')) {
          errorMessage = err.message;
        } else {
          errorMessage = `Transaction failed: ${err.message}`;
        }
      }

      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Build buy transactions for gas estimation only
   * Returns transactions without adding them to batch
   */
  const buildBuyTransactionsForEstimation = useCallback(
    async (
      buyOffer: BuyOffer,
      token: SelectedToken,
      amount: string,
      fromChainId: number,
      userPortfolio?: Token[]
    ) => {
      // Reuse the existing buildTransactions logic
      return buildTransactions(
        buyOffer,
        token,
        amount,
        fromChainId,
        userPortfolio
      );
    },
    [buildTransactions]
  );

  return {
    getUSDCAddress,
    getBestOffer,
    executeBuy,
    buildTransactions,
    buildBuyTransactionsForEstimation,
    isLoading,
    error,
    isInitialized,
    clearError,
  };
}

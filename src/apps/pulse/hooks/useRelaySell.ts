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
import {
  getNativeBalanceFromPortfolio,
  toWei,
} from '../../the-exchange/utils/blockchain';
import {
  getWrappedTokenAddressIfNative,
  isNativeToken,
  isWrappedToken,
} from '../../the-exchange/utils/wrappedTokens';

export interface SellOffer {
  tokenAmountToReceive: number;
  minimumReceive: number;
  slippageTolerance: number;
  priceImpact?: number;
  offer: Execute;
}

interface SellParams {
  fromAmount: string;
  fromTokenAddress: string;
  fromChainId: number;
  fromTokenDecimals: number;
  toChainId: number;
  slippage?: number;
}

export default function useRelaySell() {
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
  const isAllowanceSet = useCallback(
    async ({
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
        return undefined;
      }
    },
    [isZeroAddress]
  );

  // Clear errors when SDK initializes successfully
  useEffect(() => {
    if (isInitialized) {
      setError(null);
    }
  }, [isInitialized]);

  /**
   * Get the USDC address for a specific chain
   */
  const getUSDCAddress = useCallback((chainId: number): string | null => {
    const stableCurrency = STABLE_CURRENCIES.find(
      (currency) => currency.chainId === chainId
    );
    return stableCurrency?.address || null;
  }, []);

  /**
   * Get the best sell offer for swapping a token to USDC
   * Swaps 100% of the token amount, then takes 1% of received USDC as a PillarX fee
   * User receives at the end 99% of the USDC amount received from the swap
   */
  const getBestSellOffer = useCallback(
    async ({
      fromAmount,
      fromTokenAddress,
      fromChainId,
      fromTokenDecimals,
      toChainId,
      slippage = 0.03,
    }: SellParams): Promise<SellOffer | null> => {
      if (!isInitialized) {
        setError('Unable to get quote. Please try again.');
        return null;
      }

      const usdcAddress = getUSDCAddress(toChainId);
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
        const fromTokenAddressWithWrappedCheck = getWrappedTokenAddressIfNative(
          fromTokenAddress,
          fromChainId
        );

        /**
         * Step 2: Convert amount to wei for processing
         * We will swap 100% of the token amount, then take 1% of the received USDC as fee
         */
        const fromAmountInWei = parseUnits(fromAmount, fromTokenDecimals);

        // Create quote request for Relay SDK
        // Handle native ETH - use zero address instead of 0xeeee...
        const normalizedFromTokenAddress =
          fromTokenAddressWithWrappedCheck ===
          '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
            ? '0x0000000000000000000000000000000000000000'
            : fromTokenAddressWithWrappedCheck;

        const quoteRequest = {
          user: accountAddress,
          chainId: fromChainId,
          currency: normalizedFromTokenAddress,
          toChainId,
          toCurrency: usdcAddress,
          amount: fromAmountInWei.toString(), // Use full amount - we'll take fee from USDC output
          tradeType: 'EXACT_INPUT' as const,
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

        if (quote && quote.details?.currencyOut) {
          // Extract USDC amount from the quote response
          const { currencyOut } = quote.details;
          let usdcAmount = 0;
          let minimumAmount = 0;

          // Get the estimated amount (prefer formatted, fallback to raw amount)
          if (currencyOut.amountFormatted) {
            usdcAmount = parseFloat(currencyOut.amountFormatted);
          } else if (currencyOut.amount) {
            // Convert from raw units to readable format
            usdcAmount = parseFloat(currencyOut.amount) / 10 ** 6; // USDC has 6 decimals
          }

          // Get the minimum amount (prefer formatted, fallback to raw amount)
          if (currencyOut.minimumAmount) {
            // minimumAmount is in raw units, convert to readable format
            minimumAmount = parseFloat(currencyOut.minimumAmount) / 10 ** 6; // USDC has 6 decimals
          } else {
            // Fallback: calculate minimum receive using slippage tolerance
            // Formula: Minimum to receive = Est. to amount × (1 - max.slippage)
            minimumAmount = usdcAmount * (1 - slippage);
          }

          // Validate the quote
          if (usdcAmount <= 0) {
            setError('Unable to get quote. Please try again.');
            return null;
          }

          // Apply platform fee (1%) to both estimated and minimum amounts
          // The fee should be calculated on the actual amounts, not overridden
          const userReceivesAmount = usdcAmount * 0.99;
          const userMinimumReceive = minimumAmount * 0.99;

          // Calculate price impact on raw swap amounts (before platform fee)
          // This shows the actual market impact, separate from our platform fee
          let priceImpact: number | undefined;

          // Try to get price impact from Relay API first
          if (quote.details?.totalImpact?.percent) {
            priceImpact = parseFloat(quote.details.totalImpact.percent);
          } else if (quote.details?.swapImpact?.percent) {
            priceImpact = parseFloat(quote.details.swapImpact.percent);
          } else {
            // Fallback: Calculate price impact manually using raw swap amounts
            // Price Impact (%) = (Total Paid Value - Total Received Value) / Total Paid Value × 100
            // For sell operations:
            // Total Paid Value = Token amount in USD (estimated from input amount)
            // Total Received Value = USDC amount received from swap (before platform fee)
            const tokenAmountInUsd =
              parseFloat(fromAmount) *
              (quote.details?.currencyIn?.amountUsd
                ? parseFloat(quote.details.currencyIn.amountUsd)
                : 0);
            if (tokenAmountInUsd > 0) {
              // Use the raw USDC amount from the swap (before our 1% fee)
              priceImpact =
                ((tokenAmountInUsd - usdcAmount) / tokenAmountInUsd) * 100;
            }
          }

          const sellOffer: SellOffer = {
            tokenAmountToReceive: userReceivesAmount,
            minimumReceive: userMinimumReceive,
            slippageTolerance: slippage,
            priceImpact,
            offer: quote,
          };

          return sellOffer;
        }

        // No quote found
        setError('Unable to get quote. Please try again.');
        return null;
      } catch (err) {
        console.error('Failed to get sell offer from Relay:', err);

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
   * Swaps 100% of token amount, then transfers 1% of received USDC to fee receiver
   * Includes allowance checks, wrapping logic, and USDC fee capture
   */
  const buildSellTransactions = useCallback(
    async (
      sellOffer: SellOffer,
      token: SelectedToken,
      amount: string,
      userPortfolio?: Token[]
    ) => {
      const transactions = [];

      const { steps } = sellOffer.offer;

      if (!steps || steps.length === 0) {
        throw new Error('No execution steps found in Relay quote');
      }

      /**
       * Step 1: Determine if wrapping is required
       * Check if the route requires wrapped tokens but user has native tokens
       */
      const isWrapRequired =
        isWrappedToken(
          sellOffer.offer.details?.currencyIn?.currency?.address || '',
          token.chainId
        ) && !isWrappedToken(token.address, token.chainId);

      const fromAmountBigInt = parseUnits(amount, token.decimals);

      /**
       * Step 2: Fee calculation and validation
       * For sell operations: Swap 100% of token, then split USDC 99% to user, 1% to fee receiver
       * Fee is calculated on the actual USDC received (after slippage, price impact, etc.)
       */
      const feeReceiver = import.meta.env.VITE_SWAP_FEE_RECEIVER;

      // Validate fee receiver address
      if (!feeReceiver) {
        throw new Error('Fee receiver address is not configured');
      }

      // Get USDC address for the chain
      const usdcAddress = getUSDCAddress(token.chainId);
      if (!usdcAddress) {
        throw new Error('USDC address not found for chain');
      }

      // Calculate fee distribution: 99% to user, 1% to fee receiver
      // We swap 100% of the token, then take 1% of the received USDC as fee
      // Use the guaranteed minimum USDC received from the swap (slippage-protected)
      // The amount is already in wei format (6 decimals for USDC)
      // Note: We prefer minimumAmount to avoid overdrawing when slippage occurs, fallback to amount
      const actualUsdcReceived = BigInt(
        sellOffer.offer.details?.currencyOut?.minimumAmount ||
          sellOffer.offer.details?.currencyOut?.amount ||
          '0'
      );
      const usdcFeeAmount = (actualUsdcReceived * BigInt(1)) / BigInt(100); // 1% to fee receiver
      const usdcUserAmount = actualUsdcReceived - usdcFeeAmount; // 99% to user

      // Debug: Log fee calculation for troubleshooting
      transactionDebugLog('Fee calculation:', {
        actualUsdcReceived: actualUsdcReceived.toString(),
        usdcFeeAmount: usdcFeeAmount.toString(),
        usdcUserAmount: usdcUserAmount.toString(),
      });

      // Validate USDC amounts
      if (usdcFeeAmount <= BigInt(0) || usdcUserAmount <= BigInt(0)) {
        throw new Error(
          'Invalid USDC fee calculation: amounts must be greater than 0'
        );
      }

      if (usdcFeeAmount + usdcUserAmount !== actualUsdcReceived) {
        throw new Error(
          'USDC fee calculation error: amounts do not add up correctly'
        );
      }

      const fromTokenChainId = token.chainId;
      const userSelectedNative = isNativeToken(token.address);

      /**
       * Step 3: Balance checks
       * Verify user has sufficient balance for swap and wrapping (if needed)
       */
      let userNativeBalance = BigInt(0);
      try {
        // Get native balance from portfolio
        const nativeBalance =
          getNativeBalanceFromPortfolio(userPortfolio, fromTokenChainId) || '0';
        userNativeBalance = toWei(nativeBalance, 18);

        // Debug: Log balance validation only if there's an issue
        if (userNativeBalance < fromAmountBigInt) {
          transactionDebugLog('Insufficient balance:', {
            required: fromAmountBigInt.toString(),
            available: userNativeBalance.toString(),
          });
        }
      } catch (e) {
        console.warn(
          'Unable to fetch balances from portfolio, skipping balance validation:',
          e
        );
        // Skip balance validation if portfolio is not available
        userNativeBalance = BigInt(0);
      }

      // Calculate total required for native tokens (swap + wrapping if needed)
      if (userSelectedNative && userNativeBalance > BigInt(0)) {
        let totalNativeRequired = fromAmountBigInt;
        if (isWrapRequired) {
          totalNativeRequired += fromAmountBigInt; // wrapping step uses swap amount
        }

        // Debug: Log native balance check only if insufficient
        if (userNativeBalance < totalNativeRequired) {
          transactionDebugLog('Insufficient native balance:', {
            required: totalNativeRequired.toString(),
            available: userNativeBalance.toString(),
            isWrapRequired,
          });
        }

        if (userNativeBalance < totalNativeRequired) {
          throw new Error(
            'Insufficient native token balance to cover swap and wrapping.'
          );
        }
      } else if (userSelectedNative && userNativeBalance === BigInt(0)) {
        // If we can't get the balance, only warn if portfolio was actually provided
        // (if portfolio is undefined/empty, balance validation is expected to be skipped)
        if (userPortfolio && userPortfolio.length > 0) {
          console.warn(
            'Could not validate native balance - proceeding with transaction'
          );
        }
      }

      /**
       * Step 5: Wrap transaction (if required)
       * If the route requires wrapped tokens but user has native tokens,
       * add a wrapping transaction
       */
      if (isWrapRequired) {
        const wrappedTokenAddress = getWrappedTokenAddressIfNative(
          token.address,
          token.chainId
        );
        if (!wrappedTokenAddress) {
          throw new Error('Wrapped token address not found');
        }

        const wrapCalldata = encodeFunctionData({
          abi: [
            {
              name: 'deposit',
              type: 'function',
              stateMutability: 'payable',
              inputs: [],
              outputs: [],
            },
          ],
          functionName: 'deposit',
        });

        transactions.push({
          to: wrappedTokenAddress, // wrapped token address
          data: wrapCalldata,
          value: fromAmountBigInt,
          chainId: fromTokenChainId,
        });
        transactionDebugLog('Pushed wrap transaction:', {
          to: wrappedTokenAddress,
          value: fromAmountBigInt,
          chainId: fromTokenChainId,
        });
      }

      /**
       * Step 6: Check if Relay SDK provides approval step first
       * If Relay SDK has an approval step (id: "approve"), use it instead of adding our own
       */
      const hasRelayApprovalStep = steps.some((step) => step.id === 'approve');

      if (!hasRelayApprovalStep) {
        if (isWrapRequired) {
          // After wrapping, we need to approve the wrapped token for the swap
          // Get the wrapped token address
          const wrappedTokenAddress = getWrappedTokenAddressIfNative(
            token.address,
            token.chainId
          );
          if (!wrappedTokenAddress) {
            throw new Error('Wrapped token address not found');
          }

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
                if (item.data?.to && item.data.to !== wrappedTokenAddress) {
                  spenderAddress = item.data.to;
                  break;
                }
              }
              if (spenderAddress) break;
            }
          }

          if (spenderAddress) {
            // Check if approval is needed for the wrapped token
            const isAllowance = await isAllowanceSet({
              owner: walletAddress || '',
              spender: spenderAddress,
              tokenAddress: wrappedTokenAddress,
              chainId: fromTokenChainId,
            });

            const isEnoughAllowance = isAllowance
              ? isAllowance >= fromAmountBigInt
              : undefined;

            if (!isEnoughAllowance) {
              // Add approval for wrapped token
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
                args: [spenderAddress as `0x${string}`, fromAmountBigInt],
              });

              transactions.push({
                data: calldata,
                value: BigInt(0),
                to: wrappedTokenAddress,
                chainId: fromTokenChainId,
                transactionType: 'approval',
                stepDescription: `Approve ${token.symbol} (wrapped)`,
              });

              transactionDebugLog('Added wrapped token approval:', {
                wrappedTokenAddress,
                spender: spenderAddress,
                amount: fromAmountBigInt.toString(),
              });
            }
          }
        } else {
          // For regular ERC20 tokens (not wrapped), we need to approve the token directly
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
                if (item.data?.to && item.data.to !== token.address) {
                  spenderAddress = item.data.to;
                  break;
                }
              }
              if (spenderAddress) break;
            }
          }

          if (spenderAddress) {
            // Check if approval is needed for the ERC20 token
            const isAllowance = await isAllowanceSet({
              owner: walletAddress || '',
              spender: spenderAddress,
              tokenAddress: token.address,
              chainId: fromTokenChainId,
            });

            const isEnoughAllowance = isAllowance
              ? isAllowance >= fromAmountBigInt
              : undefined;

            if (!isEnoughAllowance) {
              // Add approval for ERC20 token
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
                args: [spenderAddress as `0x${string}`, fromAmountBigInt],
              });

              transactions.push({
                data: calldata,
                value: BigInt(0),
                to: token.address,
                chainId: fromTokenChainId,
                transactionType: 'approval',
                stepDescription: `Approve ${token.symbol}`,
              });

              transactionDebugLog('Added ERC20 token approval:', {
                tokenAddress: token.address,
                spender: spenderAddress,
                amount: fromAmountBigInt.toString(),
              });
            }
          }
        }
      }

      /**
       * Step 7: Process route steps (use Relay SDK approval when available)
       * Handle each step in the swap route, but skip approval checks since we handle them separately
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
                    stepDescription:
                      step.description || `Approve ${token.symbol}`,
                    transactionType: 'approval',
                  });

                  transactionDebugLog('Added Relay SDK approval transaction:', {
                    stepIndex: i,
                    itemIndex: j,
                    to,
                    value: bigIntValue.toString(),
                    dataLength: data?.length || 0,
                    stepDescription:
                      step.description || `Approve ${token.symbol}`,
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

      /**
       * Step 8: USDC Fee Transfer (after all swap steps complete)
       * Transfer 1% of received USDC to fee receiver
       * Note: This must happen AFTER the swap completes and smart account has USDC
       */

      // Add USDC fee transfer to the batch
      // The smart account will have USDC after the swap completes
      if (actualUsdcReceived > BigInt(0) && usdcFeeAmount > BigInt(0)) {
        const feeTransferCalldata = encodeFunctionData({
          abi: erc20Abi,
          functionName: 'transfer',
          args: [feeReceiver as `0x${string}`, usdcFeeAmount], // 1% to fee receiver
        });

        const feeTransferStep = {
          to: usdcAddress,
          value: BigInt(0),
          data: feeTransferCalldata,
          chainId: fromTokenChainId,
        };

        transactions.push({
          ...feeTransferStep,
          stepIndex: steps.length, // Add after all swap steps
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

      return transactions;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isAllowanceSet, walletAddress]
  );

  /**
   * Execute the sell transaction by building and submitting to batch
   */
  const executeSell = async (
    token: SelectedToken,
    amount: string,
    toChainId: number,
    userPortfolio?: Token[]
  ): Promise<boolean | string> => {
    if (!isInitialized || !accountAddress || !walletAddress) {
      setError('Unable to execute transaction. Please try again.');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      transactionDebugLog('Starting sell execution', {
        token: token.symbol,
        amount,
        chainId: token.chainId,
        walletAddress,
      });

      let transactions = [];
      let sellOffer;

      if (token.chainId === toChainId) {
        // Get the sell offer
        sellOffer = await getBestSellOffer({
          fromAmount: amount,
          fromTokenAddress: token.address,
          fromChainId: token.chainId,
          fromTokenDecimals: token.decimals,
          toChainId,
        });

        if (!sellOffer) {
          setError('Unable to execute transaction. Please try again.');
          return false;
        }

        transactionDebugLog('Sell quote obtained:', sellOffer);
        transactions = await buildSellTransactions(
          sellOffer,
          token,
          amount,
          userPortfolio
        );
      } else {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        const result = await buildSellTransactionWithBridge(
          amount,
          token,
          toChainId,
          userPortfolio
        );
        transactions = result.transactions;
        sellOffer = result.finalSellOffer;
      }

      if (transactions.length === 0) {
        setError('No transactions to execute. Please try again.');
        return false;
      }

      // Add each transaction to the batch in order
      // Approvals first, then swap transactions, then USDC fee transfer
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
        const transactionName = `pulse-sell-${token.chainId}-${tx.data.slice(0, 10)}-${i}`;
        const batchName = `pulse-sell-batch-${token.chainId}`;

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
        const title =
          transactions.length === 1
            ? `Sell ${amount} ${token.symbol} for USDC`
            : `Sell ${amount} ${token.symbol} - Step ${i + 1}/${transactions.length}`;

        const stepDescription = tx.stepDescription || `Transaction ${i + 1}`;
        const description = `Selling ${amount} ${token.symbol} for ${sellOffer.tokenAmountToReceive.toFixed(2)} USDC on ${stepDescription}`;

        setTransactionMetaForName(transactionName, {
          title,
          description,
        });
      }

      transactionDebugLog('All transactions added to batch successfully', {
        totalTransactions: transactions.length,
        batchName: `pulse-sell-batch-${token.chainId}`,
      });

      return true;
    } catch (err) {
      console.error('Failed to execute sell:', err);

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

  /**
   * Get the best sell offer with cross-chain bridge
   * This calculates the final amount user will receive after:
   * 1. Swapping token to USDC on same chain
   * 2. Taking 1% fee from received USDC
   * 3. Bridging remaining 99% USDC to target chain
   */
  const getBestSellOfferWithBridge = useCallback(
    async ({
      fromAmount,
      fromTokenAddress,
      fromChainId,
      fromTokenDecimals,
      toChainId,
      slippage = 0.03,
    }: SellParams): Promise<SellOffer | null> => {
      if (!isInitialized) {
        setError('Unable to get quote. Please try again.');
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Step 1: Get quote for token -> USDC on same chain
        const firstSwapOffer = await getBestSellOffer({
          fromAmount,
          fromTokenAddress,
          fromChainId,
          fromTokenDecimals,
          toChainId: fromChainId, // Same chain swap
          slippage,
        });

        if (!firstSwapOffer) {
          setError('Unable to get quote for first swap');
          return null;
        }

        // Step 2: Calculate USDC after first swap and fee (1%)
        // User gets 99% of the USDC from the first swap
        const usdcAfterFirstSwap = firstSwapOffer.tokenAmountToReceive;
        const usdcAfterFee = usdcAfterFirstSwap * 0.99; // 1% fee taken

        // Step 3: Get quote for bridging USDC to target chain
        const usdcAddress = getUSDCAddress(fromChainId);
        if (!usdcAddress) {
          setError('Unable to get USDC address for source chain');
          return null;
        }

        const bridgeOffer = await getBestSellOffer({
          fromAmount: usdcAfterFee.toString(),
          fromTokenAddress: usdcAddress,
          fromChainId,
          fromTokenDecimals: 6,
          toChainId, // Target chain
          slippage,
        });

        if (!bridgeOffer) {
          setError('Unable to get quote for bridge');
          return null;
        }

        // Step 4: Calculate final amounts
        // The bridge offer already includes the 1% fee taken by getBestSellOffer
        // So bridgeOffer.tokenAmountToReceive is what user actually receives
        const finalAmountToReceive = bridgeOffer.tokenAmountToReceive;
        const finalMinimumReceive = bridgeOffer.minimumReceive;

        // Step 5: Calculate combined price impact
        // Price impact from first swap + price impact from bridge
        let combinedPriceImpact: number | undefined;
        if (
          firstSwapOffer.priceImpact !== undefined &&
          bridgeOffer.priceImpact !== undefined
        ) {
          // Combine the two price impacts
          combinedPriceImpact =
            firstSwapOffer.priceImpact + bridgeOffer.priceImpact;
        } else if (firstSwapOffer.priceImpact !== undefined) {
          combinedPriceImpact = firstSwapOffer.priceImpact;
        } else if (bridgeOffer.priceImpact !== undefined) {
          combinedPriceImpact = bridgeOffer.priceImpact;
        }

        // Return the final offer that reflects what user will actually receive
        const finalOffer: SellOffer = {
          tokenAmountToReceive: finalAmountToReceive,
          minimumReceive: finalMinimumReceive,
          slippageTolerance: slippage,
          priceImpact: combinedPriceImpact,
          offer: bridgeOffer.offer, // Use bridge offer as the main offer
        };

        return finalOffer;
      } catch (err) {
        console.error('Failed to get sell offer with bridge:', err);
        setError('Unable to get quote. Please try again.');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [isInitialized, getBestSellOffer, getUSDCAddress]
  );

  /**
   * Build transactions for selling token with cross-chain bridge
   * 1. Swap input token to USDC on same chain
   * 2. Take 1% fee from received USDC
   * 3. Bridge remaining 99% USDC to target chain
   *
   * Note: This function fetches fresh quotes internally. For gas estimation,
   * the quotes may be stale but that's acceptable for estimation purposes.
   */
  const buildSellTransactionWithBridge = useCallback(
    async (
      inputAmount: string,
      fromToken: SelectedToken,
      toChainId: number,
      userPortfolio?: Token[]
    ) => {
      if (!isInitialized) {
        throw new Error(
          'Relay SDK not initialized. Please wait and try again.'
        );
      }

      const transactions = [];
      const fromChainId = fromToken.chainId;

      // ====================================
      // FIRST SWAP: Token -> USDC (same chain)
      // ====================================

      // Step 1: Get quote for token -> USDC on same chain
      // For gas estimation, we need fresh quotes to build accurate transactions
      let firstSwapOffer: SellOffer | null = null;
      try {
        firstSwapOffer = await getBestSellOffer({
          fromAmount: inputAmount,
          fromTokenAddress: fromToken.address,
          fromChainId,
          fromTokenDecimals: fromToken.decimals,
          toChainId: fromChainId, // Same chain swap
        });
      } catch (err) {
        // Error getting first swap quote - will be handled below
      }

      if (!firstSwapOffer) {
        throw new Error(
          'Unable to get quote for first swap. Please try again.'
        );
      }

      const { steps: firstSwapSteps } = firstSwapOffer.offer;

      if (!firstSwapSteps || firstSwapSteps.length === 0) {
        throw new Error('No execution steps found in first swap quote');
      }

      // Step 2: Check if wrapping is required for first swap
      const isWrapRequired =
        isWrappedToken(
          firstSwapOffer.offer.details?.currencyIn?.currency?.address || '',
          fromToken.chainId
        ) && !isWrappedToken(fromToken.address, fromToken.chainId);

      const fromAmountBigInt = parseUnits(inputAmount, fromToken.decimals);

      // Step 3: Get USDC address
      const usdcAddress = getUSDCAddress(fromChainId);
      if (!usdcAddress) {
        throw new Error('USDC address not found for source chain');
      }

      // Step 4: Calculate fee for first swap (1% of USDC received)
      const feeReceiver = import.meta.env.VITE_SWAP_FEE_RECEIVER;
      if (!feeReceiver) {
        throw new Error('Fee receiver address is not configured');
      }

      const actualUsdcReceived = BigInt(
        firstSwapOffer.offer.details?.currencyOut?.minimumAmount ||
          firstSwapOffer.offer.details?.currencyOut?.amount ||
          '0'
      );
      const firstSwapFeeAmount = (actualUsdcReceived * BigInt(1)) / BigInt(100);
      const usdcAfterFirstSwapFee = actualUsdcReceived - firstSwapFeeAmount;

      // Step 5: Balance checks for first swap
      const userSelectedNative = isNativeToken(fromToken.address);
      let userNativeBalance = BigInt(0);

      try {
        const nativeBalance =
          getNativeBalanceFromPortfolio(userPortfolio, fromChainId) || '0';
        userNativeBalance = toWei(nativeBalance, 18);
      } catch (e) {
        console.warn(
          'Unable to fetch balances from portfolio, skipping balance validation:',
          e
        );
      }

      if (userSelectedNative && userNativeBalance > BigInt(0)) {
        let totalNativeRequired = fromAmountBigInt;
        if (isWrapRequired) {
          totalNativeRequired += fromAmountBigInt;
        }

        if (userNativeBalance < totalNativeRequired) {
          throw new Error(
            'Insufficient native token balance to cover swap and wrapping.'
          );
        }
      }

      // Step 6: Add wrap transaction if required
      if (isWrapRequired) {
        const wrappedTokenAddress = getWrappedTokenAddressIfNative(
          fromToken.address,
          fromToken.chainId
        );
        if (!wrappedTokenAddress) {
          throw new Error('Wrapped token address not found');
        }

        const wrapCalldata = encodeFunctionData({
          abi: [
            {
              name: 'deposit',
              type: 'function',
              stateMutability: 'payable',
              inputs: [],
              outputs: [],
            },
          ],
          functionName: 'deposit',
        });

        transactions.push({
          to: wrappedTokenAddress,
          data: wrapCalldata,
          value: fromAmountBigInt,
          chainId: fromChainId,
        });

        transactionDebugLog('Pushed wrap transaction for first swap:', {
          to: wrappedTokenAddress,
          value: fromAmountBigInt.toString(),
          chainId: fromChainId,
        });
      }

      // Step 7: Check for approval in first swap
      const hasFirstSwapRelayApprovalStep = firstSwapSteps.some(
        (step) => step.id === 'approve'
      );

      if (!hasFirstSwapRelayApprovalStep) {
        const tokenToApprove = isWrapRequired
          ? getWrappedTokenAddressIfNative(fromToken.address, fromToken.chainId)
          : fromToken.address;

        if (!tokenToApprove) {
          throw new Error('Token address for approval not found');
        }

        // Find spender address from swap steps
        let spenderAddress = '';
        for (let i = 0; i < firstSwapSteps.length; i += 1) {
          const step = firstSwapSteps[i];
          if (
            step.kind === 'transaction' &&
            step.items &&
            step.items.length > 0
          ) {
            for (let j = 0; j < step.items.length; j += 1) {
              const item = step.items[j];
              if (item.data?.to && item.data.to !== tokenToApprove) {
                spenderAddress = item.data.to;
                break;
              }
            }
            if (spenderAddress) break;
          }
        }

        if (spenderAddress) {
          const isAllowance = await isAllowanceSet({
            owner: walletAddress || '',
            spender: spenderAddress,
            tokenAddress: tokenToApprove,
            chainId: fromChainId,
          });

          const isEnoughAllowance = isAllowance
            ? isAllowance >= fromAmountBigInt
            : undefined;

          if (!isEnoughAllowance) {
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
              args: [spenderAddress as `0x${string}`, fromAmountBigInt],
            });

            transactions.push({
              data: calldata,
              value: BigInt(0),
              to: tokenToApprove,
              chainId: fromChainId,
              transactionType: 'approval',
              stepDescription: `Approve ${fromToken.symbol}`,
            });

            transactionDebugLog('Added approval for first swap:', {
              tokenAddress: tokenToApprove,
              spender: spenderAddress,
              amount: fromAmountBigInt.toString(),
            });
          }
        }
      }

      // Step 8: Add first swap transactions
      for (let i = 0; i < firstSwapSteps.length; i += 1) {
        const step = firstSwapSteps[i];

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
                typeof value === 'string' ? BigInt(value) : BigInt(value || 0);

              const isApprovalStep = step.id === 'approve';

              if (isApprovalStep) {
                transactions.push({
                  chainId,
                  to: to as `0x${string}`,
                  value: bigIntValue,
                  data: data || '0x',
                  stepIndex: i,
                  itemIndex: j,
                  stepDescription:
                    step.description || `Approve ${fromToken.symbol}`,
                  transactionType: 'approval',
                });
              } else {
                transactions.push({
                  chainId,
                  to: to as `0x${string}`,
                  value: bigIntValue,
                  data: data || '0x',
                  stepIndex: i,
                  itemIndex: j,
                  stepDescription: step.description || `Step ${i + 1}`,
                });
              }

              transactionDebugLog('Added first swap transaction:', {
                stepIndex: i,
                itemIndex: j,
                to,
                chainId,
              });
            }
          }
        }
      }

      // Step 9: Add USDC fee transfer (1% from first swap)
      if (actualUsdcReceived > BigInt(0) && firstSwapFeeAmount > BigInt(0)) {
        const feeTransferCalldata = encodeFunctionData({
          abi: erc20Abi,
          functionName: 'transfer',
          args: [feeReceiver as `0x${string}`, firstSwapFeeAmount],
        });

        transactions.push({
          to: usdcAddress,
          value: BigInt(0),
          data: feeTransferCalldata,
          chainId: fromChainId,
          stepDescription: 'USDC Fee Transfer (1%)',
          transactionType: 'usdc_fee_transfer',
        });

        transactionDebugLog('Added USDC fee transfer from first swap:', {
          feeAmount: firstSwapFeeAmount.toString(),
          recipient: feeReceiver,
        });
      }

      // ====================================
      // SECOND SWAP: USDC (fromChain) -> USDC (toChain)
      // ====================================

      // Step 10: Get quote for USDC bridge
      const usdcToBridgeFormatted = (
        Number(usdcAfterFirstSwapFee) /
        10 ** 6
      ).toString();

      let bridgeOffer: SellOffer | null = null;
      try {
        bridgeOffer = await getBestSellOffer({
          fromAmount: usdcToBridgeFormatted,
          fromTokenAddress: usdcAddress,
          fromChainId,
          fromTokenDecimals: 6,
          toChainId, // Target chain
        });
      } catch (err) {
        // Error getting bridge quote - will be handled below
      }

      if (!bridgeOffer) {
        throw new Error('Unable to get quote for bridge. Please try again.');
      }

      const { steps: bridgeSteps } = bridgeOffer.offer;

      if (!bridgeSteps || bridgeSteps.length === 0) {
        throw new Error('No execution steps found in bridge quote');
      }

      // Step 11: Check for approval in bridge
      const hasBridgeRelayApprovalStep = bridgeSteps.some(
        (step) => step.id === 'approve'
      );

      if (!hasBridgeRelayApprovalStep) {
        // Find spender address from bridge steps
        let bridgeSpenderAddress = '';
        for (let i = 0; i < bridgeSteps.length; i += 1) {
          const step = bridgeSteps[i];
          if (
            step.kind === 'transaction' &&
            step.items &&
            step.items.length > 0
          ) {
            for (let j = 0; j < step.items.length; j += 1) {
              const item = step.items[j];
              if (item.data?.to && item.data.to !== usdcAddress) {
                bridgeSpenderAddress = item.data.to;
                break;
              }
            }
            if (bridgeSpenderAddress) break;
          }
        }

        if (bridgeSpenderAddress) {
          const usdcAmountBigInt = parseUnits(usdcToBridgeFormatted, 6);

          const isAllowance = await isAllowanceSet({
            owner: walletAddress || '',
            spender: bridgeSpenderAddress,
            tokenAddress: usdcAddress,
            chainId: fromChainId,
          });

          const isEnoughAllowance = isAllowance
            ? isAllowance >= usdcAmountBigInt
            : undefined;

          if (!isEnoughAllowance) {
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
              args: [bridgeSpenderAddress as `0x${string}`, usdcAmountBigInt],
            });

            transactions.push({
              data: calldata,
              value: BigInt(0),
              to: usdcAddress,
              chainId: fromChainId,
              transactionType: 'approval',
              stepDescription: 'Approve USDC for bridge',
            });

            transactionDebugLog('Added approval for bridge:', {
              tokenAddress: usdcAddress,
              spender: bridgeSpenderAddress,
              amount: usdcAmountBigInt.toString(),
            });
          }
        }
      }

      // Step 13: Add bridge transactions
      for (let i = 0; i < bridgeSteps.length; i += 1) {
        const step = bridgeSteps[i];

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
                typeof value === 'string' ? BigInt(value) : BigInt(value || 0);

              const isApprovalStep = step.id === 'approve';

              if (isApprovalStep) {
                transactions.push({
                  chainId,
                  to: to as `0x${string}`,
                  value: bigIntValue,
                  data: data || '0x',
                  stepIndex: i,
                  itemIndex: j,
                  stepDescription: step.description || 'Approve USDC',
                  transactionType: 'approval',
                });
              } else {
                transactions.push({
                  chainId,
                  to: to as `0x${string}`,
                  value: bigIntValue,
                  data: data || '0x',
                  stepIndex: i,
                  itemIndex: j,
                  stepDescription: step.description || `Bridge Step ${i + 1}`,
                });
              }

              transactionDebugLog('Added bridge transaction:', {
                stepIndex: i,
                itemIndex: j,
                to,
                chainId,
              });
            }
          }
        }
      }

      transactionDebugLog('Built sell transaction with bridge:', {
        firstSwapUsdcReceived: actualUsdcReceived.toString(),
        firstSwapFee: firstSwapFeeAmount.toString(),
        usdcToBridge: usdcAfterFirstSwapFee.toString(),
        totalTransactions: transactions.length,
      });

      return {
        transactions,
        finalSellOffer: bridgeOffer,
      };
    },
    [
      getBestSellOffer,
      getUSDCAddress,
      isAllowanceSet,
      walletAddress,
      transactionDebugLog,
      isInitialized,
    ]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    getUSDCAddress,
    getBestSellOffer,
    getBestSellOfferWithBridge,
    executeSell,
    buildSellTransactions,
    buildSellTransactionWithBridge,
    isLoading,
    error,
    isInitialized,
    clearError,
  };
}

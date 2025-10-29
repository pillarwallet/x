import { EtherspotUtils } from '@etherspot/transaction-kit';
import {
  LiFiStep,
  Route,
  RoutesRequest,
  getRoutes,
  getStepTransaction,
} from '@lifi/sdk';
import {
  createPublicClient,
  encodeFunctionData,
  erc20Abi,
  formatUnits,
  http,
  parseUnits,
  zeroAddress,
} from 'viem';

// types
import { StepTransaction, SwapOffer, SwapType } from '../utils/types';

// hooks
import { useTransactionDebugLogger } from '../../../hooks/useTransactionDebugLogger';

// utils
import {
  Token,
  chainNameToChainIdTokensData,
} from '../../../services/tokensData';
import { isStableCoin } from '../../../utils/blockchain';
import { getNetworkViem } from '../../deposit/utils/blockchain';
import {
  getNativeBalanceFromPortfolio,
  processEth,
  toWei,
} from '../utils/blockchain';
import {
  getWrappedTokenAddressIfNative,
  isNativeToken,
  isWrappedToken,
} from '../utils/wrappedTokens';

const useOffer = () => {
  const { isZeroAddress } = EtherspotUtils;
  const { transactionDebugLog } = useTransactionDebugLogger();

  /**
   * Get native fee estimation for ERC20 tokens
   * This function calculates how much native token (ETH, MATIC, etc.) is needed
   * to pay for gas fees when swapping ERC20 tokens
   */
  const getNativeFeeForERC20 = async ({
    tokenAddress,
    chainId,
    feeAmount,
    slippage = 0.03,
  }: {
    tokenAddress: string;
    chainId: number;
    feeAmount: string;
    slippage?: number;
  }) => {
    try {
      /**
       * Create route request to find the best path for converting
       * the ERC20 token to native token for fee payment
       */
      const feeRouteRequest: RoutesRequest = {
        fromChainId: chainId,
        toChainId: chainId,
        fromTokenAddress: tokenAddress,
        toTokenAddress: zeroAddress,
        fromAmount: feeAmount,
        options: {
          slippage,
          bridges: {
            allow: ['relay'],
          },
          exchanges: { allow: ['openocean', 'kyberswap'] },
        },
      };

      const result = await getRoutes(feeRouteRequest);
      const { routes } = result;

      const allOffers = routes as Route[];

      if (allOffers.length) {
        /**
         * Find the best offer by comparing receive amounts
         * The best offer is the one that gives the most native tokens
         */
        const bestOffer = allOffers.reduce((a, b) => {
          const receiveAmountA = processEth(a.toAmount, 18);
          const receiveAmountB = processEth(b.toAmount, 18);
          return receiveAmountA > receiveAmountB ? a : b;
        });

        return bestOffer;
      }

      return undefined;
    } catch (e) {
      console.error('Failed to get native fee estimation via LiFi:', e);
      return undefined;
    }
  };

  /**
   * Get the best swap offer for a given token pair
   * This function finds the optimal route for swapping one token to another
   * across different exchanges and bridges
   */
  const getBestOffer = async ({
    fromAmount,
    fromTokenAddress,
    fromChainId,
    fromTokenDecimals,
    toTokenAddress,
    toChainId,
    toTokenDecimals,
    slippage,
  }: SwapType): Promise<SwapOffer | undefined> => {
    try {
      /**
       * Step 1: Handle wrapped token conversion
       * Replace native token addresses with their wrapped equivalents
       * This is required for some DEX aggregators
       */
      const fromTokenAddressWithWrappedCheck = getWrappedTokenAddressIfNative(
        fromTokenAddress,
        fromChainId
      );

      /**
       * Step 2: Apply fee deduction using BigInt arithmetic
       * Convert to wei first, then apply 1% fee deduction using integer math
       * This prevents precision loss for large amounts or tokens with many decimals
       */
      const fromAmountInWei = parseUnits(String(fromAmount), fromTokenDecimals);
      const feeDeduction = fromAmountInWei / BigInt(100); // 1% fee
      const fromAmountFeeDeducted = fromAmountInWei - feeDeduction;

      /**
       * Step 3: Create route request for LiFi
       * This request includes all necessary parameters for finding swap routes
       */
      const routesRequest: RoutesRequest = {
        fromChainId,
        toChainId,
        fromTokenAddress: fromTokenAddressWithWrappedCheck,
        toTokenAddress,
        fromAmount: fromAmountFeeDeducted.toString(),
        options: {
          slippage,
          bridges: {
            allow: ['relay'],
          },
          exchanges: { allow: ['openocean', 'kyberswap'] },
        },
      };

      const result = await getRoutes(routesRequest);
      const { routes } = result;

      const allOffers = routes as Route[];

      if (allOffers.length) {
        /**
         * Step 4: Find the best offer
         * Compare all available routes and select the one with the highest output
         */
        const bestOffer = allOffers.reduce((a, b) => {
          const receiveAmountA = processEth(a.toAmount, toTokenDecimals);
          const receiveAmountB = processEth(b.toAmount, toTokenDecimals);
          return receiveAmountA > receiveAmountB ? a : b;
        });

        const selectedOffer: SwapOffer = {
          tokenAmountToReceive: processEth(bestOffer.toAmount, toTokenDecimals),
          offer: bestOffer as Route,
        };

        return selectedOffer;
      }

      // Return undefined instead of empty object when no routes found
      return undefined;
    } catch (e) {
      console.error(
        'Sorry, an error occurred while trying to fetch the best swap offer. Please try again.',
        e
      );
      // Return undefined instead of empty object on error
      return undefined;
    }
  };

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
    } catch (error) {
      console.error('Failed to check token allowance:', error);
      return undefined;
    }
  };

  /**
   * Build step transactions for a swap
   * This function creates the sequence of transactions needed to execute a swap
   * including fee payments, approvals, and the actual swap
   */
  const getStepTransactions = async (
    tokenToSwap: Token,
    route: Route,
    fromAccount: string,
    userPortfolio: Token[] | undefined,
    fromAmount: number // Pass the original user input amount
  ): Promise<StepTransaction[]> => {
    const stepTransactions: StepTransaction[] = [];

    /**
     * Step 1: Determine if wrapping is required
     * Check if we need to wrap native tokens before swapping
     */
    const isWrapRequired =
      isWrappedToken(route.fromToken.address, route.fromToken.chainId) &&
      !isWrappedToken(
        tokenToSwap.contract,
        chainNameToChainIdTokensData(tokenToSwap.blockchain)
      );

    // Convert fromAmount (number) to BigInt using token decimals
    const fromAmountBigInt = parseUnits(
      String(fromAmount),
      tokenToSwap.decimals
    );

    /**
     * Step 2: Fee calculation and validation
     * Calculate 1% platform fee and validate fee receiver address
     */
    const feeReceiver = import.meta.env.VITE_SWAP_FEE_RECEIVER;

    // Validate fee receiver address
    if (!feeReceiver) {
      throw new Error('Fee receiver address is not configured');
    }

    // Use the original input amount for fee calculation
    const feeAmount = fromAmountBigInt / BigInt(100); // 1% of input
    const fromTokenChainId = route.fromToken.chainId;
    const userSelectedNative = isNativeToken(tokenToSwap.contract);
    const userSelectedWrapped = isWrappedToken(
      tokenToSwap.contract,
      fromTokenChainId
    );
    const userSelectedStable = isStableCoin(
      tokenToSwap.contract,
      fromTokenChainId
    );

    /**
     * Step 3: Balance checks
     * Verify user has sufficient balance for swap and fees
     */
    let userNativeBalance = BigInt(0);
    try {
      // Get native balance from portfolio
      const nativeBalance =
        getNativeBalanceFromPortfolio(userPortfolio, fromTokenChainId) || '0';
      userNativeBalance = toWei(nativeBalance, 18);
    } catch (e) {
      throw new Error('Unable to fetch balances for swap.');
    }

    // Calculate total required
    let totalNativeRequired = BigInt(0);
    if (userSelectedNative) {
      // Native: swap amount + fee
      // Use fromAmountBigInt for total required
      totalNativeRequired = fromAmountBigInt;
      if (isWrapRequired) {
        totalNativeRequired += fromAmountBigInt - feeAmount; // wrapping step uses swap amount
      }
      if (userNativeBalance < totalNativeRequired) {
        throw new Error(
          'Insufficient native token balance to cover swap and fee.'
        );
      }
    }

    /**
     * Step 4: Fee transaction creation
     * Create the appropriate fee transaction based on token type
     */
    if (userSelectedNative) {
      // Always treat as native fee if user selected native
      const feeStep = {
        to: feeReceiver,
        value: feeAmount,
        data: '0x' as `0x${string}`,
        chainId: fromTokenChainId,
      };
      stepTransactions.push(feeStep);
      transactionDebugLog(
        'Pushed native fee step (user selected native):',
        feeStep
      );
    } else if (userSelectedStable) {
      // Validate token contract address
      if (!tokenToSwap.contract) {
        throw new Error('Token contract address is undefined');
      }

      // Stablecoin fee
      const calldata = encodeFunctionData({
        abi: erc20Abi,
        functionName: 'transfer',
        args: [feeReceiver, feeAmount],
      });
      const feeStep = {
        to: tokenToSwap.contract,
        value: BigInt(0),
        data: calldata,
        chainId: fromTokenChainId,
      };
      stepTransactions.push(feeStep);
      transactionDebugLog(
        'Pushed stablecoin fee step (user selected stable):',
        feeStep
      );
    } else if (userSelectedWrapped) {
      // Validate token contract address
      if (!tokenToSwap.contract) {
        throw new Error('Token contract address is undefined');
      }

      // Wrapped token fee
      const calldata = encodeFunctionData({
        abi: erc20Abi,
        functionName: 'transfer',
        args: [feeReceiver, feeAmount],
      });
      const feeStep = {
        to: tokenToSwap.contract,
        value: BigInt(0),
        data: calldata,
        chainId: fromTokenChainId,
      };
      stepTransactions.push(feeStep);
      transactionDebugLog(
        'Pushed wrapped token fee step (user selected wrapped):',
        feeStep
      );
    } else {
      // Validate token contract address
      if (!tokenToSwap.contract) {
        throw new Error('Token contract address is undefined');
      }

      /**
       * Non-stable, non-wrapped ERC20: estimate native equivalent
       * For regular ERC20 tokens, we need to estimate how much native token
       * is equivalent to our fee amount
       */
      try {
        const nativeFeeRoute = await getNativeFeeForERC20({
          tokenAddress: tokenToSwap.contract,
          chainId: fromTokenChainId,
          feeAmount: feeAmount.toString(),
        });
        if (nativeFeeRoute && nativeFeeRoute.toAmount) {
          const estimatedNativeFee = BigInt(nativeFeeRoute.toAmount);
          const bufferedNativeFee =
            estimatedNativeFee + estimatedNativeFee / BigInt(100); // +1%
          if (userNativeBalance < bufferedNativeFee) {
            throw new Error(
              'Insufficient native token balance to pay the fee.'
            );
          }

          const feeStep = {
            to: feeReceiver,
            value: bufferedNativeFee,
            data: '0x' as `0x${string}`,
            chainId: fromTokenChainId,
          };
          stepTransactions.push(feeStep);
          transactionDebugLog(
            'Pushed ERC20 non-stable fee step (native, user selected ERC20):',
            feeStep
          );
        } else {
          throw new Error(
            'Failed to estimate native fee for ERC20. No route found.'
          );
        }
      } catch (e) {
        throw new Error('Failed to estimate native fee for ERC20.');
      }
    }

    /**
     * Step 5: Wrap transaction (if required)
     * If the route requires wrapped tokens but user has native tokens,
     * add a wrapping transaction
     */
    if (isWrapRequired) {
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

      stepTransactions.push({
        to: route.fromToken.address, // wrapped token address
        data: wrapCalldata,
        value: BigInt(route.fromAmount),
        chainId: route.fromChainId,
      });
    }

    /**
     * Step 6: Process route steps
     * Handle each step in the swap route, including approvals and swaps
     */
    try {
      // eslint-disable-next-line no-restricted-syntax
      for (const step of route.steps) {
        // --- APPROVAL LOGIC ---
        // Only require approval for ERC20 tokens (never for native tokens, including special addresses like POL/MATIC)
        const isTokenNative = isNativeToken(step.action.fromToken.address);

        // Validate required addresses before proceeding
        if (!step.action.fromToken.address) {
          throw new Error('Token address is undefined in step');
        }

        const isAllowance = isTokenNative
          ? undefined // Native tokens never require approval
          : // eslint-disable-next-line no-await-in-loop
            await isAllowanceSet({
              owner: fromAccount,
              spender: step.estimate.approvalAddress || '',
              tokenAddress: step.action.fromToken.address,
              chainId: step.action.fromChainId,
            });

        const isEnoughAllowance = isAllowance
          ? formatUnits(isAllowance, step.action.fromToken.decimals) >=
            formatUnits(
              BigInt(step.action.fromAmount),
              step.action.fromToken.decimals
            )
          : undefined;

        // Here we are checking if this is not a native/gas token and if the allowance
        // is not set, then we manually add an approve transaction
        if (!isTokenNative && !isEnoughAllowance) {
          // Validate approval address before using it
          if (!step.estimate.approvalAddress) {
            throw new Error(
              'Approval address is undefined for non-native token'
            );
          }

          // We encode the callData for the approve transaction
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
            args: [
              step.estimate.approvalAddress as `0x${string}`,
              BigInt(step.estimate.fromAmount),
            ],
          });

          // We push the approve transaction to the stepTransactions array
          stepTransactions.push({
            data: calldata,
            value: BigInt(0),
            to: step.action.fromToken.address,
            chainId: step.action.fromChainId,
            transactionType: 'approval',
          });
        }

        const actionCopy = { ...step.action };

        // This is to make sure we have a fromAddress, which is not always
        // provided by Lifi
        if (!actionCopy.fromAddress) {
          actionCopy.fromAddress = fromAccount;
        }

        // This is to make sure we have a toAddress, which is not always
        // provided by Lifi, from and to address are the same
        actionCopy.toAddress = actionCopy.fromAddress;

        const modifiedStep: LiFiStep = { ...step, action: actionCopy };

        // eslint-disable-next-line no-await-in-loop
        const updatedStep = await getStepTransaction(modifiedStep);

        if (!updatedStep.transactionRequest) {
          throw new Error('No transactionRequest');
        }

        const { to, data, value, gasLimit, gasPrice, chainId, type } =
          updatedStep.transactionRequest;

        // Validate the 'to' address before adding to stepTransactions
        if (!to) {
          throw new Error('Transaction "to" address is undefined');
        }

        // Handle bigint conversions properly for values from LiFi SDK
        const valueBigInt =
          typeof value === 'bigint' ? value : BigInt(String(value || 0));
        const gasLimitBigInt =
          typeof gasLimit === 'bigint'
            ? gasLimit
            : BigInt(String(gasLimit || 0));
        const gasPriceBigInt =
          typeof gasPrice === 'bigint'
            ? gasPrice
            : BigInt(String(gasPrice || 0));

        stepTransactions.push({
          to,
          data: data as `0x${string}`,
          value: valueBigInt,
          gasLimit: gasLimitBigInt,
          gasPrice: gasPriceBigInt,
          chainId,
          type,
        });
      }
    } catch (error) {
      console.error('Failed to get step transactions:', error);
      throw error; // Re-throw so the UI can handle it
    }

    return stepTransactions;
  };

  return {
    getBestOffer,
    getStepTransactions,
  };
};

export default useOffer;

import {
  useEtherspotUtils,
  useWalletAddress,
} from '@etherspot/transaction-kit';
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
import {
  logOfferOperation,
  logExchangeError,
  addExchangeBreadcrumb,
  startExchangeTransaction,
} from '../utils/sentry';

const useOffer = () => {
  const { isZeroAddress } = useEtherspotUtils();
  const { transactionDebugLog } = useTransactionDebugLogger();
  const walletAddress = useWalletAddress();

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
    startExchangeTransaction(
      'get_native_fee',
      {
        tokenAddress,
        chainId,
        feeAmount,
        slippage,
      },
      walletAddress
    );

    try {
      addExchangeBreadcrumb('Getting native fee for ERC20', 'offer', {
        tokenAddress,
        chainId,
        feeAmount,
        slippage,
        walletAddress,
      });

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

      const route = result.routes?.[0];
      if (!route) {
        logOfferOperation('native_fee_no_route', {
          tokenAddress,
          chainId,
          feeAmount,
          slippage,
          walletAddress,
        });
        return undefined;
      }

      transactionDebugLog(
        'Get native fee for ERC20 swap, the route:',
        route,
        'the request:',
        feeRouteRequest
      );

      logOfferOperation('native_fee_success', {
        tokenAddress,
        chainId,
        feeAmount,
        slippage,
        route,
        walletAddress,
      });

      return route;
    } catch (e) {
      const error = e instanceof Error ? e : new Error(String(e));
      logExchangeError(
        error,
        {
          operation: 'get_native_fee',
          tokenAddress,
          chainId,
          feeAmount,
          slippage,
          walletAddress,
        },
        {
          component: 'useOffer',
          method: 'getNativeFeeForERC20',
        }
      );

      console.error('Failed to get native fee estimation via LiFi:', e);
      return undefined;
    }
  };

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
      // Replace native token with wrapped if needed
      const fromTokenAddressWithWrappedCheck = getWrappedTokenAddressIfNative(
        fromTokenAddress,
        fromChainId
      );

      const fromAmountFeeDeducted = Number(fromAmount) * 0.99;

      const routesRequest: RoutesRequest = {
        fromChainId,
        toChainId,
        fromTokenAddress: fromTokenAddressWithWrappedCheck,
        toTokenAddress,
        fromAmount: `${parseUnits(`${fromAmountFeeDeducted}`, fromTokenDecimals)}`,
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

  const getStepTransactions = async (
    tokenToSwap: Token,
    route: Route,
    fromAccount: string,
    userPortfolio: Token[] | undefined,
    fromAmount: number // Pass the original user input amount
  ): Promise<StepTransaction[]> => {
    const stepTransactions: StepTransaction[] = [];

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

    // --- 1% FEE LOGIC ---
    // Always deduct 1% from the From Token (already done in getBestOffer)
    // - Native in native
    // - Stablecoin in stablecoin
    // - Wrapped in wrapped
    // - Non-stable ERC20 in native
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

    // --- BALANCE CHECKS ---
    // For native: need enough for swap + fee
    // For ERC20: need enough ERC20 for swap
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

    // --- FEE STEP ---
    // The following logic ensures the fee is always taken in the correct asset:
    // - If user selected native: fee is sent as native
    // - If user selected stablecoin: fee is sent as stablecoin ERC20
    // - If user selected wrapped: fee is sent as wrapped ERC20
    // - If user selected non-stable ERC20: fee is estimated and sent as native
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

      // Non-stable, non-wrapped ERC20: estimate native equivalent
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
    // --- END FEE LOGIC ---

    // If wrapping is required, we will add an extra step transaction with
    // a wrapped token deposit first
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

        stepTransactions.push({
          to,
          data: data as `0x${string}`,
          value: BigInt(`${value}`),
          gasLimit: BigInt(`${gasLimit}`),
          gasPrice: BigInt(`${gasPrice}`),
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

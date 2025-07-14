import { useEtherspotUtils } from '@etherspot/transaction-kit';
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
import {
  getNativeBalance,
  getNetworkViem,
} from '../../deposit/utils/blockchain';
import { processEth } from '../utils/blockchain';
import {
  getWrappedTokenAddressIfNative,
  isNativeToken,
  isWrappedToken,
} from '../utils/wrappedTokens';

// Utility: Convert to wei as bigint
export const toWei = (amount: string | number, decimals = 18): bigint => {
  return parseUnits(String(amount), decimals);
};

// Utility: Extract native token balance from walletPortfolio for a given chainId
export const getNativeBalanceFromPortfolio = (
  walletPortfolio: Token[] | undefined,
  chainId: number
): string | undefined => {
  if (!walletPortfolio) return undefined;
  // Find the native token for the chain (by contract address)
  const nativeToken = walletPortfolio.find(
    (token) =>
      chainNameToChainIdTokensData(token.blockchain) === chainId &&
      isNativeToken(token.contract)
  );
  return nativeToken ? String(nativeToken.balance) : undefined;
};

const useOffer = () => {
  const { isZeroAddress } = useEtherspotUtils();
  const { transactionDebugLog } = useTransactionDebugLogger();

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
      if (!route) return undefined;

      transactionDebugLog(
        'Get native fee for ERC20 swap, the route:',
        route,
        'the request:',
        feeRouteRequest
      );
      return route;
    } catch (e) {
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
    let selectedOffer: SwapOffer;

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

        selectedOffer = {
          tokenAmountToReceive: processEth(bestOffer.toAmount, toTokenDecimals),
          offer: bestOffer as Route,
        };

        return selectedOffer;
      }
    } catch (e) {
      console.error(
        'Sorry, an error occurred while trying to fetch the best swap offer. Please try again.',
        e
      );
      return {} as SwapOffer;
    }

    return {} as SwapOffer;
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
    cachedNativeBalance?: string // Optional: pass cached native balance from walletPortfolio
  ): Promise<StepTransaction[]> => {
    const stepTransactions: StepTransaction[] = [];

    const isWrapRequired =
      isWrappedToken(route.fromToken.address, route.fromToken.chainId) &&
      !isWrappedToken(
        tokenToSwap.contract,
        chainNameToChainIdTokensData(tokenToSwap.blockchain)
      );

    // --- 1% FEE LOGIC ---
    // Always deduct 1% from the From Token (already done in getBestOffer)
    const feeReceiver = import.meta.env.VITE_SWAP_FEE_RECEIVER;
    const feeAmount = BigInt(route.fromAmount) / BigInt(100); // 1%
    const fromTokenAddress = route.fromToken.address;
    const fromTokenChainId = route.fromToken.chainId;

    // 1. If From Token is native, transfer 1% directly to fee address
    if (isZeroAddress(fromTokenAddress)) {
      const feeStep = {
        to: feeReceiver,
        value: feeAmount,
        data: '0x' as `0x${string}`,
        chainId: fromTokenChainId,
      };
      stepTransactions.push(feeStep);
      transactionDebugLog('Pushed native fee step:', feeStep);
    } else if (isStableCoin(fromTokenAddress, fromTokenChainId)) {
      // 2. If input is stablecoin, push ERC20 transfer transaction
      const calldata = encodeFunctionData({
        abi: erc20Abi,
        functionName: 'transfer',
        args: [feeReceiver, feeAmount],
      });
      const feeStep = {
        to: fromTokenAddress,
        value: BigInt(0),
        data: calldata,
        chainId: fromTokenChainId,
      };
      stepTransactions.push(feeStep);
      transactionDebugLog('Pushed stablecoin fee step:', feeStep);
    } else if (isWrappedToken(fromTokenAddress, fromTokenChainId)) {
      // 3. If input is a wrapped token, push ERC20 transfer transaction (like stablecoin)
      const calldata = encodeFunctionData({
        abi: erc20Abi,
        functionName: 'transfer',
        args: [feeReceiver, feeAmount],
      });
      const feeStep = {
        to: fromTokenAddress,
        value: BigInt(0),
        data: calldata,
        chainId: fromTokenChainId,
      };
      stepTransactions.push(feeStep);
      transactionDebugLog('Pushed wrapped token fee step:', feeStep);
    } else {
      // 4. If input is ERC20 non-stable, estimate native equivalent of 1% and transfer that as fee
      try {
        const nativeFeeRoute = await getNativeFeeForERC20({
          tokenAddress: fromTokenAddress,
          chainId: fromTokenChainId,
          feeAmount: feeAmount.toString(),
        });
        if (nativeFeeRoute && nativeFeeRoute.toAmount) {
          // Add a 1% buffer to the estimated native fee
          const estimatedNativeFee = BigInt(nativeFeeRoute.toAmount);
          const bufferedNativeFee =
            estimatedNativeFee + estimatedNativeFee / BigInt(100); // +1%

          // Use cachedNativeBalance if provided, else fetch
          const userNativeBalanceStr =
            cachedNativeBalance !== undefined
              ? cachedNativeBalance
              : await getNativeBalance(fromAccount, fromTokenChainId);

          const userNativeBalance = toWei(userNativeBalanceStr, 18);

          if (userNativeBalance < bufferedNativeFee) {
            throw new Error(
              'Insufficient native token balance to pay the fee. Please ensure you have enough native token to cover the fee.'
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
            'Pushed ERC20 non-stable fee step (native):',
            feeStep
          );
        } else {
          throw new Error(
            'Failed to estimate native fee for ERC20. No route found.'
          );
        }
      } catch (e) {
        // Rethrow as error for UI to catch
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
        to: route.fromToken.address, // already a wrapped token address from the SwapReceiveCard
        data: wrapCalldata,
        value: BigInt(route.fromAmount),
        chainId: route.fromChainId,
      });
    }

    try {
      // eslint-disable-next-line no-restricted-syntax
      for (const step of route.steps) {
        // eslint-disable-next-line no-await-in-loop
        const isAllowance = await isAllowanceSet({
          owner: fromAccount,
          spender: step.estimate.approvalAddress,
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
        if (
          !isZeroAddress(step.action.fromToken.address) &&
          !isEnoughAllowance
        ) {
          // We endode the callData for the approve transaction
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
    }

    return stepTransactions;
  };

  return {
    getBestOffer,
    getStepTransactions,
  };
};

export default useOffer;

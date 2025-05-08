import { useEtherspotUtils } from '@etherspot/transaction-kit';
import {
  LiFiStep,
  Route,
  RoutesRequest,
  getRoutes,
  getStepTransaction,
} from '@lifi/sdk';
import { parseUnits } from 'ethers/lib/utils';
import {
  createPublicClient,
  encodeFunctionData,
  erc20Abi,
  formatUnits,
  http,
} from 'viem';

// types
import { StepTransaction, SwapOffer, SwapType } from '../utils/types';

// utils
import { getNetworkViem } from '../../deposit/utils/blockchain';
import { processEth } from '../utils/blockchain';

const useOffer = () => {
  const { isZeroAddress } = useEtherspotUtils();

  const getBestOffer = async ({
    fromAmount,
    fromTokenAddress,
    fromChainId,
    fromTokenDecimals,
    toTokenAddress,
    toChainId,
    toTokenDecimals,
  }: SwapType): Promise<SwapOffer | undefined> => {
    let selectedOffer: SwapOffer;

    // uses getRoutes (Lifi) - different chains or same chains, different tokens or same tokens
    try {
      const routesRequest: RoutesRequest = {
        fromChainId,
        toChainId,
        fromTokenAddress,
        toTokenAddress,
        fromAmount: `${parseUnits(`${fromAmount}`, fromTokenDecimals)}`,
        options: {
          bridges: {
            deny: ['across', 'multichain', 'hyphen', 'hop'],
          },
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
    route: Route,
    fromAccount: string
  ): Promise<StepTransaction[]> => {
    const stepTransactions: StepTransaction[] = [];

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

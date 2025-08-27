import _ from 'lodash';
import { useEffect, useState } from 'react';
import useTransactionKit from '../../../../hooks/useTransactionKit';

// reducer
import {
  setAmountReceive,
  setAmountSwap,
  setBestOffer,
  setIsAboveLimit,
  setIsOfferLoading,
  setUsdPriceReceiveToken,
  setUsdPriceSwapToken,
} from '../../reducer/theExchangeSlice';

// services
import {
  Token,
  chainNameToChainIdTokensData,
} from '../../../../services/tokensData';

// hooks
import useOffer from '../../hooks/useOffer';
import { useAppDispatch, useAppSelector } from '../../hooks/useReducerHooks';

// utils
import { formatExponential } from '../../../../utils/number';
import {
  addExchangeBreadcrumb,
  logExchangeError,
  logUserInteraction,
} from '../../utils/sentry';

// types
import { CardPosition, SwapOffer } from '../../utils/types';

// components
import BodySmall from '../Typography/BodySmall';

// images
import ReceiveArrow from '../../images/receive-arrow.png';
import SendArrow from '../../images/send-arrow.png';
import ExchangeOffer from './ExchangeOffer';

type EnterAmountProps = {
  type: CardPosition;
  tokenSymbol?: string;
  tokenBalance?: number;
  tokenChain?: string;
  isDeploymentCostLoading?: boolean;
  deploymentCost?: number;
};

const EnterAmount = ({
  type,
  tokenSymbol,
  tokenBalance,
  tokenChain,
  isDeploymentCostLoading,
  deploymentCost,
}: EnterAmountProps) => {
  const dispatch = useAppDispatch();
  const { walletAddress } = useTransactionKit();
  const amountSwap = useAppSelector((state) => state.swap.amountSwap as number);
  const amountReceive = useAppSelector(
    (state) => state.swap.amountReceive as number
  );
  const usdPriceSwapToken = useAppSelector(
    (state) => state.swap.usdPriceSwapToken as number
  );
  const usdPriceReceiveToken = useAppSelector(
    (state) => state.swap.usdPriceReceiveToken as number
  );
  const swapToken = useAppSelector((state) => state.swap.swapToken as Token);
  const receiveToken = useAppSelector(
    (state) => state.swap.receiveToken as Token
  );
  const bestOffer = useAppSelector(
    (state) => state.swap.bestOffer as SwapOffer
  );
  const isOfferLoading = useAppSelector(
    (state) => state.swap.isOfferLoading as boolean
  );
  const isAboveLimit = useAppSelector(
    (state) => state.swap.isAboveLimit as boolean
  );

  const [inputValue, setInputValue] = useState<string>('');
  const { getBestOffer } = useOffer();
  const [isNoOffer, setIsNoOffer] = useState<boolean>(false);

  // get usd price only when swap token changes
  useEffect(() => {
    if (swapToken) {
      if (!swapToken.price) {
        console.error(
          `Failed to fetch USD price of token: ${swapToken.symbol} ${swapToken.name} on ${swapToken.blockchain}`
        );
        dispatch(setUsdPriceSwapToken(0));
      }

      if (swapToken.price) {
        dispatch(setUsdPriceSwapToken(swapToken.price));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [swapToken]);

  // get usd price only when receive token changes
  useEffect(() => {
    if (receiveToken) {
      if (!receiveToken.price) {
        console.error(
          `Failed to fetch USD price of token: ${receiveToken.symbol} ${receiveToken.name} on ${receiveToken.blockchain}`
        );
        dispatch(setUsdPriceReceiveToken(0));
      }

      if (receiveToken.price) {
        dispatch(setUsdPriceReceiveToken(receiveToken.price));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receiveToken]);

  // Gets the best swap offer
  const getOffer = async () => {
    addExchangeBreadcrumb('Getting best swap offer', 'offer', {
      amountSwap,
      swapToken: swapToken?.symbol,
      receiveToken: receiveToken?.symbol,
      walletAddress,
    });

    const params = {
      fromAmount: amountSwap ?? 0,
      fromTokenAddress: swapToken?.contract ?? '',
      fromChainId: chainNameToChainIdTokensData(swapToken?.blockchain) ?? 0,
      fromTokenDecimals: swapToken?.decimals ?? 0,
      toTokenAddress: receiveToken?.contract ?? '',
      toChainId: chainNameToChainIdTokensData(receiveToken?.blockchain) ?? 0,
      toTokenDecimals: receiveToken?.decimals ?? 0,
      slippage: 0.03,
    };

    const offer = await getBestOffer(params).catch((e) => {
      logExchangeError(
        e,
        {
          operation: 'get_best_offer',
          params,
          walletAddress,
        },
        {
          component: 'EnterAmount',
          method: 'getOffer',
        }
      );

      console.error(
        'Sorry, an error occurred while trying to fetch the best swap offer. Please try again.',
        e
      );
      return {} as SwapOffer;
    });

    if (offer && Object.keys(offer as SwapOffer).length && receiveToken) {
      dispatch(setAmountReceive(offer?.tokenAmountToReceive));
      addExchangeBreadcrumb('Best offer received', 'offer', {
        offer: offer?.tokenAmountToReceive,
        walletAddress,
      });
    } else {
      setIsNoOffer(true);
      addExchangeBreadcrumb('No offer available', 'offer', {
        walletAddress,
      });
    }

    dispatch(setIsOfferLoading(false));

    return offer;
  };

  // Debounced getOffer function with 2-second delay
  const debouncedGetOffer = _.debounce(() => {
    getOffer().then((offer) => {
      if (offer) dispatch(setBestOffer(offer));
    });
  }, 2000);

  // Similar function being used for the SendModal and AccountModal to check tokens balances
  const tokenBalanceLimit = (tokenAmount: number, balance: number) => {
    if (!swapToken && !balance) return undefined;

    // Check if the value exceeds the max token amount limit
    if (tokenAmount > balance - (deploymentCost ?? 0)) {
      return `The maximum amount of ${swapToken?.symbol}${deploymentCost && deploymentCost > 0 ? ' spendable' : ''} in your wallet is ${formatExponential(balance - (deploymentCost ?? 0))} ${swapToken?.symbol}${deploymentCost && deploymentCost > 0 ? ` because your wallet is currently undeployed on ${tokenChain}` : ''} - please change the amount and try again`;
    }

    return undefined;
  };

  useEffect(() => {
    if (amountSwap) {
      setInputValue(amountSwap.toString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [swapToken, receiveToken]);

  // getOffer will be called every time the swap amount or the swap/receive token is changed
  useEffect(() => {
    dispatch(setBestOffer(undefined));
    if (amountSwap && swapToken && receiveToken && !isAboveLimit) {
      dispatch(setIsOfferLoading(true));
      debouncedGetOffer();
    }
    // Clean-up debounce on component unmount
    return () => {
      dispatch(setIsOfferLoading(false));
      debouncedGetOffer.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amountSwap, swapToken, receiveToken]);

  // When the token amount value changes, the input value reflects that change
  const handleTokenAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setInputValue(value);

    logUserInteraction('token_amount_changed', {
      type,
      value,
      tokenSymbol,
      tokenBalance,
      deploymentCost,
      walletAddress,
    });

    if (type === CardPosition.SWAP && swapToken) {
      dispatch(setAmountSwap(Number(value)));
    }

    if (tokenBalance && Number(value) > tokenBalance - (deploymentCost ?? 0)) {
      dispatch(setIsAboveLimit(true));
      addExchangeBreadcrumb('Amount above limit', 'validation', {
        value,
        tokenBalance,
        deploymentCost,
        walletAddress,
      });
    }
    if (tokenBalance && Number(value) <= tokenBalance - (deploymentCost ?? 0)) {
      dispatch(setIsAboveLimit(false));
    }
  };

  return (
    <div id="enter-amount-exchange" className="flex flex-col gap-1 group">
      <BodySmall className="group-hover:text-black_grey/[.4] font-normal">
        {tokenSymbol}
      </BodySmall>
      {type === CardPosition.SWAP ? (
        <>
          <input
            id="input-enter-amount-exchange"
            type="number"
            step="any"
            value={inputValue}
            onChange={(e) => handleTokenAmountChange(e)}
            placeholder="0"
            style={{ width: '100%' }}
            className="text-black_grey font-normal !text-3xl outline-none focus:outline-none focus:ring-0 focus:bg-[#292D32]/[.05] focus:border-b focus:border-b-black_grey group-hover:bg-[#292D32]/[.05] group-hover:border-b group-hover:border-b-black_grey"
            data-testid="enter-amount-input"
          />
          {tokenBalanceLimit(Number(inputValue), tokenBalance || 0) &&
            !isDeploymentCostLoading && (
              <BodySmall
                id="token-balance-limit-exchange"
                data-testid="error-max-limit"
              >
                {tokenBalanceLimit(Number(inputValue), tokenBalance || 0)}
              </BodySmall>
            )}
        </>
      ) : (
        <ExchangeOffer
          isOfferLoading={isOfferLoading}
          isNoOffer={isNoOffer}
          bestOffer={bestOffer}
        />
      )}
      <div className="flex justify-between">
        <BodySmall
          id="usd-conversion-exchange"
          className="group-hover:text-black_grey/[.4]"
        >
          $
          {type === CardPosition.SWAP
            ? (usdPriceSwapToken * amountSwap).toFixed(2)
            : (usdPriceReceiveToken * amountReceive).toFixed(2)}
        </BodySmall>
        <img
          src={type === CardPosition.SWAP ? SendArrow : ReceiveArrow}
          alt={type === CardPosition.SWAP ? 'Send' : 'Receive'}
        />
      </div>
    </div>
  );
};

export default EnterAmount;

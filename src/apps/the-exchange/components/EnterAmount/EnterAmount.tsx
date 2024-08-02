import { useState, useEffect } from 'react';
import _ from 'lodash';

// reducer
import { setAmountReceive, setAmountSwap, setBestOffer, setIsOfferLoading, setUsdPriceReceiveToken, setUsdPriceSwapToken } from '../../reducer/theExchangeSlice';

// hooks
import useOffer from '../../hooks/useOffer';
import useAccountBalances from '../../../../hooks/useAccountBalances';
import { useAppDispatch, useAppSelector } from '../../hooks/useReducerHooks';
import { useEtherspotPrices, useEtherspotUtils, useWalletAddress } from '@etherspot/transaction-kit';

// types
import { CardPosition, SwapOffer } from '../../utils/types';
import { Token } from '@etherspot/prime-sdk/dist/sdk/data';

// utils
import { processEth } from '../../utils/blockchain';
import { hasThreeZerosAfterDecimal } from '../../utils/converters';

// components
import BodySmall from '../Typography/BodySmall';
import NumberText from '../Typography/NumberText';
import Body from '../Typography/Body';
import { CircularProgress } from '@mui/material';

// images
import SendArrow from '../../images/send-arrow.png';
import ReceiveArrow from '../../images/receive-arrow.png';

type EnterAmountProps = {
  type: CardPosition;
  tokenSymbol?: string;
};

const EnterAmount = ({ type, tokenSymbol }: EnterAmountProps) => {
  const dispatch = useAppDispatch();
  const amountSwap = useAppSelector((state) => state.swap.amountSwap as number);
  const amountReceive = useAppSelector((state) => state.swap.amountReceive as number);
  const usdPriceSwapToken = useAppSelector((state) => state.swap.usdPriceSwapToken as number);
  const usdPriceReceiveToken = useAppSelector((state) => state.swap.usdPriceReceiveToken as number);
  const swapToken = useAppSelector((state) => state.swap.swapToken as Token);
  const receiveToken = useAppSelector((state) => state.swap.receiveToken as Token);
  const bestOffer = useAppSelector((state) => state.swap.bestOffer as SwapOffer);
  const isOfferLoading = useAppSelector((state) => state.swap.isOfferLoading as boolean);
  
  const walletAddress = useWalletAddress();
  const [inputValue, setInputValue] = useState<string>('');
  const { getPrice } = useEtherspotPrices();
  const balances = useAccountBalances();
  const { isZeroAddress, addressesEqual } = useEtherspotUtils();
  const { getBestOffer } = useOffer(swapToken?.chainId || 0);
  const [isNoOffer, setIsNoOffer] = useState<boolean>(false);

    // get usd price only when swap token changes
    useEffect(() => {
      if (swapToken) {
        getPrice(swapToken.address, swapToken.chainId).then((rates) => {
          if (rates?.usd) {
            dispatch(setUsdPriceSwapToken(rates.usd))
          }
        }).catch((e) => {
          console.error('Failed to fetch USD price of token:', e);
          dispatch(setUsdPriceSwapToken(0))
        })
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [swapToken]);

    // get usd price only when receive token changes
    useEffect(() => {
      if (receiveToken) {
        getPrice(receiveToken.address, receiveToken.chainId).then((rates) => {
          if (rates?.usd) {
            dispatch(setUsdPriceReceiveToken(rates.usd))
          }
        }).catch((e) => {
          console.error('Failed to fetch USD price of token:', e);
          dispatch(setUsdPriceReceiveToken(0))
        })
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [receiveToken]);

  // Gets the best swap offer
  const getOffer = async () => {
    const params = {
      fromAmount: amountSwap ?? 0,
      fromTokenAddress: swapToken?.address ?? '',
      fromChainId: swapToken?.chainId ?? 0,
      fromTokenDecimals: swapToken?.decimals ?? 0,
      toTokenAddress: receiveToken?.address ?? '',
      toChainId: receiveToken?.chainId ?? 0,
      toTokenDecimals: receiveToken?.decimals ?? 0,
      slippage: 0.05,
    };

    const offer = await getBestOffer(params).catch((e) => {
      console.error('Sorry, an error occurred while trying to fetch the best swap offer. Please try again.', e);
      return {} as SwapOffer;
    });

    if (offer && Object.keys(offer as SwapOffer).length && receiveToken) {
        dispatch(setAmountReceive(offer?.tokenAmountToReceive));
    } else {
      setIsNoOffer(true);
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
  const tokenBalanceLimit = (tokenAmount: number) => {
    if (!swapToken) return;

    const assetBalance = balances[swapToken.chainId]?.[walletAddress as string]?.find((balance) => {
      if (!swapToken.address) {
        return 'This token does not exist in your wallet';
      }

      const assetAddress = swapToken.address;
      const isNativeBalance = balance.token === null || isZeroAddress(balance.token);

      return (
        (isNativeBalance && isZeroAddress(assetAddress)) ||
        addressesEqual(balance.token, assetAddress)
      );
    });

    const assetBalanceValue = assetBalance ? assetBalance.balance : '0';
    const balance = processEth(assetBalanceValue, swapToken.decimals ?? 18);

    // Check if the value exceeds the max token amount limit
    if (tokenAmount > balance) {
      return `The maximum amount of ${swapToken?.symbol} in your wallet is ${balance.toFixed(4)} ${swapToken?.symbol} - please change the amount and try again`;
    }
  };

  useEffect(() => {
    if (amountSwap) {
      setInputValue(amountSwap.toString());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [swapToken, receiveToken]);

  // getOffer will be called every time the swap amount or the swap/receive token is changed
  useEffect(() => {
    dispatch(setBestOffer(undefined))
    if (amountSwap) {
      dispatch(setIsOfferLoading(true));
      debouncedGetOffer(); 
    }
    // Clean-up debounce on component unmount
    return () => {
      debouncedGetOffer.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amountSwap, swapToken, receiveToken]);

  // When the token amount value changes, the input value reflects that change
  const handleTokenAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (type === CardPosition.SWAP && swapToken) {
        dispatch(setAmountSwap(Number(value)));
    }
  };
  
  // Function to render offer based on loading and offer state
  const Offer = () => {
    if (isOfferLoading) {
      return <CircularProgress size={36} sx={{ color: '#343434' }} />;
    } else if (isNoOffer) {
      return <Body id='no-offer-exchange' className='mobile:text-xs'>Sorry, no offers were found! Please check or change the amounts and try again.</Body>;
    } else if (bestOffer) {
      return (
        <NumberText id='offer-amount-exchange' className="text-black_grey font-normal text-3xl break-words mobile:max-w-[180px] tablet:max-w-[260px] desktop:max-w-[260px] xs:max-w-[110px]">
          {bestOffer?.tokenAmountToReceive ?
          (hasThreeZerosAfterDecimal(bestOffer?.tokenAmountToReceive)
            ? bestOffer?.tokenAmountToReceive.toFixed(8)
            : bestOffer?.tokenAmountToReceive.toFixed(4))
          : 0}
        </NumberText>
      );
    }
  };

  return (
    <div id='enter-amount' className="flex flex-col gap-1 group">
      <BodySmall className="group-hover:text-black_grey/[.4] font-normal">
        {tokenSymbol}
      </BodySmall>
      {type === CardPosition.SWAP ? (
        <>
          <input
            id='input-enter-amount'
            type="number"
            step="any"
            value={inputValue}
            onChange={(e) => handleTokenAmountChange(e)}
            placeholder='0'
            style={{ width: '100%' }}
            className="text-black_grey font-normal !text-3xl outline-none focus:outline-none focus:ring-0 focus:bg-[#292D32]/[.05] focus:border-b focus:border-b-black_grey group-hover:bg-[#292D32]/[.05] group-hover:border-b group-hover:border-b-black_grey"
            data-testid="enter-amount-input"
          />
          {tokenBalanceLimit(Number(inputValue)) && <BodySmall id='token-balance-limit-enter-amount' data-testid="error-max-limit">{tokenBalanceLimit(Number(inputValue))}</BodySmall>}
        </>
      ) : (
        <Offer />
      )}
      <div className="flex justify-between">
        <BodySmall id='usd-conversion-enter-amount' className="group-hover:text-black_grey/[.4]">
          ${type === CardPosition.SWAP ? (usdPriceSwapToken * amountSwap).toFixed(2) : (usdPriceReceiveToken * amountReceive).toFixed(2)}
        </BodySmall>
        <img src={type === CardPosition.SWAP ? SendArrow : ReceiveArrow} alt={type === CardPosition.SWAP ? 'Send' : 'Receive'} />
      </div>
    </div>
  );
};

export default EnterAmount;

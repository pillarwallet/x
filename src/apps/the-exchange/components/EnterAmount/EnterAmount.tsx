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
import { AmountType, CardPosition, SwapOffer } from '../../utils/types';
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
  const amountSwap = useAppSelector((state) => state.swap.amountSwap as AmountType);
  const amountReceive = useAppSelector((state) => state.swap.amountReceive as AmountType);
  const swapToken = useAppSelector((state) => state.swap.swapToken as Token);
  const receiveToken = useAppSelector((state) => state.swap.receiveToken as Token);
  const bestOffer = useAppSelector((state) => state.swap.bestOffer as SwapOffer);
  const usdPriceSwapToken = useAppSelector((state) => state.swap.usdPriceSwapToken as number);
  const usdPriceReceiveToken = useAppSelector((state) => state.swap.usdPriceReceiveToken as number);
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
      fromAmount: amountSwap?.tokenAmount ?? 0,
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
      if (usdPriceReceiveToken > 0 ) {
        dispatch(setAmountReceive({
          tokenAmount: offer?.tokenAmountToReceive,
          usdAmount: usdPriceReceiveToken * offer.tokenAmountToReceive,
        }));
      } else {
        dispatch(setAmountReceive({ tokenAmount: offer.tokenAmountToReceive, usdAmount: 0 }));
      }
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

  // getOffer will be called every time the swap amount or the swap/receive token is changed
  useEffect(() => {
    setInputValue(amountSwap ? amountSwap.tokenAmount.toString() : '');
    if (amountSwap?.tokenAmount) {
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
  // the handleTokenAmountChange will make sure that we get a USD price, and will then add it to amountSwap
  const handleTokenAmountChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // Might need to find a way to debounce the getPrice call too
    if (type === CardPosition.SWAP && swapToken) {
      if (usdPriceSwapToken > 0) {
        dispatch(setAmountSwap({ tokenAmount: Number(value), usdAmount: usdPriceSwapToken * Number(value) }));
      } else {
        dispatch(setAmountSwap({ tokenAmount: Number(value), usdAmount: 0 }));
      }
    }
  };

  // Function to render offer based on loading and offer state
  const Offer = () => {
    if (isOfferLoading) {
      return <CircularProgress size={36} sx={{ color: '#343434' }} />;
    } else if (isNoOffer) {
      return <Body className='mobile:text-xs'>Sorry, no offers were found! Please check or change the amounts and try again.</Body>;
    } else if (bestOffer) {
      return (
        <NumberText className="text-black_grey font-normal text-3xl break-words mobile:max-w-[180px] tablet:max-w-[260px] desktop:max-w-[260px] xs:max-w-[110px]">
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
    <div className="flex flex-col gap-1 group">
      <BodySmall className="group-hover:text-black_grey/[.4] font-normal">
        {tokenSymbol}
      </BodySmall>
      {type === CardPosition.SWAP ? (
        <>
          <input
            type="number"
            step="any"
            value={inputValue}
            onChange={(e) => handleTokenAmountChange(e)}
            placeholder='0'
            style={{ width: '100%' }}
            className="text-black_grey font-normal !text-3xl outline-none focus:outline-none focus:ring-0 focus:bg-[#292D32]/[.05] focus:border-b focus:border-b-black_grey group-hover:bg-[#292D32]/[.05] group-hover:border-b group-hover:border-b-black_grey"
            data-testid="enter-amount-input"
          />
          {tokenBalanceLimit(Number(inputValue)) && <BodySmall data-testid="error-max-limit">{tokenBalanceLimit(Number(inputValue))}</BodySmall>}
        </>
      ) : (
        <Offer />
      )}
      <div className="flex justify-between">
        <BodySmall className="group-hover:text-black_grey/[.4]">
          ${type === CardPosition.SWAP ? amountSwap?.usdAmount.toFixed(2) : amountReceive?.usdAmount.toFixed(2)}
        </BodySmall>
        <img src={type === CardPosition.SWAP ? SendArrow : ReceiveArrow} alt={type === CardPosition.SWAP ? 'Send' : 'Receive'} />
      </div>
    </div>
  );
};

export default EnterAmount;

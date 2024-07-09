import { useState, useEffect } from 'react';
import _ from 'lodash';

// reducer
import { setAmountReceive, setAmountSwap, setBestOffer } from '../../reducer/theExchangeSlice';

// hooks
import useOffer from '../../hooks/useOffer';
import useAccountBalances from '../../../../hooks/useAccountBalances';
import { useAppDispatch, useAppSelector } from '../../hooks/useReducerHooks';
import { useEtherspotPrices, useEtherspotUtils, useWalletAddress } from '@etherspot/transaction-kit';

// types
import { CardPosition, SwapOffer } from '../../utils/types';
import { RateInfo } from '@etherspot/prime-sdk/dist/sdk/data';

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
  const amountSwap = useAppSelector((state) => state.amountSwap);
  const amountReceive = useAppSelector((state) => state.amountReceive);
  const swapToken = useAppSelector((state) => state.swapToken);
  const receiveToken = useAppSelector((state) => state.receiveToken);
  const bestOffer = useAppSelector((state) => state.bestOffer);
  
  const walletAddress = useWalletAddress();
  const [inputValue, setInputValue] = useState<number>(0);
  const { getPrice } = useEtherspotPrices();
  const balances = useAccountBalances();
  const { isZeroAddress, addressesEqual } = useEtherspotUtils();
  const { getBestOffer } = useOffer(swapToken?.chainId || 0);
  const [isOfferLoading, setIsOfferLoading] = useState<boolean>(false);
  const [isNoOffer, setIsNoOffer] = useState<boolean>(false);

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

    if (offer && receiveToken) {
      const usdPrice = await getPrice(receiveToken.address, receiveToken.chainId).catch((e) => {
        console.error('Failed to fetch USD price of token:', e);
        return {} as RateInfo;
      });

      if (usdPrice) {
        dispatch(setAmountReceive({
          tokenAmount: offer?.tokenAmountToReceive,
          usdAmount: usdPrice.usd * offer.tokenAmountToReceive,
        }));
      } else {
        dispatch(setAmountReceive({ tokenAmount: offer.tokenAmountToReceive, usdAmount: 0 }));
      }
    } else {
      setIsNoOffer(true);
    }

    setIsOfferLoading(false);

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
    if (balance && tokenAmount > balance) {
      return `The maximum amount of ${swapToken?.symbol} in your wallet is ${balance.toFixed(4)} ${swapToken?.symbol} - please change the amount and try again`;
    }

    return undefined;
  };

  // getOffer will be called every time the swap amount or the swap/receive token is changed
  useEffect(() => {
    setInputValue(amountSwap ? amountSwap.tokenAmount : 0);
    if (amountSwap?.tokenAmount) {
      setIsOfferLoading(true);
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
    setInputValue(Number(value));

    // Might need to find a way to debounce the getPrice call too
    if (type === CardPosition.SWAP && swapToken) {
      const usdPrice = await getPrice(swapToken.address, swapToken.chainId);
      if (usdPrice) {
        dispatch(setAmountSwap({ tokenAmount: Number(value), usdAmount: usdPrice.usd * Number(value) }));
      } else {
        dispatch(setAmountSwap({ tokenAmount: Number(value), usdAmount: 0 }));
      }
    }
  };

  // Function to render offer based on loading and offer state
  const renderOffer = () => {
    if (isOfferLoading) {
      return <CircularProgress size={36} sx={{ color: '#343434' }} />;
    } else if (isNoOffer) {
      return <Body>Sorry, no offers were found! Please check or change the amounts and try again.</Body>;
    } else if (bestOffer) {
      return (
        <NumberText className="text-black_grey font-normal text-3xl break-words mobile:max-w-[180px] tablet:max-w-[260px] desktop:max-w-[260px] xs:max-w-[110px]">
          {hasThreeZerosAfterDecimal(bestOffer?.tokenAmountToReceive)
            ? bestOffer?.tokenAmountToReceive.toFixed(8)
            : bestOffer?.tokenAmountToReceive.toFixed(4)}
        </NumberText>
      );
    }
  };

  return (
    <div className="flex flex-col gap-1 group">
      <BodySmall className="goup-hover:text-black_grey/[.4] font-normal">
        {tokenSymbol}
      </BodySmall>
      {type === CardPosition.SWAP ? (
        <>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => handleTokenAmountChange(e)}
            style={{ width: '100%' }}
            className="text-black_grey font-normal !text-3xl outline-none focus:outline-none focus:ring-0 focus:bg-[#292D32]/[.05] focus:border-b focus:border-b-black_grey group-hover:bg-[#292D32]/[.05] group-hover:border-b group-hover:border-b-black_grey"
            data-testid="enter-amount-input"
          />
          {tokenBalanceLimit(inputValue) && <BodySmall data-testid="error-max-limit">{tokenBalanceLimit(inputValue)}</BodySmall>}
        </>
      ) : (
        renderOffer()
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

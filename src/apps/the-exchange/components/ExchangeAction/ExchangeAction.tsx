/* eslint-disable no-await-in-loop */
import { useWalletAddress } from '@etherspot/transaction-kit';
import { CircularProgress } from '@mui/material';
import { BigNumber } from 'ethers';
import { useEffect, useState } from 'react';
import { formatEther } from 'viem';

// services
import {
  Token,
  chainNameToChainIdTokensData,
  convertPortfolioAPIResponseToToken,
} from '../../../../services/tokensData';

// hooks
import useBottomMenuModal from '../../../../hooks/useBottomMenuModal';
import useGlobalTransactionsBatch from '../../../../hooks/useGlobalTransactionsBatch';
import { useTransactionDebugLogger } from '../../../../hooks/useTransactionDebugLogger';
import useOffer, { getNativeBalanceFromPortfolio } from '../../hooks/useOffer';
import { useAppSelector } from '../../hooks/useReducerHooks';

// types
import { PortfolioData } from '../../../../types/api';
import { SwapOffer } from '../../utils/types';

// utils
import { isApproveTransaction } from '../../../../utils/blockchain';
import { formatTokenAmount } from '../../utils/converters';

// components
import TokenLogo from '../TokenLogo/TokenLogo';
import Body from '../Typography/Body';
import BodySmall from '../Typography/BodySmall';
import NumberText from '../Typography/NumberText';

// images
import ArrowRight from '../../images/arrow-right.png';
import {
  getFeeAmount,
  getFeeSymbol,
  isERC20FeeTx,
  isNativeFeeTx,
} from '../../utils/blockchain';

const ExchangeAction = () => {
  const bestOffer = useAppSelector(
    (state) => state.swap.bestOffer as SwapOffer
  );
  const swapToken = useAppSelector((state) => state.swap.swapToken as Token);
  const receiveToken = useAppSelector(
    (state) => state.swap.receiveToken as Token
  );
  const isOfferLoading = useAppSelector(
    (state) => state.swap.isOfferLoading as boolean
  );
  const amountSwap = useAppSelector((state) => state.swap.amountSwap as number);

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isAddingToBatch, setIsAddingToBatch] = useState<boolean>(false);
  const [feeInfo, setFeeInfo] = useState<{
    amount: string;
    symbol: string;
    recipient: string;
    warning?: string;
  } | null>(null);
  const { addToBatch } = useGlobalTransactionsBatch();
  const { showSend, setShowBatchSendModal } = useBottomMenuModal();
  const { getStepTransactions } = useOffer();
  const walletAddress = useWalletAddress();
  const { transactionDebugLog } = useTransactionDebugLogger();
  const walletPortfolio = useAppSelector(
    (state) => state.swap.walletPortfolio as PortfolioData | undefined
  );

  const feeReceiver = import.meta.env.VITE_SWAP_FEE_RECEIVER;

  const isNoValidOffer =
    !bestOffer ||
    !bestOffer.tokenAmountToReceive ||
    Number(bestOffer.tokenAmountToReceive) === 0;

  const fetchFeeInfo = async () => {
    setFeeInfo(null);
    setErrorMessage('');
    if (!bestOffer || !swapToken || !walletAddress) return;
    try {
      // Extract cached native balance for the relevant chain
      const nativeBalance = getNativeBalanceFromPortfolio(
        walletPortfolio
          ? convertPortfolioAPIResponseToToken(walletPortfolio)
          : undefined,
        bestOffer.offer.fromChainId
      );
      // Only get the fee transaction, not the whole batch
      const stepTxs = await getStepTransactions(
        swapToken,
        bestOffer.offer,
        walletAddress,
        nativeBalance
      );
      transactionDebugLog(
        'Step transactions:',
        stepTxs,
        'Fee receiver:',
        feeReceiver
      );
      // Find the fee transfer (to feeReceiver for native, or ERC20 transfer for stablecoin)
      const feeTx = stepTxs.find(
        (tx) => isNativeFeeTx(tx, feeReceiver) || isERC20FeeTx(tx, swapToken)
      );
      if (feeTx) {
        const amount = getFeeAmount(feeTx, swapToken, swapToken.decimals);
        const symbol = getFeeSymbol(
          feeTx,
          swapToken,
          bestOffer.offer.fromChainId
        );
        setFeeInfo({
          amount,
          symbol,
          recipient: String(feeReceiver),
          warning: undefined,
        });
      } else {
        transactionDebugLog(
          'No fee transaction found in stepTxs for feeReceiver:',
          feeReceiver
        );
        setFeeInfo({
          amount: '0',
          symbol: swapToken.symbol,
          recipient: String(feeReceiver),
          warning: 'Fee transaction not found. Please check your swap setup.',
        });
      }
    } catch (e) {
      setFeeInfo(null);
      transactionDebugLog('Fee estimation error:', e);
      setErrorMessage(
        'Unable to prepare the swap. Please check your wallet and try again.'
      );
    }
  };

  useEffect(() => {
    fetchFeeInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bestOffer, swapToken, walletAddress]);

  const getTransactionTitle = (
    index: number,
    length: number,
    callData: string
  ): string => {
    const transactionApprove = isApproveTransaction(callData);
    if (length > 1 && transactionApprove) {
      return `Swap assets (approve) ${index + 1}/${length}`;
    }
    if (length > 1 && !transactionApprove) {
      return `Swap assets ${index + 1}/${length}`;
    }
    return 'Swap assets';
  };

  const onClickToExchange = async () => {
    setErrorMessage('');

    if (isOfferLoading) {
      setErrorMessage('Please wait until the offer is found.');
      return;
    }

    if (isNoValidOffer) {
      setErrorMessage(
        'No offer was found! Please try changing the amounts to try again.'
      );
      return;
    }

    try {
      setIsAddingToBatch(true);

      // Extract cached native balance for the relevant chain
      const nativeBalance = getNativeBalanceFromPortfolio(
        walletPortfolio
          ? convertPortfolioAPIResponseToToken(walletPortfolio)
          : undefined,
        bestOffer.offer.fromChainId
      );
      const stepTransactions = await getStepTransactions(
        swapToken,
        bestOffer.offer,
        walletAddress as `0x${string}`,
        nativeBalance
      );

      transactionDebugLog(
        'The Exchange - Step Transactions:',
        stepTransactions
      );

      if (!stepTransactions.length) {
        setErrorMessage(
          'We were not able to add this to the queue at the moment. Please try again.'
        );
        setIsAddingToBatch(false);
        return;
      }

      if (stepTransactions.length) {
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < stepTransactions.length; ++i) {
          const { value } = stepTransactions[i];
          const bigIntValue = BigNumber.from(value).toBigInt();
          const integerValue = formatEther(bigIntValue);

          transactionDebugLog(
            'The Exchange - Adding transaction to batch:',
            stepTransactions[i]
          );

          addToBatch({
            title: getTransactionTitle(
              i,
              stepTransactions.length,
              stepTransactions[i].data?.toString() ?? ''
            ),
            description:
              `${amountSwap} ${swapToken.symbol} on ${swapToken.blockchain.toUpperCase()} to ${bestOffer.tokenAmountToReceive} ${receiveToken.symbol} on ${receiveToken.blockchain.toUpperCase()}` ||
              '',
            chainId: chainNameToChainIdTokensData(swapToken?.blockchain) || 0,
            to: stepTransactions[i].to || '',
            value: integerValue,
            data: stepTransactions[i].data?.toString() ?? '',
          });
        }
        setShowBatchSendModal(true);
        showSend();
      }
      setIsAddingToBatch(false);
    } catch (error) {
      transactionDebugLog('Swap batch error:', error);
      setErrorMessage(
        'We were not able to add this to the queue at the moment. Please try again.'
      );
      setIsAddingToBatch(false);
    }
  };

  return (
    <div
      id="exchange-action"
      className="flex flex-col w-full tablet:max-w-[420px] desktop:max-w-[420px] mb-20"
    >
      <div
        className={`flex flex-col gap-4 rounded-t-[3px] p-4 border-b border-black_grey ${!isNoValidOffer && !isOfferLoading ? 'bg-white' : 'bg-white/[.6]'}`}
      >
        <Body className="font-normal">You receive</Body>
        <div className="flex justify-between items-end">
          {isOfferLoading ? (
            <CircularProgress size={64.5} sx={{ color: '#343434' }} />
          ) : (
            <NumberText className="font-normal text-[43px]">
              {isNoValidOffer
                ? '0'
                : formatTokenAmount(bestOffer?.tokenAmountToReceive)}
            </NumberText>
          )}
          <div className="flex gap-1 items-center">
            <TokenLogo
              tokenName={receiveToken?.name}
              tokenLogo={receiveToken?.logo}
              showLogo={Boolean(receiveToken)}
            />
            <Body className="font-normal">{receiveToken?.symbol ?? ''}</Body>
          </div>
        </div>
        {!isNoValidOffer && feeInfo && (
          <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-200">
            <BodySmall className="font-normal text-black_grey">
              Fee: {feeInfo.amount} {feeInfo.symbol}
            </BodySmall>
            {feeInfo.warning && (
              <BodySmall className="text-orange-600 font-normal mt-1">
                {feeInfo.warning}
              </BodySmall>
            )}
          </div>
        )}
      </div>
      <div
        id="exchange-action-button"
        onClick={onClickToExchange}
        className={`flex gap-4 rounded-b-[3px] p-4 gap-2 items-center ${!isNoValidOffer && !isOfferLoading ? 'bg-white cursor-pointer' : 'bg-white/[.6]'}`}
      >
        <Body>Exchange</Body>
        {errorMessage && <BodySmall>{errorMessage}</BodySmall>}
        {isAddingToBatch ? (
          <CircularProgress
            size={24}
            sx={{ color: '#343434' }}
            data-testid="loading-circular"
          />
        ) : (
          <img src={ArrowRight} alt="arrow-right" className="w-5 h-5" />
        )}
      </div>
    </div>
  );
};

export default ExchangeAction;

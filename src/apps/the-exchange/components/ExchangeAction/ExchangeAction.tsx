/* eslint-disable no-await-in-loop */
import { useWalletAddress } from '@etherspot/transaction-kit';
import { CircularProgress } from '@mui/material';
import { BigNumber } from 'ethers';
import { useState } from 'react';
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
import useOffer from '../../hooks/useOffer';
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
  const { addToBatch } = useGlobalTransactionsBatch();
  const { showSend, setShowBatchSendModal } = useBottomMenuModal();
  const { getStepTransactions } = useOffer();
  const walletAddress = useWalletAddress();
  const { transactionDebugLog } = useTransactionDebugLogger();
  const walletPortfolio = useAppSelector(
    (state) => state.swap.walletPortfolio as PortfolioData | undefined
  );

  const isNoValidOffer =
    !bestOffer ||
    !bestOffer.tokenAmountToReceive ||
    Number(bestOffer.tokenAmountToReceive) === 0;

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

      // Convert walletPortfolio to Token[] for userPortfolio
      const userPortfolio = walletPortfolio
        ? convertPortfolioAPIResponseToToken(walletPortfolio)
        : undefined;
      const stepTransactions = await getStepTransactions(
        swapToken,
        bestOffer.offer,
        walletAddress as `0x${string}`,
        userPortfolio,
        amountSwap
      );

      transactionDebugLog(
        'The Exchange - Step Transactions:',
        stepTransactions
      );

      // Debug: Log WalletConnect transaction preparation
      console.log('Exchange App - WalletConnect transaction preparation:', {
        walletAddress,
        swapToken: swapToken.symbol,
        receiveToken: receiveToken.symbol,
        amountSwap,
        stepTransactionsCount: stepTransactions.length
      });

      if (!stepTransactions.length) {
        setErrorMessage(
          'We were not able to add this to the queue at the moment. Please try again.'
        );
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
    } catch (error) {
      transactionDebugLog('Swap batch error:', error);
      setErrorMessage(
        'We were not able to add this to the queue at the moment. Please try again.'
      );
    } finally {
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

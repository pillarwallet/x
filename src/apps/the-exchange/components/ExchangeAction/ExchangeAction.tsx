/* eslint-disable no-await-in-loop */
import { CircularProgress } from '@mui/material';
import { BigNumber } from 'ethers';
import { useState } from 'react';

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
import useTransactionKit from '../../../../hooks/useTransactionKit';
import useOffer from '../../hooks/useOffer';
import { useAppSelector } from '../../hooks/useReducerHooks';

// utils
import { logExchangeError } from '../../utils/sentry';

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
  const { showSend, setShowBatchSendModal } = useBottomMenuModal();
  const { getStepTransactions } = useOffer();
  const { kit, walletAddress } = useTransactionKit();
  const { setTransactionMetaForName } = useGlobalTransactionsBatch();
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

  /**
   * Execute the swap transaction
   * This function handles the entire swap process including validation,
   * transaction building, and batch submission
   */
  const onClickToExchange = async () => {
    setErrorMessage('');

    /**
     * Step 1: Validate required data before proceeding
     * Ensure all necessary data is available before attempting the swap
     */
    if (!swapToken || !receiveToken) {
      const errorMsg = 'Please select both tokens before proceeding.';
      setErrorMessage(errorMsg);
      return;
    }

    if (amountSwap <= 0) {
      const errorMsg = 'Please enter a valid amount to swap.';
      setErrorMessage(errorMsg);
      return;
    }

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

      /**
       * Step 2: Convert wallet portfolio data
       * Transform the portfolio data into the format expected by the transaction builder
       */
      const userPortfolio = walletPortfolio
        ? convertPortfolioAPIResponseToToken(walletPortfolio)
        : undefined;

      /**
       * Step 3: Build transaction steps
       * Get the sequence of transactions needed to execute the swap
       * This includes fee payments, approvals, and the actual swap
       */
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

      if (!stepTransactions || stepTransactions.length === 0) {
        setErrorMessage(
          'We were not able to add this to the queue at the moment. Please try again.'
        );
        return;
      }

      if (stepTransactions.length) {
        /**
         * Step 4: Add transactions to batch
         * Process each transaction step and add it to the batch for execution
         */
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < stepTransactions.length; ++i) {
          const transactionData = stepTransactions[i];

          // Validate transaction data
          if (!transactionData.to) {
            throw new Error(`Transaction ${i + 1} is missing 'to' address`);
          }

          /**
           * Handle bigint conversion properly
           * Ensure values are properly converted for the batch system
           */
          const { value, data, to } = transactionData;

          // Handle bigint conversion properly
          let bigIntValue: bigint;
          if (typeof value === 'bigint') {
            // If value is already a native bigint, use it directly
            bigIntValue = value;
          } else if (value) {
            // If value exists but is not a bigint, convert it
            bigIntValue = BigNumber.from(value).toBigInt();
          } else {
            // If value is undefined/null, use 0
            bigIntValue = BigInt(0);
          }

          transactionDebugLog(
            'The Exchange - Adding transaction to batch:',
            transactionData
          );

          /**
           * Add transaction to batch with proper metadata
           * Each transaction includes title, description, and execution parameters
           */

          // Create transactionName
          const chainId =
            chainNameToChainIdTokensData(swapToken?.blockchain) || 0;
          if (chainId === 0) {
            throw new Error(`Invalid chain: ${swapToken?.blockchain}`);
          }
          const transactionName = `tx-${chainId}-${data}`;
          const batchName = `batch-${chainId}`;

          kit
            .transaction({
              chainId,
              to: to as `0x${string}`,
              value: bigIntValue,
              data: data?.toString() ?? '',
            })
            .name({ transactionName })
            .addToBatch({ batchName });

          // Create description using transactionDescription helper
          const description = `${amountSwap} ${swapToken.symbol} on ${swapToken.blockchain.toUpperCase()} to ${bestOffer.tokenAmountToReceive} ${receiveToken.symbol} on ${receiveToken.blockchain.toUpperCase()}`;

          setTransactionMetaForName(transactionName, {
            title: getTransactionTitle(
              i,
              stepTransactions.length,
              data?.toString() ?? ''
            ),
            description,
          });
        }

        /**
         * Step 5: Open batch modal
         * Show the batch modal to user for transaction review and execution
         */
        setShowBatchSendModal(true);
        showSend();
      }
    } catch (error) {
      /**
       * Error handling for transaction execution
       * Log the error and provide user-friendly error message
       */
      // Log only critical errors with essential context
      logExchangeError(
        error instanceof Error ? error : String(error),
        {
          operation: 'exchange_click',
          swapToken: swapToken?.symbol,
          receiveToken: receiveToken?.symbol,
          amountSwap,
          walletAddress,
        },
        {
          component: 'ExchangeAction',
          method: 'onClickToExchange',
        }
      );

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

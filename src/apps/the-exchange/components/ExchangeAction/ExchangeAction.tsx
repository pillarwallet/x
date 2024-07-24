import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

// hooks
import useGlobalTransactionsBatch from '../../../../hooks/useGlobalTransactionsBatch';
import useBottomMenuModal from '../../../../hooks/useBottomMenuModal';
import { useEtherspotSwaps } from '@etherspot/transaction-kit';
import { useAppSelector } from '../../hooks/useReducerHooks';

// types
import { SwapOffer } from '../../utils/types';

// utils
import { hasThreeZerosAfterDecimal } from '../../utils/converters';

// components
import TokenLogo from '../TokenLogo/TokenLogo';
import Body from '../Typography/Body';
import NumberText from '../Typography/NumberText';
import BodySmall from '../Typography/BodySmall';
import { CircularProgress } from '@mui/material';

// images
import ArrowRight from '../../images/arrow-right.png';
import { Token } from '@etherspot/prime-sdk/dist/sdk/data';

const ExchangeAction = () => {
    const bestOffer = useAppSelector((state) => state.swap.bestOffer as SwapOffer);
    const swapToken = useAppSelector((state) => state.swap.swapToken as Token);
    const receiveToken = useAppSelector((state) => state.swap.receiveToken as Token);
    const isOfferLoading = useAppSelector((state) => state.swap.isOfferLoading as boolean);

    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isAddingToBatch, setIsAddingToBatch] = useState<boolean>(false);
    const { addToBatch } = useGlobalTransactionsBatch();
    const { showSend } = useBottomMenuModal();
    const { prepareCrossChainOfferTransactions } = useEtherspotSwaps();

    useEffect(() => {
        setErrorMessage('');
    }, [bestOffer])

    const onClickToExchange = async () => {
        setErrorMessage('');

        if (isOfferLoading) {
            setErrorMessage('Please wait until the offer is found.');
            return;
        }

        if (!bestOffer) {
            setErrorMessage('No offer was found! Please try changing the amounts to try again.');
            return;
        }

        try {
            setIsAddingToBatch(true);

            // receiveAmount param is unique to the ExchangeOffer type - same chain, different tokens
            if ('receiveAmount' in bestOffer.offer) {
                for (let i = 0; i < bestOffer.offer.transactions.length; ++i) {
                    addToBatch({
                        title: 'Swap assets',
                        chainId: swapToken?.chainId || 0,
                        to: bestOffer.offer.transactions[i].to,
                        value: bestOffer.offer.transactions[i].value,
                        data: bestOffer.offer.transactions[i].data,
                    });
                }
                showSend();
            }

            // insurance param is unique to the Route type - different chains, different tokens
            if ('id' in bestOffer.offer) {
                const stepTransactions = await prepareCrossChainOfferTransactions(bestOffer.offer);
                if (stepTransactions) {
                    for (let i = 0; i < stepTransactions.length; ++i) {
                        addToBatch({
                            title: 'Swap assets',
                            chainId: swapToken?.chainId || 0,
                            to: stepTransactions[i].to || '',
                            value: ethers.BigNumber.from(stepTransactions[i].value),
                            data: stepTransactions[i].data?.toString() ?? '',
                        });
                    }
                    showSend();
                }
            }
            setIsAddingToBatch(false);

        } catch (error) {
            console.error('Something went wrong. Please try again', error);
            setErrorMessage('We were not able to add this to the queue at the moment. Please try again.');
            setIsAddingToBatch(false);
        }
    };

    return (
        <div className='flex flex-col w-full tablet:max-w-[420px] desktop:max-w-[420px] mb-20'>
            <div className={`flex flex-col gap-4 rounded-t-[3px] p-4 border-b border-black_grey ${bestOffer?.tokenAmountToReceive && !isOfferLoading ? 'bg-white' : 'bg-white/[.6]'}`}>
                <Body className='font-normal'>You receive</Body>
                <div className='flex justify-between items-end'>
                    {isOfferLoading
                    ? <CircularProgress size={64.5} sx={{ color: '#343434' }} />
                    : <NumberText className='font-normal text-[43px]'>{bestOffer?.tokenAmountToReceive ? ((hasThreeZerosAfterDecimal(bestOffer?.tokenAmountToReceive) ? bestOffer?.tokenAmountToReceive.toFixed(8) : bestOffer?.tokenAmountToReceive.toFixed(4))) : 0}</NumberText>}
                    <div className='flex gap-1 items-center'>
                        <TokenLogo tokenLogo={receiveToken?.icon} />
                        <Body className='font-normal'>{receiveToken?.symbol ?? ''}</Body>
                    </div>
                </div>
            </div>
            <div onClick={onClickToExchange} className={`flex gap-4 rounded-b-[3px] p-4 gap-2 items-center ${bestOffer?.tokenAmountToReceive && !isOfferLoading ? 'bg-white cursor-pointer' : 'bg-white/[.6]'}`}>
                <Body>Exchange</Body>
                {errorMessage && (
                    <BodySmall>
                        {errorMessage}
                    </BodySmall>
                )}
                {isAddingToBatch ? <CircularProgress size={24} sx={{ color: '#343434' }} data-testid='loading-circular'/> : <img src={ArrowRight} className='w-5 h-5'/>}
            </div>
        </div>
    );
};

export default ExchangeAction;

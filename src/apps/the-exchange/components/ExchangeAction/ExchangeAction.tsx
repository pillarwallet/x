import TokenLogo from '../TokenLogo/TokenLogo';
import Body from '../Typography/Body';
import NumberText from '../Typography/NumberText';
import ArrowRight from '../../images/arrow-right.png';
import { useContext } from 'react';
import { SwapDataContext } from '../../context/SwapDataProvider';
import useGlobalTransactionsBatch from '../../../../hooks/useGlobalTransactionsBatch';

const ExchangeAction = () => {
    const { bestOffer, swapToken } = useContext(SwapDataContext);
    const { addToBatch } = useGlobalTransactionsBatch();

    const onClickToExchange = () => {
        if (bestOffer) {
            addToBatch({
                title: 'Swap assets',
                chainId: swapToken?.chainId || 0,
                to: bestOffer.transactions[0].to,
                value: bestOffer.transactions[0].value,
                data: bestOffer.transactions[0].data,
              });
        }
      }

    return (
        <div className='flex flex-col w-full tablet:max-w-[420px] desktop:max-w-[420px] mb-20'>
            <div className="flex flex-col bg-white gap-4 rounded-t-[3px] p-4 border-b border-black_grey">
                <Body className='font-normal'>You receive</Body>
                <div className='flex justify-between items-end'>
                    <NumberText className='font-normal text-[43px]'>0.00</NumberText>
                    <div className='flex gap-1 items-center'>
                        <TokenLogo />
                        <Body className='font-normal'>ZRX</Body>
                    </div>
                </div>
            </div>
            <div onClick={onClickToExchange} className="flex bg-white gap-4 rounded-b-[3px] p-4 gap-2 items-center cursor-pointer">
                <Body>Exchange</Body>
                <img src={ArrowRight} className='w-5 h-5'/>
            </div>
        </div>

    )
}

export default ExchangeAction;

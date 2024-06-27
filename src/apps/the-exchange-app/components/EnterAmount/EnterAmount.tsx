import BodySmall from '../Typography/BodySmall';
import SendArrow from '../../images/send-arrow.png';
import ReceiveArrow from '../../images/receive-arrow.png';
import { useContext, useState, useEffect } from 'react';
import { SwapReceive } from '../../utils/types';
import { SwapDataContext } from '../../context/SwapDataProvider';
import { useEtherspotPrices } from '@etherspot/transaction-kit';
import useOffer from '../../hooks/useOffer';

type EnterAmountProps = {
    type: SwapReceive;
    tokenSymbol?: string;
}

const EnterAmount = ({ type, tokenSymbol }: EnterAmountProps) => {
    const [isHover, setIsHover] = useState<boolean>(false);
    const [isFocus, setIsFocus] = useState<boolean>(false);
    const { amountSwap, setAmountSwap, amountReceive, setAmountReceive, swapToken, receiveToken, setBestOffer } = useContext(SwapDataContext);
    const [inputValue, setInputValue] = useState<string>('0.00');
    const { getPrice } = useEtherspotPrices();
    const { getBestOffer } = useOffer(swapToken?.chainId || 0);

    const getOffer = async () => {
        const params = {
            fromAmount: amountSwap?.tokenAmount || 0,
            fromTokenAddress: swapToken?.address || '',
            fromChainId: swapToken?.chainId || 0,
            fromTokenDecimals: swapToken?.decimals || 0,
            toTokenAddress: receiveToken?.address || '',
            toChainId: receiveToken?.chainId || 0,
            toTokenDecimals: receiveToken?.decimals || 0,
        }
        const offer = await getBestOffer(params);

        return offer;
    }
    
    useEffect(() => {
        getOffer().then((offer) => setBestOffer(offer));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [amountSwap, swapToken, receiveToken])

    useEffect(() => {
        if (type === SwapReceive.SWAP) {
            setInputValue(amountSwap ? amountSwap.tokenAmount.toString() : '0.00');
        } else {
            setInputValue(amountReceive ? amountReceive.tokenAmount.toString() : '0.00');
        }
    }, [type, amountSwap, amountReceive]);

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
    
        if (type === SwapReceive.SWAP && swapToken) {
            const usdPrice = await getPrice(swapToken.address, swapToken.chainId);
            if (usdPrice) {
                setAmountSwap({ tokenAmount: Number(value), usdAmount: usdPrice.usd * Number(value) });
            } else {
                setAmountSwap({ tokenAmount: Number(value), usdAmount: 0 });
            }
        } else if (type === SwapReceive.RECEIVE && receiveToken) {
            const usdPrice = await getPrice(receiveToken.address, receiveToken.chainId);
            if (usdPrice) {
                setAmountReceive({ tokenAmount: Number(value), usdAmount: usdPrice.usd * Number(value) });
            } else {
                setAmountReceive({ tokenAmount: Number(value), usdAmount: 0 });
            }
        }
    };


    return (
        <div 
            onMouseEnter={() => setIsHover(true)} 
            onMouseLeave={() => setIsHover(false)} 
            className="flex flex-col gap-1 group"
        >
            <BodySmall className={`${(isHover && !isFocus) && 'text-black_grey/[.4]'} font-normal`}>
                {tokenSymbol}
            </BodySmall>
            <input 
                type='number' 
                value={inputValue} 
                onChange={handleChange} 
                onFocus={() => setIsFocus(true)} 
                onBlur={() => setIsFocus(false)} 
                className='text-black_grey font-normal !text-3xl outline-none focus:outline-none focus:ring-0 focus:bg-[#292D32]/[.05] focus:border-b focus:border-b-black_grey group-hover:bg-[#292D32]/[.05] group-hover:border-b group-hover:border-b-black_grey mobile:max-w-[120px] tablet:max-w-[260px] desktop:max-w-[260px] xs:max-w-[100px]' 
            />
            <div className='flex justify-between'>
                <BodySmall className={`${(isHover && !isFocus) && 'text-black_grey/[.4]'}`}>
                    ${type === SwapReceive.SWAP ? amountSwap?.usdAmount.toFixed(2) : amountReceive?.usdAmount.toFixed(2)}
                </BodySmall>
                <img src={type === SwapReceive.SWAP ? SendArrow : ReceiveArrow} alt={type === SwapReceive.SWAP ? 'Send' : 'Receive'} />
            </div>
        </div>
    )
}

export default EnterAmount;

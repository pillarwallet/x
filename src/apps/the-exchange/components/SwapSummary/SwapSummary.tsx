// hooks
import { useAppSelector } from '../../hooks/useReducerHooks';

// types
import { AmountType, SwapOffer } from '../../utils/types';

// utils
import { hasThreeZerosAfterDecimal } from '../../utils/converters';

// components
import BodySmall from '../Typography/BodySmall';

// images
import ArrowRightLight from '../../images/arrow-right-light.png';
import { Token } from '@etherspot/prime-sdk/dist/sdk/data';

const SwapSummary = () => {
    const swapToken = useAppSelector((state) => state.swap.swapToken as Token);
    const receiveToken = useAppSelector((state) => state.swap.receiveToken as Token);
    const amountSwap = useAppSelector((state) => state.swap.amountSwap as AmountType);
    const amountReceive = useAppSelector((state) => state.swap.amountReceive as AmountType);
    const bestOffer = useAppSelector((state) => state.swap.bestOffer as SwapOffer);

    if (!swapToken || !receiveToken || !amountSwap || !amountReceive || !bestOffer) {
        return null;
    }
    const exchangeRate = (amountReceive.tokenAmount / amountSwap.tokenAmount) || 0;
    const usdPerToken = (amountReceive.usdAmount / amountSwap.tokenAmount) || 0;

    return (
        <div className="flex gap-1 justify-center border border-[#999999]/[.20] rounded-[3px] p-4 w-full tablet:max-w-[420px] desktop:max-w-[420px]">
            <BodySmall className="font-medium text-light_grey">1 {swapToken.symbol}</BodySmall>
            <img src={ArrowRightLight} className='w-3 h-3' alt="Arrow Right Light"/>
            <BodySmall className="font-medium text-light_grey">{hasThreeZerosAfterDecimal(exchangeRate) ? exchangeRate.toFixed(8) : exchangeRate.toFixed(4)} {receiveToken.symbol}</BodySmall>
            <BodySmall className="font-medium text-light_grey">(${usdPerToken.toFixed(2)})</BodySmall>
        </div>
    );
}

export default SwapSummary;

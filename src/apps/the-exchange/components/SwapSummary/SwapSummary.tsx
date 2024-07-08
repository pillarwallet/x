import { useContext } from 'react';

// context
import { SwapDataContext } from '../../context/SwapDataProvider';

// utils
import { hasThreeZerosAfterDecimal } from '../../utils/converters';

// components
import BodySmall from '../Typography/BodySmall';
import ArrowRightLight from '../../images/arrow-right-light.png';

const SwapSummary = () => {
    const { swapToken, receiveToken, amountSwap, amountReceive, bestOffer } = useContext(SwapDataContext);

    if (!swapToken || !receiveToken || !amountSwap || !amountReceive || !bestOffer) {
        return null;
    }
    const exchangeRate = amountReceive.tokenAmount / amountSwap.tokenAmount;
    const usdPerToken = amountReceive.usdAmount / amountSwap.tokenAmount;

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

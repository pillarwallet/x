import BodySmall from '../Typography/BodySmall';
import ArrowRightLight from '../../images/arrow-right-light.png';

const SwapSummary = () => {
    return (
        <div className="flex gap-1 justify-center border border-[#999999]/[.20] rounded-[3px] p-4 w-full tablet:max-w-[420px] desktop:max-w-[420px]">
            <BodySmall className="font-medium text-light_grey">1 ETH</BodySmall>
            <img src={ArrowRightLight} className='w-3 h-3'/>
            <BodySmall className="font-medium text-light_grey">1 ETH</BodySmall>
            <BodySmall className="font-medium text-light_grey">1 ETH</BodySmall>
        </div>
    )
}

export default SwapSummary;
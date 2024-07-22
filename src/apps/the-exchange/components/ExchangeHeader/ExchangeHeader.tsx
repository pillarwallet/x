// components
import Body from '../Typography/Body';
import BodySmall from '../Typography/BodySmall';

// images
import XLogo from '../../images/x-logo.png';

const ExchangeHeader = () => {
    return (
        <div className="flex flex-col mb-20 desktop:mb-28 ">
            <div className="flex gap-1 items-center">
                <img src={XLogo} className='w-[25px] h-[18.5px]' />
                <Body className='text-lg text-[#312F3A]'>The Exchange</Body>
            </div>
            <BodySmall className='text-sm text-[#312F3A]'>by PillarX</BodySmall>
        </div>
    )
}

export default ExchangeHeader;

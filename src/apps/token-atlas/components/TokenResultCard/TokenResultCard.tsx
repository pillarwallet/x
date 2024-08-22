// images
import LogoEx from '../../images/token-atlas-logo-small.svg';

// components
import Body from '../Typography/Body';

const TokenResultCard = () => {
    return (
        <div className="flex w-full bg-medium_grey rounded-lg p-4 justify-between items-center">
            <div className="flex items-center">
                <img src={LogoEx} className="w-[30px] h-[30px] object-fill rounded-full mr-2" />
                <div className='flex flex-col mr-2'>
                    <Body className="text-base">Ethereum</Body>
                    <Body className="text-white_grey">ETH</Body>
                </div>
            </div>
            <Body className='text-base font-medium'>On Entereum</Body>
        </div>
    );
};

export default TokenResultCard;

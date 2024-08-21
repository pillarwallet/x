// images
import LogoEx from '../../images/token-atlas-logo-small.svg';

// components
import Body from '../Typography/Body';

const TokenCard = () => {
    return (
        <div className="flex flex-col relative w-full bg-medium_grey rounded-lg px-4 pb-4 pt-6 items-center justify-center">
            <img src={LogoEx} className="absolute top-2 right-2 w-4 h-4 object-fill rounded-full" />
            <img src={LogoEx} className="w-[40px] h-[40px] object-fill rounded-full" />
            <Body className="text-base">Ethereum</Body>
            <Body className="text-white_grey">ETH</Body>
        </div>
    );
};

export default TokenCard;

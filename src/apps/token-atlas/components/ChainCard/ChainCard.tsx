// images
import LogoEx from '../../images/token-atlas-logo-small.svg';

// components
import Body from '../Typography/Body';

const ChainCard = () => {
    return (
        <div className="flex rounded-[50px] bg-medium_grey p-1 pr-3 items-center h-8 max-w-[150px]">
            <img src={LogoEx} className="w-[24px] h-[24px] object-fill rounded-full mr-2" />
            <Body className='truncate'>EthereumEthereumEthereum</Body>
        </div>
    );
};

export default ChainCard;

// components
import Body from '../Typography/Body';
import BodySmall from '../Typography/BodySmall';

const PriceCard = () => {
    return (
        <div className="flex flex-col bg-medium_grey rounded p-2 gap-1 w-[125px]">
            <BodySmall className='text-light_grey'>1H</BodySmall>
            <Body>1.65739205%</Body>
        </div>
    );
};

export default PriceCard;

// utils
import { limitDigits } from '../../utils/converters';

// components
import Body from '../Typography/Body';
import BodySmall from '../Typography/BodySmall';

type PriceCardProps = {
    percentage?: number;
    timePeriod?: string;
};

const PriceCard = ({ percentage, timePeriod }: PriceCardProps) => {
    if (!timePeriod || !percentage) return null;

    return (
        <div className="flex flex-col bg-medium_grey rounded p-2 gap-1 w-[125px]">
            <BodySmall className="text-light_grey">{timePeriod}</BodySmall>
            <Body>{limitDigits(percentage)}%</Body>
        </div>
    );
};

export default PriceCard;

import { createRef } from 'react';

// hooks
import useRefDimensions from '../../../pillarx-app/hooks/useRefDimensions';

// components
import ChainCard from '../ChainCard/ChainCard';
import Body from '../Typography/Body';
import PriceCard from '../PriceCard/PriceCard';
import BodyLight from '../Typography/BodyLight';

type TokenInfoColumnProps = {
    className?: string;
};

const TokenInfoColumn = ({ className }: TokenInfoColumnProps) => {
    const divRef = createRef<HTMLDivElement>();
    const dimensions = useRefDimensions(divRef);

    // TODO: change the total cards with the array of chains
    const totalCards = 4;

    const numberVisibleCards = Math.floor((dimensions.width - 50 || 0) / 158);
    const numberHiddenCards = totalCards - numberVisibleCards;

    return (
        <div ref={divRef} className={`flex flex-col gap-10 ${className}`}>
            <div className='flex flex-col gap-2'>
                <Body>Blockchains</Body>
                <div className='w-full h-fit flex gap-2'>
                    {Array.from({ length: numberVisibleCards }).map((_, index) =>
                        <ChainCard key={index} />
                    )}
                    {numberHiddenCards > 0 &&
                    <div className='flex rounded-full bg-medium_grey p-2 items-center h-8'>
                        <Body>+ {numberHiddenCards}</Body>
                    </div>
                    }
                </div>
            </div>
            <div className='flex flex-col gap-2'>
                <Body>Price changes</Body>
                <div className='flex flex-wrap gap-2'>
                    <PriceCard />
                    <PriceCard />
                    <PriceCard />
                    <PriceCard />
                    <PriceCard />
                </div>
            </div>
            <div className='flex flex-col gap-2 mb-20'>
                <Body>Stats</Body>
                <div className='flex flex-col rounded px-4 bg-medium_grey'>
                    <div className='flex justify-between border-b border-b-dark_grey py-3'>
                        <BodyLight>All time high</BodyLight>
                        <Body>0.07290420182023</Body>
                    </div>
                    <div className='flex justify-between border-b border-b-dark_grey py-3'>
                        <BodyLight>All time low</BodyLight>
                        <Body>0.0502828261</Body>
                    </div>
                    <div className='flex justify-between border-b border-b-dark_grey py-3'>
                        <BodyLight>Total supply</BodyLight>
                        <Body>800000000</Body>
                    </div>
                    <div className='flex justify-between border-b border-b-dark_grey py-3'>
                        <BodyLight>Circulating supply</BodyLight>
                        <Body>23423682391</Body>
                    </div>
                    <div className='flex justify-between border-b border-b-dark_grey py-3'>
                        <BodyLight>Diluted market cap</BodyLight>
                        <Body>3489724397</Body>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TokenInfoColumn;

// components
import TokenResultCard from '../TokenResultCard/TokenResultCard';
import Body from '../Typography/Body';

const TokensSearchResult = () => {
    return (
        <div className="flex flex-col w-full">
            <Body className="text-white_light_grey mb-4">Search tokens</Body>
            <div className='flex flex-col gap-4 max-h-[250px] overflow-auto'>
                <TokenResultCard />
                <TokenResultCard />
                <TokenResultCard />
                <TokenResultCard />
                <TokenResultCard />
                <TokenResultCard />
                <TokenResultCard />
                <TokenResultCard />
            </div>
        </div>
    );
};

export default TokensSearchResult;

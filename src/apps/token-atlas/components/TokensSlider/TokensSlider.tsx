// components
import TokenCard from '../TokenCard/TokenCard';
import Body from '../Typography/Body';

const TokensSlider = () => {
    return (
        <div className="flex flex-col overflow-x-scroll">
            <Body className="text-white_light_grey mb-4">Trending tokens</Body>
            <div className="flex">
                <div className="flex gap-4 mb-4">
                    <TokenCard />
                    <TokenCard />
                    <TokenCard />
                    <TokenCard />
                    <TokenCard />
                    <TokenCard />
                    <TokenCard />
                    <TokenCard />
                    <TokenCard />
                    <TokenCard />
                    <TokenCard />
                    <TokenCard />
                    <TokenCard />
                </div>
            </div>
        </div>
    );
};

export default TokensSlider;

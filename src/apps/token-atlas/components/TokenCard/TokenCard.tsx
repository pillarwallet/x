// components
import Body from '../Typography/Body';

type TokenCardProps = {
    tokenLogo?: string;
    tokenName?: string;
    tokenSymbol?: string;
    blockchainLogo?: string;
    onClick: () => void;
};

const TokenCard = ({ tokenLogo, tokenName, tokenSymbol, blockchainLogo, onClick }: TokenCardProps) => {
    return (
        <div className="flex flex-col relative w-[108px] h-[125px] bg-medium_grey rounded-lg px-4 pb-4 pt-6 items-center justify-center cursor-pointer" onClick={onClick}>
            {blockchainLogo && (
                <img
                    src={blockchainLogo}
                    className="absolute top-2 right-2 w-4 h-4 object-fill rounded-full"
                />
            )}
            {tokenLogo && (
                <img
                    src={tokenLogo}
                    className="w-[40px] h-[40px] object-fill rounded-full"
                />
            )}
            <Body className="text-base capitalize w-full truncate text-center">{tokenName}</Body>
            <Body className="text-white_grey">{tokenSymbol}</Body>
        </div>
    );
};

export default TokenCard;

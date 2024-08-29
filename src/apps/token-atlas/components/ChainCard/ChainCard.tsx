// components
import Body from '../Typography/Body';
import blockchainList from '../../utils/blockchainList.json';

type ChainCardProps = {
    chainName: string;
};

const ChainCard = ({ chainName }: ChainCardProps) => {
    const { data: blockchainsData } = blockchainList;

    const blockchain = blockchainsData.find(
        (blockchain) =>
            blockchain.name.toLocaleLowerCase() === chainName.toLowerCase()
    );

    const explorerLink = blockchain ? blockchain.explorer : undefined;
    const blockchainLogo = blockchain ? blockchain.logo : undefined;

    return (
        <a href={explorerLink} target="_blank" rel="noopener noreferrer">
            <div
                className={`flex rounded-[50px] bg-medium_grey p-1 pr-3 items-center h-8 max-w-[150px] ${
                    explorerLink && 'cursor-pointer'
                }`}
            >
                {blockchainLogo && (
                    <img
                        src={blockchainLogo}
                        className="w-[24px] h-[24px] object-fill rounded-full mr-2"
                    />
                )}
                <Body className="truncate capitalize">{chainName}</Body>
            </div>
        </a>
    );
};

export default ChainCard;

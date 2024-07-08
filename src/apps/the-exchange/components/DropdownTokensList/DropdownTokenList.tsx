import { useContext, useState } from 'react';

// types
import { CardPosition } from '../../utils/types';

// context
import { SwapDataContext } from '../../context/SwapDataProvider';

// utils
import { convertChainIdtoName } from '../../utils/converters';

// components
import TokenSearchInput from '../TokenSearchInput/TokenSearchInput';
import TokenListItem from '../TokenListItem/TokenListItem';
import SelectDropdown from '../SelectDropdown/SelectDropdown';

// images
import CloseIcon from '../../images/add.png';

type DropdownTokenListProps = {
    type: CardPosition;
    initialCardPosition: CardPosition;
};

const DropdownTokenList = ({ type, initialCardPosition }: DropdownTokenListProps) => {
    const [isChainSelectionOpen, setIsChainSelectionOpen] = useState<boolean>(false);
    const {
        isSwapOpen,
        setIsSwapOpen,
        setIsReceiveOpen,
        swapTokenData,
        receiveTokenData,
        setSwapToken,
        setReceiveToken,
        setSwapChain,
        setReceiveChain,
        searchTokenResult,
        swapChain,
        receiveChain,
        setSearchTokenResult,
    } = useContext(SwapDataContext);

    // select all chainsId of tokens available in the list for swap token
    const allChainsSwap = swapTokenData?.map((chain) => chain.chainId);
    const uniqueChainsSwap = allChainsSwap.filter((chain, index) => {
        return allChainsSwap.indexOf(chain) === index;
    });

    // select all chainsId of tokens available in the list for receive token
    const allChainsReceive = receiveTokenData?.map((chain) => chain.chainId);
    const uniqueChainsReceive = allChainsReceive.filter((chain, index) => {
        return allChainsReceive.indexOf(chain) === index;
    });

    // if there are no tokens being typed searched, we show the swapTokenData list of tokens
    // which will filter if a chain has been chosen
    const swapTokenList = searchTokenResult.length
    ? searchTokenResult
    : swapChain?.chainId
    ? swapTokenData.filter((token) => token.chainId === swapChain?.chainId)
    : swapTokenData;

    // if there are no tokens being typed searched, we show the receiveTokenData list of tokens
    // which will filter if a chain has been chosen
    const receiveTokenList = searchTokenResult.length
    ? searchTokenResult
    : receiveChain?.chainId
    ? receiveTokenData.filter((token) => token.chainId === receiveChain?.chainId)
    : receiveTokenData;

    return (
        <>
            <div className="fixed inset-0 bg-black_grey/[.9] -z-10" data-testid='dropdown-token-list'>
                <button
                    onClick={() => {type === CardPosition.SWAP ? setIsSwapOpen(false) : setIsReceiveOpen(false); setSearchTokenResult([])}}
                    className="fixed top-0 right-0 w-[50px] h-[50px] mt-6 mr-4 mb-20 desktop:mr-14 desktop:mb-28 bg-black"
                    data-testid='close-card-button'
                >
                    <img src={CloseIcon} className="w-full h-auto" />
                </button>
            </div>
            <div className="flex flex-col w-full max-w-[420px]">
                <div className={`flex flex-row gap-[10px] p-4 w-full rounded-t-[3px] border-b border-b-black_grey ${initialCardPosition === CardPosition.SWAP ? 'bg-green' : 'bg-purple'}`}>
                    <SelectDropdown
                        options={isSwapOpen ? uniqueChainsSwap : uniqueChainsReceive}
                        isOpen={isChainSelectionOpen}
                        onClick={() => setIsChainSelectionOpen(!isChainSelectionOpen)}
                        className={`${isChainSelectionOpen && 'w-full'}`}
                        onSelect={() => setIsChainSelectionOpen(false)}
                    />
                    <TokenSearchInput placeholder="Search tokens" isShrinked={isChainSelectionOpen} />
                </div>
                <div className={`flex flex-col p-4 w-full rounded-b-[3px] max-h-[272px] mr-4 overflow-y-auto ${initialCardPosition === CardPosition.SWAP ? 'bg-green' : 'bg-purple'}`}>
                    {isSwapOpen ? 
                        swapTokenList.map((token, index) => (
                            <TokenListItem
                                key={index}
                                onClick={() => {
                                    setSwapToken(token);
                                    setSwapChain({chainId: token.chainId, chainName: convertChainIdtoName(token.chainId)}); 
                                    setSearchTokenResult([]);
                                    setIsSwapOpen(false);
                                }}
                                tokenName={token.name}
                                tokenSymbol={token.symbol}
                                chainName={convertChainIdtoName(token.chainId)}
                                tokenLogo={token.icon}
                            />
                        ))
                    : 
                        receiveTokenList.map((token, index) => (
                            <TokenListItem
                                key={index}
                                onClick={() => {
                                    setReceiveToken(token);
                                    setReceiveChain({chainId: token.chainId, chainName: convertChainIdtoName(token.chainId)});
                                    setSearchTokenResult([]);
                                    setIsReceiveOpen(false);
                                }}
                                tokenName={token.name}
                                tokenSymbol={token.symbol}
                                chainName={convertChainIdtoName(token.chainId)}
                                tokenLogo={token.icon}
                            />
                        ))
                    }
                </div>
            </div>
        </>
    );
};

export default DropdownTokenList;

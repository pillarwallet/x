import { useContext, useState } from 'react';

import TextInput from '../TextInput/TextInput';
import TokenListItem from '../TokenListItem/TokenListItem';
import CloseIcon from '../../images/add.png';
import { SwapDataContext } from '../../context/SwapDataProvider';
import { CardPosition, SwapReceive } from '../../utils/types';
import SelectDropdown from '../SelectDropdown/SelectDropdown';

type DropdownTokenListProps = {
    type: SwapReceive;
    initialCardPosition: CardPosition;
}

const DropdownTokenList = ({ type, initialCardPosition }: DropdownTokenListProps) => {
    const [isChainSelectionOpen, setIsChainSelectionOpen] = useState<boolean>(false);
    const { isSwapOpen, setIsSwapOpen, setIsReceiveOpen, swapTokenData, receiveTokenData, setSwapToken, setReceiveToken } = useContext(SwapDataContext);
    
    const allChainsSwap = swapTokenData?.map((chain) => chain.chainId.toString());
    const uniqueChainsSwap = allChainsSwap.filter((chain, index) => {
        return allChainsSwap.indexOf(chain) === index;
    })

    const allChainsReceive = receiveTokenData?.map((chain) => chain.chainId.toString());
    const uniqueChainsReceive = allChainsReceive.filter((chain, index) => {
        return allChainsReceive.indexOf(chain) === index;
    })

    return (
        <>
        <div className="fixed inset-0 bg-black_grey/[.9] -z-10">
            <button onClick={() => type === SwapReceive.SWAP ? setIsSwapOpen(false) : setIsReceiveOpen(false)} className="fixed top-0 right-0 w-[50px] h-[50px] mt-6 mr-4 mb-20 desktop:mr-14 desktop:mb-28 bg-black">
                <img src={CloseIcon} className='w-full h-auto' />
            </button>
            
        </div>
        <div className='flex flex-col w-full max-w-[420px]'>
            <div className={`flex flex-row gap-[10px] p-4 w-full rounded-t-[3px] border-b border-b-black_grey ${initialCardPosition === CardPosition.LEFT ? 'bg-green' : 'bg-purple'}`}>
                <SelectDropdown options={isSwapOpen ? uniqueChainsSwap : uniqueChainsReceive} isOpen={isChainSelectionOpen} onClick={() => isChainSelectionOpen ? setIsChainSelectionOpen(false) : setIsChainSelectionOpen(true)} className={`${isChainSelectionOpen && 'w-full'}`} onSelect={() => setIsChainSelectionOpen(false)} />
                <TextInput placeholder="Search tokens" isShrinked={isChainSelectionOpen} />
            </div>
            <div className={`flex flex-col p-4 w-full rounded-b-[3px] bg-green max-h-[272px] mr-4 overflow-y-auto ${initialCardPosition === CardPosition.LEFT ? 'bg-green' : 'bg-purple'}`}>
                {isSwapOpen ? 
                swapTokenData.map((token, index) => {
                    return (<TokenListItem key={index} onClick={() => {setSwapToken(token); setIsSwapOpen(false)}} tokenName={token.name} tokenSymbol={token.symbol} chainName={token.chainId.toString()} tokenLogo={token.icon} />)
                })
                :
                receiveTokenData.map((token, index) => {
                    return (<TokenListItem key={index} onClick={() => {setReceiveToken(token); setIsReceiveOpen(false)}} tokenName={token.name} tokenSymbol={token.symbol} chainName={token.chainId.toString()} tokenLogo={token.icon} />)
                })
                }
            </div>
        </div>
        </>

    )
}

export default DropdownTokenList;
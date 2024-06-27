import { useContext, useState } from 'react';
import { CardPosition, SwapReceive } from '../../utils/types';
import SwapReceiveCard from '../SwapReceiveCard/SwapReceiveCard';
import SwapIcon from '../../images/arrow-swap-horizontal.png';
import { SwapDataContext } from '../../context/SwapDataProvider';
import DropdownTokenList from '../DropdownTokensList/DropdownTokenList';
import usePillarSwapAssets from '../../hooks/usePillarSwapAssets';
import { isEqual } from 'lodash';

type CardPositionType = {
    left: CardPosition;
    right: CardPosition;
}

const CardsSwap = () => {
    const {
        setSwapTokenData,
        isSwapOpen,
        setIsSwapOpen,
        setIsReceiveOpen,
        isReceiveOpen,
        swapChain,
        receiveChain,
        swapToken,
        receiveToken,
        setSwapChain,
        setReceiveChain,
        setSwapToken,
        setReceiveToken,
        amountSwap,
        amountReceive,
        setAmountReceive,
        setAmountSwap,
        setReceiveTokenData,
    } = useContext(SwapDataContext);

    const { getPillarSwapAssets } = usePillarSwapAssets();

    const initialPosition: CardPositionType = {
        left: CardPosition.LEFT,
        right: CardPosition.RIGHT,
    };

    const [cardPosition, setCardPosition] = useState<CardPositionType>(initialPosition);

    const swapCards = () => {
        setCardPosition(prevPosition => ({
            left: prevPosition.right,
            right: prevPosition.left,
        }));
        setSwapChain(receiveChain);
        setReceiveChain(swapChain);
        setSwapToken(receiveToken);
        setReceiveToken(swapToken);
        setAmountSwap(amountReceive);
        setAmountReceive(amountSwap);
    };

    const handleOpenTokenList = async (position: CardPosition) => {
        const type = position === CardPosition.LEFT ? SwapReceive.SWAP : SwapReceive.RECEIVE;
        try {
            const assets = await getPillarSwapAssets();
            setSwapTokenData(assets);
            setReceiveTokenData(assets);
            if (type === SwapReceive.SWAP) {
                setIsSwapOpen(true);
            } else {
                setIsReceiveOpen(true);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const isInitialOrder = isEqual(cardPosition, initialPosition);

    const renderCards = () => (
        <div className='flex w-full gap-4 desktop:gap-8 justify-center'>
            <SwapReceiveCard
                onClick={() => handleOpenTokenList(isInitialOrder ? cardPosition.left : cardPosition.right)}
                position={isInitialOrder ? cardPosition.left : cardPosition.right}
                initialPosition={isInitialOrder ? initialPosition.left : initialPosition.right}
            />
            <SwapReceiveCard
                onClick={() => handleOpenTokenList(isInitialOrder ? cardPosition.right : cardPosition.left)}
                position={isInitialOrder ? cardPosition.right : cardPosition.left}
                initialPosition={isInitialOrder ? initialPosition.right : initialPosition.left}
            />
        </div>
    );

    const renderDropdown = () => (
        <DropdownTokenList
            type={isSwapOpen ? SwapReceive.SWAP : SwapReceive.RECEIVE}
            initialCardPosition={(isSwapOpen && isInitialOrder) || (isReceiveOpen && !isInitialOrder) ? initialPosition.left : initialPosition.right}
        />
    );

    return (
        <div className='flex w-full justify-center'>
            {!isSwapOpen && !isReceiveOpen ? renderCards() : renderDropdown()}
            {(!isSwapOpen && !isReceiveOpen) &&
            <button
                onClick={swapCards}
                className="absolute self-center w-[34px] h-[34px] p-2 bg-white rounded-[3px] desktop:p-4 desktop:w-14 desktop:h-14"
            >
                <img src={SwapIcon} className='w-[18px] h-[18px] desktop:w-6 desktop:h-6' />
            </button>}
        </div>
    );
};

export default CardsSwap;

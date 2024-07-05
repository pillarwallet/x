import { useContext, useState } from 'react';
import { isEqual } from 'lodash';

// hooks
import usePillarSwapAssets from '../../hooks/usePillarSwapAssets';

// context
import { SwapDataContext } from '../../context/SwapDataProvider';

// types
import { CardPosition } from '../../utils/types';

// components
import SwapReceiveCard from '../SwapReceiveCard/SwapReceiveCard';
import DropdownTokenList from '../DropdownTokensList/DropdownTokenList';

// images
import SwapIcon from '../../images/arrow-swap-horizontal.png';

type CardPositionType = {
    swap: CardPosition;
    receive: CardPosition;
};

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
        swap: CardPosition.SWAP,
        receive: CardPosition.RECEIVE,
    };

    const [cardPosition, setCardPosition] = useState<CardPositionType>(initialPosition);

    // swapCards allow the user to switch between Swap and Receive cards
    const swapCards = () => {
        setCardPosition((prevPosition) => ({
            swap: prevPosition.receive,
            receive: prevPosition.swap,
        }));
        setSwapChain(receiveChain);
        setReceiveChain(swapChain);
        setSwapToken(receiveToken);
        setReceiveToken(swapToken);
        setAmountSwap(amountReceive);
        setAmountReceive(amountSwap);
    };

    // handleOpenTokenList opens the list for selecting tokens
    const handleOpenTokenList = async (position: CardPosition) => {
        // Error handled in usePillarSwapAssets hook
        const assets = await getPillarSwapAssets();

        setSwapTokenData(assets);
        setReceiveTokenData(assets);

        if (position === CardPosition.SWAP) {
            setIsSwapOpen(true);
        } else {
            setIsReceiveOpen(true);
        }
    };

    // isInitialOrder tells us if the cards are in the initial order or they have been switched
    const isInitialOrder = isEqual(cardPosition, initialPosition);

    const renderCards = () => (
        <div className="flex w-full gap-4 desktop:gap-8 justify-center" data-testid='swap-receive-cards'>
            <SwapReceiveCard
                onClick={() => handleOpenTokenList(isInitialOrder ? cardPosition.swap : cardPosition.receive)}
                position={isInitialOrder ? cardPosition.swap : cardPosition.receive}
                initialPosition={isInitialOrder ? initialPosition.swap : initialPosition.receive}
            />
            <SwapReceiveCard
                onClick={() => handleOpenTokenList(isInitialOrder ? cardPosition.receive : cardPosition.swap)}
                position={isInitialOrder ? cardPosition.receive : cardPosition.swap}
                initialPosition={isInitialOrder ? initialPosition.receive : initialPosition.swap}
            />
        </div>
    );

    const renderDropdown = () => (
        <DropdownTokenList
            type={isSwapOpen ? CardPosition.SWAP : CardPosition.RECEIVE}
            initialCardPosition={(isSwapOpen && isInitialOrder) || (isReceiveOpen && !isInitialOrder) ? initialPosition.swap : initialPosition.receive}
        />
    );

    return (
        <div className="flex w-full justify-center">
            {!isSwapOpen && !isReceiveOpen ? renderCards() : renderDropdown()}
            {!isSwapOpen && !isReceiveOpen && (
                <button
                    onClick={swapCards}
                    className="absolute self-center w-[34px] h-[34px] p-2 bg-white rounded-[3px] desktop:p-4 desktop:w-14 desktop:h-14"
                >
                    <img src={SwapIcon} className="w-[18px] h-[18px] desktop:w-6 desktop:h-6" />
                </button>
            )}
        </div>
    );
};

export default CardsSwap;

import { useState } from 'react';
import { isEqual } from 'lodash';

// reducer
import { 
    setAmountReceive, 
    setAmountSwap, 
    setIsReceiveOpen, 
    setIsSwapOpen, 
    setReceiveChain, 
    setReceiveToken, 
    setReceiveTokenData, 
    setSwapChain, 
    setSwapToken, 
    setSwapTokenData 
} from '../../reducer/theExchangeSlice';

// hooks
import usePillarSwapAssets from '../../hooks/usePillarSwapAssets';
import { 
    useAppDispatch, 
    useAppSelector 
} from '../../hooks/useReducerHooks';

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
    const dispatch = useAppDispatch();
    const isSwapOpen = useAppSelector((state) => state.swap.isSwapOpen);
    const isReceiveOpen = useAppSelector((state) => state.swap.isReceiveOpen);
    const swapChain = useAppSelector((state) => state.swap.swapChain);
    const receiveChain = useAppSelector((state) => state.swap.receiveChain);
    const swapToken = useAppSelector((state) => state.swap.swapToken);
    const receiveToken = useAppSelector((state) => state.swap.receiveToken);
    const amountSwap = useAppSelector((state) => state.swap.amountSwap);
    const amountReceive = useAppSelector((state) => state.swap.amountReceive);

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
        dispatch(setSwapChain(receiveChain));
        dispatch(setReceiveChain(swapChain));
        dispatch(setSwapToken(receiveToken));
        dispatch(setReceiveToken(swapToken));
        dispatch(setAmountSwap(amountReceive));
        dispatch(setAmountReceive(amountSwap));
    };

    // handleOpenTokenList opens the list for selecting tokens
    const handleOpenTokenList = async (position: CardPosition) => {
        // Error handled in usePillarSwapAssets hook
        const assets = await getPillarSwapAssets();

        dispatch(setSwapTokenData(assets));
        dispatch(setReceiveTokenData(assets));

        if (position === CardPosition.SWAP) {
            dispatch(setIsSwapOpen(true));
        } else {
            dispatch(setIsReceiveOpen(true));
        }
    };

    // isInitialOrder tells us if the cards are in the initial order or they have been switched
    const isInitialOrder = isEqual(cardPosition, initialPosition);

    const SwapCards = () => (
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

    const DropdownList = () => (
        <DropdownTokenList
            type={isSwapOpen ? CardPosition.SWAP : CardPosition.RECEIVE}
            initialCardPosition={(isSwapOpen && isInitialOrder) || (isReceiveOpen && !isInitialOrder) ? initialPosition.swap : initialPosition.receive}
        />
    );

    return (
        <div className="flex w-full justify-center">
            {!isSwapOpen && !isReceiveOpen ? <SwapCards /> : <DropdownList />}
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

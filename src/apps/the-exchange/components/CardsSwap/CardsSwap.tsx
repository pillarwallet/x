import { isEqual } from 'lodash';
import { useState } from 'react';

// reducer
import {
  setIsReceiveOpen,
  setIsSwapOpen,
  setReceiveTokenData,
  setSwapTokenData,
} from '../../reducer/theExchangeSlice';

// hooks
import usePillarSwapAssets from '../../hooks/usePillarSwapAssets';
import { useAppDispatch, useAppSelector } from '../../hooks/useReducerHooks';

// types
import { CardPosition } from '../../utils/types';

// components
import DropdownTokenList from '../DropdownTokensList/DropdownTokenList';
import SwapReceiveCard from '../SwapReceiveCard/SwapReceiveCard';

// images
import SwitchCardsButton from '../SwitchCardsButton/SwitchCardsButton';

type CardPositionType = {
  swap: CardPosition;
  receive: CardPosition;
};

const CardsSwap = () => {
  const dispatch = useAppDispatch();
  const isSwapOpen = useAppSelector(
    (state) => state.swap.isSwapOpen as boolean
  );
  const isReceiveOpen = useAppSelector(
    (state) => state.swap.isReceiveOpen as boolean
  );

  const { getPillarSwapAssets } = usePillarSwapAssets();

  const initialPosition: CardPositionType = {
    swap: CardPosition.SWAP,
    receive: CardPosition.RECEIVE,
  };

  const [cardPosition, setCardPosition] =
    useState<CardPositionType>(initialPosition);

  // swapCards allow the user to switch between Swap and Receive cards
  const swapCardsAction = () => {
    setCardPosition((prevPosition) => ({
      swap: prevPosition.receive,
      receive: prevPosition.swap,
    }));
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

  // eslint-disable-next-line react/no-unstable-nested-components
  const SwapCards = () => (
    <div
      className="flex w-full gap-4 desktop:gap-8 justify-center"
      data-testid="swap-receive-cards"
    >
      <SwapReceiveCard
        onClick={() =>
          handleOpenTokenList(
            isInitialOrder ? cardPosition.swap : cardPosition.receive
          )
        }
        position={isInitialOrder ? cardPosition.swap : cardPosition.receive}
        initialPosition={
          isInitialOrder ? initialPosition.swap : initialPosition.receive
        }
      />
      <SwapReceiveCard
        onClick={() =>
          handleOpenTokenList(
            isInitialOrder ? cardPosition.receive : cardPosition.swap
          )
        }
        position={isInitialOrder ? cardPosition.receive : cardPosition.swap}
        initialPosition={
          isInitialOrder ? initialPosition.receive : initialPosition.swap
        }
      />
    </div>
  );

  return (
    <div className="flex w-full justify-center">
      {!isSwapOpen && !isReceiveOpen ? (
        <SwapCards />
      ) : (
        <DropdownTokenList
          type={isSwapOpen ? CardPosition.SWAP : CardPosition.RECEIVE}
          initialCardPosition={
            (isSwapOpen && isInitialOrder) || (isReceiveOpen && !isInitialOrder)
              ? initialPosition.swap
              : initialPosition.receive
          }
        />
      )}
      {!isSwapOpen && !isReceiveOpen && (
        <SwitchCardsButton onSwap={swapCardsAction} />
      )}
    </div>
  );
};

export default CardsSwap;

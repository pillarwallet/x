import { isEqual } from 'lodash';
import { useState } from 'react';
import useTransactionKit from '../../../../hooks/useTransactionKit';

// reducer
import {
  setIsReceiveOpen,
  setIsSwapOpen,
  setReceiveChain,
  setSearchTokenResult,
  setSwapChain,
} from '../../reducer/theExchangeSlice';

// hooks
import { useAppDispatch, useAppSelector } from '../../hooks/useReducerHooks';

// types
import { CardPosition } from '../../utils/types';

// utils
import { addExchangeBreadcrumb, logUserInteraction } from '../../utils/sentry';

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
  const { walletAddress } = useTransactionKit();
  const isSwapOpen = useAppSelector(
    (state) => state.swap.isSwapOpen as boolean
  );
  const isReceiveOpen = useAppSelector(
    (state) => state.swap.isReceiveOpen as boolean
  );

  const initialPosition: CardPositionType = {
    swap: CardPosition.SWAP,
    receive: CardPosition.RECEIVE,
  };

  const [cardPosition, setCardPosition] =
    useState<CardPositionType>(initialPosition);

  // swapCards allow the user to switch between Swap and Receive cards
  const swapCardsAction = () => {
    logUserInteraction('swap_cards_switched', {
      previousPosition: cardPosition,
      walletAddress,
    });

    addExchangeBreadcrumb('Cards switched', 'user_interaction', {
      previousPosition: cardPosition,
      walletAddress,
    });

    setCardPosition((prevPosition) => ({
      swap: prevPosition.receive,
      receive: prevPosition.swap,
    }));
  };

  // handleOpenTokenList opens the list for selecting tokens
  const handleOpenTokenList = async (position: CardPosition) => {
    logUserInteraction('token_list_opened', {
      position,
      walletAddress,
    });

    addExchangeBreadcrumb(
      `Token list opened for ${position}`,
      'user_interaction',
      {
        position,
        walletAddress,
      }
    );

    dispatch(setSearchTokenResult(undefined));

    if (position === CardPosition.SWAP) {
      dispatch(setIsSwapOpen(true));
      dispatch(setSwapChain({ chainId: 0, chainName: 'all' }));
    } else {
      dispatch(setIsReceiveOpen(true));
      dispatch(setReceiveChain({ chainId: 0, chainName: 'all' }));
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
      {import.meta.env.VITE_SWAP_BUTTON_SWITCH === 'true' &&
        !isSwapOpen &&
        !isReceiveOpen && <SwitchCardsButton onSwap={swapCardsAction} />}
    </div>
  );
};

export default CardsSwap;

import { Token } from '@etherspot/data-utils/dist/cjs/sdk/data/classes/token';

// reducer
import {
  setAmountReceive,
  setAmountSwap,
  setReceiveChain,
  setReceiveToken,
  setSwapChain,
  setSwapToken,
  setUsdPriceReceiveToken,
  setUsdPriceSwapToken,
} from '../../reducer/theExchangeSlice';

// hooks
import { useAppDispatch, useAppSelector } from '../../hooks/useReducerHooks';

// images
import SwapIcon from '../../images/arrow-swap-horizontal.png';
import { ChainType } from '../../utils/types';

type SwitchCardsButtonType = {
  onSwap: () => void;
};

const SwitchCardsButton = ({ onSwap }: SwitchCardsButtonType) => {
  const dispatch = useAppDispatch();
  const swapChain = useAppSelector(
    (state) => state.swap.swapChain as ChainType
  );
  const receiveChain = useAppSelector(
    (state) => state.swap.receiveChain as ChainType
  );
  const swapToken = useAppSelector((state) => state.swap.swapToken as Token);
  const receiveToken = useAppSelector(
    (state) => state.swap.receiveToken as Token
  );
  const amountReceive = useAppSelector(
    (state) => state.swap.amountReceive as number
  );
  const usdPriceSwapToken = useAppSelector(
    (state) => state.swap.usdPriceSwapToken as number
  );
  const usdPriceReceiveToken = useAppSelector(
    (state) => state.swap.usdPriceReceiveToken as number
  );

  // swapCards allow the user to switch between Swap and Receive cards
  const swapCardsAction = () => {
    onSwap();
    dispatch(setSwapChain(receiveChain));
    dispatch(setReceiveChain(swapChain));
    dispatch(setSwapToken(receiveToken));
    dispatch(setReceiveToken(swapToken));
    dispatch(setAmountSwap(amountReceive));
    dispatch(setAmountReceive(0));
    dispatch(setUsdPriceSwapToken(usdPriceReceiveToken));
    dispatch(setUsdPriceReceiveToken(usdPriceSwapToken));
  };

  return (
    <button
      type="button"
      id="switch-cards-button-exchange"
      onClick={swapCardsAction}
      className="absolute self-center w-[34px] h-[34px] p-2 bg-white rounded-[3px] desktop:p-4 desktop:w-14 desktop:h-14"
    >
      <img
        src={SwapIcon}
        alt="swap-icon"
        className="w-[18px] h-[18px] desktop:w-6 desktop:h-6"
      />
    </button>
  );
};

export default SwitchCardsButton;

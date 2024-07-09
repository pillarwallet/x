// hooks
import { useAppSelector } from '../../hooks/useReducerHooks';

// types
import { CardPosition } from '../../utils/types';

// components
import EnterAmount from '../EnterAmount/EnterAmount';
import SelectToken from '../SelectToken/SelectToken';

type SwapReceiveCardProps = {
    position: CardPosition;
    initialPosition: CardPosition;
    onClick: () => void;
}

const SwapReceiveCard = ({ position, initialPosition, onClick }: SwapReceiveCardProps) => {
    const swapToken = useAppSelector((state) => state.swap.swapToken);
    const receiveToken = useAppSelector((state) => state.swap.receiveToken);
  
    const isClickable = (position === CardPosition.SWAP && !swapToken) || (position === CardPosition.RECEIVE && !receiveToken);

    return (
        <div onClick={isClickable ? onClick : undefined} className={`flex flex-col w-full cursor-pointer h-[200px] justify-between rounded-lg p-4 desktop:h-[230px] desktop:max-w-[306px] ${initialPosition === CardPosition.SWAP ? 'bg-green' : 'bg-purple'}`} data-testid='select-token-card'>
            <SelectToken
                onClick={!isClickable ? onClick : undefined}
                type={position}
                tokenName={position === CardPosition.SWAP ? swapToken?.name : receiveToken?.name}
                tokenChain={position === CardPosition.SWAP ? swapToken?.chainId : receiveToken?.chainId}
                tokenLogo={position === CardPosition.SWAP ? swapToken?.icon : receiveToken?.icon}
            />
            <EnterAmount
                type={position}
                tokenSymbol={position === CardPosition.SWAP ? swapToken?.symbol : receiveToken?.symbol}
            />
        </div>
    );
}

export default SwapReceiveCard;

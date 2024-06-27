import EnterAmount from '../EnterAmount/EnterAmount';
import SelectToken from '../SelectToken/SelectToken';
import { useContext } from 'react';
import { SwapDataContext } from '../../context/SwapDataProvider';
import { CardPosition, SwapReceive } from '../../utils/types';

type SwapReceiveCardProps = {
    position: CardPosition;
    initialPosition: CardPosition;
    onClick?: () => void;
}

const SwapReceiveCard = ({ position, initialPosition, onClick }: SwapReceiveCardProps) => {
    const {swapToken, receiveToken} = useContext(SwapDataContext);

    const isClickable = (position === CardPosition.LEFT && !swapToken) || (position === CardPosition.RIGHT && !receiveToken)

    return (
        <div onClick={isClickable ? onClick : undefined} className={`flex flex-col w-full cursor-pointer h-[200px] justify-between rounded-lg p-4 desktop:h-[230px] desktop:max-w-[306px] ${initialPosition === CardPosition.LEFT ? 'bg-green' : 'bg-purple'}`}>
            <SelectToken onClick={!isClickable ? onClick : undefined} type={position === CardPosition.LEFT ? SwapReceive.SWAP : SwapReceive.RECEIVE} tokenName={position === CardPosition.LEFT ? swapToken?.name : receiveToken?.name} tokenChain={position === CardPosition.LEFT ? swapToken?.chainId.toString() : receiveToken?.chainId.toString()} tokenLogo={position === CardPosition.LEFT ? swapToken?.icon : receiveToken?.icon} />
            <EnterAmount type={position === CardPosition.LEFT ? SwapReceive.SWAP : SwapReceive.RECEIVE} tokenSymbol={position === CardPosition.LEFT ? swapToken?.symbol : receiveToken?.symbol} />
        </div>
    )
}

export default SwapReceiveCard;

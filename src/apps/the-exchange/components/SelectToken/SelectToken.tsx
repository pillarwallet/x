// types
import { CardPosition } from '../../utils/types';

// utils
import { convertChainIdtoName } from '../../utils/converters';

// components
import Body from '../Typography/Body';

// images
import TokenLogo from '../TokenLogo/TokenLogo';

type SelectTokenProps = {
    type: CardPosition;
    tokenName?: string;
    tokenChain?: number;
    tokenLogo?: string;
    onClick?: () => void;
}

const SelectToken = ({ type, tokenName, tokenChain, tokenLogo, onClick }: SelectTokenProps) => {
    return (
        <div onClick={onClick} className='flex justify-between items-start'>
            <div className="flex w-full flex-col">
                <Body className='capitalize'>{tokenName ?? type}</Body>
                <Body className="font-normal capitalize">{tokenChain ? `On ${convertChainIdtoName(tokenChain)}` : 'Select Token'}</Body>
            </div>
            {tokenLogo &&
                <TokenLogo tokenLogo={tokenLogo} />
            }
        </div>

    )
}

export default SelectToken;

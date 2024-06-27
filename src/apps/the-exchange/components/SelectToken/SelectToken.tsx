import { SwapReceive } from '../../utils/types';
import TokenLogo from '../TokenLogo/TokenLogo';
import Body from '../Typography/Body';

type SelectTokenProps = {
    type: SwapReceive;
    tokenName?: string;
    tokenChain?: string;
    tokenLogo?: string;
    onClick?: () => void;
}

const SelectToken = ({ type, tokenName, tokenChain, tokenLogo, onClick }: SelectTokenProps) => {
    return (
        <div onClick={onClick} className='flex justify-between items-start'>
            <div className="flex w-full flex-col">
                <Body className='capitalize'>{tokenName ? tokenName : type}</Body>
                <Body className="font-normal capitalize">{tokenName ? `On ${tokenChain}` : 'Select Token'}</Body>
            </div>
            {tokenLogo &&
                <TokenLogo tokenLogo={tokenLogo} />
            }
        </div>

    )
}

export default SelectToken;

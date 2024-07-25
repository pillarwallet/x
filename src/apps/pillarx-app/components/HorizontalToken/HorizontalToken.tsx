// images
import defaultLogo from '../../images/logo-unknown.png';

// components
import BodySmall from '../Typography/BodySmall';
import Body from '../Typography/Body';
import TokensPercentage from '../TokensPercentage/TokensPercentage';

type HorizontalTokenProps = {
    tokenIndex: number;
    tokenLogo?: string;
    tokenSymbol?: string;
    tokenName?: string;
    tokenValue?: number;
    percentage?: number;
    isLast?: boolean;
};

const HorizontalToken = ({ tokenIndex, tokenLogo, tokenSymbol, tokenName, tokenValue, percentage, isLast }: HorizontalTokenProps) => {
    return (
        <div className={`flex w-full justify-between py-5 ${!isLast && 'border-b border-[#1F1D23] mobile:border-[#27262F]'} ${isLast && tokenIndex === 3 && 'mobile:border-b mobile:border-[#27262F]'}`}>
            <div className='flex items-center'>
                <BodySmall className='text-purple_light mr-[18px]'>0{tokenIndex}</BodySmall>
                <img src={tokenLogo ?? defaultLogo} className='w-[50px] h-[50px] object-fill rounded mr-3.5' />
                <div className='flex flex-col'>
                    {tokenSymbol && <Body>{tokenSymbol}</Body>}
                    {tokenName && <BodySmall className='text-purple_light'>{tokenName}</BodySmall>}
                </div>
            </div>
            <div className='flex flex-col items-center'>
                {tokenValue && <Body>${tokenValue.toFixed(4)}</Body>}
                <TokensPercentage percentage={percentage} />
            </div>
        </div>
    );
};

export default HorizontalToken;

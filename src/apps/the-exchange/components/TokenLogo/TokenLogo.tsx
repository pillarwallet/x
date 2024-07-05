// images
import DefaultLogo from '../../images/logo-unknown.png';

type TokenLogoProps = {
    tokenLogo?: string;
    tokenChainLogo?: string;
    isBigger?: boolean;
}

const TokenLogo = ({ tokenLogo, tokenChainLogo, isBigger }: TokenLogoProps) => {
    return (
        <div className='flex min-w-fit items-end'>
            <img src={tokenLogo ? tokenLogo : DefaultLogo} alt='token-logo' className={`${isBigger ? 'w-[30px] h-[30px]' : 'w-5 h-5'} object-fill rounded-full grayscale`} />
            <div className={`${isBigger ? 'w-3.5 h-3.5' : 'w-3 h-3'} rounded-full border border-white relative right-[7px] ${!tokenChainLogo && 'hidden'}`}>
                <img src={tokenChainLogo ? tokenChainLogo : DefaultLogo} alt='chain-logo' className={`w-full h-full object-fill rounded-full grayscale ${!tokenChainLogo && 'hidden'}`} />
            </div>
        </div>
    )
}

export default TokenLogo;

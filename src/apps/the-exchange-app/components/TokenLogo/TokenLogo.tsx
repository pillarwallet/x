import DefaultLogo from '../../images/logo-unknown.png';

type TokenLogoProps = {
    tokenLogo?: string;
    tokenChainLogo?: string;
}

const TokenLogo = ({ tokenLogo, tokenChainLogo }: TokenLogoProps) => {
    return (
        <div className='flex min-w-fit items-end'>
            <img src={tokenLogo ? tokenLogo : DefaultLogo} className='w-5 h-5 object-fill rounded-full grayscale' />
            <div className={`w-3.5 h-3.5 rounded-full border border-green relative right-[7px] ${!tokenChainLogo && 'hidden'}`}>
                <img src={tokenChainLogo ? tokenChainLogo : DefaultLogo} className={`w-full h-full object-fill rounded-full grayscale ${!tokenChainLogo && 'hidden'}`} />
            </div>
        </div>
    )
}

export default TokenLogo;
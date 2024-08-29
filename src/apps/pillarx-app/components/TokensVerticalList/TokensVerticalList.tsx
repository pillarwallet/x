import { Link } from 'react-router-dom';

// types
import { TokenData } from '../../../../types/api';

// components
import HorizontalToken from '../HorizontalToken/HorizontalToken';

type TokensVerticalListProps = {
    position: 'left' | 'right';
    data: TokenData[];
};

const TokensVerticalList = ({ position, data }: TokensVerticalListProps) => {
    const listStartIndex = position === 'left' ? 1 : 4;
    
    return (
        <div className={`flex flex-col flex-1 mobile:p-0 mobile:border-0 ${position === 'left' ? 'pr-10 border-r-[3px] border-[#1F1D23]' : 'pl-10'}`}>
            {data.map((token, index) => (
                <Link 
                    key={index}
                    to={`/token-atlas?asset=${token.name}&symbol=${token.symbol}`}
                >
                    <HorizontalToken 
                        tokenIndex={index + listStartIndex} 
                        tokenName={token.name} 
                        tokenSymbol={token.symbol} 
                        tokenValue={undefined} 
                        percentage={undefined} 
                        isLast={index === data.length - 1} 
                        tokenLogo={token.logo} 
                    />
                </Link>
            ))}
        </div>
    );
};

export default TokensVerticalList;

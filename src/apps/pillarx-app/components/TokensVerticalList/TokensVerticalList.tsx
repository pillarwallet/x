// types
import { TokenData } from '../../../../types/api';

// components
import HorizontalToken from '../HorizontalToken/HorizontalToken';
import Body from '../Typography/Body';

type TokensVerticalListProps = {
    position: 'left' | 'right';
    data: TokenData[];
    title?: string;
};

const TokensVerticalList = ({ position, data, title }: TokensVerticalListProps ) => {
    const topThreeTokens = data.slice(0, 3);

    return(
        <div className={`flex flex-col flex-1 mobile:p-0 mobile:border-0 ${position === 'left' ? 'pr-10 border-r-[3px] border-[#1F1D23]' : 'pl-10'}`}>
            {title && <Body className='text-purple_light'>{title}</Body>}
            <div className="flex flex-col">
                {topThreeTokens.map((token, index) => 
                    <HorizontalToken key={index} tokenIndex={index + 1} tokenName={token.name} tokenSymbol={token.symbol} tokenValue={undefined} percentage={undefined}/>
                )}
            </div>
        </div>
    );
};

export default TokensVerticalList;

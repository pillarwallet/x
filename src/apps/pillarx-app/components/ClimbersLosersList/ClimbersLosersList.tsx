import { useTranslation } from 'react-i18next';

// types
import { TokenData } from '../../../../types/api';

// components
import HorizontalToken from '../HorizontalToken/HorizontalToken';
import Body from '../Typography/Body';

type ClimbersLosersListProps = {
    type: 'climbers' | 'losers';
    data: TokenData[];
};

const ClimbersLosersList = ({ type, data }: ClimbersLosersListProps ) => {
    const { t } = useTranslation();

    return(
        <div className={`flex flex-col flex-1 mobile:p-0 mobile:border-0 ${type === 'climbers' ? 'pr-10 border-r-[3px] border-[#1F1D23]' : 'pl-10'}`}>
            <Body className='text-purple_light'>{type === 'climbers' ? `${t`title.topClimbers`}` : `${t`title.topLosers`}`}</Body>
            <div className="flex flex-col">
                {data.map((token, index) => 
                    <HorizontalToken key={index} tokenIndex={index + 1} tokenName={token.name} tokenSymbol={token.symbol} tokenValue={undefined} percentage={undefined}/>
                )}
            </div>
        </div>
    );
};

export default ClimbersLosersList;

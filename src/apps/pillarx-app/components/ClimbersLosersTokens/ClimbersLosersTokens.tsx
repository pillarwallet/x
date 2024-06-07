// types
import { TokenData } from '../../../../types/api'

// components
import TileContainer from '../TileContainer/TileContainer'
import SkeletonLoader from '../../../../components/SkeletonLoader';
import ClimbersLosersList from '../ClimbersLosersList/ClimbersLosersList';

type ClimbersLosersTokensProps = {
    data: TokenData[] | undefined;
    isDataLoading: boolean;
}

const ClimbersLosersTokens = ({ data, isDataLoading }: ClimbersLosersTokensProps) => {

    const topCimbers = data?.slice(0, 3);

if (!data || isDataLoading) {
    return (
    <TileContainer className='px-10 pt-[30px] pb-5 tablet:p-5 mobile:p-0 mobile:bg-[#1F1D23] mobile:flex-col'>
         <div className='flex flex-col flex-1 mr-5 mobile:m-0'>
            <SkeletonLoader  $height='24px' $width='120px' $marginBottom='20px' $radius='10px' />
            <div className="flex flex-col">
                <SkeletonLoader  $height='50px' $width='100%' $marginBottom='20px' $radius='10px' />
                <SkeletonLoader  $height='50px' $width='100%' $marginBottom='20px' $radius='10px' />
                <SkeletonLoader  $height='50px' $width='100%' $marginBottom='20px' $radius='10px' />
            </div>
        </div>
        <div className='flex flex-col flex-1 ml-5 mobile:m-0'>
            <SkeletonLoader  $height='24px' $width='120px' $marginBottom='20px' $radius='10px' />
            <div className="flex flex-col">
                <SkeletonLoader  $height='50px' $width='100%' $marginBottom='20px' $radius='10px' />
                <SkeletonLoader  $height='50px' $width='100%' $marginBottom='20px' $radius='10px' />
                <SkeletonLoader  $height='50px' $width='100%' $marginBottom='20px' $radius='10px' />
            </div>
        </div>
    </TileContainer>
    )
}

    return (
    <TileContainer className='px-10 pt-[30px] pb-5 tablet:p-5 mobile:p-0 mobile:bg-[#1F1D23] mobile:flex-col'>
        <ClimbersLosersList type='climbers' data={topCimbers ?? []} />
        <ClimbersLosersList type='losers' data={topCimbers ?? []} />
    </TileContainer>
    )
};

export default ClimbersLosersTokens;

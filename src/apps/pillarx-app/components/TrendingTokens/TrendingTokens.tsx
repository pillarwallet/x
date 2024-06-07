import { useTranslation } from 'react-i18next'
import { createRef, useEffect, useState } from 'react';

// types
import { TokenData } from '../../../../types/api'

// hooks
import useRefDimensions from '../../hooks/useRefDimensions';

// images

// components
import TileContainer from '../TileContainer/TileContainer'
import Body from '../Typography/Body';
import TrendingTokenInfo from '../TrendingTokenInfo/TrendingTokenInfo';
import SkeletonLoader from '../../../../components/SkeletonLoader';


type TrendingTokensProps = {
    data: TokenData[] | undefined;
    isDataLoading: boolean;
}

const TrendingTokens = ({ data, isDataLoading }: TrendingTokensProps) => {
    const [t] = useTranslation();

    const [trendingTokenWidth, setTrendingTokenWidth] = useState<number>(0);

    useEffect(() => {
        const handleTrendingTokenWidthResize = () => {
            if (window.innerWidth >= 1024) {
                setTrendingTokenWidth(159);
            } else if (window.innerWidth >= 800) {
                setTrendingTokenWidth(152);
            } else {
                // 102px for width of the TrendingTokenInfo component 100px + 2px of space
                setTrendingTokenWidth(102);
            }
        };

        handleTrendingTokenWidthResize();
        window.addEventListener('resize', handleTrendingTokenWidthResize);

        return () => {
            window.removeEventListener('resize', handleTrendingTokenWidthResize);
        };
    }, []);
    
    const divRef = createRef()
    const dimensions = useRefDimensions(divRef as React.RefObject<HTMLDivElement>)

    const numberTrendingTokens = Math.floor(dimensions.width / trendingTokenWidth) ?? 0;


if (!data || isDataLoading) {
    return (
    <TileContainer className='flex-col px-10 pt-[30px] pb-5 tablet:p-5 mobile:p-0 mobile:bg-[#1F1D23]'>
         <SkeletonLoader  $height='24px' $width='140px' $marginBottom='10px' $radius='10px' />
         <div className='flex justify-between gap-2'>
         <SkeletonLoader  $height='120px' $width='80px' $radius='10px' />
         <SkeletonLoader  $height='120px' $width='80px' $radius='10px' />
         <SkeletonLoader  $height='120px' $width='80px' $radius='10px' />
         <SkeletonLoader  $height='120px' $width='80px' $radius='10px' className='tablet:hidden' />
         <SkeletonLoader  $height='120px' $width='80px' $radius='10px' className='tablet:hidden' />
         <SkeletonLoader  $height='120px' $width='80px' $radius='10px' className='tablet:hidden' />
         <SkeletonLoader  $height='120px' $width='80px' $radius='10px' className='mobile:hidden' />
         <SkeletonLoader  $height='120px' $width='80px' $radius='10px' className='mobile:hidden' />
         </div>
    </TileContainer>
    )
}

    return (
        <div ref={divRef as React.RefObject<HTMLDivElement>}>
            <TileContainer className='flex-col px-10 pt-[30px] pb-5 tablet:p-5 mobile:p-0 mobile:bg-[#1F1D23]'>
                <Body className='text-purple_light mb-2.5'>{t`title.trendingTokens`}</Body>
                <div className='flex justify-between'>
                {data?.slice(0, numberTrendingTokens).map((token, index) =>
                    <TrendingTokenInfo key={index} logo={token.logo} tokenName={token.name} tokenValue={undefined} percentage={undefined}  />
                )}
                </div>
            </TileContainer>
        </div>
    )
}

export default TrendingTokens;

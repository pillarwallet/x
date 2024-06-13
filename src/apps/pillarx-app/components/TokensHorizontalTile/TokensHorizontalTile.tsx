import { createRef, useEffect, useState } from 'react';

// types
import { Projection, TokenData } from '../../../../types/api'

// hooks
import useRefDimensions from '../../hooks/useRefDimensions';

// components
import TileContainer from '../TileContainer/TileContainer'
import Body from '../Typography/Body';
import TokenInfoHorizontal from '../TokenInfoHorizontal/TokenInfoHorizontal';
import SkeletonLoader from '../../../../components/SkeletonLoader';



type TokensHorizontalTileProps = {
    data: Projection | undefined;
    isDataLoading: boolean;
}

const TokensHorizontalTile = ({ data, isDataLoading }: TokensHorizontalTileProps) => {
    const [tokenHorizontalWidth, setTokenHorizontalWidth] = useState<number>(0);
    const { data: dataTokens, meta } = data || {};
    const dataTokensHorizontal = dataTokens as TokenData[];

    useEffect(() => {
        const handleTokenHorizontalWidthResize = () => {
            if (window.innerWidth >= 1024) {
                setTokenHorizontalWidth(159);
            } else if (window.innerWidth >= 800) {
                setTokenHorizontalWidth(152);
            } else {
                // 102px for width of the TokenInfoHorizontal component 100px + 2px of space
                setTokenHorizontalWidth(102);
            }
        };

        handleTokenHorizontalWidthResize();
        window.addEventListener('resize', handleTokenHorizontalWidthResize);

        return () => {
            window.removeEventListener('resize', handleTokenHorizontalWidthResize);
        };
    }, []);
    
    const divRef = createRef()
    const dimensions = useRefDimensions(divRef as React.RefObject<HTMLDivElement>)

    const numberTokensHorizontal = Math.floor(dimensions.width / tokenHorizontalWidth) ?? 0;

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
                <Body className='text-purple_light mb-2.5'>{meta?.display.title}</Body>
                <div className='flex justify-between'>
                {dataTokensHorizontal?.slice(0, numberTokensHorizontal).map((token, index) =>
                    <TokenInfoHorizontal key={index} logo={token.logo} tokenName={token.name} tokenValue={undefined} percentage={undefined}  />
                )}
                </div>
            </TileContainer>
        </div>
    )
}

export default TokensHorizontalTile;

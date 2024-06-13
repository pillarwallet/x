
// components
import TileContainer from '../TileContainer/TileContainer'
import SkeletonLoader from '../../../../components/SkeletonLoader';

type SkeletonTilesProps = {
    type: 'horizontal' | 'vertical'
}
const SkeletonTiles = ({ type }: SkeletonTilesProps) => {

    if (type === 'vertical') {
        return (
            <TileContainer className='px-10 pt-[30px] pb-5 tablet:p-5 mobile:p-0 mobile:bg-[#1F1D23] mobile:flex-col'>
            <div className='flex flex-col flex-1 mr-5 mobile:m-0'>
               <SkeletonLoader  $height='24px' $width='120px' $marginBottom='20px' $radius='10px' />
               <div className='flex flex-col'>
                   <SkeletonLoader  $height='50px' $width='100%' $marginBottom='20px' $radius='10px' />
                   <SkeletonLoader  $height='50px' $width='100%' $marginBottom='20px' $radius='10px' />
                   <SkeletonLoader  $height='50px' $width='100%' $marginBottom='20px' $radius='10px' />
               </div>
           </div>
           <div className='flex flex-col flex-1 ml-5 mobile:m-0'>
               <SkeletonLoader  $height='24px' $width='120px' $marginBottom='20px' $radius='10px' />
               <div className='flex flex-col'>
                   <SkeletonLoader  $height='50px' $width='100%' $marginBottom='20px' $radius='10px' />
                   <SkeletonLoader  $height='50px' $width='100%' $marginBottom='20px' $radius='10px' />
                   <SkeletonLoader  $height='50px' $width='100%' $marginBottom='20px' $radius='10px' />
               </div>
           </div>
        </TileContainer>
        )
    }

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

export default SkeletonTiles;

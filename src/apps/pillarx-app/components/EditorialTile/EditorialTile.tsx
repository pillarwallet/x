import moment from 'moment';
import mime from 'mime';

// types
import { EditorialDisplay, Projection } from '../../../../types/api';

// components
import TileContainer from '../TileContainer/TileContainer';
import SkeletonLoader from '../../../../components/SkeletonLoader';
import Body from '../Typography/Body';
import BodySmall from '../Typography/BodySmall';
import EditorialTag from '../EditorialTag/EditorialTag';

type EditorialTileProps = {
    data: Projection | undefined;
    isDataLoading: boolean;
};

const EditorialTile = ({ data, isDataLoading }: EditorialTileProps) => {
    const { meta } = data || {};
    const editorialDisplay = meta?.display as EditorialDisplay | undefined;

    const DisplayMedia = () => {
        if (editorialDisplay?.media) {
            const mimeType = mime.getType(editorialDisplay.media);

            if (mimeType?.includes('image')) {
                return (
                    <img src={editorialDisplay.media} className='rounded-lg object-cover object-center desktop:h-full tablet:h-full mobile:w-full' data-testid='editorial-tile-image' />
                );
            }

            if (mimeType?.includes('video')) {
                return (
                    <video className='rounded-lg w-full' preload='none' autoPlay loop muted controls playsInline data-testid='editorial-tile-video'>
                        <source src={editorialDisplay.media} type={mimeType} />
                    </video>
                );
            }

            if (mimeType?.includes('audio')) {
                return (
                    <audio className='w-full' preload='none' controls data-testid='editorial-tile-audio'>
                        <source src={editorialDisplay.media} type={mimeType} />
                    </audio>
                );
            }
        }

        return null;
    };

    const editorialDate = editorialDisplay?.timestamp && new Date(editorialDisplay.timestamp * 1000);

    if (!data || isDataLoading) {
        return (
            <TileContainer className='flex-col desktop:p-10 desktop:pt-[30px] tablet:p-5 mobile:p-0 mobile:bg-[#1F1D23]'>
                <SkeletonLoader $height='24px' $width='150px' $marginBottom='10px' $radius='6px' />
                <div data-testid="editorial-tile-loading" className='flex mobile:flex-col bg-medium_grey rounded-2xl p-2 gap-4'>
                    <div className='flex desktop:basis-2/5 tablet:basis-2/5 mobile:basis-full mobile:w-full'>
                        <SkeletonLoader $height='250px' $width='100%' $radius='6px' />
                    </div>
                    <div className='flex flex-col justify-between desktop:basis-3/5 tablet:basis-3/5 mobile:basis-0 mobile:w-full desktop:px-4 tablet:px-4 mobile:px-0'>
                        <div className='flex flex-col gap-2 desktop:mt-14 tablet:mt-8 mobile:mt-0'>
                            <SkeletonLoader $height='26px' $width='50px' $radius='6px' />
                            <SkeletonLoader $height='30px' $width='200px' $radius='6px' />
                        </div>
                        <div className='mb-[18px] mt-4 flex justify-between'>
                            <SkeletonLoader $height='24px' $width='80px' $radius='6px' />
                            <SkeletonLoader $height='24px' $width='60px' $radius='6px' />
                        </div>
                    </div>
                </div>
            </TileContainer>
        );
    }

    return (
        <TileContainer id='editorial-tile' className='flex-col desktop:p-10 desktop:pt-[30px] tablet:p-5 mobile:p-0 mobile:bg-[#1F1D23]'>
            <a href={editorialDisplay?.href} target="_blank" rel="noreferrer">
                <div className='flex mobile:flex-col bg-medium_grey rounded-2xl p-2 gap-4'>
                    {editorialDisplay?.media && (
                        <div className='flex items-center justify-center overflow-hidden desktop:basis-2/5 tablet:basis-2/5 mobile:basis-full mobile:w-full'>
                            <DisplayMedia />
                        </div>
                    )}
                    <div className='flex flex-col justify-between w-full desktop:basis-3/5 tablet:basis-3/5 mobile:basis-full desktop:px-4 tablet:px-4 mobile:px-0'>
                        <div className='flex flex-col gap-2 desktop:mt-14 tablet:mt-8 mobile:mt-0'>
                            {editorialDisplay?.tags?.length && editorialDisplay.tags.map((tag, index) => (
                                <EditorialTag key={index} color={tag.color} icon={tag.icon} label={tag.label} />
                            ))}
                            {editorialDisplay?.title && (
                                <h1 className='text-[20px] leading-[30px] desktop:text-[32px] desktop:leading[48px]'>
                                    {editorialDisplay.title}
                                </h1>
                            )}
                            {editorialDisplay?.summary && (
                                <Body className='text-purple_light tablet:hidden mobile:hidden'>{editorialDisplay.summary}</Body>
                            )}
                        </div>
                        <div className='mb-[18px] mt-4 flex justify-between'>
                            <div onClick={() => window.open(editorialDisplay?.attribution?.href, '_blank', 'noreferrer')} className='flex gap-2 items-center cursor-pointer'>
                                {editorialDisplay?.attribution?.icon && <img src={editorialDisplay.attribution.icon} className='h-5' />}
                                {editorialDisplay?.attribution?.name && <BodySmall className='text-purple_light'>{editorialDisplay.attribution.name}</BodySmall>}
                            </div>
                            {editorialDate && <BodySmall className='text-purple_light'>{moment(editorialDate).format('D MMMM YYYY')}</BodySmall>}
                        </div>
                    </div>
                </div>
            </a>
        </TileContainer>
    );
};

export default EditorialTile;

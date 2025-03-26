// types
import { GenericBannerDisplay, Projection } from '../../../../types/api';

// components
import TileContainer from '../TileContainer/TileContainer';

type GenericBannerTileProps = {
  data: Projection | undefined;
  isDataLoading: boolean;
};

const GenericBannerTile = ({ data, isDataLoading }: GenericBannerTileProps) => {
  const { meta } = data || {};
  const bannerDisplay = meta?.display as GenericBannerDisplay | undefined;

  const handleOpenBannerLink = () => {
    window.open(bannerDisplay?.cta?.href, '_blank');
  };

  if (
    !data ||
    !meta ||
    Object.keys(meta).length === 0 ||
    !bannerDisplay ||
    Object.keys(bannerDisplay).length === 0 ||
    isDataLoading
  ) {
    return null;
  }

  return (
    <TileContainer
      id="generic-banner-tile"
      className={`p-1 flex-col ${!bannerDisplay && 'hidden'}`}
    >
      <a href={bannerDisplay?.cta?.href} target="_blank" rel="noreferrer">
        <div
          className="flex flex-col rounded-2xl bg-cover bg-no-repeat bg-center desktop:min-h-[320px] tablet:min-h-[280px] mobile:min-h-[240px] justify-end"
          style={{
            backgroundImage:
              bannerDisplay?.backgroundImage &&
              `url(${bannerDisplay.backgroundImage})`,
          }}
        >
          <div className="p-10 mobile:p-4">
            <p className="text-[45px] font-medium tablet:leading-[67.5px] desktop:leading-[67.5px] mobile:text-xl mobile:leading-[30px]">
              {bannerDisplay?.title && bannerDisplay.title}
            </p>
            <p className="font-medium desktop:text-[22px] tablet:text-[22px] tablet:leading-[33px] desktop:leading-[33px] mobile:text-sm">
              {bannerDisplay?.subtitle && bannerDisplay.subtitle}
            </p>
            {bannerDisplay?.cta?.text && bannerDisplay?.cta?.href && (
              <button
                type="button"
                className="mt-10 mobile:mt-4"
                onClick={handleOpenBannerLink}
              >
                <p className="font-medium bg-container_grey rounded-md py-3 px-5 mobile:text-sm mobile:py-2 mobile:px-4">
                  {bannerDisplay.cta.text && bannerDisplay.cta.text}
                </p>
              </button>
            )}
          </div>
        </div>
      </a>
    </TileContainer>
  );
};

export default GenericBannerTile;

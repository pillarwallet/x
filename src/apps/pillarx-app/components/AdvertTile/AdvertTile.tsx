/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/self-closing-comp */
import { Native } from '@hypelab/sdk-react';

// types
import { Advertisement, Projection } from '../../../../types/api';

// components
import EditorialTag from '../EditorialTag/EditorialTag';
import TileContainer from '../TileContainer/TileContainer';

type AdvertTileProps = {
  data: Projection | undefined;
  isDataLoading: boolean;
};

const AdvertTile = ({ data, isDataLoading }: AdvertTileProps) => {
  const { data: adData } = data || {};
  const slugData = adData as Advertisement | undefined;

  if (!slugData || isDataLoading) return null;

  return (
    <Native placement={slugData.slug}>
      <TileContainer
        id="advert-tile"
        className="mobile:bg-[#1F1D23] xs:flex-col"
      >
        <div className="flex flex-col p-4 justify-between desktop:basis-1/2 tablet:basis-1/2 mobile:basis-1/2 xs:basis-full xs:order-2">
          <EditorialTag label="Advert" color="white" />
          <div className="flex items-center gap-5 mb-2 mt-4">
            <img
              data-ref="icon"
              className="h-10 w-10 rounded-full"
              alt="advert-image"
            />
            <div className="flex flex-col">
              <p className="text-xs text-white">
                @<span data-ref="advertiser"></span>
              </p>
              <p
                className="text-xs text-purple_light"
                data-ref="displayUrl"
              ></p>
            </div>
          </div>
          <div
            data-ref="headline"
            className="desktop:text-xl tablet:text-xl mobile:text-base mb-2"
          ></div>
          <div data-ref="body" className="text-sm text-purple_light mb-2"></div>
          <a data-ref="ctaLink" href="/" target="_blank" rel="noreferrer">
            <p
              data-ref="ctaText"
              className="rounded-md text-base bg-purple_medium px-4 py-2 w-fit cursor-pointer"
            ></p>
          </a>
        </div>
        <div className="flex items-center justify-end desktop:basis-1/2 tablet:basis-1/2 mobile:basis-1/2 xs:basis-full xs:order-1">
          <a
            data-ref="ctaLink"
            href="/"
            target="_blank"
            rel="noreferrer"
            className="w-full"
          >
            <div
              data-ref="mediaContent"
              className="flex h-auto rounded-r-2xl mobile:rounded-2xl xs:rounded-2xl overflow-hidden cursor-pointer xs:w-full"
            ></div>
          </a>
        </div>
      </TileContainer>
    </Native>
  );
};

export default AdvertTile;

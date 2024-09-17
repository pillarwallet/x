import { createRef, useEffect, useState } from 'react';

// types
import { MediaGridData, Projection } from '../../../../types/api';

// components
import SkeletonLoader from '../../../../components/SkeletonLoader';
import useRefDimensions from '../../hooks/useRefDimensions';
import MediaGridCollection from '../MediaGridCollection/MediaGridCollection';
import TileContainer from '../TileContainer/TileContainer';
import Body from '../Typography/Body';

type HighlightedMediaGridTileProps = {
  data: Projection | undefined;
  isDataLoading: boolean;
};

const HighlightedMediaGridTile = ({
  data,
  isDataLoading,
}: HighlightedMediaGridTileProps) => {
  const [mediaGridTileWidth, setMediaGridTileWidth] = useState<number>(0);
  const { data: dataMedia, meta } = data || {};
  const dataMediaGrid = dataMedia as MediaGridData | undefined;

  // This mesure the window width
  const windowWidth = window.innerWidth;

  useEffect(() => {
    const handleTokenHorizontalWidthResize = () => {
      if (windowWidth > 1024) {
        // Depending on the window width, the HighlightedMediaGridTile
        // does not have the same width because of the app padding
        setMediaGridTileWidth(900);
      } else {
        setMediaGridTileWidth(960);
      }
    };

    handleTokenHorizontalWidthResize();
    window.addEventListener('resize', handleTokenHorizontalWidthResize);

    return () => {
      window.removeEventListener('resize', handleTokenHorizontalWidthResize);
    };
  }, [windowWidth]);

  const divRef = createRef<HTMLDivElement>();
  const dimensions = useRefDimensions(divRef);

  const numberOfMediGridCollections =
    dimensions.width > mediaGridTileWidth ? 3 : 4;

  if (!data && isDataLoading) {
    return (
      <TileContainer className="flex-col p-10 pt-[30px] tablet:p-5 mobile:p-0 mobile:bg-[#1F1D23]">
        <SkeletonLoader
          $height="24px"
          $width="180px"
          $radius="10px"
          $marginBottom="10px"
        />
        <div className="flex gap-8 tablet:flex-wrap mobile:flex-col justify-between">
          <SkeletonLoader
            $height="300px"
            $width="270px"
            $radius="10px"
            $marginBottom="16px"
          />
          <SkeletonLoader
            $height="300px"
            $width="270px"
            $radius="10px"
            $marginBottom="16px"
          />
        </div>
      </TileContainer>
    );
  }

  if (!dataMediaGrid?.grids) return null;

  return (
    <div ref={divRef}>
      <TileContainer className="flex-col p-10 pt-[30px] tablet:p-5 mobile:p-0 mobile:bg-[#1F1D23]">
        <Body className="text-purple_light mb-2.5">{meta?.display?.title}</Body>
        <div className="flex gap-8 tablet:flex-wrap mobile:flex-col justify-between">
          {dataMediaGrid.grids
            .slice(0, numberOfMediGridCollections)
            .map((collection, index) => (
              <MediaGridCollection key={index} gridData={collection} />
            ))}
        </div>
      </TileContainer>
    </div>
  );
};

export default HighlightedMediaGridTile;

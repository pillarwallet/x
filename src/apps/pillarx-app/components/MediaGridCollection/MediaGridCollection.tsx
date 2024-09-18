// types
import { MediaGridCollectionItem } from '../../../../types/api';

// components
import Body from '../Typography/Body';
import DisplayCollectionImage from './DisplayCollectionImage';

type MediaGridCollectionProps = {
  gridData: MediaGridCollectionItem;
};

const MediaGridCollection = ({ gridData }: MediaGridCollectionProps) => {
  const gridItems = gridData.items;

  if (!gridItems) return null;

  return (
    <div
      id="pillarx-feed-media-grid-collection"
      data-testid="media-grid-collection"
      className="flex flex-col bg-medium_grey max-w-[394px] mobile:min-w-full tablet:basis-[47%] desktop:basis-1/3 rounded-[10px] p-1 shrink"
    >
      <div className="flex h-[274px] w-full">
        <div className="flex basis-[73%] h-full">
          <DisplayCollectionImage
            image={gridItems[0].imageUrl}
            url={gridItems[0].url}
            className="object-cover w-full h-full rounded-md"
          />
        </div>
        <div className="flex flex-col basis-[27%] h-full ml-1">
          {gridItems[1] && (
            <DisplayCollectionImage
              image={gridItems[1].imageUrl}
              url={gridItems[1].url}
              className="object-cover w-full h-[calc((274px-8px)/3)] rounded-md"
            />
          )}
          {gridItems[2] && (
            <DisplayCollectionImage
              image={gridItems[2].imageUrl}
              url={gridItems[2].url}
              className="object-cover w-full h-[calc((274px-8px)/3)] rounded-md mt-1"
            />
          )}
          {gridItems[3] && (
            <DisplayCollectionImage
              image={gridItems[3].imageUrl}
              url={gridItems[3].url}
              className="object-cover w-full h-[calc((274px-8px)/3)] rounded-md mt-1"
            />
          )}
        </div>
      </div>
      <div className="flex mt-4 pb-3 px-2.5 items-center">
        <DisplayCollectionImage
          image={gridData.image_url}
          url={gridData.opensea_url}
          className="object-cover w-[50px] h-[50px] rounded-2xl mr-4"
        />
        {/* TO DO - add the number of items in the collection in the div below */}
        <div className="flex-col">
          <a href={gridData.opensea_url} target="_blank" rel="noreferrer">
            <Body className="w-full">{gridData.name}</Body>
          </a>
        </div>
      </div>
    </div>
  );
};

export default MediaGridCollection;
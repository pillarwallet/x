import moment from 'moment';
import { useEffect, useState } from 'react';

// api
import { useRecordPresenceMutation } from '../../../../services/pillarXApiPresence';

// hooks
import useTransactionKit from '../../../../hooks/useTransactionKit';

// types
import { EditorialDisplay, Projection } from '../../../../types/api';

// components
import EditorialTag from '../EditorialTag/EditorialTag';
import TileContainer from '../TileContainer/TileContainer';
import Body from '../Typography/Body';
import BodySmall from '../Typography/BodySmall';
import DisplayMedia from './DisplayMedia';

type EditorialTileProps = {
  data: Projection | undefined;
  isDataLoading: boolean;
};

const EditorialTile = ({ data, isDataLoading }: EditorialTileProps) => {
  /**
   * Import the recordPresence mutation from the
   * pillarXApiPresence service. We use this to
   * collect data on what asset is being selected
   */
  const [recordPresence] = useRecordPresenceMutation();

  const { walletAddress: accountAddress } = useTransactionKit();

  const [isBrokenMedia, setIsBrokenMedia] = useState<boolean>(false);
  const { meta } = data || {};
  const editorialDisplay = meta?.display as EditorialDisplay | undefined;

  const handleMediaError = () => {
    setIsBrokenMedia(true);
  };

  // useEffect to avoid error of changing state in component
  useEffect(() => {
    const displayMediaComponent = (
      <DisplayMedia
        editorialDisplay={editorialDisplay}
        isBrokenMedia={isBrokenMedia}
        handleMediaError={handleMediaError}
      />
    );
    if (!displayMediaComponent) {
      setIsBrokenMedia(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorialDisplay]);

  const editorialDate =
    editorialDisplay?.timestamp && new Date(editorialDisplay.timestamp * 1000);

  const handleClickOnTile = () => {
    if (accountAddress && data) {
      recordPresence({
        address: accountAddress,
        action: 'app:feed:tap',
        value: {
          layout: data.layout,
          id: data.id,
          exitHref: editorialDisplay?.href ? editorialDisplay.href : '',
        },
      });
    }
  };

  if (
    !data ||
    !editorialDisplay ||
    Object.keys(editorialDisplay).length < 2 ||
    isDataLoading
  ) {
    return null;
  }

  return (
    <TileContainer
      id="editorial-tile"
      className="flex-col desktop:p-10 desktop:pt-[30px] tablet:p-5 mobile:p-0 mobile:bg-[#1F1D23]"
    >
      <a
        href={editorialDisplay?.href}
        target="_blank"
        rel="noreferrer"
        onClick={handleClickOnTile}
      >
        <div className="flex mobile:flex-col bg-medium_grey rounded-2xl p-2 gap-4">
          {editorialDisplay?.media && !isBrokenMedia && (
            <div className="flex items-center justify-center overflow-hidden desktop:basis-2/5 tablet:basis-2/5 mobile:basis-full mobile:w-full">
              <DisplayMedia
                editorialDisplay={editorialDisplay}
                isBrokenMedia={isBrokenMedia}
                handleMediaError={handleMediaError}
              />
            </div>
          )}
          <div
            className={`flex flex-col justify-between w-full ${isBrokenMedia ? 'basis-full' : 'desktop:basis-3/5 tablet:basis-3/5 mobile:basis-full'} desktop:px-4 tablet:px-4 mobile:px-0`}
          >
            <div className="flex flex-col gap-2 desktop:mt-14 tablet:mt-8 mobile:mt-0">
              {editorialDisplay?.tags?.length &&
                editorialDisplay.tags.map((tag, index) => (
                  <EditorialTag
                    key={index}
                    color={tag.color}
                    icon={tag.icon}
                    label={tag.label}
                  />
                ))}
              {editorialDisplay?.title && (
                <h1 className="text-[20px] desktop:text-[32px]">
                  {editorialDisplay.title}
                </h1>
              )}
              {editorialDisplay?.summary && (
                <Body className="text-purple_light tablet:hidden mobile:hidden">
                  {editorialDisplay.summary}
                </Body>
              )}
            </div>
            <div className="mb-[18px] mt-4 flex justify-between">
              <div
                onClick={() =>
                  editorialDisplay?.attribution?.href &&
                  window.open(
                    editorialDisplay?.attribution?.href,
                    '_blank',
                    'noreferrer'
                  )
                }
                className={`flex gap-2 items-center ${editorialDisplay?.attribution?.href && 'cursor-pointer'}`}
              >
                {editorialDisplay?.attribution?.icon && (
                  <img
                    src={editorialDisplay.attribution.icon}
                    alt="display-icon"
                    className="h-5"
                  />
                )}
                {editorialDisplay?.attribution?.name && (
                  <BodySmall className="text-purple_light">
                    {editorialDisplay.attribution.name}
                  </BodySmall>
                )}
              </div>
              {editorialDate && (
                <BodySmall className="text-purple_light">
                  {moment(editorialDate).format('D MMMM YYYY')}
                </BodySmall>
              )}
            </div>
          </div>
        </div>
      </a>
    </TileContainer>
  );
};

export default EditorialTile;

import mime from 'mime';

// types
import { EditorialDisplay } from '../../../../types/api';

type DisplayMediaProps = {
  editorialDisplay: EditorialDisplay | undefined;
  isBrokenMedia: boolean;
  handleMediaError: () => void;
};

const DisplayMedia = ({
  editorialDisplay,
  isBrokenMedia,
  handleMediaError,
}: DisplayMediaProps) => {
  if (editorialDisplay?.media && !isBrokenMedia) {
    const mimeType = mime.getType(editorialDisplay.media);

    if (mimeType?.includes('image')) {
      return (
        <img
          src={editorialDisplay.media}
          alt="media-display"
          onError={handleMediaError}
          className="rounded-lg object-cover object-center desktop:h-full tablet:h-full mobile:w-full"
          data-testid="editorial-tile-image"
        />
      );
    }

    if (mimeType?.includes('video')) {
      return (
        <video
          className="rounded-lg w-full"
          preload="none"
          autoPlay
          loop
          muted
          controls
          playsInline
          data-testid="editorial-tile-video"
        >
          <source
            src={editorialDisplay.media}
            onError={handleMediaError}
            type={mimeType}
          />
        </video>
      );
    }

    if (mimeType?.includes('audio')) {
      return (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <audio
          className="w-full"
          preload="none"
          controls
          data-testid="editorial-tile-audio"
        >
          <source
            src={editorialDisplay.media}
            onError={handleMediaError}
            type={mimeType}
          />
        </audio>
      );
    }
  }

  return null;
};

export default DisplayMedia;

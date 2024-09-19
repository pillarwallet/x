// components
import RandomAvatar from '../RandomAvatar/RandomAvatar';

type DisplayCollectionImageProps = {
  name: string;
  image?: string;
  className: string;
  url?: string;
};

const DisplayCollectionImage = ({
  name,
  image,
  className,
  url,
}: DisplayCollectionImageProps) => {
  const handleClick = () => {
    if (url) {
      window.open(url, '_blank', 'noreferrer');
    }
  };

  if (!image) {
    return (
      <div
        id="pillarx-feed-display-collection-avatar"
        data-testid="display-collection-image"
        className={`overflow-hidden ${className} ${url && 'cursor-pointer'}`}
        onClick={handleClick}
      >
        <RandomAvatar isRandomVariant name={name} />
      </div>
    );
  }

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <img
      id="pillarx-feed-display-collection-image"
      data-testid="display-collection-image"
      src={image}
      alt="nft-image"
      className={`${className} ${url && 'cursor-pointer'}`}
      onClick={handleClick}
    />
  );
};

export default DisplayCollectionImage;

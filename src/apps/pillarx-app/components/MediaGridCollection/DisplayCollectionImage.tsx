import Avatar from 'boring-avatars';

type AvatarVariantType =
  | 'marble'
  | 'beam'
  | 'pixel'
  | 'sunset'
  | 'ring'
  | 'bauhaus';

type DisplayCollectionImageProps = {
  image?: string;
  className: string;
  url?: string;
};

const DisplayCollectionImage = ({
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
    const variants: AvatarVariantType[] = [
      'marble',
      'beam',
      'pixel',
      'sunset',
      'ring',
      'bauhaus',
    ];

    const randomVariant: AvatarVariantType =
      variants[Math.floor(Math.random() * variants.length)];

    return (
      <div
        id="pillarx-feed-display-collection-avatar"
        data-testid="display-collection-image"
        className={`overflow-hidden ${className} ${url && 'cursor-pointer'}`}
        onClick={handleClick}
      >
        <Avatar
          name="Random Avatar"
          variant={randomVariant}
          className="rounded-md"
          square
          data-testid="display-collection-avatar"
        />
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

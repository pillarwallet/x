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
        className={`overflow-hidden ${className} ${url && 'cursor-pointer'}`}
        onClick={handleClick}
      >
        <Avatar
          name="Maria Mitchell"
          variant={randomVariant}
          className="rounded-md"
          square
        />
      </div>
    );
  }

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <img
      src={image}
      alt="nft-image"
      className={`${className} ${url && 'cursor-pointer'}`}
      onClick={handleClick}
    />
  );
};

export default DisplayCollectionImage;

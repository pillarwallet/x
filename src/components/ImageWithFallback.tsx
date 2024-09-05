import { useState } from 'react';

// images
import unknownAssetImage from '../assets/images/logo-unknown.png';

// components
import IdenticonImage from './IdenticonImage';

const ImageWithFallback = ({
  src,
  alt,
}: {
  src: string | undefined;
  alt: string | undefined;
}) => {
  const [useFallbackImage, setUseFallbackImage] = useState(false);

  if (src && !useFallbackImage) {
    return (
      <img
        src={src}
        alt={alt}
        onError={({ currentTarget }) => {
          // eslint-disable-next-line no-param-reassign
          currentTarget.onerror = null;
          setUseFallbackImage(true);
        }}
      />
    );
  }

  if ((!src || useFallbackImage) && alt?.length) {
    return <IdenticonImage text={alt} size={256} />;
  }

  return <img src={unknownAssetImage} alt={alt} />;
};

export default ImageWithFallback;

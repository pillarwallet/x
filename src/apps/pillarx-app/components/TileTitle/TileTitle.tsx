import { useState } from 'react';

// components
import Body from '../Typography/Body';

type TileTitleProps = {
  title?: string;
  leftDecorator?: string;
  rightDecorator?: string;
};
const TileTitle = ({
  title,
  leftDecorator,
  rightDecorator,
}: TileTitleProps) => {
  const [isBrokenImageRight, setIsBrokenImageRight] = useState<boolean>(false);
  const [isBrokenImageLeft, setIsBrokenImageLeft] = useState<boolean>(false);

  return (
    <div className="flex items-center gap-2">
      {leftDecorator && !isBrokenImageLeft && (
        <img
          src={leftDecorator}
          alt="left-decorator-image"
          className="w-7 h-7 object-contain"
          onError={() => setIsBrokenImageLeft(true)}
        />
      )}
      {title && <Body>{title}</Body>}
      {rightDecorator && !isBrokenImageRight && (
        <img
          src={rightDecorator}
          alt="right-decorator-image"
          className="w-6 h-6 object-fill rounded-full"
          onError={() => setIsBrokenImageRight(true)}
        />
      )}
    </div>
  );
};

export default TileTitle;

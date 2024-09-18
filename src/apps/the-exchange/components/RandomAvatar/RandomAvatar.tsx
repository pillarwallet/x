import Avatar from 'boring-avatars';
import { AvatarVariantType } from '../../../../types';

const RandomAvatar = () => {
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
    <Avatar
      name="Random Avatar"
      variant={randomVariant}
      className="rounded-md"
      square
      data-testid="random-avatar"
    />
  );
};

export default RandomAvatar;

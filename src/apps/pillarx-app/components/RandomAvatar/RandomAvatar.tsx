import Avatar from 'boring-avatars';
import { AvatarVariantType } from '../../../../types';

type RandomAvatarProps = {
  name: string;
  variant?: string;
  isRandomVariant?: boolean;
};

const RandomAvatar = ({
  name,
  variant,
  isRandomVariant,
}: RandomAvatarProps) => {
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

  const avatarVariant = () => {
    if (isRandomVariant && !variant) {
      return randomVariant;
    }
    if (variant) {
      return variant as AvatarVariantType;
    }
    return 'marble';
  };

  return (
    <Avatar
      name={name}
      variant={avatarVariant()}
      className="rounded-md"
      square
      data-testid="random-avatar"
    />
  );
};

export default RandomAvatar;

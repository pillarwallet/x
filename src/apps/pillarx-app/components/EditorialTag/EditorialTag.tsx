import * as MuiIcons from '@mui/icons-material';

type IconName = keyof typeof MuiIcons;

type EditorialTagProps = {
  label?: string;
  icon?: string;
  color?: string;
};

const EditorialTag = ({ label, icon, color }: EditorialTagProps) => {
  const iconName = icon as IconName;
  const IconTag = icon ? MuiIcons[iconName] : null;
  const tagColor = color === 'default' ? 'white' : color;

  return (
    <div
      id="editorial-tag"
      className="flex relative rounded py-1 px-2 w-fit mr-2"
    >
      <div
        className="absolute inset-0 rounded opacity-10"
        style={{ backgroundColor: tagColor, zIndex: 5 }}
      />
      <div className="flex relative items-center gap-1" style={{ zIndex: 10 }}>
        {IconTag && (
          <IconTag
            data-testid="icon-tag"
            style={{ width: 16, height: 16, color: tagColor }}
          />
        )}
        {label && (
          <p className="text-xs" style={{ color: tagColor }}>
            {label}
          </p>
        )}
      </div>
    </div>
  );
};

export default EditorialTag;

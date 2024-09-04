// components
import Body from '../Typography/Body';

type TagsProps = {
  icon?: string;
  tagText?: string;
};
const Tags = ({ icon, tagText }: TagsProps) => {
  return (
    <div className="flex gap-2 items-center bg-medium_grey py-1.5 desktop:px-4 tablet:px-4 rounded-md mobile:px-3">
      {icon && <img src={icon} alt="tag-icon" />}
      {tagText && <Body>{tagText}</Body>}
    </div>
  );
};

export default Tags;

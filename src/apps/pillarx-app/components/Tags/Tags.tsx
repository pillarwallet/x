// components
import Body from '../Typography/Body';

type TagsProps = {
    icon?: string;
    tagText?: string;
}
const Tags = ({ icon, tagText }: TagsProps) => {
	return (
		<div className='flex gap-2 items-center bg-[#312F3A] py-1.5 px-4 rounded-md mobile:px-3'>
			{icon ? <img src={icon} /> : null}	
			{tagText ? <Body>{tagText}</Body> : null}
		</div>
	)
}

export default Tags;

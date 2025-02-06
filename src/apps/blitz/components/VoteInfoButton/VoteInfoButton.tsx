import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { TbTriangleFilled, TbTriangleInvertedFilled } from 'react-icons/tb';
import UsersVotesIcon from '../../images/users_votes_icon.svg';
import Body from '../Typography/Body';

type VoteInfoButtonProps = {
  type: 'up' | 'down';
};

const VoteInfoButton = ({ type }: VoteInfoButtonProps) => {
  const DUMMY_VOTES_NUMBER = 15;
  const DUMMY_VOTES_PERCENTAGE = 71.43982;

  return (
    <div className="flex flex-col basis-[30%] p-4 gap-5 w-full bg-gradient-to-t from-[#27262F] to-[#27262F4D] h-fit rounded-[20px]">
      <div className="flex justify-between">
        <div className="flex gap-2 items-center">
          <Body className="text-purple_light">Voted</Body>
          {type === 'up' ? (
            <TbTriangleFilled size={12} color="#5DC787" />
          ) : (
            <TbTriangleInvertedFilled size={12} color="#FF366C" />
          )}
        </div>
        <div className="flex px-1.5 py-1 bg-medium_grey rounded-md gap-1">
          <img src={UsersVotesIcon} alt="token-pot-icon" className="w-4 h-4" />
          <p className="text-[13px] text-purple_light">{DUMMY_VOTES_NUMBER}</p>
        </div>
      </div>
      <p
        className={`text-[40px] leading-10 ${type === 'up' ? 'text-percentage_green' : 'text-percentage_red'}`}
      >
        {DUMMY_VOTES_PERCENTAGE.toFixed(1)}%
      </p>
      <button
        type="button"
        className={`flex w-full p-2 items-center justify-center rounded-xl gap-2 ${type === 'up' ? 'bg-percentage_green' : 'bg-percentage_red'}`}
      >
        <p className="text-2xl">Vote</p>
        {type === 'up' ? <FaArrowUp size={15} /> : <FaArrowDown size={15} />}
      </button>
    </div>
  );
};

export default VoteInfoButton;

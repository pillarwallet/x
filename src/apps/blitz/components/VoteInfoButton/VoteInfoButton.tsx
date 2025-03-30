import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { TbTriangleFilled, TbTriangleInvertedFilled } from 'react-icons/tb';
import UsersVotesIcon from '../../images/users_votes_icon.svg';

type VoteInfoButtonProps = {
  type: 'up' | 'down';
};

const VoteInfoButton = ({ type }: VoteInfoButtonProps) => {
  const DUMMY_VOTES_NUMBER = 15;
  const DUMMY_VOTES_PERCENTAGE = 71.43982;

  return (
    <div className="flex flex-col desktop:basis-[30%] p-4 gap-5 w-full tablet:max-w-[256px] bg-gradient-to-t from-[#27262F] to-[#27262F4D] h-fit rounded-[20px]">
      <div className="flex justify-between">
        <div className="flex gap-2 items-center">
          <p className="desktop:text-base tablet:text-xs text-purple_light">
            Voted
          </p>
          {type === 'up' ? (
            <TbTriangleFilled
              className="desktop:w-3 desktop:h-3 tablet:w-2 tablet:h-2"
              color="#5DC787"
            />
          ) : (
            <TbTriangleInvertedFilled
              className="desktop:w-3 desktop:h-3 tablet:w-2 tablet:h-2"
              color="#FF366C"
            />
          )}
        </div>
        <div className="flex px-1.5 py-1 bg-medium_grey rounded-md gap-1 items-center">
          <img
            src={UsersVotesIcon}
            alt="token-pot-icon"
            className="desktop:w-4 desktop:h-4 tablet:w-3 tablet:h-3"
          />
          <p className="desktop:text-[13px] tablet:text-[10px] text-purple_light">
            {DUMMY_VOTES_NUMBER}
          </p>
        </div>
      </div>
      <p
        className={`flex text-[40px] leading-10 tablet:hidden ${type === 'up' ? 'text-percentage_green' : 'text-percentage_red'}`}
      >
        {DUMMY_VOTES_PERCENTAGE.toFixed(1)}%
      </p>
      <button
        type="button"
        className={`flex w-full p-2 items-center justify-center rounded-xl gap-2 ${type === 'up' ? 'bg-percentage_green' : 'bg-percentage_red'}`}
      >
        <p className="desktop:text-2xl tablet:text-base">Vote</p>
        {type === 'up' ? (
          <FaArrowUp className="desktop:w-[15px] desktop:h-[15px] tablet:w-3 tablet:h-3" />
        ) : (
          <FaArrowDown className="desktop:w-[15px] desktop:h-[15px] tablet:w-3 tablet:h-3" />
        )}
      </button>
    </div>
  );
};

export default VoteInfoButton;

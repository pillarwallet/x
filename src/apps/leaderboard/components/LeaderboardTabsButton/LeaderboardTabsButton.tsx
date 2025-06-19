// reducer
import { useAppDispatch, useAppSelector } from '../../hooks/useReducerHooks';
import {
  LeaderboardTimeTabsType,
  setTimeTab,
} from '../../reducer/LeaderboardSlice';

const LeaderboardTabsButton = () => {
  const dispatch = useAppDispatch();
  const timeTab = useAppSelector(
    (state) => state.leaderboard.timeTab as LeaderboardTimeTabsType
  );

  return (
    <div
      id="leaderboard-button-tabs"
      className="flex w-fit p-1 bg-[#121116] rounded-[10px]"
    >
      <button
        type="button"
        className={`items-center justify-center w-[130px] rounded-md p-1.5 ${timeTab === 'weekly' ? 'bg-container_grey' : 'bg-[#121116]'}`}
        onClick={() => dispatch(setTimeTab('weekly'))}
      >
        <p
          className={`font-normal text-[13px] ${timeTab === 'weekly' ? 'text-white' : 'text-white/[.5]'}`}
        >
          Weekly
        </p>
      </button>
      <button
        type="button"
        className={`items-center justify-center w-[130px] rounded-md p-1.5 ${timeTab === 'all' ? 'bg-container_grey' : 'bg-[#121116]'}`}
        onClick={() => dispatch(setTimeTab('all'))}
      >
        <p
          className={`font-normal text-[13px] ${timeTab === 'all' ? 'text-white' : 'text-white/[.5]'}`}
        >
          All Time
        </p>
      </button>
    </div>
  );
};

export default LeaderboardTabsButton;

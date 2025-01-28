// components
import Body from '../Typography/Body';

type LeaderboardTabsButtonProps = {
  tabs: string[];
  activeTab: number;
  onTabClick: (index: number) => void;
};

const LeaderboardTabsButton = ({
  tabs,
  activeTab,
  onTabClick,
}: LeaderboardTabsButtonProps) => {
  return (
    <div className="flex w-full bg-container_grey rounded-2xl p-4 gap-4 mb-5">
      {tabs.map((tab, index) => (
        <button
          type="button"
          key={index}
          onClick={() => onTabClick(index)}
          className={`p-3 w-full ${
            activeTab === index
              ? 'bg-purple_medium rounded-md'
              : 'hover:bg-medium_grey hover:rounded-md'
          }`}
        >
          <Body className="text-white">{tab}</Body>
        </button>
      ))}
    </div>
  );
};

export default LeaderboardTabsButton;

import { useState } from 'react';
import { TbTriangleFilled, TbTriangleInvertedFilled } from 'react-icons/tb';
import UserInfo from '../UserInfo/UserInfo';

const Tab = ({
  value,
  activeTab,
  setActiveTab,
}: {
  value: 'up' | 'down';
  activeTab: 'up' | 'down';
  setActiveTab: (value: 'up' | 'down') => void;
}) => {
  const DUMMY_VOTES_PERCENTAGE = 71.43982;
  return (
    <button
      type="button"
      className={`flex w-full items-center justify-between gap-2 py-1.5 px-3 rounded-lg ${
        activeTab === value && 'bg-[#33313E]'
      }`}
      onClick={() => setActiveTab(value)}
    >
      <div className="flex gap-2 items-center">
        <p className="text-base text-purple_light">Voted</p>
        {value === 'up' ? (
          <TbTriangleFilled className="w-3 h-3" color="#5DC787" />
        ) : (
          <TbTriangleInvertedFilled className="w-3 h-3" color="#FF366C" />
        )}
      </div>
      <p
        className={`text-[10px] py-[1px] px-1 rounded ${value === 'up' ? 'text-percentage_green bg-percentage_green/[.1]' : 'text-percentage_red bg-percentage_red/[.1]'}`}
      >
        {DUMMY_VOTES_PERCENTAGE.toFixed(1)}%
      </p>
    </button>
  );
};

const VotersList = () => {
  const [activeTab, setActiveTab] = useState<'up' | 'down'>('up');

  return (
    <div className="flex my-6 justify-center">
      {/* Desktop View */}
      <div className="flex tablet:hidden mobile:hidden">
        <div className="flex flex-col border-r-[1px] border-medium_grey pr-20">
          <div className="flex gap-2.5 items-center mb-6">
            <p className="text-white text-2xl">Voted</p>
            <TbTriangleFilled size={15} color="#5DC787" />
          </div>
          {Array.from({ length: 10 }).map((_, index) => (
            <UserInfo key={index} />
          ))}
        </div>
        <div className="flex flex-col pl-20">
          <div className="flex gap-2.5 items-center mb-6">
            <p className="text-white text-2xl">Voted</p>
            <TbTriangleInvertedFilled size={15} color="#FF366C" />
          </div>
          {Array.from({ length: 4 }).map((_, index) => (
            <UserInfo key={index} />
          ))}
        </div>
      </div>

      {/* Tablet and Mobile View with Tabs */}
      <div className="flex flex-col w-full max-w-[528px] desktop:hidden">
        <div className="flex w-full bg-container_grey p-1.5 rounded-xl">
          <Tab value="up" activeTab={activeTab} setActiveTab={setActiveTab} />
          <Tab value="down" activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        {activeTab === 'up' &&
          Array.from({ length: 10 }).map((_, index) => (
            <UserInfo key={index} />
          ))}
        {activeTab === 'down' &&
          Array.from({ length: 4 }).map((_, index) => <UserInfo key={index} />)}
      </div>
    </div>
  );
};

export default VotersList;

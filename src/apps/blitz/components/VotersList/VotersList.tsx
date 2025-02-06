import { TbTriangleFilled, TbTriangleInvertedFilled } from 'react-icons/tb';
import UserInfo from '../UserInfo/UserInfo';

const VotersList = () => {
  return (
    <div className="flex my-6">
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
  );
};

export default VotersList;

type LeaderboardFiltersButtonProps = {
  isActive: boolean;
  text: string;
  onClick: () => void;
};

const LeaderboardFiltersButton = ({
  isActive,
  text,
  onClick,
}: LeaderboardFiltersButtonProps) => {
  return (
    <button
      type="button"
      className={`flex py-[7px] px-2 w-fit h-fit items-center justify-center ${isActive ? 'bg-dark_blue text-white' : 'bg-container_grey text-white/[.5]'} border-x-[1px] border-t-[1px] border-b-[3px] rounded-lg border-[#121116] cursor-pointer`}
      onClick={onClick}
    >
      <p className="font-normal text-[13px]">{text}</p>
    </button>
  );
};

export default LeaderboardFiltersButton;

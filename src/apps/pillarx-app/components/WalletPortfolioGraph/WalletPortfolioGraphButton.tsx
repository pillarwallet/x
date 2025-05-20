// components
import BodySmall from '../Typography/BodySmall';

type WalletPortfolioGraphButtonProps = {
  isActive: boolean;
  text: string;
  onClick: () => void;
};

const WalletPortfolioGraphButton = ({
  isActive,
  text,
  onClick,
}: WalletPortfolioGraphButtonProps) => {
  return (
    <div
      className={`flex py-[1px] px-1.5 w-fit h-fit items-center justify-center ${isActive ? 'bg-dark_blue text-white' : 'bg-container_grey text-white/[.5]'} border-x-[1px] border-t-[1px] border-b-[3px] rounded-md border-[#121116] cursor-pointer`}
      onClick={onClick}
    >
      <BodySmall className="font-normal">{text}</BodySmall>
    </div>
  );
};

export default WalletPortfolioGraphButton;

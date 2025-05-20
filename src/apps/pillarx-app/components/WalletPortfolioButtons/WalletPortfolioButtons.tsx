import { RiArrowDownLine } from 'react-icons/ri';

// reducer
import { useAppDispatch } from '../../hooks/useReducerHooks';
import { setIsReceiveModalOpen } from '../../reducer/WalletPortfolioSlice';

// components
import ReceiveModal from '../ReceiveModal';
import BodySmall from '../Typography/BodySmall';
import WalletConnectDropdown from '../WalletConnectDropdown/WalletConnectDropdown';

const WalletPortfolioButtons = () => {
  const dispatch = useAppDispatch();
  return (
    <div className="flex w-full desktop:gap-x-2.5 tablet:gap-x-2.5">
      <ReceiveModal />
      <div
        className="flex py-[9px] px-3 w-fit h-fit items-center justify-center border-x-2 border-t-2 border-b-4 rounded-[10px] border-[#121116] cursor-pointer"
        onClick={() => dispatch(setIsReceiveModalOpen(true))}
      >
        <div className="flex gap-2 items-center justify-center rounded-lg cursor-pointer">
          <BodySmall>Receive</BodySmall>
          <RiArrowDownLine size={16} color="white" />
        </div>
      </div>
      <WalletConnectDropdown />
    </div>
  );
};

export default WalletPortfolioButtons;

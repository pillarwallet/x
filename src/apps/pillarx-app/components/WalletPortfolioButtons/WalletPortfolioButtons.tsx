import { usePrivy } from '@privy-io/react-auth';
import { RiArrowDownLine } from 'react-icons/ri';
import { useAccount } from 'wagmi';

// hooks
import { useEIP7702Upgrade } from '../../../../hooks/useEIP7702Upgrade';

// reducer
import { useAppDispatch } from '../../hooks/useReducerHooks';
import { setIsReceiveModalOpen } from '../../reducer/WalletPortfolioSlice';

// components
import useTransactionKit from '../../../../hooks/useTransactionKit';
import ReceiveModal from '../ReceiveModal/ReceiveModal';
import BodySmall from '../Typography/BodySmall';
import WalletConnectDropdown from '../WalletConnectDropdown/WalletConnectDropdown';

const WalletPortfolioButtons = () => {
  const dispatch = useAppDispatch();
  const { user } = usePrivy();
  const { isConnected } = useAccount();
  const { isEligible, handleUpgradeClick } = useEIP7702Upgrade();
  const { kit } = useTransactionKit();

  // Check if Privy user is connected via WalletConnect using linkedAccounts
  const isPrivyConnectedViaWalletConnect = user?.linkedAccounts?.some(
    (account) =>
      account.type === 'wallet' &&
      (account.connectorType === 'wallet_connect' ||
        account.connectorType === 'wallet_connect_v1' ||
        account.connectorType === 'wallet_connect_v2')
  );

  // Don't show WalletConnectDropdown if user is connected via Wagmi or Privy with WalletConnect
  // or if user is in delegatedEoa mode
  const shouldShowWalletConnectDropdown =
    !isConnected &&
    !isPrivyConnectedViaWalletConnect &&
    kit.getEtherspotProvider().getWalletMode() !== 'delegatedEoa';

  return (
    <div className="flex w-full desktop:gap-x-2.5 tablet:gap-x-2.5">
      <ReceiveModal />
      <button
        type="button"
        className="flex py-[9px] px-3 w-fit h-fit items-center justify-center border-x-2 border-t-2 border-b-4 rounded-[10px] border-[#121116] cursor-pointer"
        onClick={() => dispatch(setIsReceiveModalOpen(true))}
      >
        <div className="flex gap-2 items-center justify-center rounded-lg cursor-pointer">
          <BodySmall>Receive</BodySmall>
          <RiArrowDownLine size={16} color="white" />
        </div>
      </button>
      {isEligible && (
        <button
          type="button"
          className="flex py-[9px] px-3 w-fit h-fit items-center justify-center border-x-2 border-t-2 border-b-4 rounded-[10px] border-[#121116] cursor-pointer"
          onClick={handleUpgradeClick}
        >
          <div className="flex gap-2 items-center justify-center rounded-lg cursor-pointer">
            <BodySmall>Upgrade</BodySmall>
            <RiArrowDownLine size={16} color="white" className="rotate-180" />
          </div>
        </button>
      )}
      {shouldShowWalletConnectDropdown && <WalletConnectDropdown />}
    </div>
  );
};

export default WalletPortfolioButtons;

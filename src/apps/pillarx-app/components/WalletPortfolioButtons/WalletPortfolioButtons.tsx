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

// hooks
import useTransactionKit from '../../../../hooks/useTransactionKit';

const WalletPortfolioButtons = () => {
  const dispatch = useAppDispatch();
  const { user } = usePrivy();
  const { isConnected } = useAccount();
  const { isEligible, handleUpgradeClick } = useEIP7702Upgrade();
  const { walletAddress: accountAddress, kit } = useTransactionKit();

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

  const handleAddCash = async () => {
    try {
      // Validate wallet address
      if (!accountAddress) {
        throw new Error('Wallet address is not available');
      }

      // Check if address is a valid Ethereum address (0x followed by 40 hex characters)
      const isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(accountAddress);
      if (!isValidAddress) {
        throw new Error('Invalid wallet address format');
      }

      // Get token from backend API
      const tokenUrl = new URL(import.meta.env.VITE_ONRAMP_JWT_URL);

      const tokenResponse = await fetch(tokenUrl.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!tokenResponse.ok) {
        throw new Error('Failed to get token from backend');
      }

      const tokenData = await tokenResponse.json();
      const { token } = tokenData;

      if (!token) {
        throw new Error('No token received from backend');
      }

      console.log('Received token from backend:', token);

      // Get user's current IP address
      let clientIp = '127.0.0.1'; // fallback
      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        if (ipResponse.ok) {
          const ipData = await ipResponse.json();
          clientIp = ipData.ip;
          console.log('Client IP:', clientIp);
        }
      } catch (ipError) {
        console.warn('Failed to fetch client IP, using fallback:', ipError);
      }

      // Call Coinbase API to create onramp session (via Vite proxy to avoid CORS)
      const response = await fetch(
        '/api/coinbase/platform/v2/onramp/sessions',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            purchaseCurrency: 'USDC',
            destinationNetwork: 'base',
            destinationAddress: accountAddress,
            paymentCurrency: 'USD',
            clientIp,
          }),
        }
      );

      const data = await response.json();
      console.log('Coinbase API response for onramp session:', data);

      console.log('Onramp session created successfully');

      const onrampUrl = data?.session?.onrampUrl;

      if (!onrampUrl) {
        throw new Error('No URL received from Coinbase API');
        return;
      }
      console.log('Opening onramp URL:', onrampUrl);
      window.open(onrampUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error opening add cash URL:', error);
      // Optionally show user-friendly error message
      alert(error instanceof Error ? error.message : 'Failed to open add cash');
    }
  };

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
      <button
        type="button"
        className="flex py-[9px] px-3 w-fit h-fit items-center justify-center border-x-2 border-t-2 border-b-4 rounded-[10px] border-[#121116] cursor-pointer"
        onClick={() => handleAddCash()}
      >
        <div className="flex gap-2 items-center justify-center rounded-lg cursor-pointer">
          <BodySmall>Add Cash</BodySmall>
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

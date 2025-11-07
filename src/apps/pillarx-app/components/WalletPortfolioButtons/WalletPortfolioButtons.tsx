import { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { RiArrowDownLine } from 'react-icons/ri';
import { useAccount } from 'wagmi';
import { TailSpin } from 'react-loader-spinner';

// hooks
import { useEIP7702Upgrade } from '../../../../hooks/useEIP7702Upgrade';
import useTransactionKit from '../../../../hooks/useTransactionKit';

// reducer
import { useAppDispatch } from '../../hooks/useReducerHooks';
import { setIsReceiveModalOpen } from '../../reducer/WalletPortfolioSlice';

// components
import ReceiveModal from '../ReceiveModal/ReceiveModal';
import BodySmall from '../Typography/BodySmall';
import WalletConnectDropdown from '../WalletConnectDropdown/WalletConnectDropdown';

// icons
import FrameIcon from '../../images/Frame.svg';

const WalletPortfolioButtons = () => {
  const dispatch = useAppDispatch();
  const { user } = usePrivy();
  const { isConnected } = useAccount();
  const { isEligible, handleUpgradeClick } = useEIP7702Upgrade();
  const { walletAddress: accountAddress, kit } = useTransactionKit();
  const [isAddCashLoading, setIsAddCashLoading] = useState(false);

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
    if (isAddCashLoading) return;

    setIsAddCashLoading(true);

    // Open window immediately to preserve user gesture for mobile browsers
    // We'll redirect it once we have the URL
    const newWindow = window.open('about:blank', '_blank', 'noopener,noreferrer');

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

      // Get user's current IP address
      let clientIp = '127.0.0.1'; // fallback
      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        if (ipResponse.ok) {
          const ipData = await ipResponse.json();
          clientIp = ipData.ip;
        }
      } catch (ipError) {
        // Silently fall back to default IP
      }

      // Call Coinbase API to create onramp session (via proxy to avoid CORS)
      // This uses Vite proxy in dev and Cloudflare Pages Function in production
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

      if (!response.ok) {
        throw new Error(
          `Coinbase API error (${response.status}): ${data.error || JSON.stringify(data)}`
        );
      }

      const onrampUrl = data?.session?.onrampUrl;

      if (!onrampUrl) {
        throw new Error('No URL received from Coinbase API');
      }

      // Redirect the pre-opened window to the Coinbase URL
      if (newWindow) {
        newWindow.location.href = onrampUrl;
      } else {
        // Fallback: if popup was blocked, try direct window.open
        window.open(onrampUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      // Close the blank window if we opened one and then failed
      if (newWindow) {
        newWindow.close();
      }

      // TODO: Replace with toast notification or proper error UI
      // For now, silently fail - user can try again
      // Error is logged for debugging in development
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error('Error opening add cash URL:', error);
      }
    } finally {
      setIsAddCashLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full gap-y-2.5">
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
        {shouldShowWalletConnectDropdown && <WalletConnectDropdown />}
      </div>
      <div className="flex w-full desktop:gap-x-2.5 tablet:gap-x-2.5">
        <button
          type="button"
          className="flex py-[9px] px-3 w-fit h-fit items-center justify-center border-x-2 border-t-2 border-b-4 rounded-[10px] border-[#121116] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleAddCash}
          disabled={isAddCashLoading}
        >
          <div className="flex gap-2 items-center justify-center rounded-lg">
            {isAddCashLoading ? (
              <>
                <span className="text-white font-medium text-[14px] leading-[14px] tracking-[-0.02em] text-center align-bottom">
                  Add Cash
                </span>
                <TailSpin color="#FFFFFF" height={16} width={16} />
              </>
            ) : (
              <>
                <span className="text-white font-medium text-[14px] leading-[14px] tracking-[-0.02em] text-center align-bottom">
                  Add Cash
                </span>
                <img src={FrameIcon} alt="Add Cash" width={16} height={16} />
              </>
            )}
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
      </div>
    </div>
  );
};

export default WalletPortfolioButtons;

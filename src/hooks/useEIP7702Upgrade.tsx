import { useCallback, useState } from 'react';
import { createPublicClient, formatEther, http } from 'viem';

// hooks
import { useEIP7702Info } from './useEIP7702Info';
import { useTransactionDebugLogger } from './useTransactionDebugLogger';
import useTransactionKit from './useTransactionKit';

// reducer
import { getNetworkViem } from '../apps/deposit/utils/blockchain';
import {
  useAppDispatch,
  useAppSelector,
} from '../apps/pillarx-app/hooks/useReducerHooks';
import {
  setIsEIP7702Eligible,
  setIsUpgradeWalletModalOpen,
} from '../apps/pillarx-app/reducer/WalletPortfolioSlice';

export interface GasUpgradeInfo {
  balanceInEth: number;
  gasCostInEth: number;
  requiredEth: number;
  hasEnoughEth: boolean;
}

type EIP7702UpgradeProps = {
  chainId?: number;
};

export const useEIP7702Upgrade = ({
  chainId = 1,
}: EIP7702UpgradeProps = {}) => {
  const [isCheckingGas, setIsCheckingGas] = useState<boolean>(false);
  const [gasUpgradeInfo, setGasUpgradeInfo] = useState<
    GasUpgradeInfo | undefined
  >(undefined);
  const dispatch = useAppDispatch();
  const { walletAddress } = useTransactionKit();
  const { transactionDebugLog } = useTransactionDebugLogger();
  const eip7702Info = useEIP7702Info();
  const isEligible = useAppSelector(
    (state) => state.walletPortfolio.isEIP7702Eligible
  );
  const hasCompletedUpgrade = useAppSelector(
    (state) => state.walletPortfolio.hasCompletedEIP7702Upgrade
  );
  const isModalOpen = useAppSelector(
    (state) => state.walletPortfolio.isUpgradeWalletModalOpen
  );

  // Check if user is eligible for EIP-7702 upgrade
  const checkEligibility = useCallback(() => {
    // If user has already completed the upgrade, do not allow upgrading again
    if (hasCompletedUpgrade) {
      dispatch(setIsEIP7702Eligible(false));
      return false;
    }

    const selectedChainEIP7702Info = eip7702Info[chainId]; // Default mainnet chainId is 1
    const hasSelectedChainEIP7702 =
      selectedChainEIP7702Info?.hasImplementation || false;

    const eligible =
      !hasSelectedChainEIP7702 &&
      Object.keys(eip7702Info).length > 0 &&
      !!walletAddress;

    dispatch(setIsEIP7702Eligible(eligible));

    return eligible;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eip7702Info, walletAddress, isEligible, hasCompletedUpgrade, chainId]);

  // Calculate gas costs
  const calculateGas = useCallback(async () => {
    if (!walletAddress) {
      transactionDebugLog('Gas calculation skipped - no wallet address');
      return null;
    }

    transactionDebugLog('Starting gas calculation for EIP-7702 upgrade', {
      walletAddress,
    });
    setIsCheckingGas(true);

    try {
      const publicClient = createPublicClient({
        chain: getNetworkViem(chainId),
        transport: http(),
      });

      const balance = await publicClient.getBalance({
        address: walletAddress as `0x${string}`,
      });
      const balanceInEth = parseFloat(formatEther(balance));

      const estimatedGas = BigInt(50000); // Estimated gas (approx.) for EIP-7702 upgrade
      const gasPrice = await publicClient.getGasPrice();
      const gasCost = estimatedGas * gasPrice;
      const gasCostInEth = parseFloat(formatEther(gasCost));

      const requiredEth = gasCostInEth * 1.3; // 30% buffer cost
      const hasEnoughEth = balanceInEth >= requiredEth;

      transactionDebugLog('Gas calculation completed', {
        balanceInEth,
        gasCostInEth,
        requiredEth,
        hasEnoughEth,
        estimatedGas: estimatedGas.toString(),
        gasPrice: gasPrice.toString(),
      });

      return {
        balanceInEth,
        gasCostInEth,
        requiredEth,
        hasEnoughEth,
      };
    } catch (error) {
      console.error('Failed to calculate gas:', error);
      transactionDebugLog('Gas calculation failed:', error);
      return null;
    } finally {
      setIsCheckingGas(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId, walletAddress]);

  // Check eligibility and optionally show modal
  const checkEligibilityAndShowModal = useCallback(
    async (showModalImmediately = false) => {
      setGasUpgradeInfo(undefined); // Clear old gas data to force fresh calculation

      // If this is a manual click
      if (showModalImmediately) {
        dispatch(setIsUpgradeWalletModalOpen(true));
        return;
      }

      const eligible = checkEligibility();

      if (!eligible) {
        return;
      }

      // Check if user previously dismissed the upgrade modal
      const wasDismissed = localStorage.getItem('eip7702_upgrade_dismissed');

      // Don't auto-show modal if it's already open or user dismissed it
      if (isModalOpen || wasDismissed) {
        return;
      }

      // Calculate gas in the background
      const gasInfo = await calculateGas();

      if (gasInfo) {
        setGasUpgradeInfo(gasInfo);
        // Only show modal if user has enough gas and hasn't dismissed it
        const shouldShowAutoModal = !wasDismissed && gasInfo.hasEnoughEth;
        dispatch(setIsUpgradeWalletModalOpen(shouldShowAutoModal));
      }
    },
    [checkEligibility, calculateGas, dispatch, isModalOpen]
  );

  // Manual button click handler
  const handleUpgradeClick = useCallback(() => {
    checkEligibilityAndShowModal(true);
  }, [checkEligibilityAndShowModal]);

  // Auto check on login (only show modal if enough gas)
  const checkOnLogin = useCallback(() => {
    checkEligibilityAndShowModal(false);
  }, [checkEligibilityAndShowModal]);

  return {
    isCheckingGas,
    isEligible,
    handleUpgradeClick,
    checkOnLogin,
    calculateGasFees: calculateGas,
    setGasUpgradeInfo,
    gasUpgradeInfo,
  };
};

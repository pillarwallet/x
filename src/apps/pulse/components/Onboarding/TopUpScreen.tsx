import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { TailSpin } from 'react-loader-spinner';
import { BigNumber, utils } from 'ethers';
import { Address, encodeFunctionData, erc20Abi, parseUnits } from 'viem';

// assets
import BackArrow from '../../assets/back-arrow.svg';
import ArrowDown from '../../assets/arrow-down.svg';
import WalletIcon from '../../assets/wallet.svg';
import EscIcon from '../../assets/esc-icon.svg';
import { getLogoForChainId } from '../../../../utils/blockchain';

// components
import PreviewTopUp from './PreviewTopUp';

// constants
import { STABLE_CURRENCIES } from '../../constants/tokens';

// hooks
import useRelaySell, { SellOffer } from '../../hooks/useRelaySell';
import useDeployWallet from '../../../../hooks/useDeployWallet';

// services
import {
  getAllGaslessPaymasters,
  Paymasters,
} from '../../../../services/gasless';

// types
import { SelectedToken } from '../../types/tokens';
import {
  PortfolioToken,
  chainIdToChainNameTokensData,
} from '../../../../services/tokensData';

// utils
import { calculateTopUpGasCost } from '../../utils/gasCalculation';

interface FeeAsset {
  decimals: number;
  balance: number;
  tokenPrice?: string;
  asset: {
    symbol: string;
    contract: string;
    name: string;
    decimals: number;
    balance: number;
    price?: number;
  };
  paymasterAddress?: string;
  [key: string]: unknown;
}

interface TopUpScreenProps {
  onBack: () => void;
  initialBalance: number;
  setSearching: () => void;
  selectedToken: SelectedToken | null;
  portfolioTokens: PortfolioToken[];
  setOnboardingScreen: Dispatch<SetStateAction<'welcome' | 'topup' | null>>;
  markOnboardingComplete: () => void;
  isPortfolioLoading?: boolean;
  showCloseButton?: boolean; // Show ESC button instead of back arrow
}

export default function TopUpScreen(props: TopUpScreenProps) {
  const {
    onBack,
    initialBalance,
    setSearching,
    selectedToken,
    portfolioTokens,
    setOnboardingScreen,
    markOnboardingComplete,
    isPortfolioLoading = false,
    showCloseButton = false,
  } = props;
  const [amount, setAmount] = useState<string>('');
  const [allocateAmount, setAllocateAmount] = useState<number>(10);
  const [inputPlaceholder, setInputPlaceholder] = useState<string>('0');
  const [error, setError] = useState<string | null>(null);
  const [sellOffer, setSellOffer] = useState<SellOffer | null>(null);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isGaslessSupported, setIsGaslessSupported] = useState<boolean>(false);
  const [selectedFeeAsset, setSelectedFeeAsset] = useState<FeeAsset | null>(
    null
  );
  const [gasPrice, setGasPrice] = useState<string>('');
  const [estimatedGasCostInToken, setEstimatedGasCostInToken] =
    useState<string>('');
  const [approveData, setApproveData] = useState<string>('');
  const [selectedPaymasterAddress, setSelectedPaymasterAddress] =
    useState<string>('');

  const {
    getBestSellOffer,
    isInitialized: isRelayInitialized,
    error: relayError,
  } = useRelaySell();

  const { getGasPrice } = useDeployWallet();

  // Check if selected token is USDC
  const isSelectedTokenUSDC = (): boolean => {
    if (!selectedToken) return false;
    return STABLE_CURRENCIES.some(
      (stable) =>
        stable.chainId === selectedToken.chainId &&
        stable.address.toLowerCase() === selectedToken.address.toLowerCase()
    );
  };

  // Get selected token balance info
  const getSelectedTokenBalance = () => {
    if (!selectedToken) {
      return { balance: 0, usdValue: 0, symbol: '' };
    }

    const portfolioToken = portfolioTokens.find(
      (token) =>
        token.contract.toLowerCase() === selectedToken.address.toLowerCase() &&
        token.blockchain === chainIdToChainNameTokensData(selectedToken.chainId)
    );

    if (portfolioToken && portfolioToken.balance && portfolioToken.price) {
      const { balance } = portfolioToken;
      const usdValue = balance * portfolioToken.price;
      return { balance, usdValue, symbol: selectedToken.symbol };
    }

    return { balance: 0, usdValue: 0, symbol: selectedToken.symbol };
  };

  const quickAmounts = ['25%', '50%', '75%', '100%'];

  // Set allocate amount to selected token's balance when token changes
  useEffect(() => {
    if (selectedToken && portfolioTokens.length > 0) {
      // Find the matching portfolio token to get balance
      const portfolioToken = portfolioTokens.find(
        (token) =>
          token.contract.toLowerCase() ===
            selectedToken.address.toLowerCase() &&
          token.blockchain ===
            chainIdToChainNameTokensData(selectedToken.chainId)
      );

      if (portfolioToken && portfolioToken.balance && portfolioToken.price) {
        const tokenBalanceUsd = portfolioToken.balance * portfolioToken.price;
        setAllocateAmount(parseFloat(tokenBalanceUsd.toFixed(2)));
      }
    }
  }, [selectedToken, portfolioTokens]);

  // Update allocate amount when amount or sell offer changes
  useEffect(() => {
    const usdAmount = parseFloat(amount) || 0;

    if (usdAmount > 0) {
      if (isSelectedTokenUSDC()) {
        // For USDC tokens: Convert USD to USDC amount using USDC price
        const usdcToken = portfolioTokens.find((token) => {
          const isUSDC = STABLE_CURRENCIES.some(
            (stable) =>
              stable.address.toLowerCase() === token.contract.toLowerCase() &&
              selectedToken &&
              stable.chainId === selectedToken.chainId
          );
          return isUSDC;
        });

        const usdcPrice = usdcToken?.price || 1; // Default to 1 if not found
        const usdcAmount = usdAmount / usdcPrice;
        setAllocateAmount(usdcAmount);
      } else if (sellOffer) {
        // For non-USDC tokens: Use the minimum USDC received from swap
        // Round down to 2 decimal places to prevent requesting more than received
        const receivedUsdcAmount = sellOffer.tokenAmountToReceive;

        // Default to the input amount (USD), but capped at received amount
        // This handles cases where price data might be inconsistent
        const targetAmount = Math.min(usdAmount, receivedUsdcAmount);
        const roundedDownAmount = Math.floor(targetAmount * 100) / 100;
        setAllocateAmount(roundedDownAmount);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, sellOffer, selectedToken, portfolioTokens]);

  // Fetch sell offer for non-USDC tokens
  useEffect(() => {
    const fetchSellOffer = async () => {
      // Only fetch for non-USDC tokens
      if (
        !selectedToken ||
        isSelectedTokenUSDC() ||
        !amount ||
        parseFloat(amount) <= 0
      ) {
        setSellOffer(null);
        setIsLoadingQuote(false);
        return;
      }

      if (!isRelayInitialized) {
        setSellOffer(null);
        setIsLoadingQuote(false);
        return;
      }

      // Find the token in portfolio to get actual balance and price
      const portfolioToken = portfolioTokens.find(
        (token) =>
          token.contract.toLowerCase() ===
            selectedToken.address.toLowerCase() &&
          token.blockchain ===
            chainIdToChainNameTokensData(selectedToken.chainId)
      );

      if (!portfolioToken || !portfolioToken.balance || !portfolioToken.price) {
        setSellOffer(null);
        setIsLoadingQuote(false);
        return;
      }

      setIsLoadingQuote(true);
      try {
        // Convert USD amount to token amount
        // amount is in USD, we need to convert to token amount
        const usdAmount = parseFloat(amount);
        const tokenPrice = portfolioToken.price;
        const tokenAmount = usdAmount / tokenPrice;

        // Get quote for selling the token amount to get USDC
        const offer = await getBestSellOffer({
          fromAmount: tokenAmount.toString(),
          fromTokenAddress: selectedToken.address,
          fromChainId: selectedToken.chainId,
          fromTokenDecimals: selectedToken.decimals,
          toChainId: selectedToken.chainId, // Same chain
        });

        setSellOffer(offer);
      } catch (err) {
        console.error('Failed to get sell offer:', err);
        setSellOffer(null);
      } finally {
        setIsLoadingQuote(false);
      }
    };

    fetchSellOffer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    amount,
    selectedToken,
    portfolioTokens,
    isRelayInitialized,
    getBestSellOffer,
  ]);

  // Fetch gasless paymasters and check if selected token supports gasless
  useEffect(() => {
    const fetchGaslessPaymasters = async () => {
      if (!selectedToken || !portfolioTokens.length) {
        setIsGaslessSupported(false);
        setSelectedFeeAsset(null);
        setSelectedPaymasterAddress('');
        return;
      }

      try {
        const paymasterObject = await getAllGaslessPaymasters(
          selectedToken.chainId,
          portfolioTokens
        );

        if (!paymasterObject || paymasterObject.length === 0) {
          // No gasless support - fall back to native
          setIsGaslessSupported(false);
          setSelectedFeeAsset(null);
          setSelectedPaymasterAddress('');
          return;
        }

        // Check if selected token supports gasless
        const matchingPaymaster = paymasterObject.find(
          (item: Paymasters) =>
            item.gasToken.toLowerCase() === selectedToken.address.toLowerCase()
        );

        if (matchingPaymaster) {
          // Selected token supports gasless!
          const tokenData = portfolioTokens.find(
            (token) =>
              token.contract.toLowerCase() ===
              selectedToken.address.toLowerCase()
          );

          if (tokenData) {
            setIsGaslessSupported(true);
            setSelectedFeeAsset({
              id: `${matchingPaymaster.gasToken}-${matchingPaymaster.chainId}-${matchingPaymaster.paymasterAddress}-${tokenData.decimals}`,
              type: 'token',
              title: tokenData.name,
              imageSrc: tokenData.logo,
              chainId: matchingPaymaster.chainId,
              value: tokenData.balance?.toString() || '0',
              price: tokenData.price?.toString() || '0',
              balance: tokenData.balance || 0,
              tokenPrice: tokenData.price?.toString(),
              decimals: tokenData.decimals || 18,
              asset: {
                name: tokenData.name,
                symbol: tokenData.symbol,
                contract: matchingPaymaster.gasToken,
                decimals: tokenData.decimals || 18,
                balance: tokenData.balance || 0,
                price: tokenData.price,
              },
              paymasterAddress: matchingPaymaster.paymasterAddress,
            });
            setSelectedPaymasterAddress(matchingPaymaster.paymasterAddress);

            // Fetch actual gas price from chain for accurate fee estimation
            const price = await getGasPrice(selectedToken.chainId);
            if (price) setGasPrice(price);
          }
        } else {
          // Selected token doesn't support gasless - fall back to native
          setIsGaslessSupported(false);
          setSelectedFeeAsset(null);
          setSelectedPaymasterAddress('');
        }
      } catch (err) {
        console.error('Failed to fetch gasless paymasters:', err);
        setIsGaslessSupported(false);
        setSelectedFeeAsset(null);
      }
    };

    fetchGaslessPaymasters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedToken, portfolioTokens]);

  // Get chain name from chain ID
  const getChainName = (chainId: number): string => {
    const chainNames: { [key: number]: string } = {
      1: 'Ethereum',
      137: 'Polygon',
      10: 'Optimism',
      42161: 'Arbitrum',
      8453: 'Base',
      56: 'BSC',
    };
    return chainNames[chainId] || 'Unknown';
  };

  // Generate approval data for fee token
  const generateApprovalData = async (gasCost: number) => {
    if (
      !selectedFeeAsset ||
      !gasPrice ||
      !selectedToken ||
      !selectedPaymasterAddress
    )
      return;

    try {
      const estimatedCost = Number(
        utils.formatEther(BigNumber.from(gasCost).mul(BigNumber.from(gasPrice)))
      );

      // Get native price in USD from paymaster API
      const paymasterUrl = import.meta.env.VITE_PAYMASTER_URL;
      const nativePriceResponse = await fetch(
        `${paymasterUrl}/getNativePriceUSD?chainId=${selectedToken.chainId}`
      );

      // Validate HTTP response
      if (!nativePriceResponse.ok) {
        const errorMessage = `Failed to fetch native token price: ${nativePriceResponse.status} ${nativePriceResponse.statusText}`;
        console.error(errorMessage);
        setError(
          'Unable to calculate gas fees. Please check your network connection and try again.'
        );
        setApproveData('');
        return;
      }

      const nativePriceData = await nativePriceResponse.json();

      // Validate response data contains the required price field
      if (
        typeof nativePriceData.priceUSD !== 'number' ||
        nativePriceData.priceUSD <= 0
      ) {
        console.error('Invalid native price data received:', nativePriceData);
        setError(
          'Unable to calculate gas fees due to invalid price data. Please try again.'
        );
        setApproveData('');
        return;
      }

      const costAsFiat = estimatedCost * nativePriceData.priceUSD;

      const feeTokenPrice = parseFloat(selectedFeeAsset.tokenPrice || '0');

      if (feeTokenPrice > 0) {
        const estimatedCostInToken = costAsFiat / feeTokenPrice;
        const estimatedCostInTokenFixed = estimatedCostInToken.toFixed(
          selectedFeeAsset.decimals
        );

        setEstimatedGasCostInToken(estimatedCostInTokenFixed);

        // Check if user has enough balance for both topup amount AND gas fee
        const userBalance = selectedFeeAsset.balance ?? 0;
        const tokenPrice = parseFloat(selectedFeeAsset.tokenPrice || '0') || 1; // Default to 1 if price unavailable

        // When the fee token is the same as the topup token,
        // calculate remaining balance after deducting the topup amount
        // Convert topup amount from USD to token units using token price
        const topUpAmountUSD = parseFloat(amount) || 0;
        const topUpAmountInTokens =
          tokenPrice > 0 ? topUpAmountUSD / tokenPrice : 0;

        const isFeeSameAsToken =
          selectedFeeAsset.asset.contract.toLowerCase() ===
          selectedToken.address.toLowerCase();

        let availableBalanceForFee = userBalance;
        if (isFeeSameAsToken) {
          availableBalanceForFee = userBalance - topUpAmountInTokens;
        }

        if (availableBalanceForFee < estimatedCostInToken) {
          const totalNeededInTokens =
            topUpAmountInTokens + estimatedCostInToken;
          setError(
            isFeeSameAsToken
              ? `Insufficient ${selectedFeeAsset.asset.symbol} balance. ` +
                  `Need ${topUpAmountInTokens.toFixed(selectedFeeAsset.decimals)} to top up + ` +
                  `${estimatedCostInTokenFixed} for gas = ${totalNeededInTokens.toFixed(selectedFeeAsset.decimals)} total, ` +
                  `but only have ${userBalance.toFixed(selectedFeeAsset.decimals)} ${selectedFeeAsset.asset.symbol}`
              : `Insufficient ${selectedFeeAsset.asset.symbol} balance for gas fees. ` +
                  `Need ${estimatedCostInTokenFixed} ${selectedFeeAsset.asset.symbol}, ` +
                  `have ${userBalance.toFixed(selectedFeeAsset.decimals)} ${selectedFeeAsset.asset.symbol}`
          );
          setApproveData(''); // Clear approval data
          return;
        }

        // Generate approval transaction for the fee token
        // Strategy: Always include approval to ensure sufficient allowance
        // The approval will be the first transaction in the batch (before swap/deposit)
        // Even if user has existing allowance, re-approving ensures we have enough for gas fees
        try {
          const requiredAmount = parseUnits(
            estimatedCostInTokenFixed,
            selectedFeeAsset.decimals
          );

          setApproveData(
            encodeFunctionData({
              abi: erc20Abi,
              functionName: 'approve',
              args: [selectedPaymasterAddress as Address, requiredAmount],
            })
          );
        } catch (approvalErr) {
          console.error('Failed to generate approval:', approvalErr);
          setError(
            'Failed to generate approval for gas fee token. Please try again later'
          );
          setApproveData('');
        }
      }
    } catch (err) {
      console.error('Failed to generate approval data:', err);
      setError(
        'Failed to calculate gas fee token approval. Please try again later'
      );
      setApproveData('');
    }
  };

  // Calculate gas cost and generate approval when gasless is supported
  useEffect(() => {
    if (
      !isGaslessSupported ||
      !selectedFeeAsset ||
      !gasPrice ||
      !selectedToken
    ) {
      setEstimatedGasCostInToken('');
      setApproveData('');
      return;
    }

    // Check if modules need to be installed (need access to state from parent)
    // For now, assume module installation may be needed
    const needsModuleInstall = true; // This should come from parent props
    const needsSwap = !isSelectedTokenUSDC();

    const totalGasCost = calculateTopUpGasCost({
      chainId: selectedToken.chainId,
      needsModuleInstall,
      needsSwap,
    });

    // Generate approval data and calculate cost in token
    generateApprovalData(totalGasCost);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGaslessSupported, selectedFeeAsset, gasPrice, selectedToken]);

  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const handleUsdAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // Only allow numbers and decimals
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      // Get selected token balance in USD
      const { usdValue } = getSelectedTokenBalance();
      const numValue = parseFloat(value) || 0;

      // Don't allow more than the token's USD balance
      if (numValue > usdValue && value !== '') {
        setError(
          `Amount cannot exceed your balance of $${usdValue.toFixed(2)}`
        );
        return;
      }

      setAmount(value);
      setError(null); // Clear error when user types
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const handleQuickAmountClick = (item: string) => {
    const percentage = parseInt(item.replace('%', ''), 10);
    const { usdValue } = getSelectedTokenBalance();

    if (usdValue > 0) {
      const calculatedAmount = (usdValue * percentage) / 100;
      // Round to 2 decimals
      setAmount(calculatedAmount.toFixed(2));
    } else {
      setAmount('0');
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const handleAllocateAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;
    // Only allow numbers and decimals
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      const numValue = parseFloat(value) || 0;

      // For non-USDC tokens, max is the received USDC amount from sell offer
      let maxAmount: number;
      if (!isSelectedTokenUSDC() && sellOffer) {
        maxAmount = sellOffer.tokenAmountToReceive;
      } else {
        maxAmount = parseFloat(amount) || 0;
      }

      // Don't allow more than the max amount
      if (numValue <= maxAmount || value === '') {
        setAllocateAmount(numValue);
        setError(null); // Clear error when user types
      } else {
        setError(`Allocate amount cannot exceed ${maxAmount.toFixed(2)} USDC`);
      }
    }
  };

  const handleAllocateDecrease = () => {
    const minAmount = 2; // Minimum 2 USDC for gas tank
    if (allocateAmount > minAmount) {
      setAllocateAmount(Math.max(minAmount, allocateAmount - 1));
    }
  };

  const handleAllocateIncrease = () => {
    // For non-USDC tokens, max is the received USDC amount from sell offer
    let maxAmount: number;
    if (!isSelectedTokenUSDC() && sellOffer) {
      maxAmount = sellOffer.tokenAmountToReceive;
    } else {
      maxAmount = parseFloat(amount) || 0;
    }

    if (allocateAmount < maxAmount) {
      setAllocateAmount(Math.min(maxAmount, allocateAmount + 1));
    }
  };

  /**
   * Validates that the user has sufficient balance for gasless transactions.
   * This checks that: user_balance >= topup_amount_in_tokens + gas_fee_in_tokens
   * Returns true if validation passes, false otherwise (with error message set)
   */
  const validateGaslessFeeBalance = (): boolean => {
    // Only validate if gasless is supported and we have the necessary data
    if (!isGaslessSupported || !selectedFeeAsset || !estimatedGasCostInToken) {
      return true; // Skip validation if not using gasless
    }

    const userBalance = selectedFeeAsset.balance ?? 0;
    const tokenPrice = parseFloat(selectedFeeAsset.tokenPrice || '0') || 1;
    const estimatedGasInToken = parseFloat(estimatedGasCostInToken);

    // Convert topup amount (USD) to token units
    const topUpAmountUSD = parseFloat(amount) || 0;
    const topUpAmountInTokens =
      tokenPrice > 0 ? topUpAmountUSD / tokenPrice : 0;

    // Check if fee token is the same as topup token
    const isFeeSameAsToken =
      selectedFeeAsset.asset.contract.toLowerCase() ===
      selectedToken?.address.toLowerCase();

    // Calculate available balance for fee
    let availableBalanceForFee = userBalance;
    if (isFeeSameAsToken) {
      availableBalanceForFee = userBalance - topUpAmountInTokens;
    }

    // Validate balance is sufficient
    if (availableBalanceForFee < estimatedGasInToken) {
      const totalNeededInTokens = topUpAmountInTokens + estimatedGasInToken;
      setError(
        isFeeSameAsToken
          ? `Insufficient ${selectedFeeAsset.asset.symbol} balance. ` +
              `Need ${topUpAmountInTokens.toFixed(selectedFeeAsset.decimals)} to top up + ` +
              `${estimatedGasCostInToken} for gas = ${totalNeededInTokens.toFixed(selectedFeeAsset.decimals)} total, ` +
              `but only have ${userBalance.toFixed(selectedFeeAsset.decimals)} ${selectedFeeAsset.asset.symbol}`
          : `Insufficient ${selectedFeeAsset.asset.symbol} balance for gas fees. ` +
              `Need ${estimatedGasCostInToken} ${selectedFeeAsset.asset.symbol}, ` +
              `have ${userBalance.toFixed(selectedFeeAsset.decimals)} ${selectedFeeAsset.asset.symbol}`
      );
      return false;
    }

    return true;
  };

  const handleTopUp = () => {
    // Validation
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!selectedToken) {
      setError('Please select a token');
      return;
    }

    // Additional validation for non-USDC tokens
    if (!isSelectedTokenUSDC()) {
      if (!sellOffer) {
        return;
      }

      const maxAllocateAmount = sellOffer.tokenAmountToReceive;
      if (allocateAmount > maxAllocateAmount) {
        setError(
          `Allocate amount cannot exceed ${maxAllocateAmount.toFixed(2)} USDC`
        );
        return;
      }
    }

    // Check against selected token's USD balance
    const { usdValue } = getSelectedTokenBalance();
    if (numAmount > usdValue) {
      setError(`Insufficient balance. You have $${usdValue.toFixed(2)}`);
      return;
    }

    // Validate gasless fee balance before proceeding
    if (!validateGaslessFeeBalance()) {
      return; // Error message already set by validateGaslessFeeBalance
    }

    // Clear any previous errors
    setError(null);

    // Navigate to preview screen
    setShowPreview(true);
  };

  const handleTokenSelectorClick = () => {
    setSearching();
  };

  // Get button text based on state
  const getButtonText = () => {
    // Show loading if either loading state is true OR if we have no portfolio data yet
    if (isPortfolioLoading || portfolioTokens.length === 0) {
      return (
        <div className="flex items-center justify-center gap-2">
          <TailSpin color="#FFFFFF" height={20} width={20} />
          <span>Loading balances...</span>
        </div>
      );
    }

    if (isLoadingQuote) {
      return (
        <div className="flex items-center justify-center gap-2">
          <TailSpin color="#FFFFFF" height={20} width={20} />
          <span>Getting quote...</span>
        </div>
      );
    }

    // For USDC tokens, show simple text
    if (isSelectedTokenUSDC()) {
      const usdcAmount = parseFloat(amount) || 0;
      if (usdcAmount > 0) {
        return `Top up ${usdcAmount.toFixed(2)} USDC`;
      }
      return 'Top up USDC';
    }

    // For non-USDC tokens, show the swap quote
    if (sellOffer && selectedToken && parseFloat(amount) > 0) {
      const usdAmount = parseFloat(amount);
      const usdcReceived = sellOffer.tokenAmountToReceive;

      // Get token price from portfolio to calculate token amount
      const portfolioToken = portfolioTokens.find(
        (token) =>
          token.contract.toLowerCase() ===
            selectedToken.address.toLowerCase() &&
          token.blockchain ===
            chainIdToChainNameTokensData(selectedToken.chainId)
      );

      if (portfolioToken && portfolioToken.price) {
        const tokenAmount = usdAmount / portfolioToken.price;
        return (
          <span>
            Swap {tokenAmount.toFixed(4)} {selectedToken.symbol} for ~
            {usdcReceived.toFixed(2)} USDC
          </span>
        );
      }
    }

    // Default text
    if (selectedToken) {
      return `Top up ${selectedToken.symbol}`;
    }
    return 'Top up';
  };

  // Show preview screen if user clicked top up
  if (showPreview) {
    return (
      <PreviewTopUp
        onBack={() => setShowPreview(false)}
        selectedToken={selectedToken}
        amount={amount}
        allocateAmount={allocateAmount}
        sellOffer={sellOffer}
        userPortfolio={portfolioTokens}
        setOnboardingScreen={setOnboardingScreen}
        markOnboardingComplete={markOnboardingComplete}
        // Gasless transaction support props
        isGaslessSupported={isGaslessSupported}
        selectedFeeAsset={selectedFeeAsset}
        approveData={approveData}
        paymasterAddress={selectedPaymasterAddress}
        estimatedGasCostInToken={estimatedGasCostInToken}
      />
    );
  }

  return (
    <div className="w-full max-w-[446px]">
      <div
        className="w-full flex flex-col min-h-[264px] bg-[#1E1D24] rounded-2xl p-3 gap-3"
        data-testid="pulse-topup-screen"
      >
        {/* Header and Subtitle */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {!showCloseButton && (
                <button
                  onClick={onBack}
                  type="button"
                  className="text-white flex items-center justify-center"
                  aria-label="Go back"
                  data-testid="pulse-topup-back-button"
                >
                  <img src={BackArrow} alt="Back" className="w-3 h-3" />
                </button>
              )}
              <h1 className="text-white font-medium text-[20px] leading-5 tracking-[-0.02em]">
                Top up Gas Tank
              </h1>
            </div>
            {showCloseButton && (
              <div className="bg-black rounded-[10px] w-10 h-10 flex justify-center items-center p-[2px_2px_4px_2px]">
                <button
                  onClick={() => setOnboardingScreen(null)}
                  type="button"
                  className="flex items-center justify-center w-9 h-[34px] bg-[#1E1D24] rounded-lg"
                  aria-label="Close"
                  data-testid="pulse-topup-close-button"
                >
                  <img src={EscIcon} alt="ESC" className="w-9 h-[34px]" />
                </button>
              </div>
            )}
          </div>

          <p className="text-white font-normal text-sm leading-[14px] tracking-[-0.02em] opacity-50">
            Select Fee Tokens and Input Amount
          </p>
        </div>

        <div className="flex flex-col bg-[#121116] rounded-[10px]">
          {/* Token Selector and Amount Input */}
          <div className="flex justify-between p-3">
            <button
              type="button"
              className="flex items-center bg-[#1E1D24] rounded-md h-[42px] p-[8px_12px_8px_8px] gap-3 min-w-[140px]"
              onClick={handleTokenSelectorClick}
              data-testid="pulse-topup-token-selector"
            >
              {selectedToken ? (
                <>
                  <div className="flex items-center gap-2">
                    <div className="relative inline-block w-7 h-7">
                      <img
                        src={selectedToken.logo}
                        alt={selectedToken.symbol}
                        className="w-7 h-7 rounded-full"
                      />
                      <img
                        src={getLogoForChainId(selectedToken.chainId)}
                        className="w-3.5 h-3.5 absolute bottom-[-2px] right-[-2px] rounded-full border border-[#1E1D24]"
                        alt="Chain Logo"
                      />
                    </div>
                    <div className="flex flex-col items-start">
                      <p className="text-white text-sm font-normal leading-4">
                        {selectedToken.symbol}
                      </p>
                      <p className="text-white/50 text-[11px] font-normal leading-3">
                        {getChainName(selectedToken.chainId)}
                      </p>
                    </div>
                  </div>
                  <img
                    src={ArrowDown}
                    className="w-2.5 h-1.5 ml-auto"
                    alt="arrow-down"
                  />
                </>
              ) : (
                <>
                  <div className="text-white text-sm font-normal">
                    Select token
                  </div>
                  <img
                    src={ArrowDown}
                    className="w-2.5 h-1.5 ml-2"
                    alt="arrow-down"
                  />
                </>
              )}
            </button>
            <div className="flex max-w-60 desktop:w-60 tablet:w-60 mobile:w-56 xs:w-44 items-right overflow-hidden">
              <div className="flex items-center max-w-60 desktop:w-60 tablet:w-60 mobile:w-56 xs:w-44 text-right justify-end bg-transparent outline-none pr-0 h-9">
                <input
                  className="no-spinner flex mobile:text-4xl xs:text-4xl desktop:text-4xl tablet:text-4xl desktop:w-40 tablet:w-40 mobile:w-36 xs:w-24 font-medium text-right text-white placeholder-white"
                  placeholder={inputPlaceholder}
                  onChange={handleUsdAmountChange}
                  value={amount}
                  type="text"
                  onFocus={() => setInputPlaceholder('')}
                  onBlur={() => setInputPlaceholder('0')}
                  data-testid="pulse-topup-amount-input"
                />
                <span className="mobile:text-4xl xs:text-4xl desktop:text-4xl tablet:text-4xl desktop:w-20 tablet:w-20 mobile:w-20 xs:w-20 font-medium overflow-hidden text-[#FFFFFF4D]">
                  USD
                </span>
              </div>
            </div>
          </div>

          {/* Wallet Balance */}
          <div className="flex justify-end p-3 pt-0">
            <div className="flex items-center">
              <img
                src={selectedToken ? selectedToken.logo : WalletIcon}
                className="w-4 h-4 rounded-full"
                alt={
                  selectedToken ? `${selectedToken.symbol}-icon` : 'wallet-icon'
                }
                data-testid="pulse-topup-wallet-icon"
              />
              <div
                className="ml-1 text-xs text-[#8A77FF]"
                data-testid="pulse-topup-wallet-balance"
              >
                {selectedToken ? (
                  <>
                    {getSelectedTokenBalance().balance.toFixed(4)}{' '}
                    {getSelectedTokenBalance().symbol}
                    <span className="text-white/50">
                      {' '}
                      (${getSelectedTokenBalance().usdValue.toFixed(2)})
                    </span>
                  </>
                ) : (
                  `$${initialBalance.toFixed(2)}`
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Amount Buttons */}
        <div className="flex w-full justify-between gap-2.5">
          {quickAmounts.map((item) => {
            return (
              <button
                key={item}
                className="flex items-center justify-center bg-[#121116] rounded-lg h-[30px] flex-1 min-w-0 p-[2px_2px_4px_2px]"
                onClick={() => handleQuickAmountClick(item)}
                type="button"
                data-testid={`pulse-topup-amount-button-${item.toLowerCase()}`}
              >
                <div className="flex items-center justify-center w-full h-full bg-[#1E1D24] rounded-[6px]">
                  <span className="text-white/50 font-normal text-[13px] leading-[13px]">
                    {item}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Allocate to Gas Tank - Only show for non-USDC tokens */}
        {!isSelectedTokenUSDC() && (
          <div className="p-3">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-white text-sm">
                  Allocate to Gas Tank:
                </span>
                <div className="flex items-center gap-2 bg-black rounded-lg px-1 py-1">
                  <input
                    type="text"
                    value={allocateAmount || ''}
                    onChange={handleAllocateAmountChange}
                    placeholder="0"
                    className="no-spinner bg-transparent text-white font-medium w-16 text-left outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    data-testid="pulse-topup-allocate-input"
                    disabled={isLoadingQuote || !sellOffer}
                  />
                  <span className="text-white/50 text-sm">USDC</span>
                  <button
                    onClick={handleAllocateDecrease}
                    type="button"
                    className="text-white/50 bg-[#1E1D24] hover:text-white text-xl font-medium w-6 h-6 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    data-testid="pulse-topup-allocate-decrease"
                    disabled={isLoadingQuote || !sellOffer}
                  >
                    −
                  </button>
                  <button
                    onClick={handleAllocateIncrease}
                    type="button"
                    className="text-white/50 bg-[#1E1D24] hover:text-white text-xl font-medium w-6 h-6 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    data-testid="pulse-topup-allocate-increase"
                    disabled={isLoadingQuote || !sellOffer}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Gasless Fee Estimate - Show when USDC is selected */}
        {isGaslessSupported && selectedFeeAsset && estimatedGasCostInToken && (
          <div className="m-2.5 p-3 bg-[#1E1D24] rounded-[10px] border border-[#29292F]">
            <div className="flex flex-col gap-2">
              {(() => {
                // Convert USD amount to token units using token price
                const tokenPrice =
                  parseFloat(selectedFeeAsset.tokenPrice || '0') || 1;
                const topUpAmountInTokens =
                  (parseFloat(amount) || 0) / tokenPrice;
                const gasInTokens = parseFloat(estimatedGasCostInToken) || 0;
                const totalNeededInTokens = topUpAmountInTokens + gasInTokens;
                const hasEnoughBalance =
                  selectedFeeAsset.balance >= totalNeededInTokens;

                return (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70 text-xs">
                        Estimated Gas Fee:
                      </span>
                      <span className="text-white font-medium text-sm">
                        ≈ {estimatedGasCostInToken}{' '}
                        {selectedFeeAsset.asset.symbol}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/50">Total needed:</span>
                      <span className="text-white">
                        {totalNeededInTokens.toFixed(selectedFeeAsset.decimals)}{' '}
                        {selectedFeeAsset.asset.symbol}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/50">Your balance:</span>
                      <span
                        className={
                          hasEnoughBalance ? 'text-[#10B981]' : 'text-[#EF4444]'
                        }
                      >
                        {selectedFeeAsset.balance.toFixed(
                          selectedFeeAsset.decimals
                        )}{' '}
                        {selectedFeeAsset.asset.symbol}
                      </span>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {/* Error Display */}
        {(error || relayError) && (
          <div className="m-2.5 p-2.5 bg-red-500/10 border border-red-500 rounded-[10px]">
            <div
              className="text-red-300 text-xs"
              data-testid="pulse-topup-error-message"
            >
              {error || relayError}
            </div>
          </div>
        )}

        {/* Top Up Button */}
        <div className="flex w-auto h-[50px] rounded-[10px] bg-black p-[2px_2px_6px_2px]">
          <button
            onClick={handleTopUp}
            type="button"
            className={`flex items-center justify-center w-full rounded-lg text-white font-medium text-base disabled:opacity-50 transition-colors ${
              parseFloat(amount) <= 0 ||
              isPortfolioLoading ||
              portfolioTokens.length === 0 ||
              isLoadingQuote ||
              (!isSelectedTokenUSDC() &&
                !sellOffer &&
                parseFloat(amount) > 0) ||
              relayError ||
              error
                ? 'bg-[#29292F]'
                : 'bg-[#8A77FF]'
            }`}
            disabled={
              parseFloat(amount) <= 0 ||
              isPortfolioLoading ||
              portfolioTokens.length === 0 ||
              isLoadingQuote ||
              (!isSelectedTokenUSDC() &&
                !sellOffer &&
                parseFloat(amount) > 0) ||
              !!relayError ||
              !!error
            }
            data-testid="pulse-topup-confirm-button"
          >
            {getButtonText()}
          </button>
        </div>
      </div>
    </div>
  );
}

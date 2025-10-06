/* eslint-disable @typescript-eslint/no-use-before-define */
import { useWalletAddress } from '@etherspot/transaction-kit';
import { CircularProgress } from '@mui/material';
import { useState, useEffect } from 'react';
import { BigNumber } from 'ethers';
import { formatEther, isAddress } from 'viem';
import styled from 'styled-components';

// services
import {
  convertPortfolioAPIResponseToToken,
  useGetWalletPortfolioQuery,
} from '../../../services/pillarXApiWalletPortfolio';
import { PortfolioToken } from '../../../services/tokensData';

// hooks
import useGlobalTransactionsBatch from '../../../hooks/useGlobalTransactionsBatch';
import useBottomMenuModal from '../../../hooks/useBottomMenuModal';
import { useAppDispatch, useAppSelector } from '../hooks/useReducerHooks';
import useOffer from '../hooks/useOffer';

// redux
import { setWalletPortfolio } from '../reducer/gasTankSlice';

// utils
import { formatTokenAmount } from '../utils/converters';
import { getLogoForChainId } from '../../../utils/blockchain';

// types
import { PortfolioData } from '../../../types/api';
import { logExchangeError, logExchangeEvent } from '../utils/sentry';
import { useTransactionDebugLogger } from '../../../hooks/useTransactionDebugLogger';

// Search component
import Search from './Search/Search';
import { SelectedToken } from '../types/tokens';
import { getChainId, getChainName, MobulaChainNames } from '../utils/constants';

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const USDC_ADDRESSES: { [chainId: number]: string } = {
  137: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359', // Polygon
  42161: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', // Arbitrum
  10: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85', // Optimism
  // Add more chains as needed
};

const TopUpModal = ({ isOpen, onClose, onSuccess }: TopUpModalProps) => {
  const paymasterUrl = import.meta.env.VITE_PAYMASTER_URL;
  const walletAddress = useWalletAddress();
  const { addToBatch } = useGlobalTransactionsBatch();
  const { showSend, setShowBatchSendModal } = useBottomMenuModal();
  const { getStepTransactions, getBestOffer } = useOffer();
  const dispatch = useAppDispatch();
  const [chains, setChains] = useState<MobulaChainNames>(MobulaChainNames.All);
  const [selectedToken, setSelectedToken] = useState<SelectedToken | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [portfolioTokens, setPortfolioTokens] = useState<PortfolioToken[]>([]);
  const [showSwapConfirmation, setShowSwapConfirmation] = useState(false);
  const [swapDetails, setSwapDetails] = useState<{
    receiveAmount: string;
    bestOffer: any;
    swapTransactions: any[];
  } | null>(null);
  const [swapAmount, setSwapAmount] = useState(0);
  const [showTokenSelection, setShowTokenSelection] = useState(false);
  const { transactionDebugLog } = useTransactionDebugLogger();

  const walletPortfolio = useAppSelector(
    (state) => state.swap.walletPortfolio as PortfolioData | undefined
  );

  // Get wallet portfolio
  const {
    data: walletPortfolioData,
    isSuccess: isWalletPortfolioDataSuccess,
    error: walletPortfolioDataError,
    refetch: refetchWalletPortfolioData,
  } = useGetWalletPortfolioQuery(
    { wallet: walletAddress || '', isPnl: false },
    { skip: !walletAddress }
  );

  // Convert portfolio data to tokens when data changes
  useEffect(() => {
    if (walletPortfolioData && isWalletPortfolioDataSuccess) {
      dispatch(setWalletPortfolio(walletPortfolioData?.result?.data));
      const tokens = convertPortfolioAPIResponseToToken(
        walletPortfolioData.result.data
      );
      setPortfolioTokens(tokens);

    }
    if (!isWalletPortfolioDataSuccess || walletPortfolioDataError) {
      if (walletPortfolioDataError) {
        logExchangeError('Failed to fetch wallet portfolio', { "error": walletPortfolioDataError }, { component: 'TopUpModal', action: 'failed_to_fetch_wallet_portfolio' });
        console.error(walletPortfolioDataError);
      }
      dispatch(setWalletPortfolio(undefined));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    walletPortfolioData,
    isWalletPortfolioDataSuccess,
    walletPortfolioDataError,
  ]);

  useEffect(() => {
    setErrorMsg(null);
  }, [selectedToken]);

  const handleTopUp = async () => {
    if (!selectedToken || !amount || !swapAmount || !walletAddress) return;

    if (USDC_ADDRESSES[selectedToken.chainId] === undefined) {
      setErrorMsg('Gas Tank is not supported on the selected token\'s chain.');
      return;
    }
    // Validate paymaster URL
    if (!paymasterUrl) {
      setErrorMsg('Service unavailable. Please try again later.');
      return;
    }

    // Validate amount
    const n = Number(amount);
    if (!Number.isFinite(n) || n <= 0) {
      setErrorMsg('Enter a valid amount.');
      return;
    }
    // Validate sufficient balance for the selected token
    const portfolioToken = portfolioTokens.find(
      (t) =>
        t.contract.toLowerCase() === selectedToken.address.toLowerCase() &&
        Number(getChainId(t.blockchain as MobulaChainNames)) === selectedToken.chainId
    );
    if (!portfolioToken || Number(portfolioToken.balance) < swapAmount) {
      setErrorMsg(`Insufficient ${selectedToken.symbol} balance.`);
      return;
    }
    // Reset error if valid
    setErrorMsg(null);

    setIsProcessing(true);

    try {
      // Check if token is USDC
      const isUSDC = selectedToken.address.toLowerCase() === USDC_ADDRESSES[selectedToken.chainId].toLowerCase();

      let receiveSwapAmount = swapAmount.toString(); // Default to input amount

      if (!isUSDC) {
        // Need to swap to USDC first
        try {
          const bestOffer = await getBestOffer({
            fromTokenAddress: selectedToken.address,
            fromAmount: Number(swapAmount),
            fromChainId: selectedToken.chainId,
            fromTokenDecimals: selectedToken.decimals,
            slippage: 0.03,
          });
          if (!bestOffer) {
            logExchangeError('No best offer found for swap', {}, { component: 'TopUpModal', action: 'no_best_offer_found' });
            setIsProcessing(false);
            setErrorMsg('No best offer found for the swap. Please try a different token or amount.');
            console.warn('No best offer found for swap');
            return;
          }
          const swapTransactions = await getStepTransactions(
            bestOffer.offer,
            walletAddress,
            portfolioTokens,
            Number(amount),
          );

          receiveSwapAmount = bestOffer.tokenAmountToReceive.toString();

          // Show swap confirmation UI and pause execution
          setSwapDetails({
            receiveAmount: receiveSwapAmount,
            bestOffer,
            swapTransactions
          });
          setShowSwapConfirmation(true);
          setIsProcessing(false);
          return;
        } catch (swapError) {
          console.error('Error getting swap transactions:', swapError);
          console.warn(
            'Failed to get swap route. Please try a different token or amount.'
          );
          logExchangeError('Failed to get swap route', { "error": swapError }, { component: 'TopUpModal', action: 'failed_to_get_swap_route' });
          setErrorMsg('Failed to get swap route. Please try a different token or amount.');
          setIsProcessing(false);
          return;
        }
      }

      // Call the paymaster API for USDC deposits
      const response = await fetch(
        `${paymasterUrl}/getTransactionForDeposit?chainId=${selectedToken.chainId}&amount=${receiveSwapAmount}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error fetching transaction data:', errorText);
        logExchangeError('Failed to fetch transaction data', { "error": errorText }, { component: 'TopUpModal', action: 'failed_to_fetch_transaction_data' });
        setErrorMsg('Failed to fetch transaction data. Please try again with different token or amount.');
        setIsProcessing(false);
        return;
      }

      const transactionData = await response.json();
      transactionDebugLog('Gas Tank Top-up transaction data', transactionData);

      // Add transactions to batch
      if (Array.isArray(transactionData.result)) {
        transactionData.result.forEach((tx: {value?: string, to: string, data?: string}, index: number) => {
          const value = tx.value || '0';
          // Handle bigint conversion properly
          let bigIntValue: bigint;
          if (typeof value === 'bigint') {
            // If value is already a native bigint, use it directly
            bigIntValue = value;
          } else if (value) {
            // If value exists but is not a bigint, convert it
            bigIntValue = BigNumber.from(value).toBigInt();
          } else {
            // If value is undefined/null, use 0
            bigIntValue = BigInt(0);
          }

          const integerValue = formatEther(bigIntValue);
          addToBatch({
            title: `Gas Tank Top-up ${index + 1}/${transactionData.result.length}`,
            description: `Add ${amount} ${selectedToken.symbol} to Gas Tank`,
            to: tx.to,
            value: integerValue,
            data: tx.data,
            chainId: selectedToken.chainId,
          });
        });
      } else {
        const value = transactionData.result.value || '0';
        // Handle bigint conversion properly
        let bigIntValue: bigint;
        if (typeof value === 'bigint') {
          // If value is already a native bigint, use it directly
          bigIntValue = value;
        } else if (value) {
          // If value exists but is not a bigint, convert it
          bigIntValue = BigNumber.from(value).toBigInt();
        } else {
          // If value is undefined/null, use 0
          bigIntValue = BigInt(0);
        }

        const integerValue = formatEther(bigIntValue);
        // Single transaction
        addToBatch({
          title: 'Gas Tank Top-up',
          description: `Add ${amount} ${selectedToken.symbol} to Gas Tank`,
          to: transactionData.result.to,
          value: integerValue,
          data: transactionData.result.data,
          chainId: selectedToken.chainId,
        });
      }

      // Show the send modal with the batched transactions
      setShowBatchSendModal(true);
      showSend();
      onSuccess?.();
    } catch (error) {
      console.error('Error processing top-up:', error);
      console.warn('Failed to process top-up. Please try again.');
      logExchangeError('Failed to process top-up', { "error": error }, { component: 'TopUpModal', action: 'failed_to_process_top_up' });
      setErrorMsg('Failed to process top-up. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAmountChange = (value: string) => {
    setErrorMsg(null);
    // Only allow numeric input
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
    let tokenAmount = 0;
    if (selectedToken) {
      tokenAmount = Number(value) / (parseFloat(selectedToken.usdValue) || 1);
    }
    setSwapAmount(tokenAmount);
  };

  const handleMaxClick = () => {
    setErrorMsg(null);
    // Since we don't have balance info in SelectedToken, we'll just clear the amount
    // In a real implementation, you'd need to fetch balance for the selected token
    setAmount('');
  };

  const handleConfirmSwap = async () => {
    if (!swapDetails || !selectedToken || !walletAddress) return;

    setIsProcessing(true);
    setShowSwapConfirmation(false);

    try {
      // Add swap transactions to batch
      swapDetails.swapTransactions.forEach((tx, index) => {
        const value = tx.value || '0';
        // Handle bigint conversion properly
        let bigIntValue: bigint;
        if (typeof value === 'bigint') {
          // If value is already a native bigint, use it directly
          bigIntValue = value;
        } else if (value) {
          // If value exists but is not a bigint, convert it
          bigIntValue = BigNumber.from(value).toBigInt();
        } else {
          // If value is undefined/null, use 0
          bigIntValue = BigInt(0);
        }

        const integerValue = formatEther(bigIntValue);
        if (!tx.to || !isAddress(tx.to)) {
          setErrorMsg('Invalid transaction target for swap route. Please try again.');
          logExchangeEvent('Invalid tx.to in swap step', 'error', { tx }, { component: 'TopUpModal', action: 'invalid_tx_to' });
          setIsProcessing(false);
          return;
        }
        addToBatch({
          title: `Swap to USDC ${index + 1}/${swapDetails.swapTransactions.length}`,
          description: `Convert ${amount} ${selectedToken.symbol} to USDC for Gas Tank`,
          to: tx.to,
          value: integerValue,
          data: tx.data,
          chainId: selectedToken.chainId,
        });
      });

      // Continue with the paymaster API call for USDC deposits
      const response = await fetch(
        `${paymasterUrl}/getTransactionForDeposit?chainId=${selectedToken.chainId}&amount=${swapDetails.receiveAmount}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error fetching transaction data:', errorText);
        logExchangeError('Failed to fetch transaction data', { "error": errorText }, { component: 'TopUpModal', action: 'failed_to_fetch_transaction_data' });
        setErrorMsg('Failed to fetch transaction data. Please try again with different token or amount.');
        setIsProcessing(false);
        return;
      }

      const transactionData = await response.json();
      transactionDebugLog('Gas Tank Top-up transaction data', transactionData);

      // Add transactions to batch
      if (Array.isArray(transactionData.result)) {
        transactionData.result.forEach((tx: {value?: string, to: string, data?: string}, index: number) => {
          const value = tx.value || '0';
          // Handle bigint conversion properly
          let bigIntValue: bigint;
          if (typeof value === 'bigint') {
            // If value is already a native bigint, use it directly
            bigIntValue = value;
          } else if (value) {
            // If value exists but is not a bigint, convert it
            bigIntValue = BigNumber.from(value).toBigInt();
          } else {
            // If value is undefined/null, use 0
            bigIntValue = BigInt(0);
          }

          const integerValue = formatEther(bigIntValue);
          addToBatch({
            title: `Gas Tank Top-up ${index + 1}/${transactionData.result.length}`,
            description: `Add ${amount} ${selectedToken.symbol} to Gas Tank`,
            to: tx.to,
            value: integerValue,
            data: tx.data,
            chainId: selectedToken.chainId,
          });
        });
      } else {
        const value = transactionData.result.value || '0';
        // Handle bigint conversion properly
        let bigIntValue: bigint;
        if (typeof value === 'bigint') {
          // If value is already a native bigint, use it directly
          bigIntValue = value;
        } else if (value) {
          // If value exists but is not a bigint, convert it
          bigIntValue = BigNumber.from(value).toBigInt();
        } else {
          // If value is undefined/null, use 0
          bigIntValue = BigInt(0);
        }

        const integerValue = formatEther(bigIntValue);
        // Single transaction
        addToBatch({
          title: 'Gas Tank Top-up',
          description: `Add ${amount} ${selectedToken.symbol} to Gas Tank`,
          to: transactionData.result.to,
          value: integerValue,
          data: transactionData.result.data,
          chainId: selectedToken.chainId,
        });
      }

      // Show the send modal with the batched transactions
      setShowBatchSendModal(true);
      showSend();
      onSuccess?.();
    } catch (error) {
      console.error('Error processing top-up:', error);
      console.warn('Failed to process top-up. Please try again.');
      logExchangeError('Failed to process top-up', { "error": error }, { component: 'TopUpModal', action: 'failed_to_process_top_up' });
      setErrorMsg('Failed to process top-up. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelSwap = () => {
    setShowSwapConfirmation(false);
    setSwapDetails(null);
  };

  if (!isOpen) return null;

  // Token Selection Modal using Search component
  if (showTokenSelection) {
    return (
      <SearchOverlay>
        <Search
          setSearching={setShowTokenSelection}
          isBuy={true}
          setBuyToken={setSelectedToken}
          setSellToken={() => {}} // Not used in this context
          chains={chains} // Show all supported chains
          setChains={() => {}} // Not allowing chain changes in gas tank
          walletPortfolioData={walletPortfolioData?.result?.data}
          walletPortfolioLoading={!isWalletPortfolioDataSuccess && !walletPortfolioDataError}
          walletPortfolioFetching={false}
          walletPortfolioError={!!walletPortfolioDataError}
          refetchWalletPortfolio={refetchWalletPortfolioData}
        />
      </SearchOverlay>
    );
  }

  // Swap Confirmation Modal
  if (showSwapConfirmation && swapDetails && selectedToken) {
    return (
      <Overlay>
        <ModalContainer>
          <Header>
            <Title>Confirm Swap</Title>
            <CloseButton onClick={handleCancelSwap}>✕</CloseButton>
          </Header>

          <Content>
            <SwapConfirmationContainer>
              <SwapDetailsSection>
                <SwapTitle>Swap Summary</SwapTitle>
                <SwapDetail>
                  <SwapLabel>From:</SwapLabel>
                  <SwapValue>{amount} {selectedToken.symbol}</SwapValue>
                </SwapDetail>
                <SwapDetail>
                  <SwapLabel>To:</SwapLabel>
                  <SwapValue>{formatTokenAmount(Number(swapDetails.receiveAmount))} USDC</SwapValue>
                </SwapDetail>
                <SwapDetail>
                  <SwapLabel>On:</SwapLabel>
                  <SwapValue>{getChainName(selectedToken.chainId)}</SwapValue>
                </SwapDetail>
              </SwapDetailsSection>

              <WarningBox>
                <WarningText>
                  This swap will be executed first, then the USDC will be added to your Gas Tank.
                </WarningText>
              </WarningBox>

              <ButtonContainer>
                <CancelButton onClick={handleCancelSwap}>
                  Cancel
                </CancelButton>
                <ConfirmButton 
                  onClick={handleConfirmSwap}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <CircularProgress size={16} color="inherit" />
                      Processing...
                    </>
                  ) : (
                    'Confirm Swap'
                  )}
                </ConfirmButton>
              </ButtonContainer>
            </SwapConfirmationContainer>
          </Content>
        </ModalContainer>
      </Overlay>
    );
  }

  return (
    <Overlay>
      <NewModalContainer>
        <NewHeader>
          <NewTitle>Top up</NewTitle>
          <CloseButton onClick={onClose}>✕</CloseButton>
        </NewHeader>

        <NewContent>
          <SectionDescription>Select Fee Tokens and Input Amount</SectionDescription>

          <TokenAmountContainer>
            <MainRow>
              <SelectTokenButton onClick={() => setShowTokenSelection(true)}>
                {selectedToken ? (
                  <SelectedTokenDisplay>
                    <TokenLogoContainer>
                      <SelectedTokenLogo src={selectedToken.logo} alt={selectedToken.symbol} />
                      <ChainLogoOverlay
                        src={getLogoForChainId(selectedToken.chainId)}
                        alt={`${getChainName(selectedToken.chainId)} chain`}
                      />
                    </TokenLogoContainer>
                    <SelectedTokenDetails>
                      <SelectedTokenSymbol>{selectedToken.symbol}</SelectedTokenSymbol>
                      <SelectedTokenChain>on {getChainName(selectedToken.chainId)}</SelectedTokenChain>
                    </SelectedTokenDetails>
                    <DropdownArrow>▼</DropdownArrow>
                  </SelectedTokenDisplay>
                ) : (
                  <SelectTokenPlaceholder>
                    Select Token
                    <DropdownArrow>▼</DropdownArrow>
                  </SelectTokenPlaceholder>
                )}
              </SelectTokenButton>

              <AmountInputGroup>
                <DollarSymbol>$</DollarSymbol>
                <AmountInput
                  type="text"
                  placeholder="0.00"
                  value={selectedToken && amount ? amount : ''}
                  onChange={(e) => {
                    handleAmountChange(e.target.value);
                  }}
                />
              </AmountInputGroup>
            </MainRow>

            <TokenAmountRow>
              <TokenAmountDisplay>
                {selectedToken && amount ? (Number(amount)/(parseFloat(selectedToken.usdValue) || 0)).toFixed(2) : '0.00' } {selectedToken?.symbol}
              </TokenAmountDisplay>
            </TokenAmountRow>
          </TokenAmountContainer>

          {errorMsg && (
            <WarningContainer>
              <WarningIcon>⚠️</WarningIcon>
              <WarningText>{errorMsg}</WarningText>
            </WarningContainer>
          )}

          <DetailsSection>
            <DetailRow>
              <DetailLabel>Rate</DetailLabel>
              <DetailValue>1 USD ≈ {selectedToken ? (1 / parseFloat(selectedToken.usdValue)).toFixed(4) : '1.08'} {selectedToken?.symbol || 'USDC'}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>
                Price impact
                <InfoIcon>ⓘ</InfoIcon>
              </DetailLabel>
              <DetailValue>0.00%</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>
                Gas fee
                <InfoIcon>ⓘ</InfoIcon>
              </DetailLabel>
              <DetailValue>≈ $0.05</DetailValue>
            </DetailRow>
          </DetailsSection>

          <NewTopUpButton
            onClick={handleTopUp}
            disabled={!selectedToken || !amount || isProcessing}
          >
            {(() => {
              if (isProcessing) {
                return (
                  <>
                    <CircularProgress size={16} color="inherit" />
                    Processing...
                  </>
                );
              }
              if (selectedToken && amount) {
                return `Top Up $${amount}`;
              }
              return 'Top Up';
            })()}
          </NewTopUpButton>
        </NewContent>
      </NewModalContainer>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const ModalContainer = styled.div`
  background: #1a1a1a;
  border-radius: 20px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid #333;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #333;
`;

const Title = styled.h2`
  color: #ffffff;
  font-size: 20px;
  font-weight: 600;
  margin: 0;
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const Content = styled.div`
  padding: 24px;
`;

const Section = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: #9ca3af;
  padding: 20px;
  justify-content: center;
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  padding: 20px;
  text-align: center;
`;

const TokenList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #333;
  border-radius: 12px;

  /* Custom scrollbar styles */
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
  transition: scrollbar-color 0.3s ease;

  &:hover {
    scrollbar-color: #7c3aed #2a2a2a;
  }

  /* WebKit scrollbar styles */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: transparent;
    border-radius: 4px;
    transition: background 0.3s ease, opacity 0.3s ease;
  }

  &:hover::-webkit-scrollbar-thumb {
    background: #7c3aed;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #8b5cf6;
  }

  /* Auto-hide behavior */
  &:not(:hover)::-webkit-scrollbar-thumb {
    opacity: 0;
    transition: opacity 0.5s ease 1s;
  }
`;

const TokenItem = styled.div<{ $isSelected: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  cursor: pointer;
  border-bottom: 1px solid #2a2a2a;
  background: ${(props) => (props.$isSelected ? '#7c3aed20' : 'transparent')};
  border-left: ${(props) => (props.$isSelected ? '3px solid #7c3aed' : 'none')};
  transition: background-color 0.2s;

  &:hover {
    background: #2a2a2a;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const TokenInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const TokenLogo = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
`;

const TokenDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const TokenSymbol = styled.div`
  color: #ffffff;
  font-weight: 600;
  font-size: 16px;
`;

const TokenName = styled.div`
  color: #9ca3af;
  font-size: 12px;
`;

const ChainName = styled.div`
  color: #8b5cf6;
  font-size: 11px;
  font-weight: 500;
`;

const TokenBalance = styled.div`
  color: #ffffff;
  font-weight: 600;
`;

const TokenBalanceContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
`;

const TokenBalanceUSD = styled.div`
  color: #9ca3af;
  font-size: 12px;
  font-weight: 400;
`;

const AmountContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const UsdPriceDisplay = styled.div`
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 8px;
  padding: 12px 16px;
  color: #9ca3af;
  font-size: 16px;
  white-space: nowrap;
  min-width: 80px;
  text-align: right;
`;

const MaxButton = styled.button`
  background: #7c3aed;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #6d28d9;
  }
`;

const BalanceInfo = styled.div`
  color: #9ca3af;
  font-size: 12px;
  margin-top: 8px;
`;

const TopUpButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #7c3aed, #a855f7);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const SwapConfirmationContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const SwapDetailsSection = styled.div`
  background: #2a2a2a;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #444;
`;

const SwapTitle = styled.h3`
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 16px 0;
`;

const SwapDetail = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SwapLabel = styled.div`
  color: #9ca3af;
  font-size: 14px;
`;

const SwapValue = styled.div`
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
`;

const WarningBox = styled.div`
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.3);
  border-radius: 8px;
  padding: 16px;
`;

// const WarningText = styled.p`
//   color: #fbbf24;
//   font-size: 14px;
//   margin: 0;
//   line-height: 1.5;
// `;

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
`;

const CancelButton = styled.button`
  flex: 1;
  background: transparent;
  color: #9ca3af;
  border: 1px solid #444;
  border-radius: 12px;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #2a2a2a;
    color: #ffffff;
    border-color: #666;
  }
`;

const ConfirmButton = styled.button`
  flex: 1;
  background: linear-gradient(135deg, #7c3aed, #a855f7);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

// New Modal Styles
const NewModalContainer = styled.div`
  background: #1a1a1a;
  border-radius: 20px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid #333;
`;

const NewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #333;
`;

const NewTitle = styled.h2`
  color: #ffffff;
  font-size: 24px;
  font-weight: 600;
  margin: 0;
`;

const NewContent = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SectionDescription = styled.div`
  color: #9ca3af;
  font-size: 16px;
  margin-bottom: 4px;
`;

const TokenAmountContainer = styled.div`
  background: #000000;
  border: 1px solid #444;
  border-radius: 12px;
  padding: 0;
  overflow: hidden;
  transition: border-color 0.2s;

  &:hover {
    border-color: #7c3aed;
  }
`;

const MainRow = styled.div`
  padding: 16px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: relative;
`;

const SelectTokenButton = styled.button`
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 50px;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 8px 16px;
  outline: none;
  margin-right: 16px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(139, 92, 246, 0.2);
    border-color: rgba(139, 92, 246, 0.5);
  }

  &:focus {
    outline: none;
  }
`;

const SelectedTokenDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

const SelectedTokenLogo = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
`;

const TokenLogoContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const ChainLogoOverlay = styled.img`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid #000000;
`;

const SelectedTokenDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const SelectedTokenSymbol = styled.div`
  color: #ffffff;
  font-weight: 600;
  font-size: 16px;
`;

const SelectedTokenChain = styled.div`
  color: #8b5cf6;
  font-size: 12px;
`;

const SelectTokenPlaceholder = styled.div`
  color: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-size: 16px;
`;

const DropdownArrow = styled.span`
  color: #9ca3af;
  font-size: 12px;
`;

const AmountInputGroup = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  right: 16px;
`;

const DollarSymbol = styled.span`
  color: #ffffff;
  font-size: 48px;
  font-weight: 700;
  margin-right: -2px;
`;

const AmountInput = styled.input`
  background: transparent;
  border: none;
  color: #ffffff;
  font-size: 48px;
  font-weight: 700;
  outline: none;
  width: 9rem;
  text-align: right;
  padding: 0;
  margin: 0;
  margin-left: -2px;

  &::placeholder {
    color: #6b7280;
    font-weight: 700;
    text-align: right;
  }

  &:focus {
    outline: none;
  }
`;

const TokenAmountRow = styled.div`
  padding: 16px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const TokenAmountDisplay = styled.div`
  color: #9ca3af;
  font-size: 14px;
`;


const WarningContainer = styled.div`
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.3);
  border-radius: 8px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const WarningIcon = styled.span`
  font-size: 16px;
`;

const WarningText = styled.div`
  color: #fbbf24;
  font-size: 14px;
`;

const DetailsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DetailLabel = styled.div`
  color: #9ca3af;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const DetailValue = styled.div`
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
`;

const InfoIcon = styled.span`
  color: #6b7280;
  font-size: 12px;
`;

const NewTopUpButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #7c3aed, #a855f7);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;


const SearchOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(4px);
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

export default TopUpModal;

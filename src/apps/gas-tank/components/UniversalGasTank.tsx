/* eslint-disable @typescript-eslint/no-use-before-define */
import { useState } from 'react';
import styled from 'styled-components';
import { CircularProgress } from '@mui/material';
import { useWalletAddress } from '@etherspot/transaction-kit';

// components
import TopUpModal from './TopUpModal';

// hooks
import useGasTankBalance from '../hooks/useGasTankBalance';
import { useGasTankHistory } from './GasTankHistory'; // import the hook

const UniversalGasTank = () => {
  const walletAddress = useWalletAddress();
  const {
    totalBalance,
    isLoading: isBalanceLoading,
    error: balanceError,
    refetch,
  } = useGasTankBalance();

  // Use the custom hook to get totalSpend from history
  const {
    totalSpend = 0,
    loading: isHistoryLoading,
    error: historyError,
    refetch: refetchHistory,
  } = useGasTankHistory(walletAddress);

  const [showTopUpModal, setShowTopUpModal] = useState(false);

  const handleTopUp = () => {
    setShowTopUpModal(true);
  };

  return (
    <Container>
      <Header>
        <TitleSection>
          <Icon>⛽</Icon>
          <Title>Universal Gas Tank</Title>
        </TitleSection>
        {!isBalanceLoading && !balanceError && (
          <RefreshButton onClick={refetch} title="Refresh balance">
            🔄
          </RefreshButton>
        )}
      </Header>

      <BalanceSection>
        {(() => {
          if (isBalanceLoading) {
            return (
                <LoadingBalance>
                <CircularProgress size={24} className="gas-tank-loading-spinner" />
                <span>Loading balance...</span>
                </LoadingBalance>
            );
          }
          if (balanceError) {
            return (
              <ErrorBalance>
                <span>Sorry, we had an issue loading your balance. Try pressing the retry button.</span>
                <RetryButton onClick={refetch}>Retry</RetryButton>
              </ErrorBalance>
            );
          }
          return <Balance>${totalBalance.toFixed(2)}</Balance>;
        })()}
        <NetworkLabel>On All Networks</NetworkLabel>
      </BalanceSection>

      <TopUpButton onClick={handleTopUp}>Top up</TopUpButton>

      <Description>
        Top up your Gas Tank so you pay for network fees on every chain
      </Description>

      <SpendInfo>
        <SpendLabel>Total Spend:</SpendLabel>
        <SpendAmount>
          {isHistoryLoading || historyError
            ? '$0.00'
            : `$${totalSpend.toFixed(2)}`}
        </SpendAmount>
      </SpendInfo>

      <DetailedDescription>
        The PillarX Gas Tank is your universal balance for covering transaction
        fees across all networks. When you top up your Tank, you&apos;re
        allocating tokens specifically for paying gas. You can increase your
        balance anytime, and the tokens in your Tank can be used to pay network
        fees on any supported chain.
      </DetailedDescription>

      <TopUpModal
        isOpen={showTopUpModal}
        onClose={() => setShowTopUpModal(false)}
        onSuccess={() => {
          setShowTopUpModal(false);
          refetch();
        }}
      />
    </Container>
  );
};

const Container = styled.div`
  background: #1a1a1a;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #333;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RefreshButton = styled.button`
  background: rgba(139, 92, 246, 0.1);
  color: #8b5cf6;
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 6px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;

  &:hover {
    background: rgba(139, 92, 246, 0.2);
    border-color: rgba(139, 92, 246, 0.5);
    transform: rotate(90deg);
  }
`;

const Icon = styled.span`
  font-size: 18px;
`;

const Title = styled.h2`
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
`;

const BalanceSection = styled.div`
  margin-bottom: 24px;
`;

const Balance = styled.div`
  color: #ffffff;
  font-size: 36px;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 4px;
`;

const LoadingBalance = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 4px;

  span {
    color: #8b5cf6;
    font-size: 18px;
    font-weight: 500;
  }
`;

const ErrorBalance = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 4px;

  span {
    color: #ef4444;
    font-size: 18px;
    font-weight: 500;
  }
`;

const RetryButton = styled.button`
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #dc2626;
  }
`;

const NetworkLabel = styled.div`
  color: #8b5cf6;
  font-size: 14px;
  font-weight: 500;
`;

const TopUpButton = styled.button`
  background: #7c3aed;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 16px;
  transition: background-color 0.2s;

  &:hover {
    background: #6d28d9;
  }
`;

const Description = styled.p`
  color: #ffffff;
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 16px 0;
`;

const SpendInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
`;

const SpendLabel = styled.span`
  color: #4ade80;
  font-size: 14px;
  font-weight: 500;
`;

const SpendAmount = styled.span`
  color: #4ade80;
  font-size: 14px;
  font-weight: 600;
`;

const DetailedDescription = styled.p`
  color: #9ca3af;
  font-size: 12px;
  line-height: 1.5;
  margin: 0;
  font-style: italic;
`;

export default UniversalGasTank;

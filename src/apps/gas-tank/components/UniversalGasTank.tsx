/* eslint-disable @typescript-eslint/no-use-before-define */
import { useState } from 'react';
import { CircularProgress } from '@mui/material';
import { useWalletAddress } from '@etherspot/transaction-kit';
import { S } from './UniversalGasTank.styles';

// components
import TopUpModal from './TopUpModal';

// hooks
import useGasTankBalance from '../hooks/useGasTankBalance';
import GasTankHistory, { useGasTankHistory } from './GasTankHistory';

// assets
import gasTankIcon from '../assets/gas-tank-icon.png';

const UniversalGasTank = () => {
  const walletAddress = useWalletAddress();
  const [showTopUpModal, setShowTopUpModal] = useState(false);

  const {
    totalBalance,
    isLoading: isBalanceLoading,
    error: balanceError,
    refetch,
  } = useGasTankBalance({ pauseAutoRefresh: showTopUpModal });

  // Use the custom hook to get totalSpend from history
  const {
    historyData,
    totalSpend = 0,
    loading: isHistoryLoading,
    error: historyError,
    refetch: refetchHistory,
  } = useGasTankHistory(walletAddress, { pauseAutoRefresh: showTopUpModal });

  const handleTopUp = () => {
    setShowTopUpModal(true);
  };

  // Show skeleton loading if either balance or history is loading
  if (isBalanceLoading || isHistoryLoading) {
    return (
      <S.MainContainer>
        <S.LoadingContainer>
          <S.LoadingLeftSection>
            <S.LoadingHeader />

            <S.LoadingBalanceAmount />
            <S.LoadingNetworkLabel />

            <S.LoadingButton />

            <S.LoadingDescription />

            <S.LoadingSpendInfo>
              <S.LoadingSpendLabel />
              <S.LoadingSpendAmount />
            </S.LoadingSpendInfo>

            <S.LoadingDetailedDescription>
              <S.LoadingDetailedLine />
              <S.LoadingDetailedLine />
              <S.LoadingDetailedLine />
              <S.LoadingDetailedLine />
            </S.LoadingDetailedDescription>
          </S.LoadingLeftSection>

          <S.LoadingRightSection>
            <S.LoadingHistoryHeader />

            <S.LoadingTableHeader>
              <S.LoadingTableHeaderCell />
              <S.LoadingTableHeaderCell />
              <S.LoadingTableHeaderCell />
              <S.LoadingTableHeaderCell />
              <S.LoadingTableHeaderCell />
            </S.LoadingTableHeader>

            {Array.from({ length: 8 }).map((_, index) => (
              <S.LoadingTableRow key={index}>
                <S.LoadingTableCell />
                <S.LoadingTableCell />
                <S.LoadingTableCell />
                <S.LoadingTableCell />
                <S.LoadingTableCell />
              </S.LoadingTableRow>
            ))}
          </S.LoadingRightSection>
        </S.LoadingContainer>

        <TopUpModal
          isOpen={showTopUpModal}
          onClose={() => setShowTopUpModal(false)}
          onSuccess={() => {
            setShowTopUpModal(false);
            refetch();
            refetchHistory();
          }}
        />
      </S.MainContainer>
    );
  }

  return (
    <S.MainContainer>
      <S.LeftSection>
        <S.Header>
          <S.TitleSection>
            <S.IconImage src={gasTankIcon} alt="Gas Tank" />
            <S.Title>Universal Gas Tank</S.Title>
          </S.TitleSection>
        </S.Header>

        <S.BalanceSection>
          {balanceError ? (
            <S.ErrorBalance>
              <span>Error loading balance</span>
              <S.RetryButton onClick={refetch}>Retry</S.RetryButton>
            </S.ErrorBalance>
          ) : (
            <>
              <S.BalanceAmount>${totalBalance.toFixed(2)}</S.BalanceAmount>
              <S.NetworkLabel>On All Networks</S.NetworkLabel>
            </>
          )}
        </S.BalanceSection>

        <S.TopUpButton onClick={handleTopUp}>Top up</S.TopUpButton>

        <S.Description>
          Top up your Gas Tank so you pay for network fees on every chain.
        </S.Description>

        <S.SpendInfo>
          <S.SpendLabel>Total Spend</S.SpendLabel>
          <S.SpendAmount>
            {historyError ? '$0.00' : `$${totalSpend.toFixed(2)}`}
          </S.SpendAmount>
        </S.SpendInfo>

        <S.DetailedDescription>
          The PillarX Gas Tank is your universal balance for covering transaction
          fees across all networks. When you top up your Tank, you&apos;re
          allocating tokens specifically for paying gas. You can increase your
          balance anytime, and the tokens in your Tank can be used to pay network
          fees on any supported chain.
        </S.DetailedDescription>
      </S.LeftSection>

      <S.RightSection>
        <GasTankHistory
          pauseAutoRefresh={showTopUpModal}
          overrideLoading={false}
          historyData={historyData}
          isLoading={false}
          isError={historyError}
          onRefresh={refetchHistory}
        />
      </S.RightSection>

      <TopUpModal
        isOpen={showTopUpModal}
        onClose={() => setShowTopUpModal(false)}
        onSuccess={() => {
          setShowTopUpModal(false);
          refetch();
          refetchHistory();
        }}
      />
    </S.MainContainer>
  );
};

export default UniversalGasTank;

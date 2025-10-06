/* eslint-disable @typescript-eslint/no-use-before-define */
import { useWalletAddress } from '@etherspot/transaction-kit';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// components
import { useGasTankHistory } from '../../../gas-tank/components/GasTankHistory';
import useGasTankBalance from '../../../gas-tank/hooks/useGasTankBalance';

// assets
import gasTankIcon from '../../../gas-tank/assets/gas-tank-icon.png';

// types
interface HistoryEntry {
  id: string;
  date: string;
  type: 'Top-up' | 'Spend';
  amount: string;
  token: {
    symbol: string;
    value: string;
    icon: string;
    chainId: string;
  };
}

const GasTankPaymasterTile = () => {
  const walletAddress = useWalletAddress();
  const navigate = useNavigate();

  const {
    totalBalance,
    isLoading: isBalanceLoading,
    error: balanceError,
  } = useGasTankBalance({ pauseAutoRefresh: false });

  const {
    historyData,
    loading: isHistoryLoading,
    error: historyError,
  } = useGasTankHistory(walletAddress, { pauseAutoRefresh: false });

  const handleTileClick = () => {
    navigate('/gas-tank');
  };

  // Show only the first 5 entries
  const displayedHistory = historyData.slice(0, 5);
  const loading = isBalanceLoading || isHistoryLoading;
  const error = balanceError || historyError;

  return (
    <TileContainer onClick={handleTileClick}>
      <Header>
        <IconImage src={gasTankIcon} alt="Gas Tank" />
        <Title>Gas Tank Paymaster</Title>
        <ViewAllButton>View All →</ViewAllButton>
      </Header>

      <ContentContainer>
        <LeftSection>
          <BalanceSection>
            {balanceError ? (
              <ErrorBalance>
                <span>Error loading balance</span>
              </ErrorBalance>
            ) : isBalanceLoading ? (
              <LoadingBalance />
            ) : (
              <>
                <BalanceAmount>${totalBalance.toFixed(2)}</BalanceAmount>
                <NetworkLabel>On All Networks</NetworkLabel>
              </>
            )}
          </BalanceSection>
        </LeftSection>

        <RightSection>
          {isHistoryLoading ? (
            <LoadingContainer>
              {Array.from({ length: 3 }).map((_, index) => (
                <LoadingRow key={index}>
                  <LoadingCell width="60px" />
                  <LoadingCell width="80px" />
                  <LoadingCell width="70px" />
                  <LoadingCell width="90px" />
                  <LoadingCell width="100px" />
                </LoadingRow>
              ))}
            </LoadingContainer>
          ) : historyError ? (
            <ErrorContainer>
              <ErrorText>Unable to load gas tank history</ErrorText>
            </ErrorContainer>
          ) : displayedHistory.length === 0 ? (
            <EmptyContainer>
              <EmptyText>No transactions yet</EmptyText>
            </EmptyContainer>
          ) : (
            <TableContainer>
              <TableHeader>
                <HeaderCell width="10%">#</HeaderCell>
                <HeaderCell width="25%">Date</HeaderCell>
                <HeaderCell width="15%">Type</HeaderCell>
                <HeaderCell width="20%">Amount</HeaderCell>
                <HeaderCell width="30%">Token</HeaderCell>
              </TableHeader>

              <TableBody>
                {displayedHistory.map((entry) => (
                  <TableRow key={entry.id}>
                    <Cell width="10%">{entry.id}</Cell>
                    <Cell width="25%">{entry.date}</Cell>
                    <Cell width="15%">
                      <TypeBadge $isDeposit={entry.type === 'Top-up'}>
                        {entry.type}
                      </TypeBadge>
                    </Cell>
                    <Cell width="20%">
                      <Amount $isDeposit={entry.amount.startsWith('+')}>
                        {entry.amount}
                      </Amount>
                    </Cell>
                    <Cell width="30%">
                      <TokenInfo>
                        <TokenIcon src={entry.token.icon} alt={entry.token.symbol} />
                        <TokenDetails>
                          <TokenValue>{entry.token.value}</TokenValue>
                          <TokenSymbol>{entry.token.symbol}</TokenSymbol>
                        </TokenDetails>
                      </TokenInfo>
                    </Cell>
                  </TableRow>
                ))}
              </TableBody>
            </TableContainer>
          )}
        </RightSection>
      </ContentContainer>
    </TileContainer>
  );
};

// Styled Components
const TileContainer = styled.div`
  background: #1A1B1E;
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid rgba(255, 255, 255, 0.05);

  &:hover {
    background: #1E1F23;
    border-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
`;

const IconImage = styled.img`
  width: 24px;
  height: 24px;
  object-fit: contain;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: #FFFFFF;
  flex: 1;
`;

const ViewAllButton = styled.span`
  color: #8B5CF6;
  font-size: 14px;
  font-weight: 500;
`;

const ContentContainer = styled.div`
  display: flex;
  gap: 32px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 24px;
  }
`;

const LeftSection = styled.div`
  flex: 1;
  min-width: 200px;
`;

const RightSection = styled.div`
  flex: 2;
`;

const BalanceSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const BalanceAmount = styled.div`
  font-size: 48px;
  font-weight: 600;
  color: #FFFFFF;
  line-height: 1;
`;

const NetworkLabel = styled.div`
  color: #3B82F6;
  font-size: 12px;
  font-weight: 500;
`;

const LoadingBalance = styled.div`
  width: 180px;
  height: 48px;
  background: linear-gradient(
    90deg,
    #2A2A2A 0%,
    rgba(139, 92, 246, 0.1) 50%,
    #2A2A2A 100%
  );
  background-size: 200% 100%;
  animation: shimmer 2s infinite linear;
  border-radius: 4px;

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
`;

const ErrorBalance = styled.div`
  color: #EF4444;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const LoadingRow = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

const LoadingCell = styled.div<{ width: string }>`
  width: ${({ width }) => width};
  height: 16px;
  background: linear-gradient(
    90deg,
    #2A2A2A 0%,
    rgba(139, 92, 246, 0.1) 50%,
    #2A2A2A 100%
  );
  background-size: 200% 100%;
  animation: shimmer 2s infinite linear;
  border-radius: 4px;

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
`;

const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
`;

const ErrorText = styled.p`
  color: #EF4444;
  font-size: 14px;
  margin: 0;
`;

const EmptyContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
`;

const EmptyText = styled.p`
  color: #9CA3AF;
  font-size: 14px;
  margin: 0;
`;

const TableContainer = styled.div`
  width: 100%;
`;

const TableHeader = styled.div`
  display: flex;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 8px;
`;

const HeaderCell = styled.div<{ width: string }>`
  width: ${({ width }) => width};
  color: #9CA3AF;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TableBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TableRow = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-radius: 6px;
  transition: background-color 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.02);
  }
`;

const Cell = styled.div<{ width: string }>`
  width: ${({ width }) => width};
  display: flex;
  align-items: center;
  color: #FFFFFF;
  font-size: 14px;
`;

const TypeBadge = styled.span<{ $isDeposit: boolean }>`
  background: ${({ $isDeposit }) =>
    $isDeposit ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
  color: ${({ $isDeposit }) =>
    $isDeposit ? '#22C55E' : '#EF4444'};
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
`;

const Amount = styled.span<{ $isDeposit: boolean }>`
  color: ${({ $isDeposit }) =>
    $isDeposit ? '#22C55E' : '#EF4444'};
  font-weight: 600;
`;

const TokenInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TokenIcon = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  object-fit: cover;
`;

const TokenDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const TokenValue = styled.span`
  color: #FFFFFF;
  font-size: 12px;
  font-weight: 500;
`;

const TokenSymbol = styled.span`
  color: #9CA3AF;
  font-size: 10px;
`;

export default GasTankPaymasterTile;
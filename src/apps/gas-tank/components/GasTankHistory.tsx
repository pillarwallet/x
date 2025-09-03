/* eslint-disable @typescript-eslint/no-use-before-define */
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useWalletAddress } from '@etherspot/transaction-kit';
import { formatUnits } from 'viem';

/**
 * Represents a single entry in the gas tank history table.
 */
interface HistoryEntry {
  id: string;
  date: string;
  type: 'Top-up' | 'Spend';
  amount: string;
  token: {
    symbol: string;
    value: string;
    icon: string;
  };
}

/**
 * Keys available for sorting the table.
 */
type SortKey = 'id' | 'date' | 'type' | 'amount' | 'token';

/**
 * REST API base URL, configurable via environment variable.
 */
const API_URL = import.meta.env.VITE_PAYMASTER_URL || '';

/**
 * GasTankHistory component
 * Displays a sortable, scrollable table of gas tank transaction history for the connected wallet.
 * Handles loading, error, and empty states. Allows manual refresh.
 */
const GasTankHistory = () => {
  const walletAddress = useWalletAddress();
  const [historyData, setHistoryData] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false); // Error state for API failures
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  /**
   * Fetches history data from the REST API and updates state.
   * Handles error and loading states.
   */
  const fetchHistory = () => {
    if (!walletAddress) return;
    setLoading(true);
    setError(false); // Reset error before fetching
    fetch(`${API_URL}/getGasTankHistory?sender=${walletAddress}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // Map API response to HistoryEntry structure
        const entries: HistoryEntry[] = (data.history || []).map((item: any, idx: number) => {
          const isDeposit = item.transactionType === 'Deposit';
          return {
            id: String(idx + 1), // Numeric id starting from 1
            date: formatTimestamp(item.timestamp),
            type: isDeposit ? 'Top-up' : 'Spend',
            amount: formatAmount(item.amount, isDeposit),
            token: {
              symbol: 'USDC',
              value: formatTokenValue(item.amount),
              icon: isDeposit ? '🔵' : '🔴', // Blue for deposit, red otherwise
            },
          };
        });
        setHistoryData(entries);
      })
      .catch(() => {
        setHistoryData([]);
        setError(true); // Set error on failure
      })
      .finally(() => setLoading(false));
  };

  // Fetch history on wallet address change
  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress]);

  /**
   * Returns the sort icon for a given column key.
   * ⇅ for unsorted, ▲ for ascending, ▼ for descending.
   */
  const getSortIcon = (key: SortKey) => {
    if (sortKey !== key) return '⇅';
    return sortOrder === 'asc' ? '▲' : '▼';
  };

  /**
   * Handles sorting logic when a column header is clicked.
   * Toggles sort order if the same column is clicked.
   */
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  /**
   * Returns sorted history data based on selected column and order.
   */
  const sortedHistory = [...historyData].sort((a, b) => {
    if (!sortKey) return 0;
    let valA, valB;
    switch (sortKey) {
      case 'id':
        valA = Number(a.id);
        valB = Number(b.id);
        break;
      case 'date':
        valA = new Date(a.date).getTime();
        valB = new Date(b.date).getTime();
        break;
      case 'type':
        valA = a.type;
        valB = b.type;
        break;
      case 'amount':
        valA = Number(a.amount.replace(/[^0-9.-]+/g, ''));
        valB = Number(b.amount.replace(/[^0-9.-]+/g, ''));
        break;
      case 'token':
        valA = a.token.value;
        valB = b.token.value;
        break;
      default:
        return 0;
    }
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <Container>
      {/* Table header with refresh button */}
      <Header>
        <Icon>📋</Icon>
        <Title>Gas Tank History</Title>
        <RefreshButton onClick={fetchHistory} title="Refresh">
          🔄
        </RefreshButton>
      </Header>

      {/* Table content: loading, error, empty, or data */}
      {loading ? (
        <Loading>Loading...</Loading>
      ) : (
        <TableWrapper>
          <Table>
            <TableHeader>
              <HeaderCell onClick={() => handleSort('id')}>
                #
                <SortIcon>{getSortIcon('id')}</SortIcon>
              </HeaderCell>
              <HeaderCell onClick={() => handleSort('date')}>
                Date
                <SortIcon>{getSortIcon('date')}</SortIcon>
              </HeaderCell>
              <HeaderCell onClick={() => handleSort('type')}>
                Type
                <SortIcon>{getSortIcon('type')}</SortIcon>
              </HeaderCell>
              <HeaderCell onClick={() => handleSort('amount')}>
                Amount
                <SortIcon>{getSortIcon('amount')}</SortIcon>
              </HeaderCell>
              <HeaderCell onClick={() => handleSort('token')}>
                Token
                <SortIcon>{getSortIcon('token')}</SortIcon>
              </HeaderCell>
            </TableHeader>

            <TableBody>
              {error ? (
                // Error message if API call fails
                <ErrorMsg>
                  Error has occurred while fetching. Please try after some time
                </ErrorMsg>
              ) : sortedHistory.length === 0 ? (
                // Empty message if no data
                <NoItemsMsg>No items to display</NoItemsMsg>
              ) : (
                // Render table rows for each entry
                sortedHistory.map((entry) => (
                  <TableRow key={entry.id}>
                    <IdCell>{entry.id}</IdCell>
                    <DateCell>{entry.date}</DateCell>
                    <TypeCell>{entry.type}</TypeCell>
                    <AmountCell isPositive={entry.amount.startsWith('+')}>
                      {entry.amount}
                    </AmountCell>
                    <TokenCell>
                      <TokenIcon>{entry.token.icon}</TokenIcon>
                      <TokenInfo>
                        <TokenValue>{entry.token.value}</TokenValue>
                        <TokenSymbol>{entry.token.symbol}</TokenSymbol>
                      </TokenInfo>
                    </TokenCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableWrapper>
      )}
    </Container>
  );
};

/**
 * Converts a UNIX timestamp (seconds) to a formatted date string.
 */
function formatTimestamp(timestamp: string): string {
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Formats the amount as a USD string, with + for deposit and - for spend.
 */
function formatAmount(amount: string, isDeposit: boolean): string {
  const value = Number(formatUnits(BigInt(amount), 6)).toFixed(2);
  return `${isDeposit ? '+' : '-'}$${value}`;
}

/**
 * Formats the token value using USDC decimals (6).
 */
function formatTokenValue(amount: string): string {
  return formatUnits(BigInt(amount), 6);
}

// Styled-components for layout and table styling

const Loading = styled.div`
  color: #9ca3af;
  font-size: 14px;
  text-align: center;
  padding: 24px 0;
`;

const Container = styled.div`
  background: #1a1a1a;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #333;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
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

const TableWrapper = styled.div`
  max-height: 340px;
  overflow-y: auto;
`;

const Table = styled.div`
  width: 100%;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 0.5fr 1.5fr 1fr 1fr 1.5fr;
  gap: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #333;
  margin-bottom: 8px;
  cursor: pointer;
`;

const HeaderCell = styled.div`
  color: #9ca3af;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 4px;
  user-select: none;
`;

const SortIcon = styled.span`
  font-size: 12px;
  margin-left: 2px;
`;

const TableBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 0.5fr 1.5fr 1fr 1fr 1.5fr;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid #2a2a2a;
  align-items: center;

  &:last-child {
    border-bottom: none;
  }
`;

const IdCell = styled.div`
  color: #ffffff;
  font-size: 14px;
  text-align: center;
`;

const DateCell = styled.div`
  color: #ffffff;
  font-size: 14px;
`;

const TypeCell = styled.div`
  color: #ffffff;
  font-size: 14px;
`;

const AmountCell = styled.div<{ isPositive: boolean }>`
  color: ${(props) => (props.isPositive ? '#4ade80' : '#ef4444')};
  font-size: 14px;
  font-weight: 600;
`;

const TokenCell = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TokenIcon = styled.span`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
`;

const TokenInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const TokenValue = styled.span`
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
`;

const TokenSymbol = styled.span`
  color: #9ca3af;
  font-size: 12px;
`;

/**
 * Refresh button for manually refetching history data.
 */
const RefreshButton = styled.button`
  margin-left: auto;
  background: none;
  border: none;
  color: #9ca3af;
  font-size: 18px;
  cursor: pointer;
  padding: 0 4px;
  transition: color 0.2s;
  &:hover {
    color: #fff;
  }
`;

/**
 * Message shown when there are no items to display.
 */
const NoItemsMsg = styled.div`
  color: #9ca3af;
  font-size: 16px;
  text-align: center;
  padding: 48px 0;
`;

/**
 * Message shown when an error occurs while fetching data.
 */
const ErrorMsg = styled.div`
  color: #ef4444;
  font-size: 16px;
  text-align: center;
  padding: 48px 0;
`;

export default GasTankHistory;

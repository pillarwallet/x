/* eslint-disable @typescript-eslint/no-use-before-define */
import { useEffect, useState, useCallback } from 'react';
import { useWalletAddress } from '@etherspot/transaction-kit';
import { formatUnits } from 'viem';
import { S } from './GasTankHistory.styles';

// Import chain logos
import logoArbitrum from '../../../assets/images/logo-arbitrum.png';
import logoAvalanche from '../../../assets/images/logo-avalanche.png';
import logoBase from '../../../assets/images/logo-base.png';
import logoBsc from '../../../assets/images/logo-bsc.png';
import logoEthereum from '../../../assets/images/logo-ethereum.png';
import logoGnosis from '../../../assets/images/logo-gnosis.png';
import logoOptimism from '../../../assets/images/logo-optimism.png';
import logoPolygon from '../../../assets/images/logo-polygon.png';
import logoUnknown from '../../../assets/images/logo-unknown.png';

// assets
import gasTankIcon from '../assets/gas-tank-icon.png';

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
    chainId: string;
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
 * Maps chainId to the corresponding chain logo image
 */
const getChainLogo = (chainId: string): string => {
  const chainIdNum = parseInt(chainId);
  switch (chainIdNum) {
    case 1: // Ethereum
      return logoEthereum;
    case 137: // Polygon
      return logoPolygon;
    case 42161: // Arbitrum
      return logoArbitrum;
    case 10: // Optimism
      return logoOptimism;
    case 8453: // Base
      return logoBase;
    case 56: // BSC
      return logoBsc;
    case 43114: // Avalanche
      return logoAvalanche;
    case 100: // Gnosis
      return logoGnosis;
    default:
      return logoUnknown;
  }
};

interface GasTankHistoryProps {
  pauseAutoRefresh?: boolean;
  overrideLoading?: boolean;
  historyData?: HistoryEntry[];
  isLoading?: boolean;
  isError?: boolean;
  onRefresh?: () => void;
}

/**
 * GasTankHistory component
 * Displays a sortable, scrollable table of gas tank transaction history for the connected wallet.
 * Handles loading, error, and empty states. Allows manual refresh.
 */
const GasTankHistory = ({
  pauseAutoRefresh = false,
  overrideLoading = true,
  historyData: externalHistoryData,
  isLoading: externalIsLoading,
  isError: externalIsError,
  onRefresh: externalOnRefresh
}: GasTankHistoryProps) => {
  const walletAddress = useWalletAddress();
  const [internalHistoryData, setInternalHistoryData] = useState<HistoryEntry[]>([]);
  const [internalLoading, setInternalLoading] = useState(true);
  const [internalError, setInternalError] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Use external data if provided, otherwise use internal data
  const historyData = externalHistoryData || internalHistoryData;
  const loading = externalIsLoading !== undefined ? externalIsLoading : internalLoading;
  const error = externalIsError !== undefined ? externalIsError : internalError;

  /**
   * Fetches history data from the REST API and updates state.
   * Handles error and loading states.
   */
  const fetchHistory = useCallback(() => {
    // If external refresh is available, use it instead
    if (externalOnRefresh) {
      externalOnRefresh();
      return;
    }

    if (!walletAddress) return;
    setInternalLoading(true);
    setInternalError(false); // Reset error before fetching
    fetch(`${API_URL}/getGasTankHistory?sender=${walletAddress}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        console.log('Main component response status:', res.status);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        // Map API response to HistoryEntry structure
        const entries: HistoryEntry[] = (data.history || []).map((item: any, idx: number) => {
          const isDeposit = item.transactionType === 'Deposit';
          return {
            id: String(idx + 1), // Numeric id starting from 1
            date: formatTimestamp(item.timestamp),
            type: isDeposit ? 'Top-up' : 'Spend',
            amount: formatAmount(isDeposit ? item.amountUsd : item.amount, isDeposit),
            token: {
              symbol: (item.swap && item.swap.length > 0 && item.swap[0]) ? item.swap[0].asset.symbol : 'USDC',
              value: (item.swap && item.swap.length > 0 && item.swap[0]) ? item.amount : formatTokenValue(item.amount),
              icon: isDeposit
                ? (item.swap && item.swap.length > 0 && item.swap[0]
                   ? item.swap[0].asset.logo
                   : 'https://coin-images.coingecko.com/coins/images/6319/large/usdc.png?1696506694')
                : 'https://coin-images.coingecko.com/coins/images/6319/large/usdc.png?1696506694',
              chainId: item.chainId || '1',
            },
          };
        });
        setInternalHistoryData(entries);
      })
      .catch((err) => {
        console.error('Main component error fetching gas tank history:', err);
        setInternalHistoryData([]);
        setInternalError(true); // Set error on failure
      })
      .finally(() => setInternalLoading(false));
  }, [walletAddress, externalOnRefresh]);

  // Fetch history on wallet address change (only if no external data provided)
  useEffect(() => {
    if (!externalHistoryData) {
      fetchHistory();
    }
  }, [fetchHistory, externalHistoryData]);

  // Auto-refresh disabled
  // useEffect(() => {
  //   if (!walletAddress || pauseAutoRefresh) return;

  //   const interval = setInterval(() => {
  //     fetchHistory();
  //   }, 30000); // 30 seconds

  //   // Cleanup interval on component unmount
  //   return () => clearInterval(interval);
  // }, [walletAddress, fetchHistory, pauseAutoRefresh]);

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
    <S.Container>
      {/* Table header with refresh button */}
      <S.Header>
        <S.IconImage src={gasTankIcon} alt="Gas Tank" />
        <S.Title>Gas Tank History</S.Title>
        <S.RefreshButton onClick={fetchHistory} title="Refresh">
          🔄
        </S.RefreshButton>
      </S.Header>

      {/* Table content: loading, error, empty, or data */}
      {(loading && overrideLoading) ? (
        <S.Loading>Loading...</S.Loading>
      ) : (
        <S.TableWrapper>
          <S.TableBody>
            <S.TableHeader>
              <S.HeaderCell onClick={() => handleSort('id')}>
                #
                <S.SortIcon>{getSortIcon('id')}</S.SortIcon>
              </S.HeaderCell>
              <S.HeaderCell onClick={() => handleSort('date')}>
                Date
                <S.SortIcon>{getSortIcon('date')}</S.SortIcon>
              </S.HeaderCell>
              <S.HeaderCell onClick={() => handleSort('type')}>
                Type
                <S.SortIcon>{getSortIcon('type')}</S.SortIcon>
              </S.HeaderCell>
              <S.HeaderCell onClick={() => handleSort('amount')}>
                Amount
                <S.SortIcon>{getSortIcon('amount')}</S.SortIcon>
              </S.HeaderCell>
              <S.HeaderCell onClick={() => handleSort('token')}>
                Token
                <S.SortIcon>{getSortIcon('token')}</S.SortIcon>
              </S.HeaderCell>
            </S.TableHeader>

            {error ? (
              // Error message if API call fails
              <S.ErrorMsg>
                Error has occurred while fetching. Please try after some time
              </S.ErrorMsg>
            ) : sortedHistory.length === 0 ? (
              // Empty message if no data
              <S.NoItemsMsg>No items to display</S.NoItemsMsg>
            ) : (
              // Render table rows for each entry
              sortedHistory.map((entry) => (
                <S.TableRow $isDeposit={entry.amount.startsWith('+')} key={entry.id}>
                  <S.IdCell>{entry.id}</S.IdCell>
                  <S.DateCell>{entry.date}</S.DateCell>
                  <S.TypeCell>{entry.type}</S.TypeCell>
                  <S.AmountCell $isDeposit={entry.amount.startsWith('+')}>
                    {entry.amount}
                  </S.AmountCell>
                  <S.TokenCell>
                    <S.TokenIconContainer>
                      <S.TokenIcon src={entry.token.icon} alt={entry.token.symbol} />
                      <S.ChainOverlay src={getChainLogo(entry.token.chainId)} alt={`Chain ${entry.token.chainId}`} />
                    </S.TokenIconContainer>
                    <S.TokenInfo>
                      <S.TokenValue>{entry.token.value}</S.TokenValue>
                      <S.TokenSymbol>{entry.token.symbol}</S.TokenSymbol>
                    </S.TokenInfo>
                  </S.TokenCell>
                </S.TableRow>
              ))
            )}
          </S.TableBody>
        </S.TableWrapper>
      )}
    </S.Container>
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
  let value = amount;
  if (!isDeposit) value = Number(formatUnits(BigInt(amount), 6)).toFixed(2);
  if (Number(value) <= 0) value = '<0.01';
  return `${isDeposit ? '+' : '-'}$${value}`;
}

/**
 * Formats the token value using USDC decimals (6).
 */
function formatTokenValue(amount: string): string {
  try {
    // Check if the amount is already a decimal (contains a dot)
    if (amount.includes('.')) {
      return parseFloat(amount).toFixed(6);
    }
    // If it's a whole number string, treat it as wei-like format
    return formatUnits(BigInt(amount), 6);
  } catch (error) {
    // Fallback: treat as regular decimal number
    return parseFloat(amount).toFixed(6);
  }
}

/**
 * Custom hook to fetch and expose gas tank history and total spend.
 */
interface UseGasTankHistoryOptions {
  pauseAutoRefresh?: boolean;
}

export function useGasTankHistory(walletAddress: string | undefined, options: UseGasTankHistoryOptions = {}) {
  const { pauseAutoRefresh = false } = options;
  const [historyData, setHistoryData] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [totalSpend, setTotalSpend] = useState(0);

  const fetchHistory = () => {
    if (!walletAddress) return;
    setLoading(true);
    setError(false);

    fetch(`${API_URL}/getGasTankHistory?sender=${walletAddress}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        console.log('Response status:', res.status);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        const entries: HistoryEntry[] = (data.history || []).map((item: any, idx: number) => {
          const isDeposit = item.transactionType === 'Deposit';
          return {
            id: String(idx + 1), // Numeric id starting from 1
            date: formatTimestamp(item.timestamp),
            type: isDeposit ? 'Top-up' : 'Spend',
            amount: formatAmount(isDeposit ? item.amountUsd : item.amount, isDeposit),
            token: {
              symbol: (item.swap && item.swap.length > 0 && item.swap[0]) ? item.swap[0].asset.symbol : 'USDC',
              value: (item.swap && item.swap.length > 0 && item.swap[0]) ? item.amount : formatTokenValue(item.amount),
              icon: isDeposit
                ? (item.swap && item.swap.length > 0 && item.swap[0]
                   ? item.swap[0].asset.logo
                   : 'https://coin-images.coingecko.com/coins/images/6319/large/usdc.png?1696506694')
                : 'https://coin-images.coingecko.com/coins/images/6319/large/usdc.png?1696506694',
              chainId: item.chainId || '1',
            },
          };
        });
        setHistoryData(entries);
        // Calculate total spend (sum of all Spend amounts)
        const totalSpendCal = entries
          .filter((entry) => entry.type === 'Spend')
          .reduce((acc, entry) => acc + Number(entry.amount.replace(/[^0-9.-]+/g, '')), 0);
        setTotalSpend(Math.abs(totalSpendCal));
      })
      .catch((err) => {
        console.error('Error fetching gas tank history:', err);
        setHistoryData([]);
        setError(true);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress]);

  // Auto-refresh disabled
  // useEffect(() => {
  //   if (!walletAddress || pauseAutoRefresh) return;

  //   const interval = setInterval(() => {
  //     fetchHistory();
  //   }, 30000); // 30 seconds

  //   // Cleanup interval on component unmount
  //   return () => clearInterval(interval);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [walletAddress, pauseAutoRefresh]);

  return { historyData, loading, error, totalSpend, refetch: fetchHistory };
}

// All styled components moved to GasTankHistory.styles.ts

export default GasTankHistory;

import { useMemo, useState, useEffect, useRef } from 'react';
import { ProcessedGasTankTransaction } from '../../types/gasTank';
import { TransactionRow } from './TransactionRow';
import { SkeletonTransactionRow } from './GasTankSkeleton';
import HistoryIcon from '../../assets/history.svg';

interface GasTankHistoryCardProps {
  transactions: ProcessedGasTankTransaction[];
  isLoading: boolean;
  error: Error | null;
  onRetry: () => void;
}

type SortKey = 'date' | 'type' | 'amount' | 'token';
type SortDirection = 'asc' | 'desc';

interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}

/**
 * Gas tank history card with sortable columns
 * Displays transactions with Date, Type, Amount, and Token columns
 */
export const GasTankHistoryCard: React.FC<GasTankHistoryCardProps> = ({
  transactions,
  isLoading,
  error,
  onRetry,
}) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'date',
    direction: 'desc',
  });

  // Infinite scroll state
  const [displayedLimit, setDisplayedLimit] = useState(10);

  // Reset displayed limit when transactions change
  useMemo(() => {
    setDisplayedLimit(10);
  }, [transactions]);

  // Sort transactions based on current sort config
  const sortedTransactions = useMemo(() => {
    const sorted = [...transactions];

    sorted.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortConfig.key) {
        case 'date':
          aValue = a.timestamp;
          bValue = b.timestamp;
          break;
        case 'type':
          aValue = a.type;
          bValue = b.type;
          break;
        case 'amount':
          // Sort algebraically: Top-up is positive, Spend is negative
          const aAmount = parseFloat(a.usdcAmount);
          const bAmount = parseFloat(b.usdcAmount);
          aValue = a.type === 'Top-up' ? aAmount : -aAmount;
          bValue = b.type === 'Top-up' ? bAmount : -bAmount;
          break;
        case 'token':
          aValue = 'USDC'; // All transactions are in USDC
          bValue = 'USDC';
          break;
        default:
          return 0;
      }

      if (typeof aValue === 'string') {
        if (sortConfig.direction === 'asc') {
          return aValue.localeCompare(bValue as string);
        } else {
          return (bValue as string).localeCompare(aValue);
        }
      } else {
        if (sortConfig.direction === 'asc') {
          return aValue - (bValue as number);
        } else {
          return (bValue as number) - aValue;
        }
      }
    });

    return sorted;
  }, [transactions, sortConfig]);

  const handleSort = (key: SortKey) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const renderSortIndicator = (key: SortKey) => {
    const isActive = sortConfig.key === key;
    const isAsc = sortConfig.direction === 'asc';

    return (
      <div className="flex flex-col ml-1 gap-[1px]">
        {/* Up arrow */}
        <svg
          width="8"
          height="5"
          viewBox="0 0 8 5"
          fill="none"
          className="cursor-pointer"
        >
          <path
            d="M4 0.5L7.4641 4.25H0.535898L4 0.5Z"
            fill={isActive && isAsc ? 'white' : '#666666'}
          />
        </svg>
        {/* Down arrow */}
        <svg
          width="8"
          height="5"
          viewBox="0 0 8 5"
          fill="none"
          className="cursor-pointer"
        >
          <path
            d="M4 4.5L0.535898 0.75H7.4641L4 4.5Z"
            fill={isActive && !isAsc ? 'white' : '#666666'}
          />
        </svg>
      </div>
    );
  };

  const visibleTransactions = sortedTransactions.slice(0, displayedLimit);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && displayedLimit < sortedTransactions.length) {
          setDisplayedLimit((prev) => prev + 10);
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [displayedLimit, sortedTransactions.length]);

  return (
    <div className="w-full md:w-auto md:flex-1 max-w-[606px] min-w-[300px] h-[460px] bg-[#1E1D24] border border-[#25232D] rounded-[12px] overflow-hidden p-[16px] flex flex-col">
      {/* Background Vectors Removed */}

      {/* Header */}
      <div className="flex items-center gap-[5px] mb-[16px]">
        <div className="w-[16px] h-[18px] relative flex items-center justify-center">
          <img src={HistoryIcon} alt="Gas Tank History" className="w-full h-full" />
        </div>
        <h3 className="font-['Poppins'] font-normal text-[16px] leading-[16px] text-white">
          Gas Tank History
        </h3>
      </div>

      {/* Column Headers */}
      <div className="w-full flex items-center pb-2 border-b border-[#25232D] mb-[12px]">
        <button
          onClick={() => handleSort('date')}
          className={`w-[120px] text-left font-['Poppins'] font-normal text-[14px] leading-[14px] tracking-[-0.02em] text-white flex items-center gap-1 ${
            sortConfig.key === 'date' ? 'opacity-100' : 'opacity-50'
          }`}
        >
          Date
          {renderSortIndicator('date')}
        </button>
        <button
          onClick={() => handleSort('type')}
          className={`w-[80px] text-left font-['Poppins'] font-normal text-[14px] leading-[14px] tracking-[-0.02em] text-white flex items-center gap-1 ${
            sortConfig.key === 'type' ? 'opacity-100' : 'opacity-50'
          }`}
        >
          Type
          {renderSortIndicator('type')}
        </button>
        <button
          onClick={() => handleSort('amount')}
          className={`w-[120px] text-right font-['Poppins'] font-normal text-[14px] leading-[14px] tracking-[-0.02em] text-white flex items-center justify-end gap-1 ${
            sortConfig.key === 'amount' ? 'opacity-100' : 'opacity-50'
          }`}
        >
          Amount
          {renderSortIndicator('amount')}
        </button>
        <button
          onClick={() => handleSort('token')}
          className={`flex-1 text-right font-['Poppins'] font-normal text-[14px] leading-[14px] tracking-[-0.02em] text-white flex items-center justify-end gap-1 ${
            sortConfig.key === 'token' ? 'opacity-100' : 'opacity-50'
          }`}
        >
          Token
          {renderSortIndicator('token')}
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-[16px] flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#25232D] scrollbar-track-transparent">
        {error ? (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-[#FF366C] text-sm mb-3">
              Failed to load history
            </p>
            <button
              onClick={onRetry}
              className="px-4 py-2 text-[#8A77FF] text-sm font-medium hover:text-[#A395FF] transition-colors"
            >
              Retry
            </button>
          </div>
        ) : isLoading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <SkeletonTransactionRow key={i} />
            ))}
          </div>
        ) : sortedTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-white/50 text-sm">No transactions yet</p>
          </div>
        ) : (
          <>
            {visibleTransactions.map((tx) => (
              <TransactionRow key={tx.id} transaction={tx} />
            ))}
            
            {/* Infinite Scroll Loader Trigger */}
            {displayedLimit < sortedTransactions.length && (
              <div ref={loaderRef} className="h-4 w-full bg-transparent" />
            )}
          </>
        )}
      </div>
    </div>
  );
};

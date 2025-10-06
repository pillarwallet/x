/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { TailSpin } from 'react-loader-spinner';
import { useLocation, useNavigate } from 'react-router-dom';
import { isAddress } from 'viem';
import {
  Token,
  chainNameToChainIdTokensData,
} from '../../../../services/tokensData';
import { PortfolioData } from '../../../../types/api';
import {
  formatExponentialSmallNumber,
  limitDigitsNumber,
} from '../../../../utils/number';
import SearchIcon from '../../assets/seach-icon.svg';
import { useTokenSearch } from '../../hooks/useTokenSearch';
import { SearchType, SelectedToken } from '../../types/tokens';
import { MobulaChainNames } from '../../utils/constants';
import { Asset, parseSearchData } from '../../utils/parseSearchData';
import Close from '../Misc/Close';
import Esc from '../Misc/Esc';
import Refresh from '../Misc/Refresh';
import PortfolioTokenList from './PortfolioTokenList';

interface SearchProps {
  setSearching: Dispatch<SetStateAction<boolean>>;
  isBuy: boolean;
  setBuyToken: Dispatch<SetStateAction<SelectedToken | null>>;
  setSellToken: Dispatch<SetStateAction<SelectedToken | null>>;
  chains: MobulaChainNames;
  setChains: Dispatch<SetStateAction<MobulaChainNames>>;
  walletPortfolioData?: PortfolioData;
  walletPortfolioLoading?: boolean;
  walletPortfolioFetching?: boolean;
  walletPortfolioError?: boolean;
  refetchWalletPortfolio?: () => void;
}


type SortKey = 'symbol' | 'price' | 'balance' | 'pnl';
type SortOrder = 'asc' | 'desc';

export default function Search({
  setSearching,
  isBuy,
  setBuyToken,
  setSellToken,
  chains,
  walletPortfolioData,
  walletPortfolioLoading,
  walletPortfolioFetching,
  walletPortfolioError,
  refetchWalletPortfolio,
}: SearchProps) {
  const { searchText, setSearchText, searchData, isFetching } = useTokenSearch({
    isBuy,
    chains,
  });
  const [searchType, setSearchType] = useState<SearchType>();
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const inputRef = useRef<HTMLInputElement>(null);
  const searchModalRef = useRef<HTMLDivElement>(null);

  const useQuery = () => {
    const { search } = useLocation();
    return new URLSearchParams(search);
  };

  const query = useQuery();

  const navigate = useNavigate();
  const location = useLocation();

  const removeQueryParams = () => {
    navigate(location.pathname, { replace: true });
  };

  useEffect(() => {
    inputRef.current?.focus();
    const tokenAddress = query.get('asset');

    // Only read asset parameter when in buy mode to prevent token address
    // from token-atlas showing in sell search
    if (isAddress(tokenAddress || '')) {
      setSearchText(tokenAddress!);
    }

    setSearchType(SearchType.MyHoldings);
  }, [query, setSearchText]);

  const handleClose = () => {
    setSearchText('');
    // It resets search type to MyHoldings if on sell screen
    setSearchType(SearchType.MyHoldings);
    setSearching(false);
    removeQueryParams();
  };

  // Click outside to close functionality
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchModalRef.current &&
        !searchModalRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ESC key to close functionality
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  const getSortIcon = (key: SortKey) => {
    if (sortKey !== key) return '↕';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  const handleTokenSelect = (item: Asset | Token) => {
    if (isBuy) {
      // Asset type
      if ('chain' in item) {
        setBuyToken({
          name: item.name,
          symbol: item.symbol,
          logo: item.logo ?? '',
          usdValue: formatExponentialSmallNumber(
            limitDigitsNumber(item.price || 0)
          ),
          dailyPriceChange: -0.02,
          chainId: chainNameToChainIdTokensData(item.chain),
          decimals: item.decimals,
          address: item.contract,
        });
      } else {
        // Token type
        setBuyToken({
          name: item.name,
          symbol: item.symbol,
          logo: item.logo ?? '',
          usdValue: formatExponentialSmallNumber(
            limitDigitsNumber(item.price || 0)
          ),
          dailyPriceChange: -0.02,
          chainId: chainNameToChainIdTokensData(item.blockchain),
          decimals: item.decimals,
          address: item.contract,
        });
      }
    } else {
      const sellTokenData = {
        name: item.name,
        symbol: item.symbol,
        logo: item.logo ?? '',
        usdValue: formatExponentialSmallNumber(
          limitDigitsNumber(item.price || 0)
        ),
        dailyPriceChange: -0.02,
        decimals: item.decimals,
        address: item.contract,
      };

      if ('chain' in item) {
        setSellToken({
          ...sellTokenData,
          chainId: chainNameToChainIdTokensData(item.chain),
        });
      } else {
        setSellToken({
          ...sellTokenData,
          chainId: chainNameToChainIdTokensData(item.blockchain),
        });
      }
    }
    setSearchText('');
    // This keeps MyHoldings filter active when on sell screen
    if (!isBuy) {
      setSearchType(SearchType.MyHoldings);
    }
    setSearching(false);
    removeQueryParams();
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-transparent"
      data-testid="pulse-search-view"
    >
      <div
        ref={searchModalRef}
        className="flex flex-col w-full max-w-[95vw] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px] xl:max-w-[900px] max-h-[90vh] sm:max-h-[80vh] bg-[#2A2A2A] border border-white/[0.05] rounded-2xl shadow-[0px_2px_15px_0px_rgba(18,17,22,0.5)] overflow-hidden"
        data-testid="pulse-search-modal"
      >
        {/* Fixed Header Section */}
        <div className="flex-shrink-0 p-3 pb-0">
          <div className="flex w-full items-start">
            <div className="flex items-center justify-center flex-1 h-10 bg-[#121116] rounded-[10px] mr-2 border-2 border-[#1E1D24] min-w-0">
              <span className="ml-2.5 flex-shrink-0">
                <img src={SearchIcon} alt="search-icon" />
              </span>
              <input
                ref={inputRef}
                type="text"
                className="flex-1 w-full ml-4 font-normal text-xs text-gray-500 bg-transparent border-none outline-none"
                value={searchText}
                data-testid="pulse-search-input"
                placeholder="Search tokens..."
                onChange={(e) => {
                  setSearchText(e.target.value);
                }}
              />
              {(searchText.length > 0 && isFetching) ? (
                <div className="mr-2.5 flex-shrink-0">
                  <TailSpin color="#FFFFFF" height={20} width={20} />
                </div>
              ) : (
                <div className="flex-shrink-0">
                  <Close onClose={handleClose} />
                </div>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-10 h-10 bg-black rounded-[10px] p-0.5 pb-1 pl-0.5 pr-0.5">
                <Refresh
                  isLoading={walletPortfolioFetching}
                  onClick={refetchWalletPortfolio}
                  disabled={!refetchWalletPortfolio || walletPortfolioFetching}
                />
              </div>
              <div className="w-10 h-10 bg-black rounded-[10px] p-0.5 pb-1 pl-0.5 pr-0.5 relative cursor-pointer">
                <Esc onClose={handleClose} />
              </div>
            </div>
          </div>

          {/* MyHoldings Header */}
          <div className="flex gap-1.5 mt-4 mb-2" data-testid="pulse-search-filter-buttons">
            <div className="flex items-center">
              <p className="text-[13px] font-normal text-white tracking-[-0.26px] px-3">
                💰My Holdings
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Content Section */}
        <div className="flex-1 min-h-0 px-3 pb-3 overflow-hidden">
          <div className="h-full overflow-y-auto overflow-x-hidden" style={{ maxHeight: 'calc(90vh - 140px)' }}>
            <table className="w-full table-fixed">
              <thead className="sticky top-0 bg-[#2A2A2A] z-10 border-b border-gray-700">
                <tr>
                  <th
                    className="text-left text-gray-400 text-xs font-medium px-2 pb-3 pt-2 cursor-pointer hover:text-white transition-colors w-2/5"
                    onClick={() => handleSort('symbol')}
                  >
                    Token/Price {getSortIcon('symbol')}
                  </th>
                  <th
                    className="text-center text-gray-400 text-xs font-medium px-2 pb-3 pt-2 cursor-pointer hover:text-white transition-colors w-1/5"
                    onClick={() => handleSort('balance')}
                  >
                    Balance {getSortIcon('balance')}
                  </th>
                  <th
                    className="text-right text-gray-400 text-xs font-medium px-2 pb-3 pt-2 cursor-pointer hover:text-white transition-colors w-2/5"
                    onClick={() => handleSort('pnl')}
                  >
                    Unrealized PnL/% {getSortIcon('pnl')}
                  </th>
                </tr>
              </thead>
              <tbody>
                <PortfolioTokenList
                  walletPortfolioData={walletPortfolioData}
                  handleTokenSelect={handleTokenSelect}
                  isLoading={walletPortfolioLoading}
                  isError={walletPortfolioError}
                  searchText={searchText}
                  sortKey={sortKey}
                  sortOrder={sortOrder}
                />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

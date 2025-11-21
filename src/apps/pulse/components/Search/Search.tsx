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
import { isTestnet } from '../../../../utils/blockchain';
import {
  formatExponentialSmallNumber,
  limitDigitsNumber,
} from '../../../../utils/number';
import { useIsMobile } from '../../../../utils/media';
import SearchIcon from '../../assets/seach-icon.svg';
import { useTokenSearch } from '../../hooks/useTokenSearch';
import { SearchType, SelectedToken, SortType } from '../../types/tokens';
import { MobulaChainNames, getChainId } from '../../utils/constants';
import {
  Asset,
  filterMarketsByLiquidity,
  Market,
  parseFreshAndTrendingTokens,
  parseSearchData,
} from '../../utils/parseSearchData';
import Close from '../Misc/Close';
import Esc from '../Misc/Esc';
import Refresh from '../Misc/Refresh';
import ChainOverlay from './ChainOverlay';
import ChainSelectButton from './ChainSelect';
import MarketList from './MarketList';
import PortfolioTokenList from './PortfolioTokenList';
import SearchSkeleton from './SearchSkeleton';
import Sort from './Sort';
import TokenList from './TokenList';

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

const overlayStyling = {
  width: 200,
  height: 210,
  background: '#23222A',
  borderRadius: 16,
  boxShadow: '0 4px 32px rgba(0,0,0,0.3)',
  padding: 0,
  overflow: 'hidden',
  zIndex: 2000,
  position: 'fixed' as const,
};

export default function Search({
  setSearching,
  isBuy,
  setBuyToken,
  setSellToken,
  chains,
  setChains,
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
  const [searchType, setSearchType] = useState<SearchType | undefined>(
    isBuy ? SearchType.Trending : undefined
  );
  const [isLoading, setIsLoading] = useState(false);
  const [parsedAssets, setParsedAssets] = useState<Asset[]>();
  const MIN_LIQUIDITY_THRESHOLD = 1000;

  // Sorting state for search results
  const [searchSort, setSearchSort] = useState<{
    mCap?: SortType;
    volume?: SortType;
    price?: SortType;
    priceChange24h?: SortType;
  }>({});

  // Store sorted search results
  const [sortedSearchAssets, setSortedSearchAssets] = useState<Asset[]>();

  let list: { assets: Asset[]; markets: Market[] } | undefined;
  if (searchData?.result.data) {
    list = parseSearchData(searchData?.result.data!, chains, searchText);
  }

  // Update sorted assets when search results change
  useEffect(() => {
    if (list?.assets) {
      setSortedSearchAssets([...list.assets]);
    } else {
      setSortedSearchAssets(undefined);
    }
    // Reset sort when search changes
    setSearchSort({});
  }, [searchText, searchData]);

  // Sorting handler for search results
  const handleSearchSortChange = (
    key: 'mCap' | 'volume' | 'price' | 'priceChange24h'
  ) => {
    if (!sortedSearchAssets) return;

    const sortType =
      searchSort[key] === SortType.Down
        ? SortType.Up
        : searchSort[key] === SortType.Up
          ? SortType.Down
          : SortType.Up;

    const sorted = [...sortedSearchAssets].sort((a, b) => {
      if (sortType === SortType.Up) {
        return (b[key] || 0) - (a[key] || 0);
      }
      return (a[key] || 0) - (b[key] || 0);
    });

    setSortedSearchAssets(sorted);
    setSearchSort({
      mCap: undefined,
      price: undefined,
      priceChange24h: undefined,
      volume: undefined,
      [key]: sortType,
    });
  };

  // Apply liquidity filter automatically
  const filteredMarkets = list?.markets
    ? filterMarketsByLiquidity(list.markets, MIN_LIQUIDITY_THRESHOLD)
    : [];

  const inputRef = useRef<HTMLInputElement>(null);
  const [showChainOverlay, setShowChainOverlay] = useState(false);
  const chainButtonRef = useRef<HTMLButtonElement>(null);
  const chainOverlayRef = useRef<HTMLDivElement>(null);
  const [overlayStyle, setOverlayStyle] = useState<React.CSSProperties>({});
  const searchModalRef = useRef<HTMLDivElement>(null);

  const useQuery = () => {
    const { search } = useLocation();
    return new URLSearchParams(search);
  };

  const query = useQuery();

  const navigate = useNavigate();
  const location = useLocation();

  const removeQueryParams = () => {
    // Preserve relayBuy parameter if it exists
    const relayBuyParam = query.get('relayBuy');
    if (relayBuyParam) {
      const newSearch = new URLSearchParams();
      newSearch.set('relayBuy', relayBuyParam);
      navigate(`${location.pathname}?${newSearch.toString()}`, {
        replace: true,
      });
    } else {
      navigate(location.pathname, { replace: true });
    }
  };

  const getUrl = (search?: SearchType) => {
    if (search === SearchType.Fresh)
      return isTestnet
        ? 'https://freshtokens-nubpgwxpiq-uc.a.run.app'
        : 'https://freshtokens-7eu4izffpa-uc.a.run.app';
    return isTestnet
      ? 'https://trendingtokens-nubpgwxpiq-uc.a.run.app'
      : 'https://trendingtokens-7eu4izffpa-uc.a.run.app';
  };

  useEffect(() => {
    inputRef.current?.focus();
    const tokenAddress = query.get('asset');

    // Only read asset parameter when in buy mode to prevent token address
    // from token-atlas showing in sell search
    if (isBuy && isAddress(tokenAddress || '')) {
      setSearchText(tokenAddress!);
    }

    // This auto-select MyHoldings filter when on sell screen
    if (!isBuy) {
      setSearchType(SearchType.MyHoldings);
    }
  }, [query, setSearchText, isBuy]);

  const handleClose = () => {
    setSearchText('');
    // It resets search type to MyHoldings if on sell screen
    if (!isBuy) {
      setSearchType(SearchType.MyHoldings);
    } else {
      setSearchType(undefined);
    }
    setSearching(false);
    removeQueryParams();
  };

  // Click outside to close functionality
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedInsideModal = searchModalRef.current?.contains(target);
      const clickedInsideChainOverlay = chainOverlayRef.current?.contains(target);

      if (!clickedInsideModal && !clickedInsideChainOverlay) {
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

  useEffect(() => {
    if (searchType) {
      setIsLoading(true);
      setParsedAssets(undefined);
      fetch(`${getUrl(searchType)}?chainIds=${getChainId(chains)}`)
        .then((response) => response.json())
        .then((result) => {
          const assets = parseFreshAndTrendingTokens(result.projection);

          // Sort based on search type
          if (searchType === SearchType.Trending) {
            // Sort by volume (descending - highest first)
            assets.sort((a, b) => (b.volume || 0) - (a.volume || 0));
          } else if (searchType === SearchType.Fresh) {
            // Sort by timestamp (descending - newest first)
            assets.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
          }

          setParsedAssets(assets);
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
          console.error(err);
        });
    }
  }, [searchType, chains]);

  // Comprehensive refresh handler
  const handleRefresh = () => {
    // Refetch wallet portfolio if available
    if (refetchWalletPortfolio) {
      refetchWalletPortfolio();
    }

    // Refetch Trending/Fresh/Top Gainers data if applicable
    if (searchType && searchType !== SearchType.MyHoldings) {
      setIsLoading(true);
      setParsedAssets(undefined);
      fetch(`${getUrl(searchType)}?chainIds=${getChainId(chains)}`)
        .then((response) => response.json())
        .then((result) => {
          const assets = parseFreshAndTrendingTokens(result.projection);

          // Sort based on search type
          if (searchType === SearchType.Trending) {
            // Sort by volume (descending - highest first)
            assets.sort((a, b) => (b.volume || 0) - (a.volume || 0));
          } else if (searchType === SearchType.Fresh) {
            // Sort by timestamp (descending - newest first)
            assets.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
          }

          setParsedAssets(assets);
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
          console.error(err);
        });
    }
  };

  /**
   * Get the chain with the highest USDC balance from portfolio data
   * Used for multi-chain asset selection
   */
  const getChainWithMostUSDC = (): number | null => {
    if (!walletPortfolioData?.assets) return null;

    // Find all USDC assets in the portfolio
    const usdcAssets = walletPortfolioData.assets.filter(
      (asset) =>
        asset.asset.symbol.toUpperCase() === 'USDC' ||
        asset.asset.name.toLowerCase().includes('usd coin')
    );

    if (usdcAssets.length === 0) return null;

    // Find the chain with the highest USDC balance
    let maxBalance = 0;
    let bestChainId: number | null = null;

    usdcAssets.forEach((usdcAsset) => {
      usdcAsset.contracts_balances.forEach((balance) => {
        if (balance.balance > maxBalance) {
          maxBalance = balance.balance;
          // Extract chain ID from chainId string (format: "eip155:1")
          const chainIdStr = balance.chainId.split(':')[1];
          bestChainId = parseInt(chainIdStr, 10);
        }
      });
    });

    return bestChainId;
  };

  const handleSearchTypeChange = (index: number) => {
    if (index === 0) setSearchType(SearchType.Trending);
    else if (index === 1) setSearchType(SearchType.Fresh);
    else if (index === 2) setSearchType(SearchType.TopGainers);
    else if (index === 3) setSearchType(SearchType.MyHoldings);
    setSearchText('');
  };

  const handleTokenSelect = (item: Asset | Token) => {
    if (isBuy) {
      let selectedChainId: number;
      let selectedContract: string;
      let selectedDecimals: number;

      // Asset type
      if ('chain' in item) {
        // Check if this asset exists on multiple chains
        const hasMultipleChains =
          'allChains' in item && item.allChains && item.allChains.length > 1;

        if (hasMultipleChains && 'allChains' in item && 'allContracts' in item && 'allDecimals' in item) {
          // Multi-chain asset - select chain with most USDC
          const chainWithMostUSDC = getChainWithMostUSDC();

          if (chainWithMostUSDC && item.allChains && item.allContracts && item.allDecimals) {
            // Find the index of the chain with most USDC
            const chainIndex = item.allChains.findIndex(
              (chain: string) => chainNameToChainIdTokensData(chain) === chainWithMostUSDC
            );

            if (chainIndex !== -1) {
              // Use the chain with most USDC
              selectedChainId = chainWithMostUSDC;
              selectedContract = item.allContracts[chainIndex];
              selectedDecimals = item.allDecimals[chainIndex];
            } else {
              // Fallback to primary chain
              selectedChainId = chainNameToChainIdTokensData(item.chain);
              selectedContract = item.contract;
              selectedDecimals = item.decimals;
            }
          } else {
            // No USDC balance found, use primary chain
            selectedChainId = chainNameToChainIdTokensData(item.chain);
            selectedContract = item.contract;
            selectedDecimals = item.decimals;
          }
        } else {
          // Single chain asset
          selectedChainId = chainNameToChainIdTokensData(item.chain);
          selectedContract = item.contract;
          selectedDecimals = item.decimals;
        }

        setBuyToken({
          name: item.name,
          symbol: item.symbol,
          logo: item.logo ?? '',
          usdValue: formatExponentialSmallNumber(
            limitDigitsNumber(item.price || 0)
          ),
          dailyPriceChange: 'priceChange24h' in item ? (item.priceChange24h || -0.02) : -0.02,
          chainId: selectedChainId,
          decimals: selectedDecimals,
          address: selectedContract,
        });
      } else {
        // Token type - use blockchain property
        selectedChainId = chainNameToChainIdTokensData(item.blockchain);
        selectedContract = item.contract;
        selectedDecimals = item.decimals;

        setBuyToken({
          name: item.name,
          symbol: item.symbol,
          logo: item.logo ?? '',
          usdValue: formatExponentialSmallNumber(
            limitDigitsNumber(item.price || 0)
          ),
          dailyPriceChange: -0.02,
          chainId: selectedChainId,
          decimals: selectedDecimals,
          address: selectedContract,
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
        dailyPriceChange: 'priceChange24h' in item ? (item.priceChange24h || -0.02) : -0.02,
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

  const handleMarketSelect = (market: Market) => {
    // When selecting a market, set the buy token to token0 (the searched token)
    // and automatically select the chain where this liquidity pool exists
    setBuyToken({
      name: market.token0.name,
      symbol: market.token0.symbol,
      logo: market.token0.logo ?? '',
      usdValue: formatExponentialSmallNumber(
        limitDigitsNumber(market.token0.price || 0)
      ),
      dailyPriceChange: market.priceChange24h || 0,
      chainId: chainNameToChainIdTokensData(market.blockchain),
      decimals: market.token0.decimals,
      address: market.token0.address,
    });
    setSearchText('');
    setSearching(false);
    removeQueryParams();
  };

  const isMobile = useIsMobile();

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-black md:p-4"
      data-testid="pulse-search-view"
    >
      <div
        ref={searchModalRef}
        className={`flex flex-col bg-[#1E1D24] p-3 ${isMobile
          ? 'fixed inset-0 z-50 w-full h-full'
          : 'w-[446px] h-[512px] border border-white/[0.05] rounded-2xl shadow-[0px_2px_15px_0px_rgba(18,17,22,0.5)]'
          }`}
        data-testid="pulse-search-modal"
      >
        {/* Fixed header section */}
        <div className="flex-shrink-0">
          {/* Header: Back/Search bar, Refresh, Chain selector */}
          <div className="flex items-center gap-2 px-1.5 pt-1.5 pb-2">
            {/* Back button (mobile only) */}
            {isMobile && (
              <button
                onClick={handleClose}
                className="flex items-center justify-center w-10 h-10 bg-[#121116] rounded-[10px] flex-shrink-0 group p-0.5"
                type="button"
                data-testid="pulse-search-back-button"
              >
                <div className="flex items-center justify-center w-full h-full bg-[#1E1D24] rounded-[8px] group-hover:bg-[#2A2A2A] transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </button>
            )}

            {/* Search input */}
            <div className={`flex items-center h-10 bg-[#121116] rounded-[10px] px-3 gap-2 ${isMobile ? 'flex-1 min-w-0' : 'flex-1'}`}>
              {/* Search icon */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
                <circle cx="11" cy="11" r="7" stroke="#858585" strokeWidth="2" fill="none" />
                <path d="M20 20L17 17" stroke="#858585" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                className="flex-1 bg-transparent text-white text-xs outline-none border-none placeholder-transparent font-normal min-w-0 h-full"
                placeholder=""
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                }}
              />
              {searchText && (
                <button
                  onClick={() => setSearchText('')}
                  className="flex items-center justify-center w-4 h-4 flex-shrink-0 opacity-60 hover:opacity-100"
                  type="button"
                >
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                    <path d="M15 5L5 15M5 5L15 15" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              )}
            </div>

            {/* Refresh button */}
            <button
              onClick={handleRefresh}
              disabled={walletPortfolioFetching || isLoading}
              className="flex items-center justify-center w-10 h-10 bg-[#121116] rounded-[10px] flex-shrink-0 group p-0.5"
              type="button"
              data-testid="pulse-search-refresh-button"
            >
              <div className="flex items-center justify-center w-full h-full bg-[#1E1D24] rounded-[8px] group-hover:bg-[#2A2A2A] transition-colors">
                <Refresh
                  isLoading={walletPortfolioFetching || isLoading}
                  onClick={handleRefresh}
                  disabled={walletPortfolioFetching || isLoading}
                />
              </div>
            </button>

            {/* Chain selector (only for buy) */}
            {isBuy ? (
              <button
                ref={chainButtonRef}
                onClick={() => {
                  const rect = chainButtonRef?.current?.getBoundingClientRect();
                  setShowChainOverlay(true);
                  setOverlayStyle({
                    ...overlayStyling,
                    top: `${rect!.bottom + 5}px`,
                    left: `${rect!.right - 200}px`,
                  });
                }}
                className="flex items-center justify-center w-10 h-10 bg-[#121116] rounded-[10px] flex-shrink-0 group p-0.5"
                type="button"
              >
                <div className="flex items-center justify-center w-full h-full bg-[#1E1D24] rounded-[8px] group-hover:bg-[#2A2A2A] transition-colors">
                  <ChainSelectButton />
                </div>
              </button>
            ) : null}
          </div>

          {/* Filter tabs - Trending / Fresh / Top Gainers / My Holdings */}
          {!searchText && (
            <div className="flex flex-wrap gap-2.5 px-1.5 pb-0" data-testid="pulse-search-filter-buttons">
              {(isBuy
                ? ['🔥 Trending', '🌱 Fresh', '🚀 Top Gainers', '💰 My Holdings']
                : ['My Holdings']
              ).map((item, index) => {
                // For sell screen, always map to MyHoldings index (3)
                const actualIndex = isBuy ? index : 3;

                if (!isBuy) {
                  return (
                    <div key={item} className="flex items-center">
                      <p className="text-[13px] font-normal text-white tracking-[-0.26px] px-3">
                        {item}
                      </p>
                    </div>
                  );
                }

                const isActive = searchType && item.includes(searchType);

                return (
                  <button
                    key={item}
                    className={`h-[30px] rounded-lg flex items-center justify-center text-xs font-medium whitespace-nowrap transition-colors px-0.5 pt-0.5 pb-1 group flex-shrink-0 outline-none focus:outline-none ring-0 focus:ring-0 shadow-none focus:shadow-none bg-[#121116]`}
                    type="button"
                    onClick={() => {
                      handleSearchTypeChange(actualIndex);
                    }}
                  >
                    <div
                      className={`w-full h-full rounded-md py-1.5 px-2 flex items-center justify-center ${isActive
                        ? 'bg-[#2E2A4A] text-white'
                        : 'bg-[#1E1D24] text-white/60 group-hover:bg-[#2A2A2A]'
                        }`}
                    >
                      {item}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Scrollable results section */}
        <div className="flex-1 overflow-y-auto mt-2">
          {/* Show skeleton during loading */}
          {(isFetching || isLoading) && <SearchSkeleton />}

          {!searchText &&
            parsedAssets === undefined &&
            searchType !== SearchType.MyHoldings && (
              <div className="flex items-center justify-center m-[50px]">
                <p className="text-gray-500">
                  Search by token or paste address...
                </p>
              </div>
            )}

          {/* Show search results with grouped Assets and Markets sections */}
          {searchText && sortedSearchAssets && searchType !== SearchType.MyHoldings && !isFetching && (
            <div className="flex flex-col">
              {/* Assets Section */}
              {sortedSearchAssets.length > 0 && (
                <>
                  {/* Column Headers with Sorting */}
                  <div
                    className="flex mt-2.5 mb-2.5"
                    style={{
                      fontSize: 13,
                      fontWeight: 400,
                      color: 'grey',
                    }}
                  >
                    <div className="flex ml-2.5">
                      <button
                        onClick={() => handleSearchSortChange('mCap')}
                        type="button"
                        data-testid="pulse-search-sort-mcap"
                      >
                        MCap
                      </button>
                      <div className="mt-0.5 ml-0.5 mr-0.5">
                        <Sort sortType={searchSort.mCap} />
                      </div>
                      <div className="ml-0.5 mr-0.5">/</div>
                      <button
                        onClick={() => handleSearchSortChange('volume')}
                        type="button"
                        data-testid="pulse-search-sort-volume"
                      >
                        24h Vol
                      </button>
                      <div className="mt-0.5 ml-0.5 mr-0.5">
                        <Sort sortType={searchSort.volume} />
                      </div>
                    </div>
                    <div className="flex ml-auto mr-2.5">
                      <button
                        onClick={() => handleSearchSortChange('price')}
                        type="button"
                        data-testid="pulse-search-sort-price"
                      >
                        Price
                      </button>
                      <div className="mt-0.5 ml-0.5 mr-0.5">
                        <Sort sortType={searchSort.price} />
                      </div>
                      <div className="ml-0.5 mr-0.5">/</div>
                      <button
                        onClick={() => handleSearchSortChange('priceChange24h')}
                        type="button"
                        data-testid="pulse-search-sort-price-change"
                      >
                        24h %
                      </button>
                      <div className="mt-0.5 ml-0.5 mr-0.5">
                        <Sort sortType={searchSort.priceChange24h} />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-2 px-2.5">
                    <p className="text-sm font-medium text-white">
                      Assets ({sortedSearchAssets.length})
                    </p>
                  </div>
                  <TokenList
                    assets={sortedSearchAssets}
                    handleTokenSelect={handleTokenSelect}
                    searchType={searchType}
                    hideHeaders={true}
                  />
                </>
              )}

              {/* Markets Section */}
              {filteredMarkets.length > 0 && (
                <>
                  <div className="flex items-center justify-between mt-4 mb-2 px-2.5">
                    <p className="text-sm font-medium text-white">
                      Markets ({filteredMarkets.length})
                    </p>
                  </div>
                  <MarketList
                    markets={filteredMarkets}
                    handleMarketSelect={handleMarketSelect}
                  />
                </>
              )}
            </div>
          )}

          {/* Show Trending/Fresh/Top Gainers results - ONLY when NO search text */}
          {!searchText && parsedAssets && searchType !== SearchType.MyHoldings && !isLoading && (
            <div className="flex flex-col">
              <TokenList
                assets={parsedAssets}
                handleTokenSelect={handleTokenSelect}
                searchType={searchType}
              />
            </div>
          )}

          {/* Show My Holdings portfolio data (filtered by search if applicable) */}
          {searchType === SearchType.MyHoldings && (
            <div className="flex flex-col">
              <PortfolioTokenList
                walletPortfolioData={walletPortfolioData}
                handleTokenSelect={handleTokenSelect}
                isLoading={walletPortfolioLoading}
                isError={walletPortfolioError}
                searchText={searchText}
              />
            </div>
          )}
        </div>
      </div>

      {
        showChainOverlay && (
          <ChainOverlay
            ref={chainOverlayRef}
            chains={chains}
            setChains={setChains}
            overlayStyle={overlayStyle}
            setOverlayStyle={setOverlayStyle}
            setShowChainOverlay={setShowChainOverlay}
          />
        )
      }
    </div >
  );
}

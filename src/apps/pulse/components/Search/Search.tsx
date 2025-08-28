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
import SearchIcon from '../../assets/seach-icon.svg';
import { useTokenSearch } from '../../hooks/useTokenSearch';
import { SearchType, SelectedToken } from '../../types/tokens';
import { MobulaChainNames, getChainId } from '../../utils/constants';
import {
  Asset,
  parseFreshAndTrendingTokens,
  parseSearchData,
} from '../../utils/parseSearchData';
import Close from '../Misc/Close';
import Refresh from '../Misc/Refresh';
import ChainOverlay from './ChainOverlay';
import ChainSelectButton from './ChainSelect';
import PortfolioTokenList from './PortfolioTokenList';
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
  walletPortfolioError?: boolean;
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
  walletPortfolioError,
}: SearchProps) {
  const { searchText, setSearchText, searchData, isFetching } = useTokenSearch({
    isBuy,
    chains,
  });
  const [searchType, setSearchType] = useState<SearchType>();
  const [isLoading, setIsLoading] = useState(false);
  const [parsedAssets, setParsedAssets] = useState<Asset[]>();

  let list;
  if (searchData?.result.data) {
    list = parseSearchData(searchData?.result.data!, chains);
  }

  const inputRef = useRef<HTMLInputElement>(null);
  const [showChainOverlay, setShowChainOverlay] = useState(false);
  const chainButtonRef = useRef<HTMLDivElement>(null);
  const [overlayStyle, setOverlayStyle] = useState<React.CSSProperties>({});

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

    if (isAddress(tokenAddress || '')) {
      setSearchText(tokenAddress!);
    }

    // This auto-select MyHoldings filter when on sell screen
    if (!isBuy) {
      setSearchType(SearchType.MyHoldings);
    }
  }, [query, setSearchText, isBuy]);

  useEffect(() => {
    if (searchType) {
      setIsLoading(true);
      setParsedAssets(undefined);
      fetch(`${getUrl(searchType)}?chainIds=${getChainId(chains)}`)
        .then((response) => response.json())
        .then((result) => {
          const assets = parseFreshAndTrendingTokens(result.projection);
          setParsedAssets(assets);
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
          console.error(err);
        });
    }
  }, [searchType, chains]);

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

  const handleSearchTypeChange = (index: number) => {
    if (index === 0) setSearchType(SearchType.Trending);
    else if (index === 1) setSearchType(SearchType.Fresh);
    else if (index === 2) setSearchType(SearchType.TopGainers);
    else if (index === 3) setSearchType(SearchType.MyHoldings);
    setSearchText('');
  };

  const handleTokenSelect = (item: Asset | Token) => {
    if (isBuy) {
      // Asset type
      if ('chain' in item) {
        setBuyToken({
          name: item.name,
          symbol: item.symbol,
          logo: item.logo ?? '',
          usdValue: item.price
            ? item.price.toFixed(6)
            : Number.parseFloat('0').toFixed(6),
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
          usdValue: item.price
            ? item.price.toFixed(6)
            : Number.parseFloat('0').toFixed(6),
          dailyPriceChange: -0.02,
          chainId: chainNameToChainIdTokensData(item.blockchain),
          decimals: item.decimals,
          address: item.contract,
        });
      }
    } else {
      setSellToken({
        name: 'USDC',
        symbol: 'USDC',
        logo: 'https://coin-images.coingecko.com/coins/images/6319/large/usdc.png?1696506694',
        usdValue: '0.9998',
        dailyPriceChange: -0.02,
        chainId: 84532,
        decimals: 6,
        address: '0x4de0Bb9BA339b16bdc4ac845dedF65a00d63213A',
      });
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
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="flex flex-col w-full max-w-[446px] max-h-[500px] overflow-y-auto bg-[#1E1D24] p-3 border border-white/[0.05] rounded-2xl shadow-[0px_2px_15px_0px_rgba(18,17,22,0.5)]">
        <div className="flex w-full">
          <div className="flex items-center justify-center w-3/4 h-10 bg-[#121116] rounded-[10px] m-2.5 border-2 border-[#1E1D24]">
            <span className="ml-2.5">
              <img src={SearchIcon} alt="search-icon" />
            </span>
            <input
              ref={inputRef}
              type="text"
              className="flex-1 w-fit ml-4 font-normal text-xs text-gray-500"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                // Only clear search type if on buy screen AND not on My Holdings
                if (isBuy && searchType !== SearchType.MyHoldings) {
                  setSearchType(undefined);
                }
                setParsedAssets(undefined);
              }}
            />
            {(searchText.length > 0 && isFetching) || isLoading ? (
              <div className="mr-2.5">
                <TailSpin color="#FFFFFF" height={20} width={20} />
              </div>
            ) : (
              <Close onClose={handleClose} />
            )}
          </div>
          <div className="mt-2.5 w-10 h-10 bg-black rounded-[10px] p-0.5 pb-1 pl-0.5 pr-0.5">
            <Refresh />
          </div>
          <div
            ref={chainButtonRef}
            className="ml-1.5 mt-2.5 w-10 h-10 bg-black rounded-[10px] p-0.5 pb-1 pl-0.5 pr-0.5 relative cursor-pointer"
            onClick={() => {
              const rect = chainButtonRef?.current?.getBoundingClientRect();
              setShowChainOverlay(true);
              setOverlayStyle({
                ...overlayStyling,
                position: 'absolute',
                top: rect?.top ? rect.top + 44 : undefined,
                left: rect?.left ? rect.left : undefined,
              });
            }}
          >
            <ChainSelectButton />
          </div>
        </div>

        {/* Trending, Fresh, TopGainers, MyHoldings */}
        <div className="flex gap-1.5">
          {(isBuy
            ? ['🔥 Trending', '🌱 Fresh', '🚀 Top Gainers', '💰My Holdings']
            : ['💰My Holdings']
          ).map((item, index) => {
            // For sell screen, always map to MyHoldings index (3)
            const actualIndex = isBuy ? index : 3;
            return (
              <div
                key={item}
                className="flex bg-black w-[100px] h-10 rounded-[10px]"
                style={{ width: isBuy ? 100 : 200 }}
              >
                <button
                  className={`flex-1 items-center justify-center rounded-[6px] m-0.5 mb-1 ${
                    searchType && item.includes(searchType)
                      ? 'bg-[#2E2A4A]'
                      : 'bg-[#1E1D24]'
                  }`}
                  type="button"
                  onClick={() => {
                    handleSearchTypeChange(actualIndex);
                  }}
                >
                  <p
                    className={`text-xs font-normal text-center ${
                      searchType && item.includes(searchType)
                        ? 'text-white'
                        : 'text-white opacity-50'
                    }`}
                  >
                    {item}
                  </p>
                </button>
              </div>
            );
          })}
        </div>
        {!searchText &&
          parsedAssets === undefined &&
          searchType !== SearchType.MyHoldings && (
            <div className="flex items-center justify-center m-[50px]">
              <p className="text-gray-500">
                Search by token or paste address...
              </p>
            </div>
          )}

        {/* Show search results only when NOT on My Holdings */}
        {searchText && list?.assets && searchType !== SearchType.MyHoldings && (
          <div className="flex flex-col">
            <TokenList
              assets={list.assets}
              handleTokenSelect={handleTokenSelect}
              searchType={searchType}
            />
          </div>
        )}
        {parsedAssets && searchType !== SearchType.MyHoldings && (
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
      {showChainOverlay && (
        <ChainOverlay
          chains={chains}
          overlayStyle={overlayStyle}
          setChains={setChains}
          setOverlayStyle={setOverlayStyle}
          setShowChainOverlay={setShowChainOverlay}
        />
      )}
    </div>
  );
}

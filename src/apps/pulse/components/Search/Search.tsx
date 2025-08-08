/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import React, {
  useState,
  useRef,
  useEffect,
  Dispatch,
  SetStateAction,
} from 'react';
import { TailSpin } from 'react-loader-spinner';
import { useLocation, useNavigate } from 'react-router-dom';
import { isAddress } from 'viem';
import { useTokenSearch } from '../../hooks/useTokenSearch';
import Close from '../Misc/Close';
import {
  Asset,
  parseFreshAndTrendingTokens,
  parseSearchData,
} from '../../utils/parseSearchData';
import { chainNameToChainIdTokensData } from '../../../../services/tokensData';
import { SearchType, SelectedToken } from '../../types/tokens';
import Refresh from '../Misc/Refresh';
import ChainSelectButton from './ChainSelect';
import { getChainId, MobulaChainNames } from '../../utils/constants';
import ChainOverlay from './ChainOverlay';
import TokenList from './TokenList';
import { isTestnet } from '../../../../utils/blockchain';
import SearchIcon from '../../assets/seach-icon.svg';

interface SearchProps {
  setSearching: Dispatch<SetStateAction<boolean>>;
  isBuy: boolean;
  setBuyToken: Dispatch<SetStateAction<SelectedToken | null>>;
  setSellToken: Dispatch<SetStateAction<SelectedToken | null>>;
  chains: MobulaChainNames;
  setChains: Dispatch<SetStateAction<MobulaChainNames>>;
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

export default function Search(props: SearchProps) {
  const { setSearching, isBuy, setBuyToken, setSellToken, chains, setChains } =
    props;
  const { searchText, setSearchText, searchData, isFetching } = useTokenSearch({
    isBuy: true,
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
  }, [query, setSearchText]);

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

  const handleTokenSelect = (item: Asset) => {
    if (isBuy) {
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
    setSearching(false);
    removeQueryParams();
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{ backgroundColor: 'black' }}
    >
      <div className="flex flex-col w-full max-w-[446px] min-h-[204px] max-h-[706px] bg-[#121116] rounded-[10px] overflow-y-auto">
        <div className="flex w-full">
          <div
            className="flex items-center justify-center w-3/4"
            style={{
              border: '2px solid #1E1D24',
              height: 40,
              backgroundColor: '#121116',
              borderRadius: 10,
              margin: 10,
            }}
          >
            <span style={{ marginLeft: 10 }}>
              <img src={SearchIcon} alt="search-icon" />
            </span>
            <input
              ref={inputRef}
              type="text"
              className="flex-1 w-fit"
              style={{
                marginLeft: 15,
                fontWeight: 400,
                fontSize: 12,
                color: 'grey',
              }}
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setSearchType(undefined);
                setParsedAssets(undefined);
              }}
            />
            {(searchText.length > 0 && isFetching) || isLoading ? (
              <div style={{ marginRight: 10 }}>
                <TailSpin color="#FFFFFF" height={20} width={20} />
              </div>
            ) : (
              <Close onClose={handleClose} />
            )}
          </div>
          <div
            style={{
              marginTop: 10,
              width: 40,
              height: 40,
              backgroundColor: 'black',
              borderRadius: 10,
              padding: '2px 2px 4px 2px',
            }}
          >
            <Refresh />
          </div>
          <div
            ref={chainButtonRef}
            style={{
              marginLeft: 5,
              marginTop: 10,
              width: 40,
              height: 40,
              backgroundColor: 'black',
              borderRadius: 10,
              padding: '2px 2px 4px 2px',
              position: 'relative',
            }}
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
        <div className="flex">
          {['🔥 Trending', '🌱 Fresh', '🚀 Top Gainers', '💰My Holdings'].map(
            (item, index) => {
              return (
                <div
                  className="flex"
                  style={{
                    backgroundColor: 'black',
                    marginLeft: 10,
                    width: 100,
                    height: 40,
                    borderRadius: 10,
                  }}
                >
                  <button
                    className="flex-1 items-center justify-center"
                    style={{
                      backgroundColor:
                        searchType && item.includes(searchType)
                          ? '#2E2A4A'
                          : '#121116',
                      borderRadius: 10,
                      margin: 2,
                      marginBottom: 4,
                      color: 'grey',
                    }}
                    type="button"
                    onClick={() => {
                      handleSearchTypeChange(index);
                    }}
                  >
                    <p style={{ fontSize: 12 }}>{item}</p>
                  </button>
                </div>
              );
            }
          )}
        </div>
        {!searchText && parsedAssets === undefined && (
          <div
            className="flex items-center justify-center"
            style={{ margin: 50 }}
          >
            <p style={{ color: 'grey' }}>Search by token or paste address...</p>
          </div>
        )}
        {searchText && list?.assets && (
          <div className="flex flex-col">
            <TokenList
              assets={list.assets}
              handleTokenSelect={handleTokenSelect}
              searchType={searchType}
            />
          </div>
        )}
        {parsedAssets && (
          <div className="flex flex-col">
            <TokenList
              assets={parsedAssets}
              handleTokenSelect={handleTokenSelect}
              searchType={searchType}
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

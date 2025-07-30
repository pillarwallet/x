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
import { useTokenSearch } from '../hooks/useTokenSearch';
import Close from './Close';
import { Asset, parseSearchData } from '../utils/parseSearchData';
import { getLogoForChainId } from '../../../utils/blockchain';
import RandomAvatar from '../../pillarx-app/components/RandomAvatar/RandomAvatar';
import { chainNameToChainIdTokensData } from '../../../services/tokensData';
import { SelectedToken } from '../types/tokens';
import Refresh from './Refresh';
import ChainSelectButton from './ChainSelect';
import { MobulaChainNames } from '../utils/constants';
import {
  formatPriceChangeDisplay,
  formatTokenPriceDisplay,
} from '../utils/price';

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

  // eslint-disable-next-line no-console
  console.log('searchData:: ', searchData);

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
    // This keeps the path and removes everything after '?'
    navigate(location.pathname, { replace: true });
  };

  useEffect(() => {
    inputRef.current?.focus();
    const tokenAddress = query.get('asset');

    if (isAddress(tokenAddress || '')) {
      setSearchText(tokenAddress!);
    }
  }, [query, setSearchText]);

  const handleClose = () => {
    setSearchText('');
    setSearching(false);
    removeQueryParams();
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
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
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
              onChange={(e) => setSearchText(e.target.value)}
            />
            {searchText.length > 0 && isFetching ? (
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
            (item) => {
              return (
                <div
                  className="flex"
                  style={{
                    backgroundColor: 'black',
                    marginLeft: 10,
                    width: 95,
                    height: 30,
                    borderRadius: 10,
                  }}
                >
                  <button
                    className="flex-1 items-center justify-center"
                    style={{
                      backgroundColor: '#121116',
                      borderRadius: 10,
                      margin: 2,
                      color: 'grey',
                    }}
                    type="button"
                  >
                    <p style={{ fontSize: 12 }}>{item}</p>
                  </button>
                </div>
              );
            }
          )}
        </div>
        {!searchText && (
          <div
            className="flex items-center justify-center"
            style={{ margin: 50 }}
          >
            <p style={{ color: 'grey' }}>Search by token or paste address...</p>
          </div>
        )}
        {searchText && list?.assets && (
          <div className="flex flex-col">
            {list?.assets.map((item) => {
              return (
                <button
                  className="flex w-full"
                  style={{
                    height: 36,
                    marginTop: 10,
                    marginBottom: 10,
                  }}
                  onClick={() => {
                    handleTokenSelect(item);
                  }}
                  type="button"
                >
                  <div
                    style={{ position: 'relative', display: 'inline-block' }}
                  >
                    {item.logo ? (
                      <img
                        src={item.logo || ''}
                        style={{
                          width: 36,
                          height: 36,
                          marginLeft: 10,
                          borderRadius: 50,
                        }}
                        alt="token logo"
                      />
                    ) : (
                      <div
                        className="w-full h-full overflow-hidden rounded-full"
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 50,
                          marginLeft: 10,
                        }}
                      >
                        <RandomAvatar name={item.name || ''} />
                        <span
                          className="absolute inset-0 flex items-center justify-center text-white text-lg font-bold"
                          style={{ marginLeft: 10 }}
                        >
                          {item.name?.slice(0, 2)}
                        </span>
                      </div>
                    )}
                    <img
                      src={getLogoForChainId(
                        chainNameToChainIdTokensData(item.chain)
                      )}
                      style={{
                        position: 'absolute',
                        bottom: '-2px',
                        right: '-2px',
                        width: 15,
                        height: 15,
                        borderRadius: '50%',
                      }}
                      alt="chain logo"
                    />
                  </div>
                  <div
                    className="flex flex-col"
                    style={{ width: 200, height: 14, marginLeft: 10 }}
                  >
                    <div className="flex">
                      <p style={{ fontSize: 13, fontWeight: 400 }}>
                        {item.symbol}
                      </p>
                      <p
                        style={{
                          fontSize: 12,
                          fontWeight: 400,
                          marginLeft: 3,
                          color: 'grey',
                        }}
                      >
                        {item.name}
                      </p>
                    </div>
                    <div className="flex">
                      <p style={{ fontSize: 13, fontWeight: 400 }}>MCap:</p>
                      <p
                        style={{
                          fontSize: 13,
                          fontWeight: 400,
                          marginLeft: 3,
                          color: 'grey',
                        }}
                      >
                        {item.mCap ? (item.mCap / 10 ** 6).toFixed(3) : 0}M
                      </p>
                      <p
                        style={{ fontSize: 13, fontWeight: 400, marginLeft: 3 }}
                      >
                        Vol:
                      </p>
                      <p
                        style={{
                          fontSize: 13,
                          fontWeight: 400,
                          marginLeft: 3,
                          color: 'grey',
                        }}
                      >
                        {item.volume ? (item.volume / 10 ** 6).toFixed(3) : 0}M
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col ml-auto mr-2.5">
                    <div>{formatTokenPriceDisplay(item.price ?? 0)}</div>
                    <div className="ml-auto">
                      {formatPriceChangeDisplay(item.priceChange24h ?? 0)}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
      {/* Overlay for chain selection */}
      {showChainOverlay && (
        <>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: 200,
              height: 210,
              zIndex: 1999,
            }}
            onClick={() => {
              setShowChainOverlay(false);
              setOverlayStyle({});
            }}
          />
          <div style={overlayStyle} onClick={(e) => e.stopPropagation()}>
            <div
              style={{ padding: '12px 0', height: '100%', overflowY: 'auto' }}
            >
              {Object.values(MobulaChainNames).map((chain) => {
                const isSelected = chains === chain;
                const isAll = chain === MobulaChainNames.All;
                let logo = null;
                if (isAll) {
                  logo = (
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 24,
                        height: 24,
                      }}
                    >
                      {/* Inline SVG for globe */}
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.5">
                          <circle
                            opacity="0.3"
                            cx="9.99976"
                            cy="10"
                            r="9"
                            fill="white"
                          />
                          <path
                            d="M9.99992 19.0001C14.9706 19.0001 19.0001 14.9706 19.0001 9.99992C19.0001 5.02927 14.9706 0.999756 9.99992 0.999756C5.02927 0.999756 0.999756 5.02927 0.999756 9.99992C0.999756 14.9706 5.02927 19.0001 9.99992 19.0001Z"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M6.3999 1.89966H7.29992C5.54488 7.15575 5.54488 12.8439 7.29992 18.1H6.3999"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12.7 1.89966C14.455 7.15575 14.455 12.8439 12.7 18.1"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M1.90015 13.6V12.7C7.15624 14.455 12.8443 14.455 18.1004 12.7V13.6"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M1.90015 7.29992C7.15624 5.54488 12.8443 5.54488 18.1004 7.29992"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </g>
                      </svg>
                    </span>
                  );
                } else {
                  const chainId = chainNameToChainIdTokensData(chain);
                  logo = (
                    <img
                      src={getLogoForChainId(chainId)}
                      alt={chain}
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        background: '#23222A',
                      }}
                    />
                  );
                }
                return (
                  <div
                    key={chain}
                    onClick={() => {
                      setChains(chain);
                      setShowChainOverlay(false);
                      setOverlayStyle({});
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '10px 18px',
                      cursor: 'pointer',
                      background: isSelected ? '#29292F' : 'transparent',
                      color: isSelected ? '#fff' : '#b0b0b0',
                      fontWeight: isSelected ? 500 : 400,
                      fontSize: 16,
                      position: 'relative',
                    }}
                  >
                    {logo}
                    <span style={{ flex: 1, marginLeft: 10 }}>
                      {chain === MobulaChainNames.All ? 'All chains' : chain}
                    </span>
                    {isSelected && (
                      <div>
                        <svg
                          width="8"
                          height="6"
                          viewBox="0 0 8 6"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1 2.71429L3.13426 5L7 1"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

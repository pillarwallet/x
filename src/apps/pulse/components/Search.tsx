/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { Dispatch, SetStateAction, useEffect, useRef } from 'react';
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

export default function Search(props: {
  setSearching: Dispatch<SetStateAction<boolean>>;
  isBuy: boolean;
  setBuyToken: Dispatch<SetStateAction<SelectedToken | null>>;
  setSellToken: Dispatch<SetStateAction<SelectedToken | null>>;
}) {
  const { setSearching, isBuy, setBuyToken, setSellToken } = props;
  const { searchText, setSearchText, searchData, isFetching } = useTokenSearch({
    isBuy: true,
  });

  let list;
  if (searchData?.result.data) {
    list = parseSearchData(searchData?.result.data!);
  }

  const inputRef = useRef<HTMLInputElement>(null);

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
      className="flex flex-col items-center justify-center min-h-screen"
      style={{ backgroundColor: 'black' }}
    >
      <div className="flex flex-col w-full max-w-[446px] min-h-[204px] max-h-[706px] bg-[#121116] rounded-[10px] overflow-y-auto overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent">
        <div
          className="flex items-center justify-center"
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
                  className="flex"
                  style={{
                    width: 398,
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
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

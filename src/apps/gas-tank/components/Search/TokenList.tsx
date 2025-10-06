import { useState } from 'react';
import { Asset } from '../../utils/parseSearchData';
import RandomAvatar from '../../../pillarx-app/components/RandomAvatar/RandomAvatar';
import { getLogoForChainId } from '../../../../utils/blockchain';
import { chainNameToChainIdTokensData } from '../../../../services/tokensData';
import { SearchType, SortType } from '../../types/tokens';
import { formatBigNumber } from '../../utils/number';
import TokenPrice from '../Price/TokenPrice';
import TokenPriceChange from '../Price/TokenPriceChange';

export interface TokenListProps {
  assets: Asset[];
  handleTokenSelect: (item: Asset) => void;
  searchType?: SearchType;
}

export default function TokenList(props: TokenListProps) {
  const { assets, handleTokenSelect, searchType } = props;

  const [sort, setSort] = useState<{
    mCap?: SortType;
    volume?: SortType;
    price?: SortType;
    priceChange24h?: SortType;
  }>({});

  const handleSortChange = (
    key: 'mCap' | 'volume' | 'price' | 'priceChange24h'
  ) => {
    const sortType =
      // eslint-disable-next-line no-nested-ternary
      sort[key] === SortType.Down
        ? SortType.Up
        : sort[key] === SortType.Up
          ? SortType.Down
          : SortType.Up;

    assets.sort((a, b) => {
      if (sortType === SortType.Up) {
        return (b[key] || 0) - (a[key] || 0);
      }
      return (a[key] || 0) - (b[key] || 0);
    });

    setSort({
      mCap: undefined,
      price: undefined,
      priceChange24h: undefined,
      volume: undefined,
      [key]: sortType,
    });
  };

  if (assets) {
    return (
      <>
        {assets.map((item) => {
          return (
            <button
              key={item.contract || item.symbol}
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
              <div style={{ position: 'relative', display: 'inline-block' }}>
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
                style={{ width: 250, height: 14, marginLeft: 10 }}
              >
                <div className="flex">
                  <p style={{ fontSize: 13, fontWeight: 400 }}>{item.symbol}</p>
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
                  <p style={{ fontSize: 13, fontWeight: 400, color: 'grey' }}>
                    MCap:
                  </p>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 400,
                      marginLeft: 3,
                    }}
                  >
                    {formatBigNumber(item.mCap || 0)}
                  </p>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 400,
                      marginLeft: 3,
                      color: 'grey',
                    }}
                  >
                    Vol:
                  </p>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 400,
                      marginLeft: 3,
                    }}
                  >
                    {formatBigNumber(item.volume || 0)}
                  </p>
                </div>
              </div>
              <div className="flex flex-col ml-auto mr-2.5">
                <div>
                  <TokenPrice value={item.price || 0} />
                </div>
                <div className="ml-auto">
                  <TokenPriceChange value={item.priceChange24h || 0} />
                </div>
              </div>
            </button>
          );
        })}
      </>
    );
  }
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <></>;
}

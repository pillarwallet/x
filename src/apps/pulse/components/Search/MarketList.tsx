import React from 'react';
import { chainNameToChainIdTokensData } from '../../../../services/tokensData';
import { getLogoForChainId } from '../../../../utils/blockchain';
import RandomAvatar from '../../../pillarx-app/components/RandomAvatar/RandomAvatar';
import { formatBigNumber } from '../../utils/number';
import { Market } from '../../utils/parseSearchData';
import TokenPrice from '../Price/TokenPrice';
import TokenPriceChange from '../Price/TokenPriceChange';

export interface MarketListProps {
    markets: Market[];
    handleMarketSelect: (market: Market) => void;
    showLiquidityFilter?: boolean;
    minLiquidity?: number;
}

export default function MarketList(props: MarketListProps) {
    const { markets, handleMarketSelect } = props;

    if (!markets || markets.length === 0) {
        return null;
    }

    return (
        <>
            {markets.map((market) => {
                const chainId = chainNameToChainIdTokensData(market.blockchain);

                return (
                    <button
                        key={`${market.address}-${market.blockchain}`}
                        className="flex w-full"
                        style={{
                            height: 36,
                            marginTop: 10,
                            marginBottom: 10,
                        }}
                        onClick={() => {
                            handleMarketSelect(market);
                        }}
                        type="button"
                        data-testid={`pulse-market-${market.blockchain.toLowerCase()}-${market.pairName.toLowerCase()}`}
                    >
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                            {/* Token0 Logo */}
                            {market.token0.logo ? (
                                <img
                                    src={market.token0.logo || ''}
                                    style={{
                                        width: 36,
                                        height: 36,
                                        marginLeft: 10,
                                        borderRadius: 50,
                                    }}
                                    alt="token0 logo"
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
                                    <RandomAvatar name={market.token0.name || ''} />
                                    <span
                                        className="absolute inset-0 flex items-center justify-center text-white text-lg font-bold"
                                        style={{ marginLeft: 10 }}
                                    >
                                        {market.token0.symbol?.slice(0, 2)}
                                    </span>
                                </div>
                            )}
                            {/* Chain Logo */}
                            <img
                                src={getLogoForChainId(chainId)}
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
                                <p style={{ fontSize: 13, fontWeight: 400 }}>
                                    {market.pairName}
                                </p>
                                <p
                                    style={{
                                        fontSize: 12,
                                        fontWeight: 400,
                                        marginLeft: 3,
                                        color: 'grey',
                                    }}
                                >
                                    {market.exchange.name}
                                </p>
                            </div>
                            <div className="flex">
                                <p style={{ fontSize: 13, fontWeight: 400, color: 'grey' }}>
                                    Liq:
                                </p>
                                <p
                                    style={{
                                        fontSize: 13,
                                        fontWeight: 400,
                                        marginLeft: 3,
                                    }}
                                >
                                    {formatBigNumber(market.liquidity || 0)}
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
                                    {formatBigNumber(market.volume24h || 0)}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col ml-auto mr-2.5">
                            <div>
                                <p style={{ fontSize: 13, fontWeight: 400 }}>
                                    ${formatBigNumber(market.liquidity || 0)}
                                </p>
                            </div>
                            {market.priceChange24h !== null && (
                                <div className="ml-auto">
                                    <TokenPriceChange value={market.priceChange24h} />
                                </div>
                            )}
                        </div>
                    </button>
                );
            })}
        </>
    );
}

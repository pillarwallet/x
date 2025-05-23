/* eslint-disable no-nested-ternary */
import React, { useMemo } from 'react';
import { TbTriangleFilled } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';

// services
import { getTopNonPrimeAssetsAcrossChains } from '../../../../services/pillarXApiWalletPortfolio';

// types
import { PortfolioData } from '../../../../types/api';

// utils
import { getLogoForChainId } from '../../../../utils/blockchain';
import { limitDigitsNumber } from '../../../../utils/number';
import { PRIME_ASSETS_MOBULA } from '../../utils/constants';

// reducer
import { useAppSelector } from '../../hooks/useReducerHooks';

// components
import HighDecimalsFormatted from '../HighDecimalsFormatted/HighDecimalsFormatted';
import TokenLogoMarketDataRow from '../TokenMarketDataRow/TokenLogoMarketDataRow';
import Body from '../Typography/Body';

const TopTokens = () => {
  const navigate = useNavigate();
  const walletPortfolio = useAppSelector(
    (state) =>
      state.walletPortfolio.walletPortfolio as PortfolioData | undefined
  );
  const isWalletPortfolioLoading = useAppSelector(
    (state) => state.walletPortfolio.isWalletPortfolioLoading as boolean
  );
  const isWalletPortfolioErroring = useAppSelector(
    (state) => state.walletPortfolio.isWalletPortfolioErroring as boolean
  );
  const isTopTokenUnrealizedPnLLoading = useAppSelector(
    (state) => state.walletPortfolio.isTopTokenUnrealizedPnLLoading as boolean
  );
  const isTopTokenUnrealizedPnLErroring = useAppSelector(
    (state) => state.walletPortfolio.isTopTokenUnrealizedPnLErroring as boolean
  );

  const topTokens = useMemo(() => {
    if (!walletPortfolio) return undefined;

    return getTopNonPrimeAssetsAcrossChains(
      walletPortfolio,
      PRIME_ASSETS_MOBULA
    );
  }, [walletPortfolio]);

  const isTopTokensEmpty = !topTokens || topTokens.length === 0;
  const isLoading =
    (isWalletPortfolioLoading || isTopTokenUnrealizedPnLLoading) &&
    !isWalletPortfolioErroring &&
    !isTopTokenUnrealizedPnLErroring;

  const isError =
    (isWalletPortfolioErroring || isTopTokenUnrealizedPnLErroring) &&
    (!isWalletPortfolioLoading || !isTopTokenUnrealizedPnLLoading);

  const showEmptyState =
    !isWalletPortfolioLoading &&
    !isTopTokenUnrealizedPnLLoading &&
    !isWalletPortfolioErroring &&
    !isTopTokenUnrealizedPnLErroring &&
    isTopTokensEmpty;

  if (isLoading) {
    return (
      <div className="container mx-auto">
        <div className="desktop:hidden tablet:flex mobile:flex text-base font-medium text-white">
          Top Tokens
        </div>
        <div className="flex w-full h-[180px] rounded-[10px] animate-pulse bg-white/[.5]" />
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      {!isTopTokensEmpty ? (
        <>
          <div className="desktop:hidden tablet:flex mobile:flex text-base font-medium text-white">
            Top Tokens
          </div>
          <div className="grid desktop:grid-cols-[2fr_1fr_1fr] grid-cols-2 gap-3">
            {/* Header Row */}
            <div className="tablet:hidden mobile:hidden desktop:flex text-base font-medium text-white">
              Top Tokens
            </div>
            <div className="tablet:hidden mobile:hidden desktop:flextext-[13px] font-normal text-white/[.5] text-end">
              Balance
            </div>
            <div className="desktop:hidden tablet:flex mobile:flex text-[13px] font-normal text-white/[.5]">
              Token / $ / Balance
            </div>
            <div className="text-[13px] font-normal text-white/[.5] text-end">
              Unrealized PnL/%
            </div>

            {topTokens?.map((token, index) => (
              <React.Fragment key={`${token.asset.symbol}-${index}`}>
                <div
                  key={index}
                  className="flex items-center flex-1 min-w-0 overflow-hidden cursor-pointer"
                  onClick={() =>
                    navigate(
                      `/token-atlas?${`&asset=${token.contract.address}`}&blockchain=${parseInt(token.contract.chainId.split(':')[1], 10)}`
                    )
                  }
                >
                  <TokenLogoMarketDataRow
                    tokenLogo={token.asset.logo}
                    chainLogo={getLogoForChainId(
                      parseInt(token.contract.chainId.split(':')[1], 10)
                    )}
                    tokenName={token.asset.name || token.asset.symbol}
                    size="w-9 h-9"
                    chainLogoSize="w-[14px] h-[14px]"
                  />
                  <div className="flex flex-col ml-1.5 h-full justify-between min-w-0 overflow-hidden">
                    <div className="flex gap-1 items-center">
                      <p className="font-normal text-white text-[13px] truncate whitespace-nowrap overflow-hidden min-w-[30px]">
                        {token.asset.symbol}
                      </p>
                      <div className="whitespace-nowrap overflow-hidden max-w-full">
                        <p className="font-normal text-white/[.5] text-[13px] truncate">
                          {token.asset.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex w-full gap-2">
                      <p className="tablet:hidden mobile:hidden desktop:flex font-normal text-white text-[13px]">
                        ${limitDigitsNumber(token.price)}
                      </p>
                      <p className="desktop:hidden tablet:flex mobile:flex font-normal text-white text-[13px]">
                        ${limitDigitsNumber(token.usdBalance)}
                      </p>
                      <p className="desktop:hidden tablet:flex mobile:flex font-normal text-white/[.5] text-[13px]">
                        {limitDigitsNumber(token.tokenBalance)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="tablet:hidden mobile:hidden desktop:flex flex-col items-end">
                  <p className="font-normal text-white text-[13px]">
                    ${limitDigitsNumber(token.usdBalance)}
                  </p>
                  <p className="font-normal text-white/[.5] text-[13px]">
                    {limitDigitsNumber(token.tokenBalance)}
                  </p>
                </div>

                <div className="flex flex-col items-end">
                  <HighDecimalsFormatted
                    value={limitDigitsNumber(Math.abs(token.unrealizedPnLUsd))}
                    moneySymbol="$"
                    styleNumber={`font-normal text-[13px] ${token.unrealizedPnLUsd > 0 && 'text-market_row_green'} ${token.unrealizedPnLUsd < 0 && 'text-percentage_red'} ${(!token.unrealizedPnLUsd || token.unrealizedPnLUsd === 0 || !token) && 'text-white'}`}
                    styleZeros="desktop:text-xs tablet:text-xs mobile:text-[10px]"
                  />
                  <div
                    className={`flex gap-1 items-center ${token.unrealizedPnLPercentage > 0 && 'text-market_row_green'} ${token.unrealizedPnLPercentage < 0 && 'text-percentage_red'} ${(!token.unrealizedPnLPercentage || token.unrealizedPnLPercentage === 0 || !token) && 'text-white'}`}
                  >
                    {!token ||
                    !token.unrealizedPnLPercentage ||
                    token.unrealizedPnLPercentage === 0 ? null : (
                      <TbTriangleFilled
                        size={6}
                        color={
                          token.unrealizedPnLPercentage > 0
                            ? '#5CFF93'
                            : '#FF366C'
                        }
                        style={{
                          transform:
                            token.unrealizedPnLPercentage < 0
                              ? 'rotate(180deg)'
                              : 'none',
                        }}
                      />
                    )}
                    <p className="font-normal text-[13px]">
                      {Math.abs(token.unrealizedPnLPercentage).toFixed(2)}%
                    </p>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col">
          {isWalletPortfolioLoading || isTopTokenUnrealizedPnLLoading ? null : (
            <div className="text-base font-medium text-white">Top Tokens</div>
          )}
          <div className="flex items-center justify-center w-full h-[200px]">
            {isError ? (
              <div className="flex flex-col items-center justify-center gap-2">
                {isWalletPortfolioErroring && (
                  <Body className="italic text-percentage_red font-normal">
                    Failed to load wallet portfolio.
                  </Body>
                )}
                {isTopTokenUnrealizedPnLErroring && (
                  <Body className="italic text-percentage_red font-normal">
                    Failed to load unrealized PnL.
                  </Body>
                )}
                <Body className="italic text-percentage_red font-normal">
                  Please check your internet connection and reload the page.
                </Body>
              </div>
            ) : showEmptyState ? (
              <Body className="italic text-white/[.5] font-normal">
                No tokens yet
              </Body>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default TopTokens;

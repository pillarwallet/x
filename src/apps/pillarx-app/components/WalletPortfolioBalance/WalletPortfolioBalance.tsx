import { useCallback, useMemo } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { TbTriangleFilled, TbFingerprint, TbCheck } from 'react-icons/tb';
import { toast } from 'sonner';

// types
import { PortfolioData, WalletHistory } from '../../../../types/api';

// utils

// reducer
import { useAppDispatch, useAppSelector } from '../../hooks/useReducerHooks';
import { setIsRefreshAll } from '../../reducer/WalletPortfolioSlice';

// images
import RefreshIcon from '../../images/refresh-button.png';

// components
import AccountSelector from '../AccountSelector/AccountSelector';
import SkeletonLoader from '../../../../components/SkeletonLoader';
import Body from '../Typography/Body';
import BodySmall from '../Typography/BodySmall';

const WalletPortfolioBalance = () => {
  const { user, linkPasskey } = usePrivy();
  const dispatch = useAppDispatch();
  const walletPortfolio = useAppSelector(
    (state) =>
      state.walletPortfolio.walletPortfolio as PortfolioData | undefined
  );
  const topTokenUnrealizedPnL = useAppSelector(
    (state) =>
      state.walletPortfolio.topTokenUnrealizedPnL as WalletHistory | undefined
  );
  const isWalletPortfolioLoading = useAppSelector(
    (state) => state.walletPortfolio.isWalletPortfolioLoading as boolean
  );
  const isWalletPortfolioWithPnlLoading = useAppSelector(
    (state) => state.walletPortfolio.isWalletPortfolioWithPnlLoading as boolean
  );
  const isWalletHistoryGraphLoading = useAppSelector(
    (state) => state.walletPortfolio.isWalletHistoryGraphLoading as boolean
  );
  const isTopTokenUnrealizedPnLLoading = useAppSelector(
    (state) => state.walletPortfolio.isTopTokenUnrealizedPnLLoading as boolean
  );

  const isAnyDataFetching =
    isWalletPortfolioLoading ||
    isWalletPortfolioWithPnlLoading ||
    isWalletHistoryGraphLoading ||
    isTopTokenUnrealizedPnLLoading;

  const balanceChange = useMemo(() => {
    if (!topTokenUnrealizedPnL) return undefined;

    const sorted = [...topTokenUnrealizedPnL.balance_history].sort(
      (a, b) => a[0] - b[0]
    );
    const first = sorted[0][1];
    const last = sorted[sorted.length - 1][1];
    const usdValue = last - first;
    const percentageValue = first !== 0 ? (usdValue / first) * 100 : 0;

    return { usdValue, percentageValue };
  }, [topTokenUnrealizedPnL]);

  const getUsdChangeText = useCallback(() => {
    if (
      !balanceChange ||
      !balanceChange.usdValue ||
      balanceChange.usdValue === 0
    )
      return '$0.00';
    const absValue = Math.abs(balanceChange.usdValue);

    return balanceChange.usdValue > 0
      ? `+$${absValue.toFixed(2)}`
      : `-$${absValue.toFixed(2)}`;
  }, [balanceChange]);

  return (
    <div className="flex w-full justify-between">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <AccountSelector />
          {user?.wallet?.connectorType === 'embedded' && (
            <div className="flex items-center ml-2">
              {user?.linkedAccounts?.find((a) => a.type === 'passkey') ? (
                <div
                  className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500/20"
                  title="Account secured with Passkey"
                >
                  <TbCheck size={14} className="text-green-500" />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    linkPasskey().catch((err) => {
                      console.error('Failed to link passkey:', err);
                      toast.error('Failed to create passkey');
                    });
                  }}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-purple_medium/20 hover:bg-purple_medium/30 transition-colors border border-purple_medium/30 group"
                >
                  <TbFingerprint
                    size={14}
                    className="text-purple_medium group-hover:text-purple_light"
                  />
                  <span className="text-xs text-purple_medium group-hover:text-purple_light font-medium">
                    Secure
                  </span>
                </button>
              )}
            </div>
          )}
        </div>
        {isWalletPortfolioLoading || !walletPortfolio ? (
          <SkeletonLoader $height="45px" $width="150px" $radius="10px" />
        ) : (
          <div className="flex flex-wrap gap-1.5 items-baseline">
            <p
              className={`text-[30px] font-semibold ${walletPortfolio.total_wallet_balance > 0 ? 'text-white' : 'text-white text-opacity-50'}`}
            >
              $
              {walletPortfolio.total_wallet_balance > 0
                ? walletPortfolio?.total_wallet_balance.toFixed(2)
                : '0.00'}
            </p>
            <div className="flex tablet:flex-wrap mobile:flex-wrap gap-1.5 items-center">
              {!balanceChange ? null : (
                <Body
                  className={`text-base font-normal ${balanceChange.usdValue > 0 && 'text-market_row_green'} ${balanceChange.usdValue < 0 && 'text-percentage_red'} ${getUsdChangeText() === '$0.00' && 'text-white text-opacity-50'} ${balanceChange.usdValue === 0 && 'text-white text-opacity-50 bg-white/[.1]'}`}
                >
                  {getUsdChangeText()}
                </Body>
              )}
              {!balanceChange ? null : (
                <div
                  className={`flex gap-1 items-center px-1 rounded ${balanceChange.percentageValue > 0 && 'text-market_row_green bg-market_row_green/[.1]'} ${balanceChange.percentageValue < 0 && 'text-percentage_red bg-percentage_red/[.1]'} ${balanceChange.percentageValue === 0 && 'text-white text-opacity-50 bg-white/[.1]'}`}
                >
                  {balanceChange.percentageValue === 0 ? null : (
                    <TbTriangleFilled
                      size={6}
                      color={
                        balanceChange.percentageValue > 0
                          ? '#5CFF93'
                          : '#FF366C'
                      }
                      style={{
                        transform:
                          balanceChange.percentageValue < 0
                            ? 'rotate(180deg)'
                            : 'none',
                      }}
                    />
                  )}

                  <BodySmall className="font-normal">
                    {balanceChange.percentageValue !== 0
                      ? Math.abs(balanceChange.percentageValue).toFixed(2)
                      : '0.00'}
                    %
                  </BodySmall>
                </div>
              )}
              {!balanceChange ? null : (
                <BodySmall
                  className={`font-normal px-1 rounded ${balanceChange.percentageValue === 0 ? 'text-white text-opacity-50 bg-white/[.1]' : 'text-purple_medium bg-purple_medium/[.1]'} `}
                >
                  24h
                </BodySmall>
              )}
            </div>
          </div>
        )}
      </div>
      <div
        className={`flex w-fit h-fit items-center justify-center rounded-[10px] border-x-2 border-t-2 border-b-4 border-[#121116] ${isAnyDataFetching ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
        onClick={() => {
          if (!isAnyDataFetching) {
            dispatch(setIsRefreshAll(true));
          }
        }}
      >
        <img src={RefreshIcon} alt="refresh-button" className="w-9 h-[34px]" />
      </div>
    </div>
  );
};

export default WalletPortfolioBalance;

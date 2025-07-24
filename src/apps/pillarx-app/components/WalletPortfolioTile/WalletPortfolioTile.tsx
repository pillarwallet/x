import { sub } from 'date-fns';
import { useEffect, useMemo } from 'react';

// services
import { useGetWalletHistoryQuery } from '../../../../services/pillarXApiWalletHistory';
import { useGetWalletPortfolioQuery } from '../../../../services/pillarXApiWalletPortfolio';

// types
import { TokenPriceGraphPeriod } from '../../../../types/api';

// utils
import { convertDateToUnixTimestamp } from '../../../../utils/common';
import {
  PeriodFilterBalance,
  getGraphResolutionBalance,
} from '../../utils/portfolio';

// hooks
import useTransactionKit from '../../../../hooks/useTransactionKit';
import { useDataFetchingState } from '../../hooks/useDataFetchingState';

// reducer
import { useAppDispatch, useAppSelector } from '../../hooks/useReducerHooks';
import {
  setIsRefreshAll,
  setIsTopTokenUnrealizedPnLErroring,
  setIsTopTokenUnrealizedPnLLoading,
  setIsWalletHistoryGraphErroring,
  setIsWalletHistoryGraphLoading,
  setIsWalletPortfolioErroring,
  setIsWalletPortfolioLoading,
  setIsWalletPortfolioWithPnlErroring,
  setIsWalletPortfolioWithPnlLoading,
  setTopTokenUnrealizedPnL,
  setWalletHistoryGraph,
  setWalletPortfolio,
  setWalletPortfolioWithPnl,
} from '../../reducer/WalletPortfolioSlice';

// components
import PrimeTokensBalance from '../PrimeTokensBalance/PrimeTokensBalance';
import TileContainer from '../TileContainer/TileContainer';
import TopTokens from '../TopTokens/TopTokens';
import WalletPortfolioBalance from '../WalletPortfolioBalance/WalletPortfolioBalance';
import WalletPortfolioButtons from '../WalletPortfolioButtons/WalletPortfolioButtons';
import WalletPortfolioGraph from '../WalletPortfolioGraph/WalletPortfolioGraph';

const WalletPortfolioTile = () => {
  const { walletAddress: accountAddress } = useTransactionKit();

  const dispatch = useAppDispatch();

  const priceGraphPeriod = useAppSelector(
    (state) => state.walletPortfolio.priceGraphPeriod as TokenPriceGraphPeriod
  );
  const periodFilter = useAppSelector(
    (state) => state.walletPortfolio.periodFilter as PeriodFilterBalance
  );
  const selectedBalanceOrPnl = useAppSelector(
    (state) => state.walletPortfolio.selectedBalanceOrPnl as 'balance' | 'pnl'
  );
  const isRefreshAll = useAppSelector(
    (state) => state.walletPortfolio.isRefreshAll as boolean
  );

  // Query parameters
  const topTokenUnrealizedPnLQueryArgs = useMemo(
    () => ({
      wallet: accountAddress || '',
      period: '1h',
      from: convertDateToUnixTimestamp(sub(new Date(), { days: 1 })),
    }),
    [accountAddress]
  );

  const walletHistoryDataQueryArgs = useMemo(
    () => ({
      wallet: accountAddress || '',
      period: getGraphResolutionBalance(periodFilter),
      from: priceGraphPeriod.from,
    }),
    [accountAddress, periodFilter, priceGraphPeriod.from]
  );

  const walletPortfolioWithPnlArgs = useMemo(
    () => ({
      wallet: accountAddress || '',
      isPnl: true,
    }),
    [accountAddress]
  );

  const shouldFetchPnl = !!accountAddress && selectedBalanceOrPnl === 'pnl';

  // API Queries
  const {
    data: walletPortfolioData,
    isLoading: isWalletPortfolioDataLoading,
    isFetching: isWalletPortfolioDataFetching,
    isSuccess: isWalletPortfolioDataSuccess,
    error: walletPortfolioDataError,
    refetch: refetchWalletPortfolioData,
  } = useGetWalletPortfolioQuery(
    { wallet: accountAddress || '', isPnl: false },
    { skip: !accountAddress }
  );

  const {
    data: walletPortfolioWithPnlData,
    isLoading: isWalletPortfolioDataWithPnlLoading,
    isFetching: isWalletPortfolioDataWithPnlFetching,
    isSuccess: isWalletPortfolioDataWithPnlSuccess,
    error: walletPortfolioDataWithPnlError,
    refetch: refetchWalletPortfolioWithPnlData,
  } = useGetWalletPortfolioQuery(walletPortfolioWithPnlArgs, {
    skip: !shouldFetchPnl,
  });

  const {
    data: walletHistoryData,
    isLoading: isWalletHistoryDataLoading,
    isFetching: isWalletHistoryDataFetching,
    isSuccess: isWalletHistoryDataSuccess,
    error: walletHistoryDataError,
    refetch: refetchWalletHistoryData,
  } = useGetWalletHistoryQuery(walletHistoryDataQueryArgs, {
    skip: !accountAddress,
  });

  const {
    data: topTokenUnrealizedPnLData,
    isLoading: isTopTokenUnrealizedPnLDataLoading,
    isFetching: isTopTokenUnrealizedPnLDataFetching,
    isSuccess: isTopTokenUnrealizedPnLDataSuccess,
    error: topTokenUnrealizedPnLDataError,
    refetch: refetchTopTokenUnrealizedPnLData,
  } = useGetWalletHistoryQuery(topTokenUnrealizedPnLQueryArgs, {
    skip: !accountAddress,
  });

  useDataFetchingState(
    walletPortfolioData?.result?.data,
    isWalletPortfolioDataLoading,
    isWalletPortfolioDataFetching,
    isWalletPortfolioDataSuccess,
    walletPortfolioDataError,
    setWalletPortfolio,
    setIsWalletPortfolioLoading,
    setIsWalletPortfolioErroring
  );

  useDataFetchingState(
    walletPortfolioWithPnlData?.result?.data,
    isWalletPortfolioDataWithPnlLoading,
    isWalletPortfolioDataWithPnlFetching,
    isWalletPortfolioDataWithPnlSuccess,
    walletPortfolioDataWithPnlError,
    setWalletPortfolioWithPnl,
    setIsWalletPortfolioWithPnlLoading,
    setIsWalletPortfolioWithPnlErroring
  );

  useDataFetchingState(
    walletHistoryData?.result?.data,
    isWalletHistoryDataLoading,
    isWalletHistoryDataFetching,
    isWalletHistoryDataSuccess,
    walletHistoryDataError,
    setWalletHistoryGraph,
    setIsWalletHistoryGraphLoading,
    setIsWalletHistoryGraphErroring
  );

  useDataFetchingState(
    topTokenUnrealizedPnLData?.result?.data,
    isTopTokenUnrealizedPnLDataLoading,
    isTopTokenUnrealizedPnLDataFetching,
    isTopTokenUnrealizedPnLDataSuccess,
    topTokenUnrealizedPnLDataError,
    setTopTokenUnrealizedPnL,
    setIsTopTokenUnrealizedPnLLoading,
    setIsTopTokenUnrealizedPnLErroring
  );

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (isRefreshAll) {
      // Only refetch if accountAddress exists
      if (accountAddress) {
        refetchWalletPortfolioData();
        refetchWalletHistoryData();
        refetchTopTokenUnrealizedPnLData();

        // Only refetch PnL data if it should be fetched
        if (shouldFetchPnl) {
          refetchWalletPortfolioWithPnlData();
        }
      }

      const timeout = setTimeout(() => {
        dispatch(setIsRefreshAll(false));
      }, 5000);

      return () => clearTimeout(timeout);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRefreshAll, accountAddress, shouldFetchPnl]);

  return (
    <TileContainer
      id="wallet-portfolio-tile"
      className="desktop:p-9 desktop:gap-9"
    >
      <div className="flex flex-col rounded-xl desktop:border-[1px] desktop:border-lighter_container_grey p-3.5 w-full desktop:gap-4 gap-3">
        <WalletPortfolioBalance />
        <div className="tablet:hidden mobile:hidden desktop:flex w-full">
          <WalletPortfolioButtons />
        </div>
        <PrimeTokensBalance />
        <div className="desktop:hidden mobile:flex tablet:flex rounded-xl w-full">
          <WalletPortfolioGraph />
        </div>
        <div className="desktop:hidden mobile:flex tablet:flex w-full">
          <WalletPortfolioButtons />
        </div>
        <TopTokens />
      </div>
      <div className="tablet:hidden mobile:hidden desktop:flex rounded-xl border-[1px] border-lighter_container_grey w-full">
        <WalletPortfolioGraph />
      </div>
    </TileContainer>
  );
};

export default WalletPortfolioTile;

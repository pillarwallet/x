import { sub } from 'date-fns';
import { useEffect } from 'react';

// utils
import { convertDateToUnixTimestamp } from '../../../../utils/common';
import { PeriodFilterBalance, PeriodFilterPnl } from '../../utils/portfolio';

// reducer
import { useAppDispatch, useAppSelector } from '../../hooks/useReducerHooks';
import {
  setPeriodFilter,
  setPeriodFilterPnl,
  setPriceGraphPeriod,
  setSelectedBalanceOrPnl,
} from '../../reducer/WalletPortfolioSlice';

// components
import BodySmall from '../Typography/BodySmall';
import BalancePnlGraph from './BalancePnlGraph';
import WalletPortfolioGraphButton from './WalletPortfolioGraphButton';

const WalletPortfolioGraph = () => {
  const dispatch = useAppDispatch();
  const periodFilter = useAppSelector(
    (state) => state.walletPortfolio.periodFilter as PeriodFilterBalance
  );
  const periodFilterPnl = useAppSelector(
    (state) => state.walletPortfolio.periodFilterPnl as PeriodFilterPnl
  );
  const selectedBalanceOrPnl = useAppSelector(
    (state) => state.walletPortfolio.selectedBalanceOrPnl as 'balance' | 'pnl'
  );

  const timeFilter =
    selectedBalanceOrPnl === 'balance'
      ? [
          { time: PeriodFilterBalance.HOUR, text: '1h' },
          { time: PeriodFilterBalance.DAY, text: '24h' },
          { time: PeriodFilterBalance.WEEK, text: '1w' },
          { time: PeriodFilterBalance.MONTH, text: '1mo' },
          { time: PeriodFilterBalance.HALF_YEAR, text: '6mo' },
        ]
      : [
          { time: PeriodFilterPnl.DAY, text: '24h' },
          { time: PeriodFilterPnl.WEEK, text: '1w' },
          { time: PeriodFilterPnl.MONTH, text: '1mo' },
          { time: PeriodFilterPnl.YEAR, text: '1y' },
        ];

  // The handleClickTimePeriod makes sure we select the right "from" Unix timestamp to today's Unix timestamp for the price history graph
  const handleClickTimePeriod = (
    filter: PeriodFilterBalance | PeriodFilterPnl
  ) => {
    if (selectedBalanceOrPnl === 'balance') {
      dispatch(setPeriodFilter(filter as PeriodFilterBalance));
      const now = new Date();
      let from;
      switch (filter) {
        case PeriodFilterBalance.HOUR:
          from = sub(now, { hours: 1 });
          break;
        case PeriodFilterBalance.DAY:
          from = sub(now, { days: 1 });
          break;
        case PeriodFilterBalance.WEEK:
          from = sub(now, { weeks: 1 });
          break;
        case PeriodFilterBalance.MONTH:
          from = sub(now, { months: 1 });
          break;
        case PeriodFilterBalance.HALF_YEAR:
          from = sub(now, { months: 6 });
          break;
        default:
          from = sub(now, { days: 1 });
          break;
      }
      dispatch(
        setPriceGraphPeriod({
          from: convertDateToUnixTimestamp(from),
          to: undefined,
        })
      );
    }

    if (selectedBalanceOrPnl === 'pnl') {
      dispatch(setPeriodFilterPnl(filter as PeriodFilterPnl));
    }
  };

  useEffect(() => {
    handleClickTimePeriod(PeriodFilterBalance.DAY);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col w-full">
      <div className="flex tablet:flex-col mobile:flex-col justify-between desktop:p-3.5">
        <div className="tablet:hidden mobile:hidden desktop:flex gap-1.5">
          <WalletPortfolioGraphButton
            onClick={() => dispatch(setSelectedBalanceOrPnl('balance'))}
            text="Balance"
            isActive={selectedBalanceOrPnl === 'balance'}
          />
          <WalletPortfolioGraphButton
            onClick={() => dispatch(setSelectedBalanceOrPnl('pnl'))}
            text="PnL"
            isActive={selectedBalanceOrPnl === 'pnl'}
          />
        </div>
        <div className="desktop:hidden tablet:flex mobile:flex w-full p-[2px] bg-[#121116] rounded-lg mb-3">
          <button
            type="button"
            className={`items-center justify-center w-full rounded-md p-[3px] ${selectedBalanceOrPnl === 'balance' ? 'bg-container_grey' : 'bg-[#121116]'}`}
            onClick={() => dispatch(setSelectedBalanceOrPnl('balance'))}
          >
            <BodySmall
              className={`font-normal ${selectedBalanceOrPnl === 'balance' ? 'text-white' : 'text-white/[.5]'}`}
            >
              Balance
            </BodySmall>
          </button>
          <button
            type="button"
            className={`items-center justify-center w-full rounded-md p-[3px] ${selectedBalanceOrPnl === 'pnl' ? 'bg-container_grey' : 'bg-[#121116]'}`}
            onClick={() => dispatch(setSelectedBalanceOrPnl('pnl'))}
          >
            <BodySmall
              className={`font-normal ${selectedBalanceOrPnl === 'pnl' ? 'text-white' : 'text-white/[.5]'}`}
            >
              PnL
            </BodySmall>
          </button>
        </div>
        <div className="flex gap-1.5">
          {timeFilter.map((filter, index) => (
            <WalletPortfolioGraphButton
              key={index}
              text={filter.text}
              isActive={
                selectedBalanceOrPnl === 'balance'
                  ? periodFilter === filter.time
                  : periodFilterPnl === filter.time
              }
              onClick={() => handleClickTimePeriod(filter.time)}
            />
          ))}
        </div>
      </div>
      <BalancePnlGraph />
    </div>
  );
};

export default WalletPortfolioGraph;

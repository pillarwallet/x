export enum PeriodFilterBalance {
  HOUR = 'HOUR',
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  HALF_YEAR = 'HALF_YEAR',
}

export enum PeriodFilterPnl {
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  YEAR = 'YEAR',
}

export const getGraphResolutionBalance = (
  filter: PeriodFilterBalance
): string => {
  switch (filter) {
    case PeriodFilterBalance.HOUR:
      // every 5 min
      return '5min';
    case PeriodFilterBalance.DAY:
      // every 5 min
      return '5min';
    case PeriodFilterBalance.WEEK:
      // every hour
      return '1h';
    case PeriodFilterBalance.MONTH:
      // every 6h
      return '6h';
    case PeriodFilterBalance.HALF_YEAR:
      // every day
      return '1d';
    default:
      return '1h';
  }
};

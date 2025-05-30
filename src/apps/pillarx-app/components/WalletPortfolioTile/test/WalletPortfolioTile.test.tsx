/* eslint-disable @typescript-eslint/no-explicit-any */
import * as transactionKit from '@etherspot/transaction-kit';
import { render, screen } from '@testing-library/react';

// servuces
import * as historyHooks from '../../../../../services/pillarXApiWalletHistory';
import * as apiHooks from '../../../../../services/pillarXApiWalletPortfolio';

// hooks
import * as fetchStateHook from '../../../hooks/useDataFetchingState';

// reducer
import * as reduxHooks from '../../../hooks/useReducerHooks';
import * as sliceActions from '../../../reducer/WalletPortfolioSlice';

// components
import WalletPortfolioTile from '../WalletPortfolioTile';

// Mock child components to isolate the tile itself
jest.mock('../../WalletPortfolioBalance/WalletPortfolioBalance', () => ({
  __esModule: true,
  default: function WalletPortfolioBalance() {
    return <div>WalletPortfolioBalance</div>;
  },
}));
jest.mock('../../WalletPortfolioButtons/WalletPortfolioButtons', () => ({
  __esModule: true,
  default: function WalletPortfolioButtons() {
    return <div>WalletPortfolioButtons</div>;
  },
}));
jest.mock('../../PrimeTokensBalance/PrimeTokensBalance', () => ({
  __esModule: true,
  default: function PrimeTokensBalance() {
    return <div>PrimeTokensBalance</div>;
  },
}));
jest.mock('../../WalletPortfolioGraph/WalletPortfolioGraph', () => ({
  __esModule: true,
  default: function WalletPortfolioGraph() {
    return <div>WalletPortfolioGraph</div>;
  },
}));
jest.mock('../../TopTokens/TopTokens', () => ({
  __esModule: true,
  default: function TopTokens() {
    return <div>TopTokens</div>;
  },
}));

describe('<WalletPortfolioTile />', () => {
  const dispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock Redux hooks
    jest.spyOn(reduxHooks, 'useAppDispatch').mockReturnValue(dispatch);
    jest
      .spyOn(reduxHooks, 'useAppSelector')
      .mockImplementation((selectorFn: any) =>
        selectorFn({
          walletPortfolio: {
            priceGraphPeriod: { from: 1111 },
            periodFilter: '24h',
            selectedBalanceOrPnl: 'balance',
            isRefreshAll: false,
          },
        })
      );

    jest.spyOn(transactionKit, 'useWalletAddress').mockReturnValue('0x1234');

    // Mock useDataFetchingState
    jest
      .spyOn(fetchStateHook, 'useDataFetchingState')
      .mockImplementation(() => {});

    // Mock queries
    jest
      .spyOn(apiHooks, 'useGetWalletPortfolioQuery')
      .mockImplementation((args: any) => {
        if (args.isPnl) {
          return {
            data: { result: { data: {} } },
            isLoading: false,
            isFetching: false,
            isSuccess: true,
            error: null,
            refetch: jest.fn(),
          };
        }
        return {
          data: { result: { data: {} } },
          isLoading: false,
          isFetching: false,
          isSuccess: true,
          error: null,
          refetch: jest.fn(),
        };
      });

    jest.spyOn(historyHooks, 'useGetWalletHistoryQuery').mockReturnValue({
      data: { result: { data: {} } },
      isLoading: false,
      isFetching: false,
      isSuccess: true,
      error: null,
      refetch: jest.fn(),
    });
  });

  it('renders correctly and matches snapshot', () => {
    const tree = render(<WalletPortfolioTile />);
    expect(tree).toMatchSnapshot();
  });

  it('renders all tile sections correctly', () => {
    render(<WalletPortfolioTile />);

    expect(screen.getByText('WalletPortfolioBalance')).toBeInTheDocument();
    expect(screen.getAllByText('WalletPortfolioButtons')).toHaveLength(2);
    expect(screen.getByText('PrimeTokensBalance')).toBeInTheDocument();
    expect(screen.getAllByText('WalletPortfolioGraph')).toHaveLength(2);
    expect(screen.getByText('TopTokens')).toBeInTheDocument();
  });

  it('skips rendering parts if no wallet address', () => {
    jest.spyOn(transactionKit, 'useWalletAddress').mockReturnValue(undefined);

    render(<WalletPortfolioTile />);

    expect(screen.getByText('WalletPortfolioBalance')).toBeInTheDocument();
  });

  it('triggers refetch on isRefreshAll true and dispatch reset after timeout', () => {
    jest.useFakeTimers();

    const refetchMock = jest.fn();
    jest
      .spyOn(reduxHooks, 'useAppSelector')
      .mockImplementation((selectorFn: any) =>
        selectorFn({
          walletPortfolio: {
            priceGraphPeriod: { from: 1111 },
            periodFilter: '24h',
            selectedBalanceOrPnl: 'pnl',
            isRefreshAll: true,
          },
        })
      );

    jest
      .spyOn(apiHooks, 'useGetWalletPortfolioQuery')
      .mockImplementation(() => {
        return {
          data: { result: { data: {} } },
          isLoading: false,
          isFetching: false,
          isSuccess: true,
          error: null,
          refetch: refetchMock,
        };
      });

    jest.spyOn(historyHooks, 'useGetWalletHistoryQuery').mockReturnValue({
      data: { result: { data: {} } },
      isLoading: false,
      isFetching: false,
      isSuccess: true,
      error: null,
      refetch: refetchMock,
    });

    render(<WalletPortfolioTile />);
    expect(refetchMock).toHaveBeenCalledTimes(4);

    jest.advanceTimersByTime(5000);
    expect(dispatch).toHaveBeenCalledWith(sliceActions.setIsRefreshAll(false));

    jest.useRealTimers();
  });
});

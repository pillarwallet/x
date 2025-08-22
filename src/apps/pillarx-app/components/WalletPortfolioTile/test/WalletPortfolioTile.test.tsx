/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react';
import { Mock, vi } from 'vitest';

// servuces
import * as historyHooks from '../../../../../services/pillarXApiWalletHistory';
import * as apiHooks from '../../../../../services/pillarXApiWalletPortfolio';

// hooks
import useTransactionKit from '../../../../../hooks/useTransactionKit';
import * as fetchStateHook from '../../../hooks/useDataFetchingState';

// reducer
import * as reduxHooks from '../../../hooks/useReducerHooks';
import * as sliceActions from '../../../reducer/WalletPortfolioSlice';

// components
import WalletPortfolioTile from '../WalletPortfolioTile';

// Mock child components to isolate the tile itself
vi.mock('../../WalletPortfolioBalance/WalletPortfolioBalance', () => ({
  __esModule: true,
  default: function WalletPortfolioBalance() {
    return <div>WalletPortfolioBalance</div>;
  },
}));
vi.mock('../../WalletPortfolioButtons/WalletPortfolioButtons', () => ({
  __esModule: true,
  default: function WalletPortfolioButtons() {
    return <div>WalletPortfolioButtons</div>;
  },
}));
vi.mock('../../PrimeTokensBalance/PrimeTokensBalance', () => ({
  __esModule: true,
  default: function PrimeTokensBalance() {
    return <div>PrimeTokensBalance</div>;
  },
}));
vi.mock('../../WalletPortfolioGraph/WalletPortfolioGraph', () => ({
  __esModule: true,
  default: function WalletPortfolioGraph() {
    return <div>WalletPortfolioGraph</div>;
  },
}));
vi.mock('../../TopTokens/TopTokens', () => ({
  __esModule: true,
  default: function TopTokens() {
    return <div>TopTokens</div>;
  },
}));

vi.mock('../../../../../hooks/useTransactionKit');

describe('<WalletPortfolioTile />', () => {
  const dispatch = vi.fn();
  const useTransactionKitMock = useTransactionKit as unknown as Mock;

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock Redux hooks
    vi.spyOn(reduxHooks, 'useAppDispatch').mockReturnValue(dispatch);
    vi.spyOn(reduxHooks, 'useAppSelector').mockImplementation(
      (selectorFn: any) =>
        selectorFn({
          walletPortfolio: {
            priceGraphPeriod: { from: 1111 },
            periodFilter: '24h',
            selectedBalanceOrPnl: 'balance',
            isRefreshAll: false,
          },
        })
    );

    useTransactionKitMock.mockReturnValue({
      walletAddress: '0x1234',
      kit: {},
    });

    // Mock useDataFetchingState
    vi.spyOn(fetchStateHook, 'useDataFetchingState').mockImplementation(
      () => {}
    );

    // Mock queries
    vi.spyOn(apiHooks, 'useGetWalletPortfolioQuery').mockImplementation(
      (args: any) => {
        if (args.isPnl) {
          return {
            data: { result: { data: {} } },
            isLoading: false,
            isFetching: false,
            isSuccess: true,
            error: null,
            refetch: vi.fn(),
          };
        }
        return {
          data: { result: { data: {} } },
          isLoading: false,
          isFetching: false,
          isSuccess: true,
          error: null,
          refetch: vi.fn(),
        };
      }
    );

    vi.spyOn(historyHooks, 'useGetWalletHistoryQuery').mockReturnValue({
      data: { result: { data: {} } },
      isLoading: false,
      isFetching: false,
      isSuccess: true,
      error: null,
      refetch: vi.fn(),
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
    useTransactionKitMock.mockReturnValue({
      walletAddress: undefined,
      kit: {},
    });

    render(<WalletPortfolioTile />);

    expect(screen.getByText('WalletPortfolioBalance')).toBeInTheDocument();
  });

  it('triggers refetch on isRefreshAll true and dispatch reset after timeout', () => {
    vi.useFakeTimers();

    const refetchMock = vi.fn();
    vi.spyOn(reduxHooks, 'useAppSelector').mockImplementation(
      (selectorFn: any) =>
        selectorFn({
          walletPortfolio: {
            priceGraphPeriod: { from: 1111 },
            periodFilter: '24h',
            selectedBalanceOrPnl: 'pnl',
            isRefreshAll: true,
          },
        })
    );

    vi.spyOn(apiHooks, 'useGetWalletPortfolioQuery').mockImplementation(() => {
      return {
        data: { result: { data: {} } },
        isLoading: false,
        isFetching: false,
        isSuccess: true,
        error: null,
        refetch: refetchMock,
      };
    });

    vi.spyOn(historyHooks, 'useGetWalletHistoryQuery').mockReturnValue({
      data: { result: { data: {} } },
      isLoading: false,
      isFetching: false,
      isSuccess: true,
      error: null,
      refetch: refetchMock,
    });

    render(<WalletPortfolioTile />);
    expect(refetchMock).toHaveBeenCalledTimes(4);

    vi.advanceTimersByTime(5000);
    expect(dispatch).toHaveBeenCalledWith(sliceActions.setIsRefreshAll(false));

    vi.useRealTimers();
  });
});

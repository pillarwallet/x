/* eslint-disable @typescript-eslint/no-explicit-any */
import { fireEvent, render, screen } from '@testing-library/react';

// reducer
import {
  useAppDispatch as useAppDispatchMock,
  useAppSelector as useAppSelectorMock,
} from '../../../hooks/useReducerHooks';
import { setIsRefreshAll } from '../../../reducer/WalletPortfolioSlice';

// components
import WalletPortfolioBalance from '../WalletPortfolioBalance';

jest.mock('../../../hooks/useReducerHooks');
jest.mock('../../../../../components/SkeletonLoader', () => ({
  __esModule: true,
  default: function SkeletonLoader() {
    return <div data-testid="skeleton-loader">Loading...</div>;
  },
}));
jest.mock('../../../images/refresh-button.png', () => 'refresh-icon.png');
jest.mock(
  '../../../images/wallet-portfolio-icon.png',
  () => 'wallet-portfolio-icon.png'
);

const mockDispatch = jest.fn();
(useAppDispatchMock as unknown as jest.Mock).mockReturnValue(mockDispatch);

describe('WalletPortfolioBalance', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const baseSelectorState = {
    walletPortfolio: {
      isWalletPortfolioLoading: false,
      isWalletPortfolioWithPnlLoading: false,
      isWalletHistoryGraphLoading: false,
      isTopTokenUnrealizedPnLLoading: false,
    },
  };

  const renderWithSelector = ({
    walletPortfolio,
    topTokenUnrealizedPnL,
    overrides = {},
  }: {
    walletPortfolio?: any;
    topTokenUnrealizedPnL?: any;
    overrides?: Partial<(typeof baseSelectorState)['walletPortfolio']>;
  }) => {
    (useAppSelectorMock as unknown as jest.Mock).mockImplementation(
      (selectorFn) =>
        selectorFn({
          walletPortfolio: {
            walletPortfolio,
            topTokenUnrealizedPnL,
            ...baseSelectorState.walletPortfolio,
            ...overrides,
          },
        })
    );

    render(<WalletPortfolioBalance />);
  };

  it('renders correctly and matches snapshot', () => {
    const tree = render(<WalletPortfolioBalance />);
    expect(tree).toMatchSnapshot();
  });

  it('shows skeleton when loading', () => {
    renderWithSelector({
      walletPortfolio: undefined,
      overrides: { isWalletPortfolioLoading: true },
    });

    expect(screen.getByTestId('skeleton-loader')).toBeInTheDocument();
  });

  it('renders 0 balance when wallet is empty', () => {
    renderWithSelector({
      walletPortfolio: { total_wallet_balance: 0 },
      topTokenUnrealizedPnL: undefined,
    });

    expect(screen.getByText('$0.00')).toBeInTheDocument();
    expect(screen.getByAltText('wallet-portfolio-icon')).toBeInTheDocument();
  });

  it('renders balance with positive change', () => {
    renderWithSelector({
      walletPortfolio: { total_wallet_balance: 1000 },
      topTokenUnrealizedPnL: {
        balance_history: [
          [1, 500],
          [2, 1000],
        ],
      },
    });

    expect(screen.getByText('$1000.00')).toBeInTheDocument();
    expect(screen.getByText(/\+?\$500/)).toBeInTheDocument();
    expect(screen.getByText('100.00%')).toBeInTheDocument();
    expect(screen.getByText('24h')).toBeInTheDocument();
  });

  it('renders balance with negative change', () => {
    renderWithSelector({
      walletPortfolio: { total_wallet_balance: 1000 },
      topTokenUnrealizedPnL: {
        balance_history: [
          [1, 1000],
          [2, 500],
        ],
      },
    });

    expect(screen.getByText('-$500.00')).toBeInTheDocument();
    expect(screen.getByText('50.00%')).toBeInTheDocument();
  });

  it('renders balance with zero change', () => {
    renderWithSelector({
      walletPortfolio: { total_wallet_balance: 1000 },
      topTokenUnrealizedPnL: {
        balance_history: [
          [1, 1000],
          [2, 1000],
        ],
      },
    });

    expect(screen.queryByText(/\$500/)).not.toBeInTheDocument();
    expect(screen.queryByText(/100.00%/)).not.toBeInTheDocument();
    expect(screen.queryByText('0.00%')).toBeInTheDocument();
    expect(screen.getByText('24h')).toBeInTheDocument();
  });

  it('disables refresh button while loading data', () => {
    renderWithSelector({
      walletPortfolio: { total_wallet_balance: 1000 },
      overrides: {
        isWalletPortfolioLoading: true,
        isWalletPortfolioWithPnlLoading: true,
      },
    });

    const button = screen.getByAltText('refresh-button').parentElement;
    expect(button).toHaveClass('opacity-50');
    fireEvent.click(button!);
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('enables refresh button and dispatches action', () => {
    renderWithSelector({
      walletPortfolio: { total_wallet_balance: 1000 },
    });

    const button = screen.getByAltText('refresh-button').parentElement;
    expect(button).not.toHaveClass('opacity-50');
    fireEvent.click(button!);
    expect(mockDispatch).toHaveBeenCalledWith(setIsRefreshAll(true));
  });
});

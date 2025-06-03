import { fireEvent, render, screen } from '@testing-library/react';

// reducer
import {
  useAppDispatch as useAppDispatchMock,
  useAppSelector as useAppSelectorMock,
} from '../../../hooks/useReducerHooks';
import {
  setPeriodFilter,
  setPeriodFilterPnl,
  setSelectedBalanceOrPnl,
} from '../../../reducer/WalletPortfolioSlice';

// utils
import { PeriodFilterBalance, PeriodFilterPnl } from '../../../utils/portfolio';

// components
import WalletPortfolioGraph from '../WalletPortfolioGraph';

jest.mock('../../../hooks/useReducerHooks');
jest.mock('../../Typography/BodySmall', () => ({
  __esModule: true,
  default: function BodySmall({ children }: { children: React.ReactNode }) {
    return <div>{children}</div>;
  },
}));

jest.mock('../BalancePnlGraph', () => ({
  __esModule: true,
  default: function BalancePnlGraph() {
    return <div data-testid="balance-graph">Graph Component</div>;
  },
}));

jest.mock('../WalletPortfolioGraphButton', () => ({
  __esModule: true,
  default: function WalletPortfolioGraphButton({
    text,
    isActive,
    onClick,
  }: {
    text: string;
    isActive?: boolean;
    onClick: () => void;
  }) {
    return (
      // eslint-disable-next-line react/button-has-type
      <button data-testid={`btn-${text}`} onClick={onClick}>
        {text} {isActive && '✓'}
      </button>
    );
  },
}));

const mockDispatch = jest.fn();
(useAppDispatchMock as unknown as jest.Mock).mockReturnValue(mockDispatch);

describe('WalletPortfolioGraph', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithState = (selectedBalanceOrPnl: 'balance' | 'pnl') => {
    (useAppSelectorMock as unknown as jest.Mock).mockImplementation(
      (selectorFn) =>
        selectorFn({
          walletPortfolio: {
            periodFilter: PeriodFilterBalance.WEEK,
            periodFilterPnl: PeriodFilterPnl.MONTH,
            selectedBalanceOrPnl,
          },
        })
    );
    render(<WalletPortfolioGraph />);
  };

  it('renders correctly and matches snapshot', () => {
    const tree = render(<WalletPortfolioGraph />);
    expect(tree).toMatchSnapshot();
  });

  it('dispatches default DAY filter on mount', () => {
    renderWithState('balance');

    expect(mockDispatch).toHaveBeenCalledWith(
      setPeriodFilter(PeriodFilterBalance.DAY)
    );
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'walletPortfolio/setPriceGraphPeriod',
      })
    );
  });

  it('renders balance time filters and Balance✓ is active', () => {
    renderWithState('balance');

    expect(screen.getByTestId('btn-1h')).toBeInTheDocument();
    expect(screen.getByTestId('btn-1mo')).toBeInTheDocument();
    expect(screen.getByTestId('btn-1w')).toBeInTheDocument();
    expect(screen.getByTestId('btn-6mo')).toBeInTheDocument();

    expect(screen.getByTestId('btn-Balance')).toHaveTextContent('Balance ✓');
    expect(screen.getByTestId('btn-PnL')).toHaveTextContent('PnL');
  });

  it('renders pnl time filters and PnL✓ is active', () => {
    renderWithState('pnl');

    expect(screen.getByTestId('btn-24h')).toBeInTheDocument();
    expect(screen.getByTestId('btn-1y')).toBeInTheDocument();

    expect(screen.getByTestId('btn-PnL')).toHaveTextContent('PnL ✓');
    expect(screen.getByTestId('btn-Balance')).toHaveTextContent('Balance');
  });

  it('clicking balance period filter dispatches correct actions', () => {
    renderWithState('balance');

    fireEvent.click(screen.getByTestId('btn-1w'));
    expect(mockDispatch).toHaveBeenCalledWith(
      setPeriodFilter(PeriodFilterBalance.WEEK)
    );
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'walletPortfolio/setPriceGraphPeriod',
      })
    );
  });

  it('clicking pnl period filter dispatches only setPeriodFilterPnl', () => {
    renderWithState('pnl');

    fireEvent.click(screen.getByTestId('btn-1mo'));
    expect(mockDispatch).toHaveBeenCalledWith(
      setPeriodFilterPnl(PeriodFilterPnl.MONTH)
    );
  });

  it('clicking PnL/Bal toggle updates selectedBalanceOrPnl', () => {
    renderWithState('balance');

    fireEvent.click(screen.getByTestId('btn-PnL'));
    expect(mockDispatch).toHaveBeenCalledWith(setSelectedBalanceOrPnl('pnl'));

    fireEvent.click(screen.getByTestId('btn-Balance'));
    expect(mockDispatch).toHaveBeenCalledWith(
      setSelectedBalanceOrPnl('balance')
    );
  });

  it('renders the BalancePnlGraph component', () => {
    renderWithState('balance');
    expect(screen.getByTestId('balance-graph')).toBeInTheDocument();
  });
});

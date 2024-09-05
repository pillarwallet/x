import { render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';

// types
import { WalletData } from '../../../../../types/api';

// components
import PortfolioOverview from '../PortfolioOverview';

const mockData: WalletData = {
  data: {
    wallet: 'wallet_address',
    wallets: [''],
    total_wallet_balance: 1000,
    assets: [],
    total_realized_pnl: 53,
    total_unrealized_pnl: 12,
    total_pnl_history: { '24h': { realized: 100, unrealized: 200 } },
  },
};

const mockNoData: WalletData = {
  data: {
    wallet: undefined,
    wallets: [''],
    total_wallet_balance: undefined,
    assets: [],
    total_realized_pnl: undefined,
    total_unrealized_pnl: undefined,
    total_pnl_history: undefined,
  },
};

const mockLoading = false;

describe('<PortfolioOverview />', () => {
  it('renders correctly and matches snapshot', () => {
    const tree = renderer
      .create(<PortfolioOverview data={mockData} isDataLoading={mockLoading} />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('displays loading skeleton when data is loading', () => {
    const tree = renderer
      .create(<PortfolioOverview data={undefined} isDataLoading />)
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders data correctly when not loading', () => {
    render(<PortfolioOverview data={mockData} isDataLoading={false} />);

    expect(screen.getByText('$1000.00')).toBeInTheDocument();
    expect(screen.getByText('30.00%')).toBeInTheDocument();
    expect(screen.queryByText('tokens')).not.toBeInTheDocument();
    expect(screen.queryByText('chains')).not.toBeInTheDocument();
    expect(screen.queryByTestId('tokens-list')).not.toBeInTheDocument();
  });

  it('calculates percentage change correctly', () => {
    render(<PortfolioOverview data={mockData} isDataLoading={false} />);

    const percentageChange = (300 / 1000) * 100;
    expect(
      screen.getByText(`${percentageChange.toFixed(2)}%`)
    ).toBeInTheDocument();
  });

  it('handles no data state correctly', () => {
    render(<PortfolioOverview data={mockNoData} isDataLoading={false} />);

    expect(screen.getByText('$0')).toBeInTheDocument();
    expect(screen.queryByText('tokens')).not.toBeInTheDocument();
    expect(screen.queryByText('chains')).not.toBeInTheDocument();
  });
});

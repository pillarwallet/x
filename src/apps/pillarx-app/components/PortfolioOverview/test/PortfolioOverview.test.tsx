import { render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';

// types
import { WalletData } from '../../../../../types/api';

// components
import BottomMenuModalProvider from '../../../../../providers/BottomMenuModalProvider';
import GlobalTransactionsBatchProvider from '../../../../../providers/GlobalTransactionsBatchProvider';
import { WalletConnectToastProvider } from '../../../../../providers/WalletConnectToastProvider';
import PortfolioOverview from '../PortfolioOverview';

const mockData: WalletData = {
  data: {
    wallet: 'wallet_address',
    wallets: [''],
    total_wallet_balance: 1000,
    assets: [],
    total_realized_pnl: 53,
    total_unrealized_pnl: 12,
    total_pnl_history: {
      '24h': { realized: 100, unrealized: 200, percentage_change: 1.0 },
    },
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
      .create(
        <BottomMenuModalProvider>
          <GlobalTransactionsBatchProvider>
            <WalletConnectToastProvider>
              <PortfolioOverview data={mockData} isDataLoading={mockLoading} />
            </WalletConnectToastProvider>
          </GlobalTransactionsBatchProvider>
        </BottomMenuModalProvider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('displays loading skeleton when data is loading', () => {
    const tree = renderer
      .create(
        <BottomMenuModalProvider>
          <GlobalTransactionsBatchProvider>
            <WalletConnectToastProvider>
              <PortfolioOverview data={undefined} isDataLoading />
            </WalletConnectToastProvider>
          </GlobalTransactionsBatchProvider>
        </BottomMenuModalProvider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders data correctly when not loading', () => {
    render(
      <BottomMenuModalProvider>
        <GlobalTransactionsBatchProvider>
          <WalletConnectToastProvider>
            <PortfolioOverview data={mockData} isDataLoading={false} />
          </WalletConnectToastProvider>
        </GlobalTransactionsBatchProvider>
      </BottomMenuModalProvider>
    );

    expect(screen.getByText('$1000.00')).toBeInTheDocument();
    expect(screen.getByText('1.00%')).toBeInTheDocument();
    expect(screen.queryByText('tokens')).not.toBeInTheDocument();
    expect(screen.queryByText('chains')).not.toBeInTheDocument();
    expect(screen.queryByTestId('tokens-list')).not.toBeInTheDocument();
  });

  it('calculates percentage change correctly', () => {
    render(
      <BottomMenuModalProvider>
        <GlobalTransactionsBatchProvider>
          <WalletConnectToastProvider>
            <PortfolioOverview data={mockData} isDataLoading={false} />
          </WalletConnectToastProvider>
        </GlobalTransactionsBatchProvider>
      </BottomMenuModalProvider>
    );

    expect(
      screen.getByText(
        `${mockData.data.total_pnl_history?.['24h']?.percentage_change.toFixed(2)}%`
      )
    ).toBeInTheDocument();
  });

  it('handles no data state correctly', () => {
    render(
      <BottomMenuModalProvider>
        <GlobalTransactionsBatchProvider>
          <WalletConnectToastProvider>
            <PortfolioOverview data={mockNoData} isDataLoading={false} />
          </WalletConnectToastProvider>
        </GlobalTransactionsBatchProvider>
      </BottomMenuModalProvider>
    );

    expect(screen.getByText('$0')).toBeInTheDocument();
    expect(screen.queryByText('tokens')).not.toBeInTheDocument();
    expect(screen.queryByText('chains')).not.toBeInTheDocument();
  });
});

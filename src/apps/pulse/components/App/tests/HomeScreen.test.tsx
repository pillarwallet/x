/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { vi } from 'vitest';

// hooks
import useTransactionKit from '../../../../../hooks/useTransactionKit';

// providers
import BottomMenuModalProvider from '../../../../../providers/BottomMenuModalProvider';
import GlobalTransactionsBatchProvider from '../../../../../providers/GlobalTransactionsBatchProvider';

// servuces
import * as portfolioService from '../../../../../services/pillarXApiWalletPortfolio';

// components
import HomeScreen from '../HomeScreen';

// test utils
import { TestWrapper } from '../../../../../test-utils/testUtils';

// Mock dependencies
vi.mock('../../../../../hooks/useTransactionKit', () => ({
  default: vi.fn(),
}));

vi.mock('../../../../../services/pillarXApiWalletPortfolio', () => ({
  useGetWalletPortfolioQuery: vi.fn(),
}));

const mockProps = {
  setSearching: vi.fn(),
  setIsBuy: vi.fn(),
  isBuy: true,
  buyToken: null,
  sellToken: null,
  refetchWalletPortfolio: vi.fn(),
  setBuyToken: vi.fn(),
  chains: 'Ethereum',
  setChains: vi.fn(),
};

const renderWithProviders = (props = {}) => {
  return render(
    <TestWrapper>
      <GlobalTransactionsBatchProvider>
        <BottomMenuModalProvider>
          <HomeScreen {...mockProps} {...props} />
        </BottomMenuModalProvider>
      </GlobalTransactionsBatchProvider>
    </TestWrapper>
  );
};

describe('<HomeScreen />', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (useTransactionKit as any).mockReturnValue({
      walletAddress: '0x1234567890123456789012345678901234567890',
    });

    vi.spyOn(portfolioService, 'useGetWalletPortfolioQuery').mockReturnValue({
      data: {
        result: {
          data: {
            assets: [],
            total_wallet_balance: 0,
            wallets: [],
            balances_length: 0,
          },
        },
      },
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });
  });

  it('renders correctly and matches snapshot', () => {
    const tree = renderer
      .create(
        <TestWrapper>
          <GlobalTransactionsBatchProvider>
            <BottomMenuModalProvider>
              <HomeScreen {...mockProps} />
            </BottomMenuModalProvider>
          </GlobalTransactionsBatchProvider>
        </TestWrapper>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders main interface elements', () => {
    renderWithProviders();

    expect(screen.getByTestId('pulse-home-view')).toBeInTheDocument();
    expect(
      screen.getByText('Search by token or paste address')
    ).toBeInTheDocument();
    expect(screen.getByTestId('pulse-buy-toggle-button')).toBeInTheDocument();
    expect(screen.getByTestId('pulse-sell-toggle-button')).toBeInTheDocument();
    expect(screen.getByLabelText('Refresh')).toBeInTheDocument();
    expect(screen.getByLabelText('Settings')).toBeInTheDocument();

    // Ensure preview components are not shown initially (no preview state)
    expect(screen.queryByText('No offer was found')).not.toBeInTheDocument();
  });

  it('toggles between Buy and Sell components correctly', () => {
    const { rerender } = renderWithProviders({ isBuy: true });

    // Buy state - should show Buy component, hide Sell
    expect(screen.getByTestId('pulse-buy-component')).toBeInTheDocument();
    expect(
      screen.queryByTestId('pulse-sell-component')
    ).not.toBeInTheDocument();

    // Check button styles for Buy state
    expect(screen.getByTestId('pulse-buy-toggle-button')).toHaveStyle({
      backgroundColor: 'rgb(30, 29, 36)', // #1E1D24
    });
    expect(screen.getByTestId('pulse-sell-toggle-button')).toHaveStyle({
      backgroundColor: 'black',
      color: 'grey',
    });

    // Switch to Sell state
    rerender(
      <TestWrapper>
        <GlobalTransactionsBatchProvider>
          <BottomMenuModalProvider>
            <HomeScreen {...mockProps} isBuy={false} />
          </BottomMenuModalProvider>
        </GlobalTransactionsBatchProvider>
      </TestWrapper>
    );

    // Sell state - should show Sell component, hide Buy
    expect(screen.getByTestId('pulse-sell-component')).toBeInTheDocument();
    expect(screen.queryByTestId('pulse-buy-component')).not.toBeInTheDocument();

    // Check button styles for Sell state
    expect(screen.getByTestId('pulse-buy-toggle-button')).toHaveStyle({
      backgroundColor: 'black',
      color: 'grey',
    });
    expect(screen.getByTestId('pulse-sell-toggle-button')).toHaveStyle({
      backgroundColor: 'rgb(30, 29, 36)', // #1E1D24
    });
  });

  it('renders Buy component with correct props when isBuy is true', () => {
    const mockBuyToken = {
      name: 'Test Token',
      symbol: 'TEST',
      address: '0x1234567890123456789012345678901234567890',
    };

    renderWithProviders({ isBuy: true, buyToken: mockBuyToken });

    expect(screen.getByTestId('pulse-buy-component')).toBeInTheDocument();
    expect(
      screen.queryByTestId('pulse-sell-component')
    ).not.toBeInTheDocument();
    // Ensure no preview state is shown
    expect(screen.queryByText('No offer was found')).not.toBeInTheDocument();
  });

  it('renders Sell component with correct props when isBuy is false', () => {
    const mockSellToken = {
      name: 'Sell Token',
      symbol: 'SELL',
      address: '0x0987654321098765432109876543210987654321',
    };

    renderWithProviders({ isBuy: false, sellToken: mockSellToken });

    expect(screen.getByTestId('pulse-sell-component')).toBeInTheDocument();
    expect(screen.queryByTestId('pulse-buy-component')).not.toBeInTheDocument();
    // Ensure no preview state is shown
    expect(screen.queryByText('No offer was found')).not.toBeInTheDocument();
  });

  it('handles user interactions correctly', () => {
    renderWithProviders();

    // Test search button interaction
    screen
      .getByRole('button', {
        name: 'search-icon Search by token or paste address',
      })
      .click();
    expect(mockProps.setSearching).toHaveBeenCalledWith(true);

    // Test Buy button interaction
    screen.getByTestId('pulse-buy-toggle-button').click();
    expect(mockProps.setIsBuy).toHaveBeenCalledWith(true);

    // Test Sell button interaction
    screen.getByTestId('pulse-sell-toggle-button').click();
    expect(mockProps.setIsBuy).toHaveBeenCalledWith(false);
  });

  it('handles missing wallet address gracefully', () => {
    (useTransactionKit as any).mockReturnValue({ walletAddress: null });
    renderWithProviders();

    expect(screen.getByTestId('pulse-home-view')).toBeInTheDocument();
    expect(screen.getByTestId('pulse-buy-component')).toBeInTheDocument();
    expect(
      screen.queryByTestId('pulse-sell-component')
    ).not.toBeInTheDocument();
  });

  it('renders main interface when no preview state is active', () => {
    renderWithProviders();

    // Should show main interface elements
    expect(
      screen.getByText('Search by token or paste address')
    ).toBeInTheDocument();
    expect(screen.getByTestId('pulse-buy-toggle-button')).toBeInTheDocument();
    expect(screen.getByTestId('pulse-sell-toggle-button')).toBeInTheDocument();

    // Should not show preview-specific elements
    expect(screen.queryByText('No offer was found')).not.toBeInTheDocument();
    expect(screen.queryByText('Close')).not.toBeInTheDocument();
  });

  it('ensures proper component isolation between Buy and Sell modes', () => {
    // Test Buy mode
    const { rerender } = renderWithProviders({ isBuy: true });

    expect(screen.getByTestId('pulse-buy-component')).toBeInTheDocument();
    expect(
      screen.queryByTestId('pulse-sell-component')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('pulse-sell-token-selector')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('pulse-sell-amount-input')
    ).not.toBeInTheDocument();

    // Test Sell mode
    rerender(
      <TestWrapper>
        <GlobalTransactionsBatchProvider>
          <BottomMenuModalProvider>
            <HomeScreen {...mockProps} isBuy={false} />
          </BottomMenuModalProvider>
        </GlobalTransactionsBatchProvider>
      </TestWrapper>
    );

    expect(screen.getByTestId('pulse-sell-component')).toBeInTheDocument();
    expect(screen.queryByTestId('pulse-buy-component')).not.toBeInTheDocument();
    expect(screen.getByTestId('pulse-sell-token-selector')).toBeInTheDocument();
    expect(screen.getByTestId('pulse-sell-amount-input')).toBeInTheDocument();
  });
});

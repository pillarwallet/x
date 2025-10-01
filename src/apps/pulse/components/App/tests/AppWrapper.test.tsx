/* eslint-disable @typescript-eslint/no-explicit-any */
import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import { vi } from 'vitest';

// hooks
import useTransactionKit from '../../../../../hooks/useTransactionKit';

// services
import * as searchService from '../../../../../services/pillarXApiSearchTokens';
import * as portfolioService from '../../../../../services/pillarXApiWalletPortfolio';

// providers
import BottomMenuModalProvider from '../../../../../providers/BottomMenuModalProvider';
import GlobalTransactionsBatchProvider from '../../../../../providers/GlobalTransactionsBatchProvider';

// components
import AppWrapper from '../AppWrapper';

// Mock dependencies
vi.mock('../../../../../hooks/useTransactionKit', () => ({
  default: vi.fn(),
}));

vi.mock('../../../../../services/pillarXApiWalletPortfolio', () => ({
  useGetWalletPortfolioQuery: vi.fn(),
}));

vi.mock('../../../../../services/pillarXApiSearchTokens', () => ({
  useGetSearchTokensQuery: vi.fn(),
}));

const mockStore = configureStore({
  reducer: {},
});

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <Provider store={mockStore}>
      <GlobalTransactionsBatchProvider>
        <BottomMenuModalProvider>{component}</BottomMenuModalProvider>
      </GlobalTransactionsBatchProvider>
    </Provider>
  );
};

const defaultMocks = () => {
  (useTransactionKit as any).mockReturnValue({
    walletAddress: '0x1234567890123456789012345678901234567890',
  });

  (portfolioService.useGetWalletPortfolioQuery as any).mockReturnValue({
    data: {
      result: {
        data: {
          tokens: [],
          total_wallet_balance: 0,
        },
      },
    },
    isLoading: false,
    error: null,
    refetch: vi.fn(),
  });

  (searchService.useGetSearchTokensQuery as any).mockReturnValue({
    data: {
      result: {
        data: [],
      },
    },
    isLoading: false,
    isFetching: false,
    error: null,
  });
};

describe('<AppWrapper />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    defaultMocks();
  });

  it('renders correctly and matches snapshot', () => {
    const tree = renderer
      .create(
        <Provider store={mockStore}>
          <GlobalTransactionsBatchProvider>
            <BottomMenuModalProvider>
              <MemoryRouter initialEntries={['/']}>
                <AppWrapper />
              </MemoryRouter>
            </BottomMenuModalProvider>
          </GlobalTransactionsBatchProvider>
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  describe('renders HomeScreen by default', () => {
    it('when no asset parameter', () => {
      renderWithProviders(
        <MemoryRouter initialEntries={['/']}>
          <AppWrapper />
        </MemoryRouter>
      );

      expect(screen.getByTestId('pulse-home-view')).toBeInTheDocument();
      expect(screen.getByTestId('pulse-buy-toggle-button')).toBeInTheDocument();
      expect(
        screen.getByTestId('pulse-sell-toggle-button')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Search by token or paste address')
      ).toBeInTheDocument();
      expect(screen.queryByTestId('pulse-search-view')).not.toBeInTheDocument();
      expect(screen.queryByText('🔥 Trending')).not.toBeInTheDocument();
    });

    it('when asset parameter is invalid', () => {
      renderWithProviders(
        <MemoryRouter initialEntries={['/?asset=invalid-address']}>
          <AppWrapper />
        </MemoryRouter>
      );

      expect(screen.getByTestId('pulse-home-view')).toBeInTheDocument();
      expect(screen.getByTestId('pulse-buy-toggle-button')).toBeInTheDocument();
      expect(screen.queryByTestId('pulse-search-view')).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('pulse-search-input')
      ).not.toBeInTheDocument();
    });

    it('when asset parameter is empty', () => {
      renderWithProviders(
        <MemoryRouter initialEntries={['/?asset=']}>
          <AppWrapper />
        </MemoryRouter>
      );

      expect(screen.getByTestId('pulse-home-view')).toBeInTheDocument();
      expect(screen.getByTestId('pulse-buy-toggle-button')).toBeInTheDocument();
      expect(screen.queryByTestId('pulse-search-view')).not.toBeInTheDocument();
      expect(screen.queryByText('🌱 Fresh')).not.toBeInTheDocument();
    });

    it('when asset parameter is malformed', () => {
      renderWithProviders(
        <MemoryRouter initialEntries={['/?asset=%20invalid%20address%20']}>
          <AppWrapper />
        </MemoryRouter>
      );

      expect(screen.getByTestId('pulse-home-view')).toBeInTheDocument();
      expect(screen.queryByTestId('pulse-search-view')).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('pulse-search-modal')
      ).not.toBeInTheDocument();
    });
  });

  describe('renders Search component', () => {
    it('when valid asset parameter is present', () => {
      renderWithProviders(
        <MemoryRouter
          initialEntries={[
            '/?asset=0x1234567890123456789012345678901234567890',
          ]}
        >
          <AppWrapper />
        </MemoryRouter>
      );

      expect(screen.getByTestId('pulse-search-view')).toBeInTheDocument();
      expect(screen.getByTestId('pulse-search-modal')).toBeInTheDocument();
      expect(screen.getByTestId('pulse-search-input')).toBeInTheDocument();
      expect(
        screen.getByDisplayValue('0x1234567890123456789012345678901234567890')
      ).toBeInTheDocument();
      expect(screen.getByText('🔥 Trending')).toBeInTheDocument();
      expect(screen.getByText('🌱 Fresh')).toBeInTheDocument();
      expect(screen.queryByTestId('pulse-home-view')).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('pulse-buy-toggle-button')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText('Search by token or paste address')
      ).not.toBeInTheDocument();
    });

    it('with multiple query parameters', () => {
      renderWithProviders(
        <MemoryRouter
          initialEntries={[
            '/?asset=0x1234567890123456789012345678901234567890&chain=ethereum&amount=100',
          ]}
        >
          <AppWrapper />
        </MemoryRouter>
      );

      expect(screen.getByTestId('pulse-search-view')).toBeInTheDocument();
      expect(screen.queryByTestId('pulse-home-view')).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('pulse-buy-toggle-button')
      ).not.toBeInTheDocument();
    });
  });

  describe('handles wallet portfolio states', () => {
    it('loading state', () => {
      (portfolioService.useGetWalletPortfolioQuery as any).mockReturnValue({
        data: null,
        isLoading: true,
        error: null,
        refetch: vi.fn(),
      });

      renderWithProviders(
        <MemoryRouter initialEntries={['/']}>
          <AppWrapper />
        </MemoryRouter>
      );

      expect(screen.getByTestId('pulse-home-view')).toBeInTheDocument();
      expect(screen.queryByTestId('pulse-search-view')).not.toBeInTheDocument();
      expect(screen.queryByText('🔥 Trending')).not.toBeInTheDocument();
    });

    it('error state', () => {
      (portfolioService.useGetWalletPortfolioQuery as any).mockReturnValue({
        data: null,
        isLoading: false,
        error: new Error('Portfolio fetch failed'),
        refetch: vi.fn(),
      });

      renderWithProviders(
        <MemoryRouter initialEntries={['/']}>
          <AppWrapper />
        </MemoryRouter>
      );

      expect(screen.getByTestId('pulse-home-view')).toBeInTheDocument();
      expect(screen.queryByTestId('pulse-search-view')).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('pulse-search-modal')
      ).not.toBeInTheDocument();
    });
  });

  it('handles wallet address changes', () => {
    const { rerender } = renderWithProviders(
      <MemoryRouter initialEntries={['/']}>
        <AppWrapper />
      </MemoryRouter>
    );

    expect(screen.getByTestId('pulse-home-view')).toBeInTheDocument();
    expect(screen.queryByTestId('pulse-search-view')).not.toBeInTheDocument();
    expect(screen.queryByText('🔥 Trending')).not.toBeInTheDocument();

    (useTransactionKit as any).mockReturnValue({
      walletAddress: null,
    });

    rerender(
      <Provider store={mockStore}>
        <GlobalTransactionsBatchProvider>
          <BottomMenuModalProvider>
            <MemoryRouter initialEntries={['/']}>
              <AppWrapper />
            </MemoryRouter>
          </BottomMenuModalProvider>
        </GlobalTransactionsBatchProvider>
      </Provider>
    );

    expect(screen.getByTestId('pulse-home-view')).toBeInTheDocument();
    expect(screen.queryByTestId('pulse-search-view')).not.toBeInTheDocument();
    expect(screen.queryByTestId('pulse-search-modal')).not.toBeInTheDocument();
  });

  it('shows beta toast when Pulse app opens', () => {
    renderWithProviders(
      <MemoryRouter initialEntries={['/']}>
        <AppWrapper />
      </MemoryRouter>
    );

    expect(screen.getByText('Welcome to Pulse (beta)')).toBeInTheDocument();
  });

  it('allows closing the beta toast', async () => {
    renderWithProviders(
      <MemoryRouter initialEntries={['/']}>
        <AppWrapper />
      </MemoryRouter>
    );

    expect(screen.getByText('Welcome to Pulse (beta)')).toBeInTheDocument();

    // Close the toast
    const closeButton = screen.getByLabelText('Close');
    closeButton.click();

    // Wait for the animation to complete (300ms delay + some buffer)
    await new Promise((resolve) => {
      setTimeout(resolve, 400);
    });

    expect(
      screen.queryByText('Welcome to Pulse (beta)')
    ).not.toBeInTheDocument();
  });
});

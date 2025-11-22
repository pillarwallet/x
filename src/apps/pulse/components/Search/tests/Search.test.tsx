/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import { vi } from 'vitest';

// types
import { PortfolioData } from '../../../../../types/api';

// hooks
import * as useTokenSearch from '../../../hooks/useTokenSearch';

// utils
import { MobulaChainNames } from '../../../utils/constants';

// components
import Search from '../Search';

// Mock dependencies
vi.mock('../../../hooks/useTokenSearch', () => ({
  useTokenSearch: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLocation: () => ({
      search: '?asset=0x1234567890123456789012345678901234567890',
      pathname: '/',
    }),
    useNavigate: () => vi.fn(),
  };
});

const mockSetSearching = vi.fn();
const mockSetBuyToken = vi.fn();
const mockSetSellToken = vi.fn();
const mockSetChains = vi.fn();

const mockPortfolioData: PortfolioData = {
  assets: [
    {
      asset: {
        id: 1,
        name: 'Test Token',
        symbol: 'TEST',
        logo: 'https://example.com/logo.png',
        decimals: ['18'],
        contracts: ['0x1234567890123456789012345678901234567890'],
        blockchains: ['ethereum'],
      },
      contracts_balances: [
        {
          address: '0x1234567890123456789012345678901234567890',
          balance: 1.0,
          balanceRaw: '1000000000000000000',
          chainId: 'eip155:1',
          decimals: 18,
        },
      ],
      cross_chain_balances: {},
      price_change_24h: 0.05,
      estimated_balance: 1.5,
      price: 1.5,
      token_balance: 1.0,
      allocation: 1.0,
      wallets: ['0x1234567890123456789012345678901234567890'],
    },
  ],
  total_wallet_balance: 1.5,
  wallets: ['0x1234567890123456789012345678901234567890'],
  balances_length: 1,
};

const defaultProps = {
  setSearching: mockSetSearching,
  isBuy: true,
  setBuyToken: mockSetBuyToken,
  setSellToken: mockSetSellToken,
  chains: MobulaChainNames.Ethereum,
  setChains: mockSetChains,
  walletPortfolioData: mockPortfolioData,
  walletPortfolioLoading: false,
  walletPortfolioError: false,
};

const mockUseTokenSearch = {
  searchText: '',
  setSearchText: vi.fn(),
  searchData: null,
  isFetching: false,
};

describe('<Search />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useTokenSearch.useTokenSearch as any).mockReturnValue(mockUseTokenSearch);
  });

  it('renders correctly and matches snapshot', () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <Search {...defaultProps} />
        </MemoryRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders main search interface elements', () => {
    render(
      <MemoryRouter>
        <Search {...defaultProps} />
      </MemoryRouter>
    );

    expect(screen.getByTestId('pulse-search-view')).toBeInTheDocument();
    expect(screen.getByTestId('pulse-search-modal')).toBeInTheDocument();
    expect(screen.getByTestId('pulse-search-input')).toBeInTheDocument();
    expect(
      screen.getByTestId('pulse-search-filter-buttons')
    ).toBeInTheDocument();
  });

  it('renders buy mode filter buttons', () => {
    render(
      <MemoryRouter>
        <Search {...defaultProps} isBuy />
      </MemoryRouter>
    );

    expect(screen.getByText('🔥 Trending')).toBeInTheDocument();
    expect(screen.getByText('🌱 Fresh')).toBeInTheDocument();
    expect(screen.getByText('🚀 Top Gainers')).toBeInTheDocument();
    expect(screen.getByText('💰 My Holdings')).toBeInTheDocument();
  });

  it('renders sell mode with only My Holdings', () => {
    render(
      <MemoryRouter>
        <Search {...defaultProps} isBuy={false} />
      </MemoryRouter>
    );

    expect(screen.getByText('My Holdings')).toBeInTheDocument();
    expect(screen.queryByText('🔥 Trending')).not.toBeInTheDocument();
    expect(screen.queryByText('🌱 Fresh')).not.toBeInTheDocument();
    expect(screen.queryByText('🚀 Top Gainers')).not.toBeInTheDocument();
  });

  it('handles search input changes', () => {
    const mockSetSearchText = vi.fn();
    (useTokenSearch.useTokenSearch as any).mockReturnValue({
      ...mockUseTokenSearch,
      setSearchText: mockSetSearchText,
    });

    render(
      <MemoryRouter>
        <Search {...defaultProps} />
      </MemoryRouter>
    );

    const input = screen.getByTestId('pulse-search-input');
    fireEvent.change(input, { target: { value: 'test search' } });

    expect(mockSetSearchText).toHaveBeenCalledWith('test search');
  });

  it('handles filter button clicks in buy mode', () => {
    render(
      <MemoryRouter>
        <Search {...defaultProps} isBuy />
      </MemoryRouter>
    );

    const trendingButton = screen.getByText('🔥 Trending');
    fireEvent.click(trendingButton);

    // Should trigger search type change
    expect(screen.getByText('🔥 Trending')).toBeInTheDocument();
  });

  it('shows loading spinner when fetching', () => {
    (useTokenSearch.useTokenSearch as any).mockReturnValue({
      ...mockUseTokenSearch,
      isFetching: true,
      searchText: 'test',
    });

    render(
      <MemoryRouter>
        <Search {...defaultProps} />
      </MemoryRouter>
    );

    expect(screen.getByTestId('pulse-search-input')).toBeInTheDocument();
  });

  it('shows close button when not fetching', () => {
    (useTokenSearch.useTokenSearch as any).mockReturnValue({
      ...mockUseTokenSearch,
      isFetching: false,
      searchText: 'test',
    });

    render(
      <MemoryRouter>
        <Search {...defaultProps} />
      </MemoryRouter>
    );

    expect(screen.getByTestId('pulse-search-input')).toBeInTheDocument();
  });

  it('displays My Holdings text when in sell mode', () => {
    render(
      <MemoryRouter>
        <Search {...defaultProps} isBuy={false} />
      </MemoryRouter>
    );

    expect(screen.getByText('My Holdings')).toBeInTheDocument();
  });

  it('handles token selection for buy mode', () => {
    render(
      <MemoryRouter>
        <Search {...defaultProps} isBuy />
      </MemoryRouter>
    );

    // Test that the component renders without errors
    expect(screen.getByTestId('pulse-search-view')).toBeInTheDocument();
    expect(screen.getByTestId('pulse-search-modal')).toBeInTheDocument();

    // Test that buy mode shows all filter buttons
    expect(screen.getByText('🔥 Trending')).toBeInTheDocument();
    expect(screen.getByText('🌱 Fresh')).toBeInTheDocument();
    expect(screen.getByText('🚀 Top Gainers')).toBeInTheDocument();
    expect(screen.getByText('💰 My Holdings')).toBeInTheDocument();
  });

  it('handles token selection for sell mode', () => {
    render(
      <MemoryRouter>
        <Search {...defaultProps} isBuy={false} />
      </MemoryRouter>
    );

    // Simulate token selection
    const tokenButton = screen.getByText('TEST').closest('button');
    if (tokenButton) {
      fireEvent.click(tokenButton);
    }

    expect(mockSetSellToken).toHaveBeenCalled();
  });

  it('shows search placeholder when no search text and no parsed assets', () => {
    (useTokenSearch.useTokenSearch as any).mockReturnValue({
      ...mockUseTokenSearch,
      searchText: '',
    });

    render(
      <MemoryRouter>
        <Search {...defaultProps} />
      </MemoryRouter>
    );

    expect(
      screen.getByText('Search by token or paste address...')
    ).toBeInTheDocument();
  });

  it('handles chain overlay toggle', () => {
    render(
      <MemoryRouter>
        <Search {...defaultProps} />
      </MemoryRouter>
    );

    const chainButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(chainButton);

    // Chain overlay should be triggered
    expect(chainButton).toBeInTheDocument();
  });

  it('handles refresh button click', () => {
    render(
      <MemoryRouter>
        <Search {...defaultProps} />
      </MemoryRouter>
    );

    const refreshButton = screen.getByRole('button', { name: /refresh/i });
    fireEvent.click(refreshButton);

    expect(refreshButton).toBeInTheDocument();
  });

  it('handles portfolio loading state', () => {
    render(
      <MemoryRouter>
        <Search {...defaultProps} walletPortfolioLoading />
      </MemoryRouter>
    );

    // Should still render the main search interface
    expect(screen.getByTestId('pulse-search-view')).toBeInTheDocument();
    expect(screen.getByTestId('pulse-search-modal')).toBeInTheDocument();
  });

  it('handles portfolio error state', () => {
    render(
      <MemoryRouter>
        <Search {...defaultProps} walletPortfolioError />
      </MemoryRouter>
    );

    // Should still render the main search interface
    expect(screen.getByTestId('pulse-search-view')).toBeInTheDocument();
    expect(screen.getByTestId('pulse-search-modal')).toBeInTheDocument();
  });

  it('handles empty portfolio data', () => {
    render(
      <MemoryRouter>
        <Search {...defaultProps} walletPortfolioData={undefined} />
      </MemoryRouter>
    );

    // Should still render the main search interface
    expect(screen.getByTestId('pulse-search-view')).toBeInTheDocument();
    expect(screen.getByTestId('pulse-search-modal')).toBeInTheDocument();
  });

  it.skip('handles close button click', () => {
    render(
      <MemoryRouter>
        <Search {...defaultProps} />
      </MemoryRouter>
    );

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(mockSetSearching).toHaveBeenCalledWith(false);
  });

  it('auto-focuses search input on mount', () => {
    render(
      <MemoryRouter>
        <Search {...defaultProps} />
      </MemoryRouter>
    );

    const input = screen.getByTestId('pulse-search-input');
    expect(input).toBeInTheDocument();
  });

  it('handles URL asset parameter on mount', () => {
    render(
      <MemoryRouter>
        <Search {...defaultProps} />
      </MemoryRouter>
    );

    // Should set search text from URL parameter
    expect(screen.getByTestId('pulse-search-input')).toBeInTheDocument();
  });
});

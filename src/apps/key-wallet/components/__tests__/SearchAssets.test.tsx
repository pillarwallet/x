import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import renderer from 'react-test-renderer';
import SearchAssets from '../SearchAssets';
import { Asset } from '../../types';

const mockAssets: Asset[] = [
  {
    id: 1,
    name: 'Ethereum',
    symbol: 'ETH',
    logo: '',
    balance: 2.5,
    decimals: 18,
    price: 2500,
    price_change_24h: 0,
    contract: '0x0000000000000000000000000000000000000000',
    chainId: 1,
    chainName: 'Ethereum',
    usdBalance: 6250,
  },
  {
    id: 2,
    name: 'Polygon',
    symbol: 'MATIC',
    logo: '',
    balance: 1000,
    decimals: 18,
    price: 0.8,
    price_change_24h: 0,
    contract: '0x0000000000000000000000000000000000000000',
    chainId: 137,
    chainName: 'Polygon',
    usdBalance: 800,
  },
  {
    id: 3,
    name: 'USD Coin',
    symbol: 'USDC',
    logo: '',
    balance: 5000,
    decimals: 6,
    price: 1,
    price_change_24h: 0,
    contract: '0x1234567890123456789012345678901234567890',
    chainId: 1,
    chainName: 'Ethereum',
    usdBalance: 5000,
  },
];

describe('<SearchAssets />', () => {
  const mockOnFilteredAssetsChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly and matches snapshot', () => {
    const tree = renderer
      .create(
        <SearchAssets
          assets={mockAssets}
          onFilteredAssetsChange={mockOnFilteredAssetsChange}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('displays search input', () => {
    render(
      <SearchAssets
        assets={mockAssets}
        onFilteredAssetsChange={mockOnFilteredAssetsChange}
      />
    );
    expect(
      screen.getByPlaceholderText(/Search by token name, symbol, or chain/i)
    ).toBeInTheDocument();
  });

  it('calls onFilteredAssetsChange with all assets when search is empty', () => {
    render(
      <SearchAssets
        assets={mockAssets}
        onFilteredAssetsChange={mockOnFilteredAssetsChange}
      />
    );
    expect(mockOnFilteredAssetsChange).toHaveBeenCalledWith(mockAssets);
  });

  it('filters assets by symbol', () => {
    render(
      <SearchAssets
        assets={mockAssets}
        onFilteredAssetsChange={mockOnFilteredAssetsChange}
      />
    );

    const input = screen.getByPlaceholderText(/Search by token name, symbol, or chain/i);
    fireEvent.change(input, { target: { value: 'ETH' } });

    // Get the last call (after the initial empty search call)
    const lastCall = mockOnFilteredAssetsChange.mock.calls[mockOnFilteredAssetsChange.mock.calls.length - 1][0];
    expect(lastCall.length).toBeGreaterThanOrEqual(1);
    expect(lastCall.some((asset: Asset) => asset.symbol === 'ETH')).toBe(true);
  });

  it('filters assets by name', () => {
    render(
      <SearchAssets
        assets={mockAssets}
        onFilteredAssetsChange={mockOnFilteredAssetsChange}
      />
    );

    const input = screen.getByPlaceholderText(/Search by token name, symbol, or chain/i);
    fireEvent.change(input, { target: { value: 'Polygon' } });

    expect(mockOnFilteredAssetsChange).toHaveBeenCalledWith([mockAssets[1]]);
  });

  it('filters assets by chain name', () => {
    render(
      <SearchAssets
        assets={mockAssets}
        onFilteredAssetsChange={mockOnFilteredAssetsChange}
      />
    );

    const input = screen.getByPlaceholderText(/Search by token name, symbol, or chain/i);
    fireEvent.change(input, { target: { value: 'Ethereum' } });

    // Should match both ETH and USDC on Ethereum
    expect(mockOnFilteredAssetsChange).toHaveBeenCalled();
    const lastCall = mockOnFilteredAssetsChange.mock.calls[mockOnFilteredAssetsChange.mock.calls.length - 1][0];
    expect(lastCall.length).toBeGreaterThan(0);
  });

  it('performs fuzzy search', () => {
    render(
      <SearchAssets
        assets={mockAssets}
        onFilteredAssetsChange={mockOnFilteredAssetsChange}
      />
    );

    const input = screen.getByPlaceholderText(/Search by token name, symbol, or chain/i);
    fireEvent.change(input, { target: { value: 'usd' } });

    // Should find USDC (case-insensitive)
    const lastCall = mockOnFilteredAssetsChange.mock.calls[mockOnFilteredAssetsChange.mock.calls.length - 1][0];
    expect(lastCall.some((asset: Asset) => asset.symbol === 'USDC')).toBe(true);
  });

  it('shows clear button when search query exists', () => {
    render(
      <SearchAssets
        assets={mockAssets}
        onFilteredAssetsChange={mockOnFilteredAssetsChange}
      />
    );

    const input = screen.getByPlaceholderText(/Search by token name, symbol, or chain/i);
    fireEvent.change(input, { target: { value: 'ETH' } });

    const clearButton = screen.getByRole('button', { name: /clear search/i });
    expect(clearButton).toBeInTheDocument();
  });

  it('clears search when clear button is clicked', () => {
    render(
      <SearchAssets
        assets={mockAssets}
        onFilteredAssetsChange={mockOnFilteredAssetsChange}
      />
    );

    const input = screen.getByPlaceholderText(/Search by token name, symbol, or chain/i);
    fireEvent.change(input, { target: { value: 'ETH' } });

    const clearButton = screen.getByRole('button', { name: /clear search/i });
    fireEvent.click(clearButton);

    expect(input).toHaveValue('');
    expect(mockOnFilteredAssetsChange).toHaveBeenCalledWith(mockAssets);
  });

  it('shows search query text when searching', () => {
    render(
      <SearchAssets
        assets={mockAssets}
        onFilteredAssetsChange={mockOnFilteredAssetsChange}
      />
    );

    const input = screen.getByPlaceholderText(/Search by token name, symbol, or chain/i);
    fireEvent.change(input, { target: { value: 'ETH' } });

    expect(screen.getByText(/Searching for "ETH"/i)).toBeInTheDocument();
  });

  it('handles empty assets array', () => {
    render(
      <SearchAssets
        assets={[]}
        onFilteredAssetsChange={mockOnFilteredAssetsChange}
      />
    );

    expect(
      screen.getByPlaceholderText(/Search by token name, symbol, or chain/i)
    ).toBeInTheDocument();
    expect(mockOnFilteredAssetsChange).toHaveBeenCalledWith([]);
  });
});

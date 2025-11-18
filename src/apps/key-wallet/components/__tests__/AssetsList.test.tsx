import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';
import AssetsList from '../AssetsList';
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
];

describe('<AssetsList />', () => {
  const mockOnAssetClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly and matches snapshot', () => {
    const tree = renderer
      .create(
        <AssetsList
          assets={mockAssets}
          totalValue={7050}
          isLoading={false}
          onAssetClick={mockOnAssetClick}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('displays loading state', () => {
    render(
      <AssetsList
        assets={[]}
        totalValue={0}
        isLoading={true}
        onAssetClick={mockOnAssetClick}
      />
    );

    expect(screen.getByText(/Loading your assets/i)).toBeInTheDocument();
    // Use getAllByText since "Your Assets" appears in the loading state
    const yourAssetsElements = screen.getAllByText(/Your Assets/i);
    expect(yourAssetsElements.length).toBeGreaterThan(0);
  });

  it('displays empty state when no assets', () => {
    render(
      <AssetsList
        assets={[]}
        totalValue={0}
        isLoading={false}
        onAssetClick={mockOnAssetClick}
      />
    );

    expect(screen.getByText(/No Assets Found/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Your wallet doesn't have any assets yet/i)
    ).toBeInTheDocument();
  });

  it('displays total portfolio value', () => {
    render(
      <AssetsList
        assets={mockAssets}
        totalValue={7050}
        isLoading={false}
        onAssetClick={mockOnAssetClick}
      />
    );

    expect(screen.getByText(/Total Portfolio Value/i)).toBeInTheDocument();
    expect(screen.getByText('$7,050.00')).toBeInTheDocument();
  });

  it('displays asset count correctly (singular)', () => {
    const singleAsset: Asset[] = [mockAssets[0]];
    render(
      <AssetsList
        assets={singleAsset}
        totalValue={6250}
        isLoading={false}
        onAssetClick={mockOnAssetClick}
      />
    );

    expect(screen.getByText(/Across 1 asset/i)).toBeInTheDocument();
  });

  it('displays asset count correctly (plural)', () => {
    render(
      <AssetsList
        assets={mockAssets}
        totalValue={7050}
        isLoading={false}
        onAssetClick={mockOnAssetClick}
      />
    );

    expect(screen.getByText(/Across 2 assets/i)).toBeInTheDocument();
  });

  it('displays assets list', () => {
    render(
      <AssetsList
        assets={mockAssets}
        totalValue={7050}
        isLoading={false}
        onAssetClick={mockOnAssetClick}
      />
    );

    expect(screen.getByText('ETH')).toBeInTheDocument();
    expect(screen.getByText('MATIC')).toBeInTheDocument();
  });

  it('includes search component', () => {
    render(
      <AssetsList
        assets={mockAssets}
        totalValue={7050}
        isLoading={false}
        onAssetClick={mockOnAssetClick}
      />
    );

    expect(
      screen.getByPlaceholderText(/Search by token name, symbol, or chain/i)
    ).toBeInTheDocument();
  });
});

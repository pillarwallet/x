import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import renderer from 'react-test-renderer';
import AssetRow from '../AssetRow';
import { Asset } from '../../types';

const mockAsset: Asset = {
  id: 1,
  name: 'Ethereum',
  symbol: 'ETH',
  logo: 'https://example.com/eth-logo.png',
  balance: 2.5,
  decimals: 18,
  price: 2500,
  price_change_24h: 5.5,
  contract: '0x0000000000000000000000000000000000000000',
  chainId: 1,
  chainName: 'Ethereum',
  usdBalance: 6250,
};

describe('<AssetRow />', () => {
  const mockOnClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly and matches snapshot', () => {
    const tree = renderer
      .create(<AssetRow asset={mockAsset} onClick={mockOnClick} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('displays asset symbol', () => {
    render(<AssetRow asset={mockAsset} onClick={mockOnClick} />);
    expect(screen.getByText('ETH')).toBeInTheDocument();
  });

  it('displays asset name', () => {
    render(<AssetRow asset={mockAsset} onClick={mockOnClick} />);
    // Asset name is in a paragraph element with class 'text-sm text-white/60 truncate'
    const assetNames = screen.getAllByText('Ethereum');
    const assetName = assetNames.find(
      (el) => el.tagName === 'P' && el.className.includes('text-sm') && el.className.includes('truncate')
    );
    expect(assetName).toBeInTheDocument();
    expect(assetName).toHaveClass('text-sm');
  });

  it('displays chain name', () => {
    render(<AssetRow asset={mockAsset} onClick={mockOnClick} />);
    // Chain name is in a span element
    const chainName = screen.getAllByText('Ethereum').find(
      (el) => el.tagName === 'SPAN' && el.className.includes('text-xs')
    );
    expect(chainName).toBeInTheDocument();
  });

  it('displays formatted balance', () => {
    render(<AssetRow asset={mockAsset} onClick={mockOnClick} />);
    expect(screen.getByText('2.5000')).toBeInTheDocument();
  });

  it('displays formatted USD value', () => {
    render(<AssetRow asset={mockAsset} onClick={mockOnClick} />);
    expect(screen.getByText('$6,250.00')).toBeInTheDocument();
  });

  it('displays positive price change in green', () => {
    render(<AssetRow asset={mockAsset} onClick={mockOnClick} />);
    const priceChange = screen.getByText('+5.50%');
    expect(priceChange).toBeInTheDocument();
    expect(priceChange).toHaveClass('text-green-400');
  });

  it('displays negative price change in red', () => {
    const negativeAsset: Asset = {
      ...mockAsset,
      price_change_24h: -3.2,
    };
    render(<AssetRow asset={negativeAsset} onClick={mockOnClick} />);
    const priceChange = screen.getByText('-3.20%');
    expect(priceChange).toBeInTheDocument();
    expect(priceChange).toHaveClass('text-red-400');
  });

  it('does not display price change when it is zero', () => {
    const zeroChangeAsset: Asset = {
      ...mockAsset,
      price_change_24h: 0,
    };
    render(<AssetRow asset={zeroChangeAsset} onClick={mockOnClick} />);
    expect(screen.queryByText(/%/)).not.toBeInTheDocument();
  });

  it('displays default logo when asset logo is missing', () => {
    const assetWithoutLogo: Asset = {
      ...mockAsset,
      logo: '',
    };
    render(<AssetRow asset={assetWithoutLogo} onClick={mockOnClick} />);
    // The alt text uses the symbol when logo is provided, or 'token' when not
    const img = screen.getByAltText(mockAsset.symbol);
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', expect.stringContaining('logo-unknown'));
  });

  it('falls back to default logo on image error', () => {
    render(<AssetRow asset={mockAsset} onClick={mockOnClick} />);
    const img = screen.getByAltText(mockAsset.symbol);
    fireEvent.error(img);
    expect(img).toHaveAttribute('src', expect.stringContaining('logo-unknown'));
  });

  it('calls onClick when clicked', () => {
    render(<AssetRow asset={mockAsset} onClick={mockOnClick} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
    expect(mockOnClick).toHaveBeenCalledWith(mockAsset);
  });

  it('handles missing symbol gracefully', () => {
    const assetWithoutSymbol: Asset = {
      ...mockAsset,
      symbol: '',
    };
    render(<AssetRow asset={assetWithoutSymbol} onClick={mockOnClick} />);
    expect(screen.getByText('(no symbol)')).toBeInTheDocument();
  });

  it('handles missing name gracefully', () => {
    const assetWithoutName: Asset = {
      ...mockAsset,
      name: '',
    };
    render(<AssetRow asset={assetWithoutName} onClick={mockOnClick} />);
    expect(screen.getByText('(no name)')).toBeInTheDocument();
  });
});

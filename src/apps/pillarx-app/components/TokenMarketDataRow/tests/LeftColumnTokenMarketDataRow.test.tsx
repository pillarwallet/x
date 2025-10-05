import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

// components
import LeftColumnTokenMarketDataRow from '../LeftColumnTokenMarketDataRow';

const ethTokenRow = {
  link: 'token-atlas?someLink=true',
  leftColumn: {
    token: {
      primaryImage: 'eth.png',
    },
    line1: {
      text1: 'ETH',
      text2: 'Ethereum',
      copyLink: '0xD76b5c2A23ef78368d8E34288B5b65D616B746aE',
    },
    line2: {
      timestamp: 1745331519,
      volume: '1.2m',
      liquidity: '30,123',
    },
  },
  rightColumn: {
    line1: {
      price: '0.042188',
      direction: 'UP',
      percentage: '20.1%',
    },
    line2: {
      transactionCount: '1823',
    },
  },
};

describe('<LeftColumnTokenMarketDataRow /> - ETH token row', () => {
  beforeEach(() => {
    // Mock the current date to December 22, 2025 for consistent relative time calculations
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-12-22T00:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders and matches snapshot', () => {
    const tree = render(<LeftColumnTokenMarketDataRow data={ethTokenRow} />);
    expect(tree).toMatchSnapshot();
  });

  it('renders text1 and text2', () => {
    render(<LeftColumnTokenMarketDataRow data={ethTokenRow} />);
    expect(screen.getByText('ETH')).toBeInTheDocument();
    expect(screen.getByText('Ethereum')).toBeInTheDocument();
  });

  it('renders volume and liquidity', () => {
    render(<LeftColumnTokenMarketDataRow data={ethTokenRow} />);
    expect(screen.getByText(/Vol:/)).toBeInTheDocument();
    expect(screen.getByText('$1.2m')).toBeInTheDocument();
    expect(screen.getByText(/Liq:/)).toBeInTheDocument();
    expect(screen.getByText('$30,123')).toBeInTheDocument();
  });

  it('does not break if some values are missing', () => {
    const incomplete = {
      leftColumn: {
        line1: {
          text1: 'ETH',
        },
        line2: {},
      },
    };

    render(<LeftColumnTokenMarketDataRow data={incomplete} />);

    expect(screen.getByText('ETH')).toBeInTheDocument();
    expect(screen.queryByText(/Vol:/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Liq:/)).not.toBeInTheDocument();
  });
});

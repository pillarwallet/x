import { render, screen } from '@testing-library/react';

// components
import RightColumnTokenMarketDataRow from '../RightColumnTokenMarketDataRow';

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

describe('<RightColumnTokenMarketDataRow /> - ETH token row', () => {
  it('renders and matches snapshot', () => {
    const tree = render(<RightColumnTokenMarketDataRow data={ethTokenRow} />);
    expect(tree).toMatchSnapshot();
  });

  it('renders percentage, price and transaction count ', () => {
    render(<RightColumnTokenMarketDataRow data={ethTokenRow} />);

    expect(screen.getByText('$0.042188')).toBeInTheDocument();
    expect(screen.getByText('20.1%')).toBeInTheDocument();
    expect(screen.getByText(/Txs:/)).toBeInTheDocument();
    expect(screen.getByText('1823')).toBeInTheDocument();
  });

  it('renders with missing percentage', () => {
    const noPercentageRow = {
      ...ethTokenRow,
      rightColumn: {
        line1: {
          price: '0.999',
          direction: 'UP',
        },
      },
    };

    render(<RightColumnTokenMarketDataRow data={noPercentageRow} />);
    expect(screen.getByText('$0.999')).toBeInTheDocument();
    expect(screen.queryByText('%')).not.toBeInTheDocument();
  });

  it('renders only transaction count when line1 is missing', () => {
    const noLine1Row = {
      ...ethTokenRow,
      rightColumn: {
        line2: {
          transactionCount: '9999',
        },
      },
    };

    render(<RightColumnTokenMarketDataRow data={noLine1Row} />);
    expect(screen.getByText('9999')).toBeInTheDocument();
    expect(screen.queryByText('$')).not.toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// components
import TokensWithMarketDataTile from '../TokensWithMarketDataTile';

// types
import {
  ApiLayout,
  Projection,
  TokensMarketData,
} from '../../../../../types/api';

const mockTokensMarketData: Projection = {
  id: 'tokens-with-market-data',
  layout: ApiLayout.TOKENS_WITH_MARKET_DATA,
  meta: {},
  data: {
    title: {
      text: 'Top Tokens',
      leftDecorator: '🔥',
      rightDecorator: '📈',
    },
    rows: [
      {
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
            liquidity: '$30,123',
          },
        },
        rightColumn: {
          line1: {
            price: '$0.042188',
            direction: 'UP',
            percentage: '20.1%',
          },
          line2: {
            transactionCount: '1823',
          },
        },
      },
      {
        link: 'token-atlas?someLink=true',
        leftColumn: {
          token: {
            primaryImage:
              'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=040',
            secondaryImage:
              'https://cryptologos.cc/logos/optimism-ethereum-op-logo.svg?v=040',
          },
          line1: {
            text1: 'XDAI',
            text2: 'XDAI',
            copyLink: '0xD76b5c2A23ef78368d8E34288B5b65D616B746aE',
          },
          line2: {
            timestamp: 1745334519,
            volume: '1.4m',
            liquidity: '$3,123',
          },
        },
        rightColumn: {
          line1: {
            price: '$1.062188',
            direction: 'DOWN',
            percentage: '3.1%',
          },
          line2: {
            transactionCount: '1423',
          },
        },
      },
    ],
  },
};

describe('<TokensWithMarketDataTile />', () => {
  it('renders and matches snapshot', () => {
    const tree = render(
      <MemoryRouter>
        <TokensWithMarketDataTile
          data={mockTokensMarketData}
          isDataLoading={false}
        />
      </MemoryRouter>
    );
    expect(tree).toMatchSnapshot();
  });

  it('renders title and decorators', () => {
    render(
      <MemoryRouter>
        <TokensWithMarketDataTile
          data={mockTokensMarketData}
          isDataLoading={false}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Top Tokens')).toBeInTheDocument();
    expect(screen.getByAltText('left-decorator-image')).toBeInTheDocument();
    expect(screen.getByAltText('right-decorator-image')).toBeInTheDocument();
  });

  it('renders token rows with expected data', () => {
    render(
      <MemoryRouter>
        <TokensWithMarketDataTile
          data={mockTokensMarketData}
          isDataLoading={false}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Ethereum')).toBeInTheDocument();
    expect(screen.getByText('ETH')).toBeInTheDocument();
    expect(screen.getByText('1.2m')).toBeInTheDocument();
    expect(screen.getByText('$30,123')).toBeInTheDocument();
    expect(screen.getByText('$0.042188')).toBeInTheDocument();
    expect(screen.getByText('20.1%')).toBeInTheDocument();
    expect(screen.getByText('1823')).toBeInTheDocument();

    expect(screen.getAllByText('XDAI')).toHaveLength(2);
    expect(screen.getByText('1.4m')).toBeInTheDocument();
    expect(screen.getByText('$3,123')).toBeInTheDocument();
    expect(screen.getByText('$1.062188')).toBeInTheDocument();
    expect(screen.getByText('3.1%')).toBeInTheDocument();
    expect(screen.getByText('1423')).toBeInTheDocument();
  });

  it('does not render anything while loading', () => {
    render(
      <MemoryRouter>
        <TokensWithMarketDataTile data={mockTokensMarketData} isDataLoading />
      </MemoryRouter>
    );

    expect(screen.queryByText('Top Tokens')).not.toBeInTheDocument();
    expect(screen.queryByText('Ethereum')).not.toBeInTheDocument();
  });

  it('does not render if data is missing or rows are empty', () => {
    const emptyData: Projection = {
      ...mockTokensMarketData,
      data: {
        ...mockTokensMarketData.data,
        rows: [],
      },
    };

    render(
      <MemoryRouter>
        <TokensWithMarketDataTile data={emptyData} isDataLoading={false} />
      </MemoryRouter>
    );

    expect(screen.queryByText('Top Tokens')).not.toBeInTheDocument();
  });

  it('renders only up to 8 rows even if more are provided', () => {
    const overfilledData: Projection = {
      ...mockTokensMarketData,
      data: {
        ...mockTokensMarketData.data,
        rows: new Array(10).fill(
          (mockTokensMarketData.data as TokensMarketData).rows?.[0]
        ),
      },
    };

    render(
      <MemoryRouter>
        <TokensWithMarketDataTile data={overfilledData} isDataLoading={false} />
      </MemoryRouter>
    );

    const ethItems = screen.getAllByText('Ethereum');
    expect(ethItems.length).toBeLessThanOrEqual(8);
  });
});

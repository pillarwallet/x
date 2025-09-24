import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// components
import TokensWithMarketDataTile from '../TokensWithMarketDataTile';

// types
import {
  ApiLayout,
  Projection,
  TokensMarketData,
} from '../../../../../types/api';

// Mock the environment variable
const originalEnv = import.meta.env;

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
            liquidity: '3,123',
          },
        },
        rightColumn: {
          line1: {
            price: '1.062188',
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
  beforeEach(() => {
    // Reset environment
    Object.defineProperty(import.meta, 'env', {
      value: { ...originalEnv, VITE_FEATURE_FLAG_GNOSIS: 'true' },
      writable: true,
    });
  });

  afterEach(() => {
    // Reset environment
    Object.defineProperty(import.meta, 'env', {
      value: originalEnv,
      writable: true,
    });
  });

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

  it('renders token rows with expected data (mobile layout)', () => {
    const { container } = render(
      <MemoryRouter>
        <TokensWithMarketDataTile
          data={mockTokensMarketData}
          isDataLoading={false}
        />
      </MemoryRouter>
    );

    // Target the mobile layout otherwise it would not consider the hidden elements when in mobile or desktop
    const mobileContainer = container.querySelector(
      '.flex-col.desktop\\:hidden'
    ) as HTMLElement;
    expect(mobileContainer).toBeInTheDocument();

    const mobileScreen = within(mobileContainer!);

    expect(mobileScreen.getByText('Ethereum')).toBeInTheDocument();
    expect(mobileScreen.getByText('ETH')).toBeInTheDocument();
    expect(mobileScreen.getByText('$1.2m')).toBeInTheDocument();
    expect(mobileScreen.getByText('$30,123')).toBeInTheDocument();
    expect(mobileScreen.getByText('$0.04219')).toBeInTheDocument(); // rounded up with limitDigitsNumber helper function
    expect(mobileScreen.getByText('20.1%')).toBeInTheDocument();
    expect(mobileScreen.getByText('1823')).toBeInTheDocument();

    // XDAI should only be present when Gnosis feature flag is enabled
    if (import.meta.env.VITE_FEATURE_FLAG_GNOSIS === 'true') {
      expect(mobileScreen.getAllByText('XDAI')).toHaveLength(2);
      expect(mobileScreen.getByText('$1.4m')).toBeInTheDocument();
      expect(mobileScreen.getByText('$3,123')).toBeInTheDocument();
      expect(mobileScreen.getByText('$1.0622')).toBeInTheDocument(); // rounded up with limitDigitsNumber helper function
      expect(mobileScreen.getByText('3.1%')).toBeInTheDocument();
      expect(mobileScreen.getByText('1423')).toBeInTheDocument();
    }
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

  it('renders the right number of rowsd', () => {
    const overfilledData: Projection = {
      ...mockTokensMarketData,
      data: {
        ...mockTokensMarketData.data,
        rows: new Array(10).fill(
          (mockTokensMarketData.data as TokensMarketData).rows?.[0]
        ),
      },
    };

    const { container } = render(
      <MemoryRouter>
        <TokensWithMarketDataTile data={overfilledData} isDataLoading={false} />
      </MemoryRouter>
    );

    // Target the mobile layout otherwise it would not consider the hidden elements when in mobile or desktop
    const mobileContainer = container.querySelector(
      '.flex-col.desktop\\:hidden'
    ) as HTMLElement;
    expect(mobileContainer).toBeInTheDocument();

    const mobileScreen = within(mobileContainer!);

    const ethItems = mobileScreen.getAllByText('Ethereum');
    expect(ethItems.length).toBeLessThanOrEqual(10);
  });
});

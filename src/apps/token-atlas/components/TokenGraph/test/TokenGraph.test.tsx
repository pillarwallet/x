import { render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';

// redux store
import { Provider } from 'react-redux';
import { store } from '../../../../../store';

// reducer
import {
  setIsGraphLoading,
  setPeriodFilter,
  setTokenDataGraph,
  setTokenDataInfo,
} from '../../../reducer/tokenAtlasSlice';

// types
import {
  TokenAtlasInfoData,
  TokenMarketHistory,
} from '../../../../../types/api';
import { PeriodFilter } from '../../../types/types';

// components
import TokenGraph from '../TokenGraph';

const mockTokenDataGraph: TokenMarketHistory = {
  price_history: [
    { timestamp: 1722466800, priceUSD: 100 },
    { timestamp: 1722553200, priceUSD: 110 },
  ],
};

const mockTokenDataInfo: TokenAtlasInfoData = {
  id: 1,
  market_cap: 100,
  market_cap_diluted: 100,
  liquidity: 150,
  price: 105,
  off_chain_volume: 150,
  volume: 150,
  volume_change_24h: 1.54,
  volume_7d: 2.3,
  is_listed: true,
  price_change_24h: 0.44,
  price_change_1h: 0.1,
  price_change_7d: 1.8,
  price_change_1m: 3.4,
  price_change_1y: 6.7,
  ath: 146,
  atl: 96,
  name: 'TOKEN',
  symbol: 'TKN',
  logo: 'tokenLogo.png',
  rank: 1047,
  contracts: [],
  total_supply: '300',
  circulating_supply: '170',
};

describe('<TokenGraph />', () => {
  beforeEach(() => {
    store.dispatch(setIsGraphLoading(false));
    store.dispatch(setTokenDataGraph(mockTokenDataGraph));
    store.dispatch(setTokenDataInfo(mockTokenDataInfo));
    store.dispatch(setPeriodFilter(PeriodFilter.DAY));
  });

  it('renders correctly and matches snapshot', () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <TokenGraph />
        </Provider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('displays a message when no price history is available', () => {
    store.dispatch(setTokenDataGraph({ price_history: [] }));

    render(
      <Provider store={store}>
        <TokenGraph />
      </Provider>
    );

    expect(screen.getByText('Price history not found.')).toBeInTheDocument();
  });

  it('renders the graph with data when available', () => {
    render(
      <Provider store={store}>
        <TokenGraph />
      </Provider>
    );

    expect(screen.getByTestId('price-graph')).toBeInTheDocument();
  });
});

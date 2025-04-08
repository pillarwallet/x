import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';

// redux store
import { Provider } from 'react-redux';
import { store } from '../../../../../store';

// provider
import AllowedAppsProvider from '../../../../../providers/AllowedAppsProvider';

// components
import TokenGraphColumn from '../TokenGraphColumn';

// reducer
import {
  setPeriodFilter,
  setTokenDataGraph,
  setTokenDataInfo,
} from '../../../reducer/tokenAtlasSlice';

// types
import {
  MarketHistoryPairData,
  TokenAtlasInfoData,
} from '../../../../../types/api';
import { PeriodFilter } from '../../../types/types';

const mockTokenDataGraph: MarketHistoryPairData = {
  result: {
    data: [
      {
        volume: 1050.25,
        open: 45000.5,
        high: 45500.0,
        low: 44800.25,
        close: 45250.75,
        time: 1712457600, // Unix timestamp
      },
      {
        volume: 980.1,
        open: 45250.75,
        high: 46000.0,
        low: 45000.0,
        close: 45900.0,
        time: 1712544000,
      },
      {
        volume: 1125.8,
        open: 45900.0,
        high: 46250.5,
        low: 45700.0,
        close: 46050.5,
        time: 1712630400,
      },
    ],
  },
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

describe('<TokenGraphColumn />', () => {
  beforeEach(() => {
    store.dispatch(setTokenDataInfo(mockTokenDataInfo));
    store.dispatch(setTokenDataGraph(mockTokenDataGraph));
    store.dispatch(setPeriodFilter(PeriodFilter.DAY));
  });

  it('renders correctly and matches snapshot', () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <MemoryRouter>
            <AllowedAppsProvider>
              <TokenGraphColumn isLoadingTokenDataInfo={false} />
            </AllowedAppsProvider>
          </MemoryRouter>
        </Provider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('displays token information correctly', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <AllowedAppsProvider>
            <TokenGraphColumn isLoadingTokenDataInfo={false} />
          </AllowedAppsProvider>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByTestId('token-logo-graph-column')).toBeInTheDocument();
    expect(screen.getByText(mockTokenDataInfo.name)).toBeInTheDocument();
    expect(screen.getByText(mockTokenDataInfo.symbol)).toBeInTheDocument();
    expect(screen.getByText(`${mockTokenDataInfo.price}`)).toBeInTheDocument();
    expect(
      screen.getByText(`${mockTokenDataInfo.price_change_24h.toFixed(3)}`)
    ).toBeInTheDocument();
  });
});

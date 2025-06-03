import { MemoryRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';

// provider
import { Provider } from 'react-redux';
import { store } from '../../../../../store';

// components
import { ApiLayout, Projection } from '../../../../../types/api';
import TokensHorizontalTile from '../TokensHorizontalTile';

describe('<TokensHorizontalTile />', () => {
  const mockData: Projection = {
    meta: {
      display: {
        title: 'horizontal title',
      },
    },
    data: [
      {
        id: 1,
        name: 'The best token',
        symbol: 'TBT',
        price: 0.123,
        contracts: [
          {
            address: '0xD6DF932A45C0f255f85145f286eA0b292B21C90B',
            blockchain: '137',
            decimals: 18,
          },
        ],
        logo: 'https://www.logo.com/example/',
        trending_score: 20,
        platforms: [
          {
            name: 'platform one',
            rank: 3,
            weight: 1,
          },
        ],
        price_change_24h: 12.56,
        pair: 'pair example',
      },
    ],
    layout: ApiLayout.TOKENS_HORIZONTAL,
    id: 'horizontal',
  };

  const mockLoading = false;

  it('renders correctly and matches snapshot', () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <MemoryRouter>
            <TokensHorizontalTile data={mockData} isDataLoading={mockLoading} />
          </MemoryRouter>
        </Provider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('displays loading skeleton when data is loading', () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <MemoryRouter>
            <TokensHorizontalTile data={undefined} isDataLoading />
          </MemoryRouter>
        </Provider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('returns null when dataTokens is empty', () => {
    const emptyMockData: Projection = {
      meta: {
        display: {
          title: 'horizontal title',
        },
      },
      data: [],
      layout: ApiLayout.TOKENS_HORIZONTAL,
      id: 'horizontal',
    };

    const tree = renderer
      .create(
        <Provider store={store}>
          <MemoryRouter>
            <TokensHorizontalTile
              data={emptyMockData}
              isDataLoading={mockLoading}
            />
          </MemoryRouter>
        </Provider>
      )
      .toJSON();

    expect(tree).toBeNull();
  });
});

import { MemoryRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';

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
        contracts: [
          {
            address: '0x123',
            blockchain: '111222',
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
        <MemoryRouter>
          <TokensHorizontalTile data={mockData} isDataLoading={mockLoading} />
        </MemoryRouter>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('displays loading skeleton when data is loading', () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <TokensHorizontalTile data={undefined} isDataLoading />
        </MemoryRouter>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});

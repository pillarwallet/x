import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';

// components
import TokensVerticalTile from '../TokensVerticalTile';

// types
import { ApiLayout, Projection } from '../../../../../types/api';

describe('<TokensVerticalTile />', () => {
  const mockData: Projection = {
    meta: {
      display: {
          title: 'vertical'
      },
    },
    data: [
      {
        id: 1,
        name: 'Token A', 
        symbol: 'TKA',
        contracts: [{ address: '0x1', blockchain: 'Ethereum' }],
        logo: 'logoA.png',
        trending_score: 90,
        platforms: [{ name: 'Platform A', rank: 1, weight: 0.5 }],
        price_change_24h: 5,
        pair: 'TKA/USD'
      },
      {
        id: 2,
        name: 'Token B', 
        symbol: 'TKB',
        contracts: [{ address: '0x2', blockchain: 'Ethereum' }],
        logo: 'logoB.png',
        trending_score: 80,
        platforms: [{ name: 'Platform B', rank: 2, weight: 0.4 }],
        price_change_24h: -3,
        pair: 'TKB/USD' 
      }
    ],
    layout: ApiLayout.TOKENS_VERTICAL,
    id: 'vertical',
  };

  it('renders correctly and matches snapshot', () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <TokensVerticalTile data={mockData} isDataLoading={false} />
        </MemoryRouter>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});

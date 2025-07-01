import { MemoryRouter } from 'react-router-dom';
import renderer, { ReactTestRendererJSON } from 'react-test-renderer';

// components
import { Provider } from 'react-redux';
import { store } from '../../../../../store';
import TokensVerticalList from '../TokensVerticalList';

// types
import { TokenData } from '../../../../../types/api';

vi.mock('../../Typography/Body', () => {
  return {
    __esModule: true,
    default: vi.fn(() => 'Body'),
  };
});

describe('<TokensVerticalList />', () => {
  const mockData: TokenData[] = [
    {
      id: 1,
      name: 'Token A',
      symbol: 'TKA',
      contracts: [{ address: '0x1', blockchain: 'Ethereum' }],
      logo: 'logoA.png',
      trending_score: 90,
      platforms: [{ name: 'Platform A', rank: 1, weight: 0.5 }],
      price_change_24h: 5,
      pair: 'TKA/USD',
      price: 0.123,
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
      pair: 'TKB/USD',
      price: 0.456,
    },
  ];

  it('renders correctly and matches snapshot for left position', () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <Provider store={store}>
            <TokensVerticalList position="left" data={mockData} />
          </Provider>
        </MemoryRouter>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly and matches snapshot for right position', () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <Provider store={store}>
            <TokensVerticalList position="right" data={mockData} />
          </Provider>
        </MemoryRouter>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders the correct number of HorizontalToken components', () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <Provider store={store}>
            <TokensVerticalList position="left" data={mockData} />
          </Provider>
        </MemoryRouter>
      )
      .toJSON() as ReactTestRendererJSON;

    const tokensList = tree.children as ReactTestRendererJSON[];

    expect(tokensList.length).toBe(mockData.length);
  });

  it('passes the correct props to HorizontalToken components', () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <Provider store={store}>
            <TokensVerticalList position="left" data={mockData} />
          </Provider>
        </MemoryRouter>
      )
      .toJSON() as ReactTestRendererJSON;

    const tokensList = tree.children as ReactTestRendererJSON[];

    tokensList.forEach((tokenElement, index) => {
      const indexNumber = tokenElement.children[0].children[0].children[1];

      expect(Number(indexNumber)).toBe(index + 1);
      expect(JSON.stringify(tokenElement.children)).toContain(
        mockData[index].name
      );
      expect(tokenElement.props.tokenValue).toBeUndefined();
      expect(tokenElement.props.percentage).toBeUndefined();
    });
  });
});

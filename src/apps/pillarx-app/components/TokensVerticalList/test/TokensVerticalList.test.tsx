import renderer, { ReactTestRendererJSON } from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';

// components
import TokensVerticalList from '../TokensVerticalList';

// types
import { TokenData } from '../../../../../types/api';

jest.mock('../../HorizontalToken/HorizontalToken', () => 'HorizontalToken');
jest.mock('../../Typography/Body', () => 'Body');

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
    },
  ];

  it('renders correctly and matches snapshot for left position', () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <TokensVerticalList position="left" data={mockData} />
        </MemoryRouter>
      )
      .toJSON();
    
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly and matches snapshot for right position', () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <TokensVerticalList position="right" data={mockData} />
        </MemoryRouter>
      )
      .toJSON();
    
    expect(tree).toMatchSnapshot();
  });

  it('renders the correct number of HorizontalToken components', () => {
    const tree = renderer.create(
      <MemoryRouter>
        <TokensVerticalList position='left' data={mockData} />
      </MemoryRouter>
    ).toJSON() as ReactTestRendererJSON;

    const tokensList = tree.children as ReactTestRendererJSON[];
    
    expect(tokensList.length).toBe(mockData.length);
  });

  it('passes the correct props to HorizontalToken components', () => {
    const tree = renderer.create(
      <MemoryRouter>
        <TokensVerticalList position='left' data={mockData} />
      </MemoryRouter>
    ).toJSON() as ReactTestRendererJSON;

    const linkElement = tree.children as ReactTestRendererJSON[];
    
    linkElement.forEach((linkElement, index) => {
      const tokenElement = linkElement.children as ReactTestRendererJSON[];

      tokenElement.forEach((token) => {
        expect(token.props.tokenIndex).toBe(index + 1);
        expect(token.props.tokenName).toBe(mockData[index].name);
        expect(token.props.tokenSymbol).toBe(mockData[index].symbol);
        expect(token.props.tokenValue).toBeUndefined();
        expect(token.props.percentage).toBeUndefined();
        expect(token.props.isLast).toBe(index === mockData.length - 1);
      })
    });
  });
});

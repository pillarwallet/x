import renderer, { ReactTestRendererJSON } from 'react-test-renderer';

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
      .create(<TokensVerticalList position="left" data={mockData} />)
      .toJSON();
    
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly and matches snapshot for right position', () => {
    const tree = renderer
      .create(<TokensVerticalList position="right" data={mockData} />)
      .toJSON();
    
    expect(tree).toMatchSnapshot();
  });

  it('renders the correct number of HorizontalToken components', () => {
    const tree = renderer.create(<TokensVerticalList position='left' data={mockData} />).toJSON() as ReactTestRendererJSON;
    const tokensList = tree.children as ReactTestRendererJSON[];
    
    expect(tokensList.length).toBe(mockData.length);
  });

  it('passes the correct props to HorizontalToken components', () => {
    const tree = renderer.create(<TokensVerticalList position='left' data={mockData} />).toJSON() as ReactTestRendererJSON;
    const tokensList = tree.children as ReactTestRendererJSON[];
    
    tokensList.forEach((tokenElement, index) => {
      expect(tokenElement.props.tokenIndex).toBe(index + 1);
      expect(tokenElement.props.tokenName).toBe(mockData[index].name);
      expect(tokenElement.props.tokenSymbol).toBe(mockData[index].symbol);
      expect(tokenElement.props.tokenValue).toBeUndefined();
      expect(tokenElement.props.percentage).toBeUndefined();
      expect(tokenElement.props.isLast).toBe(index === mockData.length - 1);
    });
  });
});

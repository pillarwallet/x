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
      .create(<TokensVerticalList position="left" data={mockData} title='tile left' />)
      .toJSON();
    
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly and matches snapshot for right position', () => {
    const tree = renderer
      .create(<TokensVerticalList position="right" data={mockData} title='title right' />)
      .toJSON();
    
    expect(tree).toMatchSnapshot();
  });

  it('renders the correct title', () => {
    const tree = renderer.create(<TokensVerticalList position='left' data={mockData} title='title left' />).toJSON() as ReactTestRendererJSON;
    const titleProp = tree.children?.[0] as ReactTestRendererJSON;

    expect(titleProp).not.toBeNull();
    expect(titleProp.type).toBe('Body');
    expect(titleProp.children).toContain('title left');
    expect(tree.children?.length).toBe(2);
  });

  it('renders correctly without title when title is undefined', () => {
    const tree = renderer.create(<TokensVerticalList position='left' data={mockData} />).toJSON() as ReactTestRendererJSON;
    
    expect(tree.children?.length).toBe(1);
  });

  it('renders the correct number of HorizontalToken components', () => {
    const tree = renderer.create(<TokensVerticalList position='left' data={mockData} title='title left' />).toJSON() as ReactTestRendererJSON;
    const tokensList = tree.children?.[1] as ReactTestRendererJSON;
    const horizontalTokens = tokensList.children as ReactTestRendererJSON[];
    
    expect(horizontalTokens.length).toBe(mockData.length);
  });

  it('passes the correct props to HorizontalToken components', () => {
    const tree = renderer.create(<TokensVerticalList position='left' data={mockData} title='title left' />).toJSON() as ReactTestRendererJSON;
    const tokensList = tree.children?.[1] as ReactTestRendererJSON;
    const horizontalTokens = tokensList.children as ReactTestRendererJSON[];
    
    horizontalTokens.forEach((tokenElement, index) => {
      expect(tokenElement.props.tokenIndex).toBe(index + 1);
      expect(tokenElement.props.tokenName).toBe(mockData[index].name);
      expect(tokenElement.props.tokenSymbol).toBe(mockData[index].symbol);
      expect(tokenElement.props.tokenValue).toBeUndefined();
      expect(tokenElement.props.percentage).toBeUndefined();
    });
  });
});

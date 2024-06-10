import renderer, { ReactTestRendererJSON } from 'react-test-renderer';

// components
import TokensVerticalTile from '../TokensVerticalTile';

// types
import { TokenData } from '../../../../../types/api';

describe('<TokensVerticalTile />', () => {
  const mockDataLeft: TokenData[] = [
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
      ];

   const mockDataRight: TokenData[] = [
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
  ];

    it('renders correctly and matches snapshot', () => {
      const tree = renderer
          .create(<TokensVerticalTile dataLeft={mockDataLeft} dataRight={mockDataRight} titleLeft='Top climbers' titleRight='Top losers' isDataLoading={false} />)
          .toJSON();

      expect(tree).toMatchSnapshot();
    });


    it('displays loading skeleton when data is loading', () => {
        const tree = renderer
            .create(<TokensVerticalTile dataLeft={undefined} dataRight={undefined} titleLeft='' titleRight='' isDataLoading={true} />)
            .toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('renders correctly with empty data array', () => {
      const tree = renderer
        .create(<TokensVerticalTile dataLeft={[]} dataRight={[]} titleLeft='' titleRight='' isDataLoading={false} />)
        .toJSON();
  
      expect(tree).toMatchSnapshot();
    });
  
    it('renders TokensVerticalList components with correct titles', () => {
      const tree = renderer.create(<TokensVerticalTile dataLeft={mockDataLeft} dataRight={mockDataRight} titleLeft='Top climbers' titleRight='Top losers' isDataLoading={false} />).toJSON() as ReactTestRendererJSON;
      const verticalLists = tree.children as ReactTestRendererJSON[];

      const leftTitleProp = (verticalLists[0].children?.find(child => 
        typeof child === 'object' && child.type === 'p') as ReactTestRendererJSON);

      const rightTitleProp = (verticalLists[1].children?.find(child => 
        typeof child === 'object' && child.type === 'p') as ReactTestRendererJSON);
  
      expect(leftTitleProp.children).toContain('Top climbers');
      expect(rightTitleProp.children).toContain('Top losers');
    });
});

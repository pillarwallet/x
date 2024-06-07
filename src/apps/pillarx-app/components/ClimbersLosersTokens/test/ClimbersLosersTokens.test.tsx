import renderer from 'react-test-renderer';

// components
import ClimbersLosersTokens from '../ClimbersLosersTokens';

// types
import { TokenData } from '../../../../../types/api';

describe('<ClimbersLosersTokens />', () => {
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
  
    it('renders correctly and matches snapshot', () => {
        const tree = renderer
            .create(<ClimbersLosersTokens data={mockData} isDataLoading={false} />)
            .toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('displays loading skeleton when data is loading', () => {
        const tree = renderer
            .create(<ClimbersLosersTokens data={undefined} isDataLoading={true} />)
            .toJSON();

        expect(tree).toMatchSnapshot();
    });

});

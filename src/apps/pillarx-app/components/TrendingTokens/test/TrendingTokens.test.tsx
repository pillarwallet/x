import renderer from 'react-test-renderer';

// components
import TrendingTokens from '../TrendingTokens';

describe('<TrendingTokens />', () => {
    const mockData = [{
        id: 1,
        name: 'The best token',
        symbol: 'TBT',
        contracts: [{
            address: '0x123',
            blockchain: '111222',
            decimals: 18,
        }],
        logo: 'https://www.logo.com/example/',
        trending_score: 20,
        platforms: [{
            name: 'platform one',
            rank: 3,
            weight: 1,
    }],
        price_change_24h: 12.56,
        pair: 'pair example',
    }];

    const mockLoading = false;
  
    it('renders correctly and matches snapshot', () => {
        const tree = renderer
            .create(<TrendingTokens data={mockData} isDataLoading={mockLoading} />)
            .toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('displays loading skeleton when data is loading', () => {
        const tree = renderer
            .create(<TrendingTokens data={undefined} isDataLoading={true} />)
            .toJSON();

        expect(tree).toMatchSnapshot();
    });

});

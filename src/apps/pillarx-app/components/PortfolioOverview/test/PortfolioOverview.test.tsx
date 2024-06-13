import renderer from 'react-test-renderer';

// components
import PortfolioOverview from '../PortfolioOverview';

// types
import { ApiLayout, Projection } from '../../../../../types/api';

describe('<PortfolioOverview />', () => {
    const mockData: Projection = {
        meta: {
            display: {
                title: 'title',
            },
        },
        data: {
            wallet: 'wallet_address',
            wallets: [''],
            total_wallet_balance: 1000,
            assets: [],
            total_realized_pnl: 53,
            total_unrealized_pnl: 12,
            total_pnl_history: { '24h': { realized: 100, unrealized: 200 } }
        },
        layout: ApiLayout.OVERVIEW,
        id: 'overview',        
    };
    const mockLoading = false;
  
    it('renders correctly and matches snapshot', () => {
        const tree = renderer
            .create(<PortfolioOverview data={mockData} isDataLoading={mockLoading} />)
            .toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('displays loading skeleton when data is loading', () => {
        const tree = renderer
            .create(<PortfolioOverview data={undefined} isDataLoading={true} />)
            .toJSON();

        expect(tree).toMatchSnapshot();
    });

});

import renderer from 'react-test-renderer';
import PortofolioOverview from '../PortofolioOverview';


describe('<PortofolioOverview />', () => {
    const mockData = {
        wallet: 'wallet_address',
        wallets: [''],
        total_wallet_balance: 1000,
        assets: [],
        total_realized_pnl: 53,
        total_unrealized_pnl: 12,
        total_pnl_history: { '24h': { realized: 100, unrealized: 200 } }
    };
    const mockLoading = false;
  
    it('renders correctly and matches snapshot', () => {
        const tree = renderer
            .create(<PortofolioOverview data={mockData} isDataLoading={mockLoading} />)
            .toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('displays loading skeleton when data is loading', () => {
        const tree = renderer
            .create(<PortofolioOverview data={undefined} isDataLoading={true} />)
            .toJSON();

        expect(tree).toMatchSnapshot();
    });

});

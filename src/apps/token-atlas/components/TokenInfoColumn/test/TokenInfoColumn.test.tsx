import { render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';

// redux store
import { Provider } from 'react-redux';
import { store } from '../../../../../store';

// components
import TokenInfoColumn from '../TokenInfoColumn';

// reducer
import { setIsAllChainsVisible, setTokenDataInfo } from '../../../reducer/tokenAtlasSlice';

// types
import { TokenAtlasInfoData } from '../../../../../types/api';

const mockTokenDataInfo: TokenAtlasInfoData = {
    id: 1,
    market_cap: 100,
    market_cap_diluted: 100,
    liquidity: 150,
    price: 105,
    off_chain_volume: 150,
    volume: 150,
    volume_change_24h: 1.54,
    volume_7d: 2.3,
    is_listed: true,
    price_change_24h: 0.44,
    price_change_1h: 0.1,
    price_change_7d: 1.8,
    price_change_1m: 3.4,
    price_change_1y: 6.7,
    ath: 146,
    atl: 96,
    name: 'TOKEN',
    symbol: 'TKN',
    logo: 'tokenLogo.png',
    rank: 1047,
    contracts: [
        { blockchain: 'Ethereum', address: '0x01' },
        { blockchain: 'Binance Smart Chain', address: '0x02' },
        { blockchain: 'Polygon', address: '0x03' },
        { blockchain: 'Avalanche', address: '0x04' },
    ],
    total_supply: '300',
    circulating_supply: '170',
};

describe('<TokenInfoColumn />', () => {
    beforeEach(() => {
        store.dispatch(setIsAllChainsVisible(false));
        store.dispatch(setTokenDataInfo(mockTokenDataInfo))
    });

    it('renders correctly and matches snapshot', () => {
        const tree = renderer
            .create(
                <Provider store={store}>
                    <TokenInfoColumn isLoadingTokenDataInfo={false} />
                </Provider>
            )
            .toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('displays circular loading when loading data', () => {
        render(
            <Provider store={store}>
                <TokenInfoColumn isLoadingTokenDataInfo={true} />
            </Provider>
        );

        expect(screen.getAllByTestId('circular-loading')).toHaveLength(2);
    });

    it('renders some of the blockchain cards when not loading', () => {
        render(
            <Provider store={store}>
                <TokenInfoColumn isLoadingTokenDataInfo={false} />
            </Provider>
        );

        expect(screen.getByText('Ethereum')).toBeInTheDocument();
    });

    it('renders the correct price change cards', () => {
        render(
            <Provider store={store}>
                <TokenInfoColumn isLoadingTokenDataInfo={false} />
            </Provider>
        );

        expect(screen.getByText('1H')).toBeInTheDocument();
        expect(screen.getByText('24H')).toBeInTheDocument();
        expect(screen.getByText('7D')).toBeInTheDocument();
        expect(screen.getByText('1M')).toBeInTheDocument();
        expect(screen.getByText('1Y')).toBeInTheDocument();
    });

    it('renders correct stats for token information', () => {
        render(
            <Provider store={store}>
                <TokenInfoColumn isLoadingTokenDataInfo={false} />
            </Provider>
        );

        expect(screen.getByText('All time high')).toBeInTheDocument();
        expect(screen.getByText('146')).toBeInTheDocument();
        expect(screen.getByText('All time low')).toBeInTheDocument();
        expect(screen.getByText('96')).toBeInTheDocument();
        expect(screen.getByText('Total supply')).toBeInTheDocument();
        expect(screen.getByText('300')).toBeInTheDocument();
        expect(screen.getByText('Circulating supply')).toBeInTheDocument();
        expect(screen.getByText('170')).toBeInTheDocument();
        expect(screen.getByText('Diluted market cap')).toBeInTheDocument();
        expect(screen.getByText('100')).toBeInTheDocument();
    });


    it('does not crash when tokenDataInfo is undefined', () => {
        render(
            <Provider store={store}>
                <TokenInfoColumn isLoadingTokenDataInfo={false} />
            </Provider>
        );

        expect(screen.getByText('Blockchains')).toBeInTheDocument();
        expect(screen.getByText('Price changes')).toBeInTheDocument();
        expect(screen.getByText('Stats')).toBeInTheDocument();
    });
});

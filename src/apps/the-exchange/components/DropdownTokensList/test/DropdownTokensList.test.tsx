import renderer, { act } from 'react-test-renderer';
import { render, fireEvent } from '@testing-library/react';

// provider
import { Provider } from 'react-redux';
import { store } from '../../../../../store';

// reducer
import { 
    setAmountReceive,
    setAmountSwap,
    setBestOffer,
    setIsOfferLoading,
    setIsReceiveOpen,
    setIsSwapOpen,
    setReceiveChain,
    setReceiveToken,
    setReceiveTokenData,
    setSearchTokenResult,
    setSwapChain,
    setSwapToken,
    setSwapTokenData, 
    setUsdPriceReceiveToken, 
    setUsdPriceSwapToken} from '../../../reducer/theExchangeSlice';

// types
import { CardPosition } from '../../../utils/types';

// components
import DropdownTokenList from '../DropdownTokenList';

const mockTokenAssets = [
    { address: '0x01', name: 'Ether', symbol: 'ETH', chainId: 1, decimals: 18, icon: 'iconEth.png' },
    { address: '0x02', name: 'Matic', symbol: 'MATIC', chainId: 137, decimals: 18, icon: 'iconMatic.png' },
  ];

describe('<DropdownTokenList />', () => {
    beforeEach(() => {
        act(() => {
            store.dispatch(setSwapTokenData(mockTokenAssets));
            store.dispatch(setReceiveTokenData(mockTokenAssets));
            store.dispatch(setIsSwapOpen(false));
            store.dispatch(setIsReceiveOpen(false));
            store.dispatch(setSwapChain({ chainId: 1, chainName: 'Ethereum' }));
            store.dispatch(setReceiveChain({ chainId: 137, chainName: 'Polygon' }));
            store.dispatch(setSwapToken(mockTokenAssets[0]));
            store.dispatch(setReceiveToken(mockTokenAssets[1]));
            store.dispatch(setAmountSwap(0.1));
            store.dispatch(setAmountReceive(10));
            store.dispatch(setBestOffer(undefined));
            store.dispatch(setSearchTokenResult([]));
            store.dispatch(setUsdPriceSwapToken(1200));
            store.dispatch(setUsdPriceReceiveToken(0.4));
            store.dispatch(setIsOfferLoading(false));
        });
      });  
    it('renders correctly and matches snapshot', () => {
        const tree = renderer
            .create(
                <Provider store={store}>
                    <DropdownTokenList type={CardPosition.SWAP} initialCardPosition={CardPosition.SWAP} />
                </Provider>)
            .toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('renders with initial props', () => {
        const { getByTestId } = render(
            <Provider store={store}>
                <DropdownTokenList type={CardPosition.SWAP} initialCardPosition={CardPosition.SWAP} />
            </Provider>
        );

        act(() => {
            store.dispatch(setIsSwapOpen(true));
        });

        const dropdownList = getByTestId('dropdown-token-list');
        expect(dropdownList).toBeInTheDocument();
    });

    it('allows selecting tokens in Swap card', async () => {
        const { getByPlaceholderText, getAllByTestId } = render(
            <Provider store={store}>
                <DropdownTokenList type={CardPosition.SWAP} initialCardPosition={CardPosition.SWAP} />
            </Provider>
        );

        act(() => {
            store.dispatch(setIsSwapOpen(true));
            store.dispatch(setSwapChain({chainId: 0, chainName: 'all'}))
        });

        const searchInput = getByPlaceholderText('Search tokens');
        fireEvent.focus(searchInput);
        fireEvent.change(searchInput, { target: { value: 'eth' } });
        
        const tokenItems = getAllByTestId('token-list-item');
        expect(tokenItems.length).toBe(1);

        const firstTokenItem = getAllByTestId('token-list-item');
        fireEvent.click(firstTokenItem[0]);
        
        expect(store.getState().swap.swapToken).toBe(mockTokenAssets[0]);
        expect(store.getState().swap.swapChain).toEqual({ chainId: 1, chainName: '1' });
        expect(store.getState().swap.isSwapOpen).toBe(false);
    });

    it('allows selecting tokens in Receive card', async () => {
        const { getByPlaceholderText, getAllByTestId } = render(
            <Provider store={store}>
                <DropdownTokenList type={CardPosition.RECEIVE} initialCardPosition={CardPosition.RECEIVE} />
            </Provider>
        );

        act(() => {
            store.dispatch(setIsReceiveOpen(true));
            store.dispatch(setReceiveChain({chainId: 0, chainName: 'all'}))
        });

        const searchInput = getByPlaceholderText('Search tokens');
        fireEvent.focus(searchInput);
        fireEvent.change(searchInput, { target: { value: 'ma' } });
        
        const tokenItems = getAllByTestId('token-list-item');
        expect(tokenItems.length).toBe(1);

        const firstTokenItem = getAllByTestId('token-list-item');
        fireEvent.click(firstTokenItem[0]);
    
        expect(store.getState().swap.receiveToken).toBe(mockTokenAssets[1]);
        expect(store.getState().swap.receiveChain).toEqual({ chainId: 137, chainName: '137' });
        expect(store.getState().swap.isReceiveOpen).toBe(false);
    });

    it('closes the dropdown when close button is clicked', async () => {
        const { getByTestId } = render(
            <Provider store={store}>
                <DropdownTokenList type={CardPosition.SWAP} initialCardPosition={CardPosition.SWAP} />
            </Provider>
        );

        act(() => {
            store.dispatch(setIsSwapOpen(true));
        });

        const closeButton = getByTestId('close-card-button');
        fireEvent.click(closeButton);

        expect(store.getState().swap.isSwapOpen).toBe(false);
        expect(store.getState().swap.searchTokenResult).toEqual([]);
    });
});

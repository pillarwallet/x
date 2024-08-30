import { render, screen, fireEvent } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter

// redux store
import { Provider } from 'react-redux';
import { store } from '../../../../../store';

// reducer
import {
    setIsSearchTokenModalOpen,
    setIsSelectChainDropdownOpen,
    setSearchTokenResult,
    setSelectedChain,
    setIsAllChainsVisible
} from '../../../reducer/tokenAtlasSlice';

// components
import SearchTokenModal from '../SearchTokenModal';

const mockTokenListData = [
    { chainId: 1, name: 'Token1' },
    { chainId: 2, name: 'Token2' },
    { chainId: 1, name: 'Token3' },
];

describe('<SearchTokenModal />', () => {
    beforeEach(() => {
        store.dispatch(setSearchTokenResult([]));
        store.dispatch(setIsAllChainsVisible(false));
        store.dispatch(setSelectedChain({ chainId: 0, chainName: 'all' }));
    });

    it('renders correctly and matches snapshot', () => {
        const tree = renderer
            .create(
                <Provider store={store}>
                    <MemoryRouter>
                        <SearchTokenModal />
                    </MemoryRouter>
                </Provider>)
            .toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('renders correctly when modal is open', () => {
        store.dispatch(setIsSearchTokenModalOpen(true));
        store.dispatch({ type: 'tokenAtlas/setTokenListData', payload: mockTokenListData });

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <SearchTokenModal />
                </MemoryRouter>
            </Provider>
        );

        expect(screen.getByText('Token1')).toBeInTheDocument();
        expect(screen.getByText('Token2')).toBeInTheDocument();
        expect(screen.getByText('Token3')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
    });

    it('renders nothing when modal is closed', () => {
        store.dispatch(setIsSearchTokenModalOpen(false));

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <SearchTokenModal />
                </MemoryRouter>
            </Provider>
        );

        expect(screen.queryByText('Token1')).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument();
    });

    it('closes the modal when the close button is clicked', () => {
        store.dispatch(setIsSearchTokenModalOpen(true));
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <SearchTokenModal />
                </MemoryRouter>
            </Provider>
        );

        fireEvent.click(screen.getByRole('button', { name: /close/i }));

        expect(store.getState().tokenAtlas.isSearchTokenModalOpen).toBe(false);
        expect(store.getState().tokenAtlas.selectedChain).toEqual({ chainId: 0, chainName: 'all' });
        expect(store.getState().tokenAtlas.searchTokenResult).toEqual([]);
        expect(store.getState().tokenAtlas.isAllChainsVisible).toBe(false);
    });

    it('handles SelectChainDropdown visibility correctly when opened', () => {
        store.dispatch(setIsSearchTokenModalOpen(true));
        store.dispatch(setIsSelectChainDropdownOpen(true));
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <SearchTokenModal />
                </MemoryRouter>
            </Provider>
        );

        expect(screen.getByTestId('select-chain-dropdown')).toHaveClass('w-full');
    });

    it('handles SelectChainDropdown visibility correctly when closed', () => {
        store.dispatch(setIsSearchTokenModalOpen(true));
        store.dispatch(setIsSelectChainDropdownOpen(false));
 
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <SearchTokenModal />
                </MemoryRouter>
            </Provider>
        );

        expect(screen.getByTestId('select-chain-dropdown')).toHaveClass('basis-2/5');
    });

    it('displays unique chainId in SelectChainDropdown', () => {
        store.dispatch(setIsSearchTokenModalOpen(true));
        store.dispatch(setIsSelectChainDropdownOpen(true));
        store.dispatch({ type: 'tokenAtlas/setTokenListData', payload: mockTokenListData });

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <SearchTokenModal />
                </MemoryRouter>
            </Provider>
        );

        const uniqueChainIds = [1, 2];
        uniqueChainIds.forEach(chainId => {
            expect(screen.getByText(chainId.toString())).toBeInTheDocument();
        });
    });
});

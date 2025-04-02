import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter
import renderer from 'react-test-renderer';

// redux store
import { Provider } from 'react-redux';
import { store } from '../../../../../store';

// reducer
import {
  setIsAllChainsVisible,
  setIsSearchTokenModalOpen,
  setIsSelectChainDropdownOpen,
  setSearchTokenResult,
  setSelectedChain,
} from '../../../reducer/tokenAtlasSlice';

// components
import SearchTokenModal from '../SearchTokenModal';

describe('<SearchTokenModal />', () => {
  beforeEach(() => {
    store.dispatch(setSearchTokenResult(undefined));
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
        </Provider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly when modal is open', () => {
    store.dispatch(setIsSearchTokenModalOpen(true));

    render(
      <Provider store={store}>
        <MemoryRouter>
          <SearchTokenModal />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Start searching for tokens.')).toBeInTheDocument();
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

    expect(
      screen.queryByText('Start searching for tokens.')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /close/i })
    ).not.toBeInTheDocument();
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
    expect(store.getState().tokenAtlas.selectedChain).toEqual({
      chainId: 0,
      chainName: 'all',
    });
    expect(store.getState().tokenAtlas.searchTokenResult).toEqual(undefined);
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

    expect(screen.getByTestId('select-chain-dropdown')).toHaveClass(
      'basis-2/5'
    );
  });
});

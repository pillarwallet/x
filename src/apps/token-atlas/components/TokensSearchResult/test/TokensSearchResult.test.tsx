import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';

// redux store
import { Provider } from 'react-redux';
import { store } from '../../../../../store';

// components
import TokensSearchResult from '../TokensSearchResult';

// reducers
import {
  setSearchTokenResult,
  setSelectedChain,
  setSelectedToken,
} from '../../../reducer/tokenAtlasSlice';

// services
import { Token } from '../../../../../services/tokensData';

const mockTokens: Token[] = [
  {
    id: 1,
    name: 'Token1',
    symbol: 'TK1',
    blockchain: 'Ethereum',
    logo: 'logo1.png',
    decimals: 18,
    contract: '0x01',
  },
  {
    id: 2,
    name: 'Token2',
    symbol: 'TK2',
    blockchain: 'Polygon',
    logo: 'logo2.png',
    decimals: 18,
    contract: '0x02',
  },
];

describe('<TokensSearchResult />', () => {
  beforeEach(() => {
    store.dispatch(setSearchTokenResult(mockTokens));
    store.dispatch(setSelectedChain({ chainId: 0, chainName: 'all' }));
    store.dispatch(setSelectedToken(undefined));
  });
  it('renders correctly and matches snapshot', () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <MemoryRouter>
            <TokensSearchResult />
          </MemoryRouter>
        </Provider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders search results when tokens are present', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <TokensSearchResult />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Token1')).toBeInTheDocument();
    expect(screen.getByText('Token2')).toBeInTheDocument();
  });

  it('renders no results with only chain selected', () => {
    store.dispatch(setSearchTokenResult([]));
    store.dispatch(setSelectedChain({ chainId: 1, chainName: 'chain1' }));
    store.dispatch(setSelectedToken(undefined));

    render(
      <Provider store={store}>
        <MemoryRouter>
          <TokensSearchResult />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.queryByText('TokenList1')).not.toBeInTheDocument();
    expect(screen.queryByText('TokenList2')).not.toBeInTheDocument();
    expect(screen.getByText(/no tokens found/i)).toBeInTheDocument();
  });

  it('handles token selection', () => {
    const mockToken: Token = {
      id: 5,
      name: 'TestToken',
      symbol: 'TTK',
      blockchain: 'Ethereum',
      logo: 'testLogo.png',
      decimals: 6,
      contract: '0x06',
    };

    store.dispatch(setSearchTokenResult([mockToken]));
    store.dispatch(setSelectedChain({ chainId: 0, chainName: 'all' }));
    store.dispatch(setSelectedToken(undefined));

    render(
      <Provider store={store}>
        <MemoryRouter>
          <TokensSearchResult />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByText('TestToken'));

    expect(store.getState().tokenAtlas.selectedToken).toEqual({
      id: 5,
      name: 'TestToken',
      symbol: 'TTK',
      chainId: 1,
      icon: 'testLogo.png',
      decimals: 6,
      address: '0x06',
    });
    expect(store.getState().tokenAtlas.isSearchTokenModalOpen).toBe(false);
    expect(store.getState().tokenAtlas.selectedChain).toEqual({
      chainId: 0,
      chainName: 'all',
    });
    expect(store.getState().tokenAtlas.searchTokenResult).toEqual(undefined);
  });
});

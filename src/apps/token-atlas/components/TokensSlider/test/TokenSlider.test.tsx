import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import { vi } from 'vitest';

// types
import type { Mock } from 'vitest';

// api
import { useGetTrendingTokensQuery } from '../../../api/token';

// store
import { store } from '../../../../../store';

// reducer
import {
  setIsSearchTokenModalOpen,
  setSelectedChain,
  setSelectedToken,
} from '../../../reducer/tokenAtlasSlice';

// components
import TokensSlider from '../TokensSlider';

vi.mock('../../../api/token', () => ({
  useGetTrendingTokensQuery: vi.fn(),
}));

const mockTrendingTokens = {
  result: [
    {
      id: 1,
      name: 'Token1',
      symbol: 'T1',
      logo: 'logo1.png',
      contracts: [{ blockchain: 'Ethereum' }],
    },
    {
      id: 2,
      name: 'Token2',
      symbol: 'T2',
      logo: 'logo2.png',
      contracts: [{ blockchain: 'Polygon' }],
    },
  ],
};

describe('<TokensSlider />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    store.dispatch(setSelectedToken(undefined));
    store.dispatch(setIsSearchTokenModalOpen(false));
    store.dispatch(setSelectedChain({ chainId: 0, chainName: 'all' }));
  });

  it('renders correctly and matches snapshot when loading', () => {
    (useGetTrendingTokensQuery as Mock).mockReturnValue({
      data: null,
      isLoading: true,
      isFetching: false,
    });

    const tree = renderer
      .create(
        <Provider store={store}>
          <MemoryRouter>
            <TokensSlider />
          </MemoryRouter>
        </Provider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders loading skeletons while fetching data', () => {
    (useGetTrendingTokensQuery as Mock).mockReturnValue({
      data: null,
      isLoading: true,
      isFetching: false,
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <TokensSlider />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId('token-slider-loader')).toBeInTheDocument();
    expect(screen.getByText(/trending tokens/i)).toBeInTheDocument();
  });

  it('renders correctly when trending tokens are available', () => {
    (useGetTrendingTokensQuery as Mock).mockReturnValue({
      data: mockTrendingTokens,
      isLoading: false,
      isFetching: false,
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <TokensSlider />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Token1')).toBeInTheDocument();
    expect(screen.getByText('Token2')).toBeInTheDocument();
  });

  it('handles token selection correctly', () => {
    (useGetTrendingTokensQuery as Mock).mockReturnValue({
      data: mockTrendingTokens,
      isLoading: false,
      isFetching: false,
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <TokensSlider />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByText('Token1'));

    const { selectedToken } = store.getState().tokenAtlas;
    expect(selectedToken).toEqual({
      id: 1,
      symbol: 'T1',
      address: '',
      decimals: undefined,
      chainId: 1,
      name: 'Token1',
      icon: 'logo1.png',
      price: 0,
    });

    expect(store.getState().tokenAtlas.isSearchTokenModalOpen).toBe(false);
    expect(store.getState().tokenAtlas.selectedChain).toEqual({
      chainId: 0,
      chainName: 'all',
    });
  });

  it('renders correctly when no trending tokens are available', () => {
    (useGetTrendingTokensQuery as Mock).mockReturnValue({
      data: { data: [] },
      isLoading: false,
      isFetching: false,
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <TokensSlider />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/trending tokens/i)).toBeInTheDocument();
    expect(screen.queryByText(/Token/)).not.toBeInTheDocument();
  });
});

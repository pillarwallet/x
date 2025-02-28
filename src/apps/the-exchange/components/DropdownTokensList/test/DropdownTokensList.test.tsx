import { fireEvent, render } from '@testing-library/react';
import renderer, { act } from 'react-test-renderer';

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
  setUsdPriceSwapToken,
} from '../../../reducer/theExchangeSlice';

// types
import { Token } from '../../../../../services/tokensData';
import { CardPosition } from '../../../utils/types';

// components
import DropdownTokenList from '../DropdownTokenList';

const mockTokenAssets: Token[] = [
  {
    id: 1,
    contract: '0x01',
    name: 'Ether',
    symbol: 'ETH',
    blockchain: 'Ethereum',
    decimals: 18,
    logo: 'iconEth.png',
  },
  {
    id: 2,
    contract: '0x02',
    name: 'POL',
    symbol: 'POL',
    blockchain: 'Polygon',
    decimals: 18,
    logo: 'iconMatic.png',
  },
];

jest.mock('../../../../../services/tokensData', () => ({
  __esModule: true,
  chainNameToChainIdTokensData: jest
    .fn()
    .mockImplementation((chainName: string) => {
      const mockChainIdMap = {
        Ethereum: 1,
        Polygon: 137,
      } as const;

      return mockChainIdMap[chainName as keyof typeof mockChainIdMap] || null;
    }),
  queryTokenData: jest.fn().mockReturnValue([
    {
      id: 1,
      contract: '0x01',
      name: 'Ether',
      symbol: 'ETH',
      blockchain: 'Ethereum',
      decimals: 18,
      logo: 'iconEth.png',
    },
    {
      id: 2,
      contract: '0x02',
      name: 'POL',
      symbol: 'POL',
      blockchain: 'Polygon',
      decimals: 18,
      logo: 'iconMatic.png',
    },
  ]),
  searchTokens: jest.fn().mockImplementation((query) => {
    return [
      { id: 1, name: 'Ether', symbol: 'ETH' },
      { id: 2, name: 'Polygon', symbol: 'POL' },
    ].filter(
      (token) => token.name.includes(query) || token.symbol.includes(query)
    );
  }),
}));

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
          <DropdownTokenList
            type={CardPosition.SWAP}
            initialCardPosition={CardPosition.SWAP}
          />
        </Provider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders with initial props', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <DropdownTokenList
          type={CardPosition.SWAP}
          initialCardPosition={CardPosition.SWAP}
        />
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
        <DropdownTokenList
          type={CardPosition.SWAP}
          initialCardPosition={CardPosition.SWAP}
        />
      </Provider>
    );

    act(() => {
      store.dispatch(setIsSwapOpen(true));
      store.dispatch(setSwapChain({ chainId: 0, chainName: 'all' }));
    });

    const searchInput = getByPlaceholderText('Search tokens');
    fireEvent.focus(searchInput);
    fireEvent.change(searchInput, { target: { value: 'eth' } });

    const tokenItems = getAllByTestId('token-list-item');
    expect(tokenItems.length).toBe(1);

    const firstTokenItem = getAllByTestId('token-list-item');
    fireEvent.click(firstTokenItem[0]);

    expect(store.getState().swap.swapToken).toBe(mockTokenAssets[0]);
    expect(store.getState().swap.swapChain).toEqual({
      chainId: 1,
      chainName: 'Ethereum',
    });
    expect(store.getState().swap.isSwapOpen).toBe(false);
  });

  it('allows selecting tokens in Receive card', async () => {
    const { getByPlaceholderText, getAllByTestId } = render(
      <Provider store={store}>
        <DropdownTokenList
          type={CardPosition.RECEIVE}
          initialCardPosition={CardPosition.RECEIVE}
        />
      </Provider>
    );

    act(() => {
      store.dispatch(setIsReceiveOpen(true));
      store.dispatch(setReceiveChain({ chainId: 0, chainName: 'all' }));
    });

    const searchInput = getByPlaceholderText('Search tokens');
    fireEvent.focus(searchInput);
    fireEvent.change(searchInput, { target: { value: 'ma' } });

    const tokenItems = getAllByTestId('token-list-item');
    expect(tokenItems.length).toBe(1);

    const firstTokenItem = getAllByTestId('token-list-item');
    fireEvent.click(firstTokenItem[0]);

    expect(store.getState().swap.receiveToken).toBe(mockTokenAssets[1]);
    expect(store.getState().swap.receiveChain).toEqual({
      chainId: 137,
      chainName: 'Polygon',
    });
    expect(store.getState().swap.isReceiveOpen).toBe(false);
  });

  it('closes the dropdown when close button is clicked', async () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <DropdownTokenList
          type={CardPosition.SWAP}
          initialCardPosition={CardPosition.SWAP}
        />
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

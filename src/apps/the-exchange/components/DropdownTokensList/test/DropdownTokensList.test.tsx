import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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
  setSearchTokenResult,
  setSwapChain,
  setSwapToken,
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

vi.mock('../../../../../services/tokensData', () => ({
  __esModule: true,
  chainNameToChainIdTokensData: vi
    .fn()
    .mockImplementation((chainName: string) => {
      const mockChainIdMap = {
        Ethereum: 1,
        Polygon: 137,
      } as const;

      return mockChainIdMap[chainName as keyof typeof mockChainIdMap] || null;
    }),
  chainIdToChainNameTokensData: vi
    .fn()
    .mockImplementation((chainId: number) => {
      const mockChainNameMap = {
        1: 'Ethereum',
        137: 'Polygon',
      } as const;

      return mockChainNameMap[chainId as keyof typeof mockChainNameMap] || null;
    }),
  queryTokenData: vi.fn().mockReturnValue([
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
  chainNameDataCompatibility: vi
    .fn()
    .mockImplementation((chainName: string) => {
      const mockChainMap = {
        XDAI: 'Gnosis',
        'BNB Smart Chain (BEP20)': 'BNB Smart Chain',
        Optimistic: 'Optimism',
        Arbitrum: 'Arbitrum',
      } as const;

      return mockChainMap[chainName as keyof typeof mockChainMap] || chainName;
    }),
}));

describe('<DropdownTokenList />', () => {
  beforeEach(() => {
    act(() => {
      store.dispatch(setIsSwapOpen(false));
      store.dispatch(setIsReceiveOpen(false));
      store.dispatch(setSwapChain({ chainId: 1, chainName: 'Ethereum' }));
      store.dispatch(setReceiveChain({ chainId: 137, chainName: 'Polygon' }));
      store.dispatch(setSwapToken(mockTokenAssets[0]));
      store.dispatch(setReceiveToken(mockTokenAssets[1]));
      store.dispatch(setAmountSwap(0.1));
      store.dispatch(setAmountReceive(10));
      store.dispatch(setBestOffer(undefined));
      store.dispatch(setSearchTokenResult(undefined));
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
    render(
      <Provider store={store}>
        <DropdownTokenList
          type={CardPosition.SWAP}
          initialCardPosition={CardPosition.SWAP}
        />
      </Provider>
    );

    act(() => {
      store.dispatch(setIsSwapOpen(true));
      store.dispatch(setSearchTokenResult(mockTokenAssets));
    });

    fireEvent.click(screen.getAllByTestId('token-list-item')[0]);

    expect(store.getState().swap.swapToken).toBe(mockTokenAssets[0]);
    expect(store.getState().swap.isSwapOpen).toBe(false);
  });

  it('allows selecting tokens in Receive card', async () => {
    render(
      <Provider store={store}>
        <DropdownTokenList
          type={CardPosition.RECEIVE}
          initialCardPosition={CardPosition.RECEIVE}
        />
      </Provider>
    );

    act(() => {
      store.dispatch(setIsReceiveOpen(true));
      store.dispatch(setSearchTokenResult(mockTokenAssets));
    });

    fireEvent.click(screen.getAllByTestId('token-list-item')[0]);

    expect(store.getState().swap.receiveToken).toBe(mockTokenAssets[1]);
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
    expect(store.getState().swap.searchTokenResult).toEqual(undefined);
  });

  it('sets Swap Chain back to all when close and reopen the dropdown', async () => {
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
      store.dispatch(setSwapChain({ chainId: 1, chainName: 'Ethereum' }));
    });

    await waitFor(() => {
      expect(store.getState().swap.swapChain).toStrictEqual({
        chainId: 1,
        chainName: 'Ethereum',
      });
    });

    const closeButton = getByTestId('close-card-button');
    fireEvent.click(closeButton);

    expect(store.getState().swap.isSwapOpen).toBe(false);
    expect(store.getState().swap.searchTokenResult).toEqual(undefined);
    expect(store.getState().swap.swapChain).toStrictEqual({
      chainId: 0,
      chainName: 'all',
    });
  });

  it('sets Receive Chain back to all when close and reopen the dropdown', async () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <DropdownTokenList
          type={CardPosition.RECEIVE}
          initialCardPosition={CardPosition.RECEIVE}
        />
      </Provider>
    );

    act(() => {
      store.dispatch(setIsReceiveOpen(true));
      store.dispatch(setReceiveChain({ chainId: 1, chainName: 'Ethereum' }));
    });

    await waitFor(() => {
      expect(store.getState().swap.receiveChain).toStrictEqual({
        chainId: 1,
        chainName: 'Ethereum',
      });
    });

    const closeButton = getByTestId('close-card-button');
    fireEvent.click(closeButton);

    expect(store.getState().swap.isReceiveOpen).toBe(false);
    expect(store.getState().swap.searchTokenResult).toEqual(undefined);
    expect(store.getState().swap.receiveChain).toStrictEqual({
      chainId: 0,
      chainName: 'all',
    });
  });
});

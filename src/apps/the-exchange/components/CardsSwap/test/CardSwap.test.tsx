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
} from '../../../reducer/theExchangeSlice';

// components
import CardsSwap from '../CardsSwap';

// types
import { Token } from '../../../../../services/tokensData';

const mockTokenAssets: Token[] = [
  {
    id: 1,
    contract: '0x01',
    name: 'Ether',
    symbol: 'ETH',
    blockchain: 'Ethereum',
    decimals: 18,
    logo: 'iconEth.png',
    balance: 4,
    price: 0.1,
  },
  {
    id: 2,
    contract: '0x02',
    name: 'POL',
    symbol: 'POL',
    blockchain: 'Polygon',
    decimals: 18,
    logo: 'iconMatic.png',
    balance: 12,
    price: 100,
  },
];

vi.mock('../../../../../services/pillarXApiSearchTokens', () => ({
  __esModule: true,
  useGetSearchTokensQuery: vi.fn().mockReturnValue({
    data: undefined,
    isLoading: false,
    isFetching: false,
  }),
}));

vi.mock('../../../../../services/tokensData', () => ({
  __esModule: true,
  chainNameToChainIdTokensData: vi
    .fn()
    .mockImplementation((chainName: string) => {
      const mockChainIdMap = {
        Ethereum: 1,
        Polygon: 137,
      } as const;

      return mockChainIdMap[chainName as keyof typeof mockChainIdMap] || '';
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
  convertAPIResponseToTokens: vi.fn().mockReturnValue([
    {
      id: 1,
      contract: '0x01',
      name: 'Ether',
      symbol: 'ETH',
      blockchain: 'Ethereum',
      decimals: 18,
      logo: 'iconEth.png',
      balance: 4,
      price: 0.1,
    },
    {
      id: 2,
      contract: '0x02',
      name: 'POL',
      symbol: 'POL',
      blockchain: 'Polygon',
      decimals: 18,
      logo: 'iconMatic.png',
      balance: 12,
      price: 100,
    },
  ]),
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

// Mock transaction-kit hooks being used
vi.mock('@etherspot/transaction-kit', () => ({
  __esModule: true,
  useEtherspotSwaps: vi.fn().mockReturnValue({
    getOffers: vi.fn().mockResolvedValue([]),
    prepareCrossChainOfferTransactions: vi.fn().mockResolvedValue({}),
    getQuotes: vi.fn().mockResolvedValue({}),
  }),
  useWalletAddress: vi.fn().mockReturnValue({
    walletAddress: vi.fn(),
  }),
  useEtherspotUtils: vi.fn().mockReturnValue({
    isZeroAddress: vi.fn(),
    addressesEqual: vi.fn(),
  }),
}));

vi.mock('@lifi/sdk', () => ({
  LiFi: vi.fn().mockImplementation(() => ({
    getRoutes: vi.fn().mockResolvedValue({ routes: [] }),
    getStepTransaction: vi.fn().mockResolvedValue({}),
  })),
}));

describe('<CardsSwap />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
      store.dispatch(setIsOfferLoading(false));
    });
    import.meta.env.VITE_SWAP_BUTTON_SWITCH = 'true';
  });

  it('renders correctly and matches snapshot', () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <CardsSwap />
        </Provider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly the swap and receive cards with the swap button', () => {
    render(
      <Provider store={store}>
        <CardsSwap />
      </Provider>
    );

    expect(screen.getByTestId('swap-receive-cards')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls swapCards when the swap button is clicked', () => {
    render(
      <Provider store={store}>
        <CardsSwap />
      </Provider>
    );

    const swapButton = screen.getByRole('button');
    fireEvent.click(swapButton);

    expect(store.getState().swap.swapChain).toEqual({
      chainId: 137,
      chainName: 'Polygon',
    });
    expect(store.getState().swap.receiveChain).toEqual({
      chainId: 1,
      chainName: 'Ethereum',
    });
    expect(store.getState().swap.swapToken).toBe(mockTokenAssets[1]);
    expect(store.getState().swap.receiveToken).toBe(mockTokenAssets[0]);
    expect(store.getState().swap.amountSwap).toEqual(10);
    expect(store.getState().swap.amountReceive).toEqual(0);
    expect(store.getState().swap.usdPriceSwapToken).toEqual(100);
    expect(store.getState().swap.usdPriceReceiveToken).toEqual(0.1);
  });

  it('opens token list when a card is clicked and no token on swap card', async () => {
    render(
      <Provider store={store}>
        <CardsSwap />
      </Provider>
    );

    act(() => {
      store.dispatch(setSwapToken(undefined));
      store.dispatch(setAmountSwap(0));
      store.dispatch(setAmountReceive(0));
    });

    const swapCard = screen.getAllByTestId('select-token-card');

    fireEvent.click(swapCard[0]);

    await waitFor(() => {
      expect(store.getState().swap.isSwapOpen).toBe(true);
    });
  });

  it('renders the dropdown when isSwapOpen is true', () => {
    render(
      <Provider store={store}>
        <CardsSwap />
      </Provider>
    );

    act(() => {
      store.dispatch(setIsSwapOpen(true));
    });

    expect(screen.getByTestId('dropdown-token-list')).toBeInTheDocument();
    expect(screen.queryByTestId('select-token-car')).not.toBeInTheDocument();
  });

  it('renders the dropdown when isReceiveOpen is true', () => {
    render(
      <Provider store={store}>
        <CardsSwap />
      </Provider>
    );

    act(() => {
      store.dispatch(setIsReceiveOpen(true));
    });

    expect(screen.getByTestId('dropdown-token-list')).toBeInTheDocument();
    expect(screen.queryByTestId('select-token-car')).not.toBeInTheDocument();
  });
});

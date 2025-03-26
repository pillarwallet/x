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
  setReceiveTokenData,
  setSearchTokenResult,
  setSwapChain,
  setSwapToken,
  setSwapTokenData,
  setUsdPriceReceiveToken,
  setUsdPriceSwapToken,
} from '../../../reducer/theExchangeSlice';

// components
import CardsSwap from '../CardsSwap';

// types
import { AccountBalancesListenerRef } from '../../../../../providers/AccountBalancesProvider';
import { Token } from '../../../../../services/tokensData';

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
  chainNameDataCompatibility: jest
    .fn()
    .mockImplementation((chainName: string) => {
      const mockChainMap = {
        XDAI: 'Gnosis',
        'BNB Smart Chain (BEP20)': 'BNB Smart Chain',
        Optimistic: 'Optimism',
        Arbitrum: 'Arbitrum One',
      } as const;

      return mockChainMap[chainName as keyof typeof mockChainMap] || chainName;
    }),
}));

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

// Mock transaction-kit hooks being used
jest.mock('@etherspot/transaction-kit', () => ({
  __esModule: true,
  useEtherspotSwaps: jest.fn().mockReturnValue({
    getOffers: jest.fn().mockResolvedValue([]),
    prepareCrossChainOfferTransactions: jest.fn().mockResolvedValue({}),
    getQuotes: jest.fn().mockResolvedValue({}),
  }),
  useEtherspotPrices: jest.fn().mockReturnValue({
    getPrice: jest.fn().mockResolvedValue({ usd: 1200 }),
    getPrices: jest.fn(),
  }),
  useWalletAddress: jest.fn().mockReturnValue({
    walletAddress: jest.fn(),
  }),
  useEtherspotUtils: jest.fn().mockReturnValue({
    isZeroAddress: jest.fn(),
    addressesEqual: jest.fn(),
  }),
  useEtherspotAssets: jest.fn().mockReturnValue({
    getAssets: jest.fn(),
    getSupportedAssets: jest.fn(),
  }),
}));

// Mock useAssets hook
jest.mock('../../../../../hooks/useAssets', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    1: [
      {
        address: '0x01',
        chainId: 1,
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18,
        logoURI: 'iconEth.png',
      },
    ],
    137: [
      {
        address: '0x02',
        chainId: 137,
        name: 'POL',
        symbol: 'POL',
        decimals: 18,
        logoURI: 'iconMatic.png',
      },
    ],
  }),
}));

// Mock useAccountBalances hook
jest.mock('../../../../../hooks/useAccountBalances', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    listenerRef: { current: {} as AccountBalancesListenerRef },
    data: {
      balances: {
        '0x01': { balance: '0.2', usdValue: '6000' },
        '0x02': { balance: '20', usdValue: '6000' },
      },
      updateData: false,
      setUpdateData: jest.fn(),
    },
  }),
}));

describe('<CardsSwap />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
    expect(store.getState().swap.usdPriceSwapToken).toEqual(0.4);
    expect(store.getState().swap.usdPriceReceiveToken).toEqual(1200);
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

    expect(store.getState().swap.swapTokenData).toStrictEqual(mockTokenAssets);
    expect(store.getState().swap.receiveTokenData).toStrictEqual(
      mockTokenAssets
    );

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

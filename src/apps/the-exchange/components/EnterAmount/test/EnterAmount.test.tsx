import { fireEvent, render, waitFor } from '@testing-library/react';
import renderer, { act } from 'react-test-renderer';
import { vi } from 'vitest';

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
  setUsdPriceSwapToken,
} from '../../../reducer/theExchangeSlice';

// types
import { Token } from '../../../../../services/tokensData';
import { CardPosition } from '../../../utils/types';

// components
import EnterAmount from '../EnterAmount';

// Mock Sentry
vi.mock('@sentry/react', () => ({
  setContext: vi.fn(),
  addBreadcrumb: vi.fn(),
  startTransaction: vi.fn(() => ({
    finish: vi.fn(),
    setStatus: vi.fn(),
    setTag: vi.fn(),
    setData: vi.fn(),
  })),
  captureException: vi.fn(),
  captureMessage: vi.fn(),
  withScope: vi.fn((callback) =>
    callback({
      setLevel: vi.fn(),
      setTag: vi.fn(),
      setExtra: vi.fn(),
    })
  ),
}));

// Mock Sentry utility functions
vi.mock('../../../utils/sentry', () => ({
  logUserInteraction: vi.fn(),
  logExchangeError: vi.fn(),
  addExchangeBreadcrumb: vi.fn(),
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

describe('<EnterAmount />', () => {
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
  });

  it('renders correctly and matches snapshot', () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <EnterAmount
            type={CardPosition.SWAP}
            tokenSymbol={store.getState().swap.swapToken.symbol}
          />
        </Provider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('handles token amount change in Swap card', async () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <EnterAmount
          type={CardPosition.SWAP}
          tokenSymbol={store.getState().swap.swapToken.symboll}
        />
      </Provider>
    );

    act(() => {
      store.dispatch(setAmountSwap(0));
      store.dispatch(setUsdPriceSwapToken(0));
    });

    const inputElement = getByTestId('enter-amount-input');
    fireEvent.change(inputElement, { target: { value: '50' } });

    await waitFor(() => {
      expect(store.getState().swap.amountSwap).toEqual(50);
      expect(store.getState().swap.usdPriceSwapToken).toEqual(0.1);
    });
  });
});
